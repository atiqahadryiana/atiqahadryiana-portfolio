import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const options = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };

export async function passwordHash(password, salt) {
  return (await derive(password, salt, 64, options)).toString('hex');
}

export async function createAccount(username, password) {
  const salt = randomBytes(16).toString('hex');
  return { username, salt, hash: await passwordHash(password, salt) };
}

export async function verifyAccount(account, username, password) {
  const computed = await passwordHash(password, account.salt);
  return (
    timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(account.hash, 'hex')) &&
    username === account.username
  );
}
