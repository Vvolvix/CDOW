// Tiny JSON store: full state in memory, debounced atomic writes. Zero native deps.
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'db.json');
const TMP = FILE + '.tmp';

const DEFAULTS = () => ({
  meta: { nextId: 1, nextUserId: 1, createdAt: Date.now() },
  users: [],            // {id,tgId,username,name,photo,bot,sess:[],bal,inv:[],refBy,refCount,tradeUrl,steamBonus,firstDepositTask,referLinkTask,dailyAt,seeds:{server,client,nonce},stats,createdAt}
  sessions: {},         // token -> {userId, tgId, createdAt}
  loginCodes: {},       // code -> {tgId, name, username, photo, exp}
  transactions: [],     // deposits/withdrawals
  withdrawals: [],
  feed: [],             // recent wins (max 120)
  battles: [],
  tx: [],               // coin ledger
});

let db = DEFAULTS();
let saveTimer = null;

function load() {
  try {
    if (fs.existsSync(FILE)) {
      const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
      db = Object.assign(DEFAULTS(), raw);
    }
  } catch (e) {
    console.error('[db] failed to load, starting fresh:', e.message);
    db = DEFAULTS();
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  return db;
}

function saveNow() {
  try {
    fs.writeFileSync(TMP, JSON.stringify(db));
    fs.renameSync(TMP, FILE);
  } catch (e) { console.error('[db] save failed:', e.message); }
}

function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => { saveTimer = null; saveNow(); }, 800);
}

const nextId = () => db.meta.nextId++;
const uid = () => db.meta.nextUserId++;

module.exports = { get db() { return db; }, load, save, saveNow, nextId, uid };
