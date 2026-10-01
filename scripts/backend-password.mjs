import { pbkdf2, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import { createInterface } from 'node:readline';

/** Read from protected stdin; plaintext is never a command argument or output. */
const readPassword = () => new Promise((resolve) => {
  if (!process.stdin.isTTY) {
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { input += chunk; });
    process.stdin.on('end', () => resolve(input.replace(/\r?\n$/, '')));
    return;
  }
  const input = createInterface({ input: process.stdin, output: process.stderr, terminal: true });
  input.question('Admin password: ', (answer) => {
    input.close();
    process.stderr.write('\n');
    resolve(answer);
  });
  input._writeToOutput = () => {};
});

const password = await readPassword();
if (typeof password !== 'string' || password.length < 8 || password.length > 256) {
  process.stderr.write('Use a password between 8 and 256 characters.\n');
  process.exitCode = 1;
} else {
  const salt = randomBytes(16);
  const hash = await promisify(pbkdf2)(password, salt, 100_000, 32, 'sha256');
  process.stdout.write(`pbkdf2-sha256$100000$${salt.toString('base64')}$${hash.toString('base64')}\n`);
}
