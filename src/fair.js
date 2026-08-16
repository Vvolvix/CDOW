// Provably fair: HMAC-SHA256(serverSeed, clientSeed:nonce) → floats.
const crypto = require('crypto');

const genSeed = () => crypto.randomBytes(32).toString('hex');
const hash = s => crypto.createHash('sha256').update(s).digest('hex');

function floats(serverSeed, clientSeed, nonce, count = 1) {
  const out = [];
  let round = 0;
  while (out.length < count) {
    const h = crypto.createHmac('sha256', serverSeed).update(`${clientSeed}:${nonce}:${round}`).digest('hex');
    for (let i = 0; i + 8 <= h.length && out.length < count; i += 8) {
      out.push(parseInt(h.slice(i, i + 8), 16) / 0xffffffff);
    }
    round++;
  }
  return out;
}

module.exports = { genSeed, hash, floats };
