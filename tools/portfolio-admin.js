import { createHash, randomBytes } from 'node:crypto';
import { readFile, writeFile, rename, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { format, resolveConfig } from 'prettier';
import { verifyAccount } from './admin-auth.js';
import { resumeUrlError } from '../src/utils/resume.js';
import {
  profileFields,
  projectTextFields,
  validateProfile,
  validateProject,
} from '../src/utils/admin-content.js';

const digest = (value) => createHash('sha256').update(value).digest('hex');
const random = () => randomBytes(32).toString('hex');
const cookieName = 'aa_admin_session';
const lifetime = 4 * 60 * 60 * 1000;

function replaceExport(source, key, value) {
  const start = new RegExp(`^export const ${key} = `, 'm').exec(source)?.index ?? -1;
  if (start === -1) throw new Error('Content export not found');
  const next = source.indexOf('\nexport const ', start + 1);
  return (
    source.slice(0, start) +
    `export const ${key} = ${JSON.stringify(value, null, 2)};\n` +
    (next === -1 ? '' : source.slice(next))
  );
}

export default function portfolioAdmin() {
  return {
    name: 'local-portfolio-admin',
    apply: 'serve',
    configureServer(server) {
      const file = resolve(server.config.root, 'src/data/portfolio.js');
      const accountFile = resolve(server.config.root, '.env.admin.local');
      const sessions = new Map();
      let accountVersion = '';
      let failedLogins = 0;
      let retryAfter = 0;
      let loginBusy = false;
      let writes = Promise.resolve();
      const cookie = (value, age) =>
        `${cookieName}=${value}; Path=/__admin; HttpOnly; SameSite=Strict; Max-Age=${age}`;
      async function readAccount() {
        let source;
        try {
          source = await readFile(accountFile, 'utf8');
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
          source = '';
        }
        const version = digest(source);
        if (version !== accountVersion) {
          sessions.clear();
          accountVersion = version;
          failedLogins = 0;
        }
        if (!source) return null;
        const values = parseEnv(source);
        if (
          !values.ADMIN_USERNAME ||
          !/^[a-f0-9]{32}$/.test(values.ADMIN_PASSWORD_SALT || '') ||
          !/^[a-f0-9]{128}$/.test(values.ADMIN_PASSWORD_HASH || '')
        )
          throw new Error('Invalid admin account configuration');
        return {
          username: values.ADMIN_USERNAME,
          salt: values.ADMIN_PASSWORD_SALT,
          hash: values.ADMIN_PASSWORD_HASH,
        };
      }
      async function snapshot() {
        const source = await readFile(file, 'utf8');
        const content = await server.ssrLoadModule(
          `/src/data/portfolio.js?admin=${digest(source)}`,
        );
        return {
          source,
          revision: digest(source),
          profile: content.profile,
          projects: content.projects,
          projectFilters: content.projectFilters,
        };
      }
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0];
        if (!path?.startsWith('/__admin/')) return next();
        const reply = (status, data) => {
          res.writeHead(status, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
          });
          res.end(JSON.stringify(data));
        };
        const fail = (code, error, fields) => reply(code, { error, ...(fields ? { fields } : {}) });
        try {
          const host = new URL(`http://${req.headers.host}`);
          if (
            !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress) ||
            !['localhost', '127.0.0.1', '[::1]'].includes(host.hostname) ||
            Number(host.port || 80) !== req.socket.localPort ||
            (req.headers.origin && req.headers.origin !== host.origin) ||
            (req.headers['sec-fetch-site'] &&
              !['same-origin', 'none'].includes(req.headers['sec-fetch-site']))
          )
            return fail(403, 'Local access required.');
          if (!['GET', 'POST'].includes(req.method)) {
            res.setHeader('Allow', 'GET, POST');
            return fail(405, 'Method not supported.');
          }
          const allowed = [
            '/__admin/session',
            '/__admin/login',
            '/__admin/logout',
            '/__admin/content',
            '/__admin/resume',
            '/__admin/profile',
            '/__admin/projects',
          ];
          if (!allowed.includes(path)) return fail(404, 'Admin endpoint not found.');
          const account = await readAccount();
          const now = Date.now();
          for (const [id, entry] of sessions) if (entry.expires <= now) sessions.delete(id);
          const id = req.headers.cookie
            ?.split(';')
            .map((value) => value.trim())
            .find((value) => value.startsWith(`${cookieName}=`))
            ?.slice(cookieName.length + 1);
          const session = sessions.get(id);
          if (req.method === 'GET') {
            if (path === '/__admin/session')
              return reply(200, {
                authenticated: Boolean(session),
                configured: Boolean(account),
                ...(session ? { username: session.username, token: session.token } : {}),
              });
            if (path !== '/__admin/content') return fail(405, 'Use POST for this action.');
            if (!session) return fail(401, 'Sign in to manage your portfolio.');
            const content = await snapshot();
            const { source: _source, ...publicContent } = content;
            return reply(200, publicContent);
          }
          if (req.headers.origin !== host.origin) return fail(403, 'Local access required.');
          if (path !== '/__admin/login' && (!session || !account))
            return fail(401, 'Your session expired. Sign in again.');
          if (path !== '/__admin/login' && req.headers['x-admin-token'] !== session.token)
            return fail(403, 'Reload the editor before saving.');
          if (req.headers['content-type']?.split(';')[0] !== 'application/json')
            return fail(415, 'Send this update as JSON.');
          const chunks = [];
          let bytes = 0;
          for await (const chunk of req) {
            bytes += chunk.length;
            if (bytes > 131072) return fail(413, 'This update is too large.');
            chunks.push(chunk);
          }
          let data;
          try {
            data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          } catch {
            return fail(400, 'The update could not be read.');
          }
          if (!data || typeof data !== 'object' || Array.isArray(data))
            return fail(400, 'An update object is required.');
          if (path === '/__admin/login') {
            if (!account)
              return fail(503, 'Create your local admin account with npm run admin:setup.');
            if (loginBusy || (failedLogins >= 5 && now < retryAfter)) {
              res.setHeader('Retry-After', '300');
              return fail(429, 'Too many sign-in attempts. Try again in five minutes.');
            }
            if (now >= retryAfter) failedLogins = 0;
            if (
              typeof data.username !== 'string' ||
              typeof data.password !== 'string' ||
              data.username.length > 80 ||
              data.password.length > 256
            )
              return fail(400, 'Enter your username and password.');
            loginBusy = true;
            let valid;
            try {
              valid = await verifyAccount(account, data.username, data.password);
            } finally {
              loginBusy = false;
            }
            if (!valid) {
              failedLogins++;
              retryAfter = Date.now() + 300000;
              return fail(401, 'The username or password is incorrect.');
            }
            failedLogins = 0;
            if (id) sessions.delete(id);
            if (sessions.size >= 16) sessions.delete(sessions.keys().next().value);
            const newId = random();
            const entry = {
              username: account.username,
              token: random(),
              expires: Date.now() + lifetime,
            };
            sessions.set(newId, entry);
            res.setHeader('Set-Cookie', cookie(newId, lifetime / 1000));
            return reply(200, {
              authenticated: true,
              username: entry.username,
              token: entry.token,
            });
          }
          if (path === '/__admin/logout') {
            sessions.delete(id);
            res.setHeader('Set-Cookie', cookie('', 0));
            return reply(200, { authenticated: false });
          }
          if (!['/__admin/resume', '/__admin/profile', '/__admin/projects'].includes(path))
            return fail(405, 'Method not supported.');
          const save = async () => {
            // Recheck the session after waiting for another save.
            if (sessions.get(id) !== session || session.expires <= Date.now())
              return fail(401, 'Your session expired. Sign in again.');
            const current = await snapshot();
            if (data.revision !== current.revision)
              return fail(409, 'The portfolio changed in another window. Reload before saving.');
            let key;
            let value;
            if (path === '/__admin/resume') {
              const error = resumeUrlError(data.resume);
              if (error) return fail(400, error, { resume: error });
              key = 'profile';
              value = { ...current.profile, resume: data.resume.trim() };
            } else if (path === '/__admin/profile') {
              const fields = validateProfile(data.profile);
              if (Object.keys(fields).length)
                return fail(400, 'Check the highlighted profile fields.', fields);
              key = 'profile';
              value = { ...current.profile };
              for (const field of profileFields.filter(
                (item) => !['github', 'linkedin'].includes(item),
              ))
                value[field] = data.profile[field].trim();
              value.about = data.profile.about.map((item) => item.trim());
              value.socials = [
                ...current.profile.socials.filter(
                  (item) => !['GitHub', 'LinkedIn'].includes(item.label),
                ),
                { label: 'GitHub', url: data.profile.github.trim() },
                { label: 'LinkedIn', url: data.profile.linkedin.trim() },
              ];
            } else {
              const fields = validateProject(data.project, current.projectFilters);
              if (Object.keys(fields).length)
                return fail(400, 'Check the highlighted project fields.', fields);
              const index = data.originalSlug
                ? current.projects.findIndex((item) => item.slug === data.originalSlug)
                : -1;
              if (data.originalSlug && index === -1)
                return fail(404, 'This project no longer exists. Reload the editor.');
              if (
                current.projects.some((item, i) => item.slug === data.project.slug && i !== index)
              )
                return fail(409, 'This project URL is already used.', {
                  slug: 'Choose a unique project URL.',
                });
              const previous =
                index === -1
                  ? {
                      number: String(current.projects.length + 1).padStart(2, '0'),
                      art: 'fallback',
                      gallery: [],
                    }
                  : current.projects[index];
              const project = { ...previous };
              for (const field of projectTextFields)
                project[field] = (data.project[field] || '').trim();
              project.status = data.project.status;
              for (const field of ['filters', 'technologies', 'features'])
                project[field] = [...new Set(data.project[field].map((item) => item.trim()))];
              key = 'projects';
              value = [...current.projects];
              if (index === -1) value.push(project);
              else value[index] = project;
            }
            const formatted = await format(replaceExport(current.source, key, value), {
              ...(await resolveConfig(file)),
              filepath: file,
            });
            const temporary = `${file}.${randomBytes(8).toString('hex')}.tmp`;
            await readAccount();
            if (sessions.get(id) !== session || session.expires <= Date.now())
              return fail(401, 'Your session expired. Sign in again.');
            if (digest(await readFile(file, 'utf8')) !== current.revision)
              return fail(409, 'The portfolio changed in another window. Reload before saving.');
            try {
              await writeFile(temporary, formatted, { encoding: 'utf8', flag: 'wx' });
              await rename(temporary, file);
            } finally {
              await rm(temporary, { force: true });
            }
            return reply(200, {
              profile: key === 'profile' ? value : current.profile,
              projects: key === 'projects' ? value : current.projects,
              projectFilters: current.projectFilters,
              revision: digest(formatted),
            });
          };
          writes = writes.catch(() => {}).then(save);
          await writes;
        } catch (error) {
          server.config.logger.error(`Portfolio admin: ${error.message}`);
          if (!res.writableEnded)
            fail(
              500,
              'The request could not be completed. Reload to check the latest saved content.',
            );
        }
      });
    },
  };
}
