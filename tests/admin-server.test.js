import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from 'vite';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import portfolioAdmin from '../tools/portfolio-admin.js';
import { createAccount } from '../tools/admin-auth.js';
import { profile, projects, projectFilters } from '../src/data/portfolio';

describe('Authenticated local portfolio administration', () => {
  let server, root, origin, file;
  const password = 'Only-a-test-password-42';
  const original = `export const profile = ${JSON.stringify(profile)};\nexport const projects = ${JSON.stringify(projects)};\nexport const projectFilters = ${JSON.stringify(projectFilters)};\n`;
  async function start() {
    server = await createServer({
      root,
      configFile: false,
      plugins: [portfolioAdmin()],
      server: { host: '127.0.0.1', port: 0 },
      logLevel: 'silent',
    });
    await server.listen();
    origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  }
  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), 'portfolio-admin-test-'));
    file = join(root, 'src/data/portfolio.js');
    await mkdir(join(root, 'src/data'), { recursive: true });
    await writeFile(file, original);
    const account = await createAccount('testowner', password);
    await writeFile(
      join(root, '.env.admin.local'),
      `ADMIN_USERNAME=testowner\nADMIN_PASSWORD_SALT=${account.salt}\nADMIN_PASSWORD_HASH=${account.hash}\n`,
    );
    await start();
  }, 20000);
  afterAll(async () => {
    await server?.close();
    if (root) {
      if (
        dirname(resolve(root)) !== resolve(tmpdir()) ||
        !basename(root).startsWith('portfolio-admin-test-')
      )
        throw new Error('Unexpected fixture directory.');
      await rm(root, { recursive: true, force: true });
    }
  });
  const request = (path, body, auth = {}, extra = {}) =>
    fetch(`${origin}/__admin/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        ...(body ? { 'Content-Type': 'application/json', Origin: origin } : {}),
        ...(auth.cookie ? { Cookie: auth.cookie, 'X-Admin-Token': auth.token } : {}),
        ...extra,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  async function login() {
    const response = await request('login', { username: 'testowner', password });
    expect(response.status).toBe(200);
    return { cookie: response.headers.get('set-cookie').split(';')[0], ...(await response.json()) };
  }
  const content = async (auth) => (await request('content', null, auth)).json();

  it('blocks anonymous reads and writes, rejects bad credentials, and keeps the hash private', async () => {
    expect((await request('content')).status).toBe(401);
    expect((await request('resume', { resume: 'https://example.com/resume.pdf' })).status).toBe(
      401,
    );
    expect((await request('login', { username: 'testowner', password: 'wrong' })).status).toBe(401);
    expect(
      (
        await request(
          'login',
          { username: 'testowner', password },
          {},
          { Origin: 'https://other.example' },
        )
      ).status,
    ).toBe(403);
    const secret = await fetch(`${origin}/.env.admin.local`);
    expect(secret.status).toBe(403);
    expect(await secret.text()).not.toContain('ADMIN_PASSWORD_HASH');
    expect(await readFile(file, 'utf8')).toBe(original);
  });
  it('uses an HttpOnly session and CSRF token, persists resume updates, and rejects stale saves', async () => {
    const response = await request('login', { username: 'testowner', password });
    expect(response.headers.get('set-cookie')).toContain('HttpOnly; SameSite=Strict');
    const auth = {
      cookie: response.headers.get('set-cookie').split(';')[0],
      ...(await response.json()),
    };
    const initial = await content(auth);
    expect(
      (
        await request(
          'resume',
          { resume: 'https://example.com/resume.pdf', revision: initial.revision },
          { ...auth, token: 'wrong' },
        )
      ).status,
    ).toBe(403);
    expect(
      (await request('resume', { resume: 'javascript:alert(1)', revision: initial.revision }, auth))
        .status,
    ).toBe(400);
    const saved = await request(
      'resume',
      { resume: "https://example.com/owner's-resume.pdf", revision: initial.revision },
      auth,
    );
    expect(saved.status).toBe(200);
    expect((await saved.json()).profile.resume).toContain("owner's-resume.pdf");
    expect((await request('resume', { resume: '', revision: initial.revision }, auth)).status).toBe(
      409,
    );
    expect((await content(auth)).profile.resume).toContain("owner's-resume.pdf");
  });
  it('adds and edits projects using the full schema and keeps them after a server restart', async () => {
    let auth = await login();
    let current = await content(auth);
    const project = {
      ...projects[3],
      slug: 'new-test-project',
      title: 'Test project',
      summary: 'An actual test entry.',
      github: '',
      demo: '',
      image: '',
    };
    let response = await request('projects', { project, revision: current.revision }, auth);
    expect(response.status).toBe(200);
    current = await response.json();
    const entry = current.projects.at(-1);
    expect(entry).toMatchObject({ slug: project.slug, number: '05', art: 'fallback', gallery: [] });
    expect((await request('projects', { project, revision: current.revision }, auth)).status).toBe(
      409,
    );
    expect(
      (
        await request(
          'projects',
          {
            project: { ...project, slug: 'another-test', demo: 'javascript:alert(1)' },
            revision: current.revision,
          },
          auth,
        )
      ).status,
    ).toBe(400);
    response = await request(
      'projects',
      {
        project: { ...project, title: 'Updated test project' },
        originalSlug: project.slug,
        revision: current.revision,
      },
      auth,
    );
    expect(response.status).toBe(200);
    await server.close();
    await start();
    expect((await request('content', null, auth)).status).toBe(401);
    auth = await login();
    current = await content(auth);
    expect(current.projects.at(-1).title).toBe('Updated test project');
    expect(current.projects).toHaveLength(5);
    expect(await readFile(file, 'utf8')).not.toContain(password);
  }, 15000);
  it('saves profile content safely, preserves other data, and revokes signed-out sessions', async () => {
    const auth = await login();
    const current = await content(auth);
    const draft = {
      name: 'Test owner',
      location: 'Malaysia',
      identity: 'Student',
      headline: 'Creating useful things',
      introduction: 'An introduction from the owner.',
      email: 'owner@example.com',
      github: 'https://github.com/testowner',
      linkedin: '',
      about: ['A paragraph containing export const projects = text.'],
    };
    const response = await request('profile', { profile: draft, revision: current.revision }, auth);
    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.profile.name).toBe('Test owner');
    expect(updated.profile.resume).toBe(current.profile.resume);
    expect(updated.projects).toHaveLength(5);
    expect((await content(auth)).profile.about).toEqual(draft.about);
    expect((await request('logout', {}, auth)).status).toBe(200);
    expect((await request('content', null, auth)).status).toBe(401);
    expect((await request('projects', { revision: updated.revision }, auth)).status).toBe(401);
  });
  it('limits repeated failed sign-in attempts', async () => {
    for (let i = 0; i < 5; i++)
      expect((await request('login', { username: 'testowner', password: 'wrong' })).status).toBe(
        401,
      );
    expect((await request('login', { username: 'testowner', password })).status).toBe(429);
  }, 15000);
});
