import * as crypto from 'node:crypto';

export function passwordManager(options = {}) {
  const {
    iterations = 100000,
    keylen = 64,
    digest = 'sha512',
    saltSize = 16,
  } = options;

  function generateSalt(bytes) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  async function generateHash(password) {
    if (!password) return null;

    const salt = generateSalt(saltSize);
    const hashedPassword = await new Promise((res, rej) => {
      crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
        if (err) {
          rej(`Password hashing failed: ${err.message}`);
        }

        res(key.toString('hex'));
      });
    });

    return {
      hash: hashedPassword,
      salt,
    };
  }

  async function verify({ password, hash, salt }) {
    if (!password || !hash || !salt) return null;

    const hashedPassword = await new Promise((res, rej) => {
      crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
        if (err) {
          rej(`Password hashing failed: ${err.message}`);
        }

        res(key.toString('hex'));
      });
    });
    return hashedPassword === hash;
  }

  return {
    generateHash,
    verify,
  };
}
