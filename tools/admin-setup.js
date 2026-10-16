import { randomBytes } from 'node:crypto';
import { access, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createAccount } from './admin-auth.js';

const file = resolve('.env.admin.local');
const reset = process.argv.includes('--reset');
const index = process.argv.indexOf('--username');
const username = index === -1 ? 'atiqah' : process.argv[index + 1];
if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username || '')) {
  throw new Error('Choose a username of 3–40 letters, numbers, dots, hyphens, or underscores.');
}
let exists = false;
try {
  await access(file);
  exists = true;
} catch {
  /* First setup. */
}
if (exists && !reset) {
  console.log(
    'An admin account already exists. To generate a new password, run npm run admin:setup -- --reset.',
  );
} else {
  const password = randomBytes(18).toString('base64url');
  const account = await createAccount(username, password);
  await writeFile(
    file,
    [
      '# Server-only local admin credentials. Never prefix these keys with VITE_.',
      `ADMIN_USERNAME=${account.username}`,
      `ADMIN_PASSWORD_SALT=${account.salt}`,
      `ADMIN_PASSWORD_HASH=${account.hash}`,
      '',
    ].join('\n'),
    { encoding: 'utf8', mode: 0o600, flag: reset ? 'w' : 'wx' },
  );
  console.log(
    `Admin account ready.\nUsername: ${username}\nPassword: ${password}\n\nKeep this password in your password manager. Only its salted hash is saved.\nRun npm run dev, then press Ctrl+M to sign in.`,
  );
}
