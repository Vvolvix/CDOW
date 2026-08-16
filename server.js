// CDOW — CS2 CASES & DROP & OPEN & WIN — main server. MADE BY VOLVIX.
// .env loader (zero-dependency)
try {
  const fs = require('fs');
  const envPath = __dirname + '\\.env';
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
    }
  }
} catch (e) { console.error('[env] load failed:', e.message); }

const express = require('express');
const http = require('http');
const crypto = require('crypto');
const path = require('path');
const { Server } = require('socket.io');

const DB = require('./src/db');
const db = DB.load();
const { genSeed, hash, floats } = require('./src/fair');
const { RARITY, ITEMS, byId, CASES, CASES_BY_ID, caseEV } = require('./src/catalog');
const { makeDouble, makeRoyal, makeRush, MIN_BET } = require('./src/games');
const { initBot, verifyWidget } = require('./src/bot');

const PORT = process.env.PORT || 3000;
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;
const ADMIN_KEY = process.env.ADMIN_KEY || 'cdow-admin';
const PAYMENTS = process.env.PAYMENTS_MODE || 'sandbox';           // sandbox | live
const RATE = 1000;                                                 // coins per 1 USD
const MIN_DEP_USD = 1;
const BOT_USERNAME = (process.env.BOT_USERNAME || '').replace('@', '');
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// Official Gateways Config
const PAYFORM_URL = 'https://payform.me/';
const UNLIMIT_URL = 'https://www.unlimit.com/';
const SKINSBACK_URL = 'https://skinsback.com/';

const CRYPTO_NETWORKS = [
  { id: 'USDTTRC', name: 'USDT (TRC20)', symbol: 'USDT', network: 'TRON' },
  { id: 'USDTBSC', name: 'USDT (BSC)', symbol: 'USDT', network: 'BNB Smart Chain' },
  { id: 'USDTTON', name: 'USDT (TON)', symbol: 'USDT', network: 'TON' },
  { id: 'USDTERC', name: 'USDT (ERC20)', symbol: 'USDT', network: 'Ethereum' },
  { id: 'USDTPOLY', name: 'USDT (Polygon)', symbol: 'USDT', network: 'Polygon' },
  { id: 'USDTSOL', name: 'USDT (Solana)', symbol: 'USDT', network: 'Solana' },
  { id: 'TRX', name: 'TRX (Tron)', symbol: 'TRX', network: 'TRON' },
  { id: 'TON', name: 'TON (The Open Network)', symbol: 'TON', network: 'TON' },
  { id: 'ETH', name: 'ETH (Ethereum)', symbol: 'ETH', network: 'Ethereum' },
  { id: 'LTC', name: 'LTC (Litecoin)', symbol: 'LTC', network: 'Litecoin' },
  { id: 'SOL', name: 'SOL (Solana)', symbol: 'SOL', network: 'Solana' },
  { id: 'MATIC', name: 'POL/MATIC (Polygon)', symbol: 'MATIC', network: 'Polygon' },
  { id: 'BNB', name: 'BNB (BSC)', symbol: 'BNB', network: 'BNB Smart Chain' },
  { id: 'BTC', name: 'BTC (Bitcoin)', symbol: 'BTC', network: 'Bitcoin' },
];

const SELL_RATE = 0.95;

const app = express();
app.use(express.json({ limit: '1mb' }));
const server = http.createServer(app);
const io = new Server(server);

// ---------------- helpers ----------------
const w = fn => (req, res) => {
  const fail = e => res.status(e.status || 500).json({ error: e.error || e.message || 'Server error' });
  try { Promise.resolve(fn(req, res)).catch(fail); } catch (e) { fail(e); }
};
const userByTg = tgId => db.users.find(u => u.tgId === tgId);
const userById = id => db.users.find(u => u.id === id);
const auth = req => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  const s = db.sessions[t];
  return s ? { token: t, user: userById(s.userId) } : {};
};

function newUser(tg) {
  const u = {
    id: DB.uid(), tgId: tg.tgId || 0, steamId: tg.steamId || '', username: tg.username || '', name: tg.name || 'Player',
    photo: tg.photo || '', bal: 0, inv: [], refBy: 0, refCount: 0, tradeUrl: tg.tradeUrl || '',
    steamBonus: false, firstDepositTask: false, referLinkTask: false, dailyAt: 0,
    tasks: {}, seeds: { server: genSeed(), client: genSeed().slice(0, 16), nonce: 0 },
    stats: { opened: 0, wagered: 0, won: 0, battlesWon: 0 }, createdAt: Date.now(),
    refCode: DB.uid().toString(36).toUpperCase(),
  };
  db.users.push(u); DB.save(); return u;
}

function credit(u, amount, reason) {
  u.bal += Math.round(amount);
  db.tx.push({ id: DB.nextId(), userId: u.id, delta: Math.round(amount), reason, ts: Date.now() });
  if (db.tx.length > 500) db.tx.splice(0, db.tx.length - 500);
  DB.save(); io.to('u' + u.id).emit('bal', u.bal);
}
function charge(u, amount, reason) {
  amount = Math.round(amount);
  if (!Number.isFinite(amount) || amount <= 0) throw { status: 400, error: 'Invalid amount' };
  if (u.bal < amount) throw { status: 400, error: 'Insufficient balance — top up your account' };
  u.bal -= amount; u.stats.wagered += amount;
  db.tx.push({ id: DB.nextId(), userId: u.id, delta: -amount, reason, ts: Date.now() });
  DB.save(); io.to('u' + u.id).emit('bal', u.bal);
}
function feed(e) {
  const u = e.userId ? userById(e.userId) : null;
  const entry = {
    id: DB.nextId(),
    ts: Date.now(),
    userId: e.userId || null,
    name: u ? u.name : (e.name || 'Player'),
    photo: u ? (u.photo || '') : (e.photo || ''),
    game: e.game,
    kind: e.kind,
    value: e.value,
    label: e.label,
    item: e.item || null,
    caseId: e.caseId || null,
    big: e.value >= 100000 || (e.item && (e.item.rarity === 'gold' || e.item.rarity === 'covert')),
  };
  db.feed.push(entry);
  if (db.feed.length > 150) db.feed.shift();
  DB.save();
  io.emit('feed:new', entry);
  return entry;
}

function sanitizeUser(u) {
  return {
    id: u.id, name: u.name, username: u.username, photo: u.photo, bal: u.bal,
    refCode: u.refCode, refCount: u.refCount, tradeUrl: u.tradeUrl,
    createdAt: u.createdAt, stats: u.stats, steamId: u.steamId || '',
    seeds: { hash: hash(u.seeds.server), client: u.seeds.client, nonce: u.seeds.nonce },
    tasks: taskState(u),
  };
}

// ---------------- tasks ----------------
const TASK_DEFS = [
  { id: 'invite', name: 'Invite a friend', reward: 5000, type: 'Unlimited', group: 'TOP Tasks', desc: 'Invite friends with your referral link. +5000 for each one who joins.', auto: true },
  { id: 'recharge', name: 'Recharge balance', reward: 6500, type: 'One-time', group: 'TOP Tasks', desc: 'Make your first deposit. +6500 automatically.', auto: true },
  { id: 'steam_name', name: 'Add CDOW to your name in Steam', reward: 250, type: 'Daily', group: 'Daily Freebies' },
  { id: 'steam_avatar', name: 'Set your avatar in Steam', reward: 250, type: 'Daily', group: 'Daily Freebies' },
  { id: 'steam_profile', name: 'Add CDOW to your Steam profile', reward: 250, type: 'Daily', group: 'Daily Freebies' },
  { id: 'daily_open', name: 'Open any case today', reward: 250, type: 'Daily', group: 'Daily Freebies' },
  { id: 'refer_link', name: 'Share your referral link', reward: 500, type: 'One-time', group: 'Other' },
];
const DAY_MS = 22 * 3600 * 1000;
function taskState(u) {
  const st = {};
  for (const t of TASK_DEFS) {
    if (t.id === 'invite') { st[t.id] = { count: u.refCount, reward: t.reward * u.refCount }; continue; }
    if (t.id === 'recharge') { st[t.id] = { done: !!u.firstDepositTask }; continue; }
    if (t.id === 'refer_link') { st[t.id] = { done: !!u.referLinkTask }; continue; }
    const last = u.tasks[t.id] || 0;
    st[t.id] = { last, ready: Date.now() - last >= DAY_MS };
  }
  return st;
}
function claimDaily(u) {
  if (Date.now() - u.dailyAt < DAY_MS) {
    const left = DAY_MS - (Date.now() - u.dailyAt);
    return { ok: false, in: Math.floor(left / 3600000), min: Math.floor((left % 3600000) / 60000) };
  }
  u.dailyAt = Date.now(); credit(u, 300, 'daily reward');
  return { ok: true };
}

// ---------------- games engines ----------------
const ctx = {
  charge, credit, userById, feed,
  announce: t => { if (tgbot) tgbot.announce(t); },
};
const double = makeDouble(io, ctx);
const royal = makeRoyal(io, ctx);
const rush = makeRush(io, ctx);

// ---------------- bot ----------------
let tgbot = null;
function issueLoginCode(from) {
  for (const k of Object.keys(db.loginCodes)) if (db.loginCodes[k].exp < Date.now()) delete db.loginCodes[k];
  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.loginCodes[code] = { tgId: from.id, name: [from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || 'Player', username: from.username || '', exp: Date.now() + 600000 };
  DB.save(); return code;
}
function applyRef(u, refCode) {
  if (u.refBy || !refCode) return;
  const inviter = db.users.find(x => x.refCode === String(refCode).toUpperCase());
  if (!inviter || inviter.id === u.id) return;
  u.refBy = inviter.id; inviter.refCount++;
  credit(inviter, 5000, 'referral bonus');
  if (tgbot) tgbot.announce(`👥 New player **${u.name}** joined CDOW — invited by **${inviter.name}**!`);
}
function loginFinish(res, u) {
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = { userId: u.id, ts: Date.now() };
  DB.save();
  res.json({ token, user: sanitizeUser(u) });
}
tgbot = initBot({
  db, save: DB.save, siteUrl: SITE_URL, botUsername: BOT_USERNAME,
  issueLoginCode,
  setRefPending: (tgId, code) => { db.refPending = db.refPending || {}; db.refPending[tgId] = code; DB.save(); },
  userByTg, claimDaily,
});

// ---------------- api: config & auth ----------------
app.get('/api/config', w((req, res) => {
  res.json({
    siteName: 'CDOW',
    tagline: 'CS2 — CASES & DROP & OPEN & WIN',
    madeBy: 'MADE BY VOLVIX',
    botUsername: BOT_USERNAME,
    tgEnabled: !!TG_TOKEN,
    payments: PAYMENTS,
    payformUrl: PAYFORM_URL,
    unlimitUrl: UNLIMIT_URL,
    skinsbackUrl: SKINSBACK_URL,
    cryptoNetworks: CRYPTO_NETWORKS,
    rate: RATE,
    minDepUsd: MIN_DEP_USD,
  });
}));

// ---------------- Smart Steam Resolver & OpenID ----------------
const STEAM_API_KEY = process.env.STEAM_API_KEY || '';

async function resolveSteamProfile(identifier) {
  if (!identifier) return {};
  let target = String(identifier).trim();
  target = target.replace(/^https?:\/\/steamcommunity\.com\/(id|profiles)\//i, '').replace(/\/+$/, '');
  
  // 1. Try Steam XML community lookup (works with both custom vanity URL & SteamID64 without API key)
  try {
    const is64 = /^7656\d{10,}$/.test(target);
    const url = is64
      ? `https://steamcommunity.com/profiles/${target}/?xml=1`
      : `https://steamcommunity.com/id/${target}/?xml=1`;
    
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (r.ok) {
      const text = await r.text();
      const nameMatch = text.match(/<steamID><!\[CDATA\[(.*?)\]\]><\/steamID>/i) || text.match(/<steamID>(.*?)<\/steamID>/i);
      const avatarMatch = text.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/i) || text.match(/<avatarFull>(.*?)<\/avatarFull>/i);
      const id64Match = text.match(/<steamID64>(.*?)<\/steamID64>/i);
      const customMatch = text.match(/<customURL><!\[CDATA\[(.*?)\]\]><\/customURL>/i) || text.match(/<customURL>(.*?)<\/customURL>/i);
      
      const name = nameMatch ? nameMatch[1].trim() : '';
      const photo = avatarMatch ? avatarMatch[1].trim() : '';
      const steamId = id64Match ? id64Match[1].trim() : (is64 ? target : '');
      const username = customMatch ? customMatch[1].trim() : (is64 ? '' : target);
      
      if (name || photo) {
        return { name: name || 'Steam Player', photo, steamId, username };
      }
    }
  } catch (e) {
    console.error('[steam-resolver] XML lookup error:', e.message);
  }

  // 2. Try Steam API key if configured
  if (STEAM_API_KEY) {
    try {
      let steam64 = target;
      if (!/^7656\d+$/.test(steam64)) {
        const vr = await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${encodeURIComponent(target)}`);
        const vd = await vr.json();
        if (vd.response && vd.response.steamid) steam64 = vd.response.steamid;
      }
      if (/^7656\d+$/.test(steam64)) {
        const pr = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steam64}`);
        const pd = await pr.json();
        const p = pd.response && pd.response.players && pd.response.players[0];
        if (p) return { name: p.personaname, photo: p.avatarfull, steamId: steam64, username: target };
      }
    } catch (e) {
      console.error('[steam-resolver] API key lookup error:', e.message);
    }
  }

  // Fallback
  return {
    name: target.replace(/[^A-Za-z0-9_ -]/g, '') || 'Steam Player',
    photo: `https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`,
    steamId: /^7656\d+$/.test(target) ? target : '',
    username: target,
  };
}

app.get('/auth/steam', (req, res) => {
  const ref = String(req.query.ref || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 16);
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': `${SITE_URL}/auth/steam/return${ref ? '?ref=' + ref : ''}`,
    'openid.realm': SITE_URL,
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  });
  res.redirect(302, 'https://steamcommunity.com/openid/login?' + params.toString());
});

app.get('/auth/steam/return', w(async (req, res) => {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) if (k.startsWith('openid.')) body.append(k, v);
  body.set('openid.mode', 'check_authentication');
  let valid = false;
  try {
    const r = await fetch('https://steamcommunity.com/openid/login', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
    });
    valid = (await r.text()).includes('is_valid:true');
  } catch (e) { console.error('[steam] verify failed:', e.message); }

  const claimed = String(req.query['openid.claimed_id'] || '');
  const steamId = claimed.split('/').pop();
  if (!valid || !/^7656\d+$/.test(steamId)) return res.redirect(302, '/?login=failed');

  const prof = await resolveSteamProfile(steamId);
  let u = db.users.find(x => x.steamId === steamId);
  if (!u) {
    u = newUser({
      steamId,
      name: prof.name || ('Player_' + steamId.slice(-4)),
      username: prof.username || '',
      photo: prof.photo || '',
    });
    applyRef(u, req.query.ref);
  } else {
    if (prof.name) u.name = prof.name;
    if (prof.photo) u.photo = prof.photo;
    DB.save();
  }
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = { userId: u.id, ts: Date.now() };
  DB.save();
  res.redirect(302, '/?t=' + token);
}));

// Quick Steam Direct Connect / Login / Profile Lookup (instant, smart)
app.post('/api/auth/steam-direct', w(async (req, res) => {
  const { steamInput, ref } = req.body || {};
  if (!String(steamInput || '').trim()) throw { status: 400, error: 'Enter your Steam vanity name, Profile URL, or SteamID64' };
  
  const prof = await resolveSteamProfile(steamInput);
  let u = (prof.steamId ? db.users.find(x => x.steamId === prof.steamId) : null) || db.users.find(x => x.name.toLowerCase() === prof.name.toLowerCase());
  
  if (!u) {
    u = newUser({
      steamId: prof.steamId || '',
      name: prof.name || 'Steam Player',
      username: prof.username || prof.name.toLowerCase(),
      photo: prof.photo || '',
    });
    applyRef(u, ref);
  } else {
    if (prof.name) u.name = prof.name;
    if (prof.photo) u.photo = prof.photo;
    if (prof.steamId) u.steamId = prof.steamId;
    DB.save();
  }
  loginFinish(res, u);
}));

// Sync current logged-in user's Steam avatar and name
app.post('/api/auth/steam-sync', w(async (req, res) => {
  const { user } = auth(req);
  if (!user) throw { status: 401, error: 'Not logged in' };
  const { identifier } = req.body || {};
  const target = identifier || user.steamId || user.name;
  const prof = await resolveSteamProfile(target);
  if (prof.name) user.name = prof.name;
  if (prof.photo) user.photo = prof.photo;
  if (prof.steamId) user.steamId = prof.steamId;
  DB.save();
  res.json({ ok: true, user: sanitizeUser(user) });
}));

app.get('/api/me', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401, error: 'Not logged in' };
  res.json(sanitizeUser(user));
}));
app.post('/api/logout', w((req, res) => { const { token } = auth(req); delete db.sessions[token]; DB.save(); res.json({ ok: true }); }));

// ---------------- live stats & top drops ----------------
function getPlatformStats() {
  const casesOpened = db.users.reduce((s, u) => s + (u.stats ? u.stats.opened : 0), 0) + (db.stats ? db.stats.cases : 0);
  const totalWon = db.users.reduce((s, u) => s + (u.stats ? u.stats.won : 0), 0) + (db.stats ? db.stats.coinsWon : 0);
  const activePlayers = Math.max(1, io.engine.clientsCount || db.users.length);
  return {
    casesOpened,
    activePlayers,
    totalWon,
    instantWithdrawals: db.withdrawals ? db.withdrawals.length : 0,
  };
}

app.get('/api/stats', w((req, res) => res.json(getPlatformStats())));

app.get('/api/drops/top', w((req, res) => {
  const recentDrops = db.feed.filter(f => f.item && f.value >= 25000).slice(-30);
  recentDrops.sort((a, b) => b.value - a.value);
  const top = recentDrops.slice(0, 4);
  if (top.length < 4) {
    const defaults = [
      { name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg', item: byName['AWP | Dragon Lore'] || ITEMS[ITEMS.length - 2], from: 'Dragon Lore Vault' },
      { name: 'PhantomBlade', photo: 'img/avatars/avatar_3.svg', item: byName['★ Butterfly Knife | Fade'] || ITEMS[ITEMS.length - 6], from: 'Knife Arena' },
      { name: 'Vortex_CS', photo: 'img/avatars/avatar_1.svg', item: byName['AK-47 | Wild Lotus'] || ITEMS[ITEMS.length - 1], from: 'AK-47 Legends' },
      { name: 'NeonRider', photo: 'img/avatars/avatar_4.svg', item: byName['★ Sport Gloves | Vice'] || ITEMS[ITEMS.length - 8], from: 'Gloves Paradise' },
    ];
    return res.json(defaults.map(d => ({
      name: d.name,
      photo: d.photo,
      item: d.item.name,
      weapon: d.item.weapon,
      rarity: d.item.rarity,
      value: d.item.value,
      img: d.item.img,
      from: d.from,
    })));
  }
  res.json(top.map(t => ({
    name: t.name,
    photo: t.photo || 'img/avatars/avatar_1.svg',
    item: t.item.name,
    weapon: t.item.weapon,
    rarity: t.item.rarity,
    value: t.item.value,
    img: t.item.img,
    from: t.caseId ? ((CASES_BY_ID[t.caseId] && CASES_BY_ID[t.caseId].name) || 'Case') : 'Drop',
  })));
}));

// ---------------- feed (LIVE WINS) ----------------
app.get('/api/feed', w((req, res) => res.json(db.feed.slice(-40).reverse())));

// ---------------- cases ----------------
function rollCase(u, c) {
  const roll = floats(u.seeds.server, u.seeds.client, u.seeds.nonce++)[0];
  let acc = 0, pick = byId[c.items[c.items.length - 1]];
  for (let i = 0; i < c.items.length; i++) {
    acc += c.w[i];
    if (roll <= acc) { pick = byId[c.items[i]]; break; }
  }
  return pick;
}
app.get('/api/cases', w((req, res) => res.json(CASES.map(c => ({
  ...c,
  items: c.items.map(id => byId[id]),
  ev: Math.round(caseEV(c)),
})))));

app.post('/api/cases/open', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401, error: 'Login first' };
  const c = CASES_BY_ID[(req.body || {}).caseId]; if (!c) throw { status: 400, error: 'Unknown case' };
  charge(user, c.price, `open ${c.id}`);
  const item = rollCase(user, c);
  const invId = 'inv' + DB.nextId();
  user.inv.push({ id: invId, itemId: item.id, ts: Date.now() });
  user.stats.opened++;
  const entry = feed({
    userId: user.id,
    game: 'case',
    kind: 'item',
    value: item.value,
    caseId: c.id,
    item: { id: item.id, name: item.name, weapon: item.weapon, rarity: item.rarity, value: item.value, img: item.img || null },
  });
  const big = item.rarity === 'gold' || item.value >= 25000;
  if (big && tgbot) tgbot.announce(`🔥 **${user.name}** just pulled **${item.name}** (${item.value.toLocaleString()} coins) from **${c.name}**!`);
  res.json({ item, invId, big, balance: user.bal, nonce: user.seeds.nonce, seedHash: hash(user.seeds.server) });
}));

// ---------------- inventory ----------------
const invOut = u => u.inv.map(i => ({ ...(byId[i.itemId] || {}), id: i.id, ts: i.ts }));
app.get('/api/inventory', w((req, res) => { const { user } = auth(req); if (!user) throw { status: 401 }; res.json(invOut(user)); }));

app.post('/api/inventory/sell', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const ids = (req.body || {}).ids || [];
  let total = 0;
  for (const id of ids) {
    const i = user.inv.findIndex(x => x.id === id); if (i < 0) continue;
    const it = byId[user.inv[i].itemId];
    if (it) total += Math.floor(it.value * SELL_RATE);
    user.inv.splice(i, 1);
  }
  if (!total) throw { status: 400, error: 'Nothing to sell' };
  credit(user, total, 'sold items'); user.stats.won += total;
  res.json({ got: total, balance: user.bal });
}));

app.post('/api/inventory/withdraw', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  if (!user.tradeUrl) throw { status: 400, error: 'Set your Steam trade URL in your profile first' };
  const ids = (req.body || {}).ids || [];
  const items = [];
  for (const id of ids) {
    const i = user.inv.findIndex(x => x.id === id); if (i < 0) continue;
    items.push(user.inv[i].itemId); user.inv.splice(i, 1);
  }
  if (!items.length) throw { status: 400, error: 'Nothing to withdraw' };
  db.withdrawals.push({ id: DB.nextId(), userId: user.id, items, tradeUrl: user.tradeUrl, ts: Date.now(), status: 'pending' });
  DB.save();
  res.json({ ok: true });
}));

// ---------------- battles ----------------
const GAMER_PROFILES = [
  { name: 'Vortex_CS', photo: 'img/avatars/avatar_1.svg' },
  { name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg' },
  { name: 'PhantomBlade', photo: 'img/avatars/avatar_3.svg' },
  { name: 'NeonRider', photo: 'img/avatars/avatar_4.svg' },
  { name: 'CyberGhost', photo: 'img/avatars/avatar_5.svg' },
  { name: 'ApexPredator', photo: 'img/avatars/avatar_6.svg' },
  { name: 'SilentReaper', photo: 'img/avatars/avatar_7.svg' },
  { name: 'NovaStrike', photo: 'img/avatars/avatar_8.svg' },
  { name: 'Krypton_9', photo: 'img/avatars/avatar_9.svg' },
  { name: 'DarkMatter', photo: 'img/avatars/avatar_10.svg' },
  { name: 'FrostByte', photo: 'img/avatars/avatar_11.svg' },
  { name: 'ViperX', photo: 'img/avatars/avatar_12.svg' },
  { name: 'GlitchCS', photo: 'img/avatars/avatar_13.svg' },
  { name: 'AeroBlast', photo: 'img/avatars/avatar_14.svg' },
  { name: 'TitanFall', photo: 'img/avatars/avatar_15.svg' },
  { name: 'EchoWolf', photo: 'img/avatars/avatar_16.svg' },
  { name: 'ZenithCS', photo: 'img/avatars/avatar_17.svg' },
  { name: 'HyperDrive', photo: 'img/avatars/avatar_18.svg' },
  { name: 'OmegaFox', photo: 'img/avatars/avatar_19.svg' },
  { name: 'Pulse_99', photo: 'img/avatars/avatar_20.svg' },
  { name: 'SpectreCS', photo: 'img/avatars/avatar_21.svg' },
  { name: 'RedlineMaster', photo: 'img/avatars/avatar_22.svg' },
  { name: 'MatrixPlayer', photo: 'img/avatars/avatar_23.svg' },
  { name: 'HavocCS', photo: 'img/avatars/avatar_24.svg' },
  { name: 'StrikeForce', photo: 'img/avatars/avatar_25.svg' },
];

const BOT_NAMES = GAMER_PROFILES.map(g => g.name);
const MODE_SLOTS = { '1v1': 2, '1v1v1': 3, '1v1v1v1': 4, '2v2': 4 };
const battlePub = b => ({
  id: b.id, caseId: b.caseId, caseName: CASES_BY_ID[b.caseId] ? CASES_BY_ID[b.caseId].name : b.caseId,
  price: CASES_BY_ID[b.caseId] ? CASES_BY_ID[b.caseId].price : 0,
  rounds: b.rounds, mode: b.mode, state: b.state, curRound: b.curRound,
  players: b.players.map((p, i) => ({
    name: p.name, photo: p.photo, bot: p.bot,
    team: b.mode === '2v2' ? i % 2 : 0, total: b.totals[i] || 0,
    items: (b.results.slice(0, b.curRound) || []).map(r => r[i]).map(id => byId[id]),
  })),
  winners: b.winners, seedHash: b.seedHash, created: b.created, creatorId: b.players[0] ? b.players[0].id : null,
});

app.get('/api/battles', w((req, res) => res.json(db.battles.slice().reverse().map(battlePub))));
app.get('/api/battles/:id', w((req, res) => {
  const b = db.battles.find(x => x.id === req.params.id);
  if (!b) throw { status: 404, error: 'Battle not found' };
  res.json(battlePub(b));
}));

app.post('/api/battles/create', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const { caseId, rounds = 3, mode = '1v1' } = req.body || {};
  const c = CASES_BY_ID[caseId]; if (!c) throw { status: 400, error: 'Unknown case' };
  if (!MODE_SLOTS[mode]) throw { status: 400, error: 'Invalid mode' };
  if (![1, 2, 3, 5].includes(rounds)) throw { status: 400, error: 'Rounds must be 1, 2, 3 or 5' };
  const cost = c.price * rounds;
  charge(user, cost, 'battle create');
  const b = {
    id: 'bt' + DB.nextId(), caseId, rounds, mode, cost, state: 'lobby', curRound: 0, revealAt: 0,
    players: [{ id: user.id, name: user.name, photo: user.photo, bot: false }],
    totals: [], results: [], winners: null, seed: '', seedHash: '', created: Date.now(),
  };
  db.battles.push(b); DB.save(); io.emit('battles:update');
  res.json(battlePub(b));
}));

app.post('/api/battles/:id/join', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const b = db.battles.find(x => x.id === req.params.id); if (!b) throw { status: 404, error: 'Battle not found' };
  if (b.state !== 'lobby') throw { status: 400, error: 'Battle already started' };
  if (b.players.length >= MODE_SLOTS[b.mode]) throw { status: 400, error: 'Battle is full' };
  if (b.players.some(p => p.id === user.id)) throw { status: 400, error: 'Already in this battle' };
  charge(user, b.cost, 'battle join');
  b.players.push({ id: user.id, name: user.name, photo: user.photo, bot: false });
  if (b.players.length >= MODE_SLOTS[b.mode]) startBattle(b);
  DB.save(); io.emit('battles:update'); io.emit('battle:' + b.id, battlePub(b));
  res.json(battlePub(b));
}));

app.post('/api/battles/:id/fillbots', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const b = db.battles.find(x => x.id === req.params.id); if (!b) throw { status: 404, error: 'Battle not found' };
  if (b.state !== 'lobby' || b.players[0].id !== user.id) throw { status: 403, error: 'Only the creator can start' };
  while (b.players.length < MODE_SLOTS[b.mode]) {
    const prof = GAMER_PROFILES[Math.floor(Math.random() * GAMER_PROFILES.length)];
    b.players.push({ id: null, name: prof.name, photo: prof.photo, bot: true });
  }
  startBattle(b); DB.save(); io.emit('battles:update'); io.emit('battle:' + b.id, battlePub(b));
  res.json(battlePub(b));
}));

function startBattle(b) {
  b.state = 'live'; b.seed = genSeed(); b.seedHash = hash(b.seed);
  b.totals = b.players.map(() => 0);
  b.results = [];
  for (let r = 0; r < b.rounds; r++) {
    const row = b.players.map((p, pi) => {
      const roll = floats(b.seed, `${b.id}-p${pi}`, r)[0];
      const c = CASES_BY_ID[b.caseId];
      let acc = 0, pick = byId[c.items[c.items.length - 1]];
      for (let i = 0; i < c.items.length; i++) { acc += c.w[i]; if (roll <= acc) { pick = byId[c.items[i]]; break; } }
      return pick.id;
    });
    b.results.push(row);
  }
  b.revealAt = Date.now() + 3000;
  io.emit('battles:update');
}

setInterval(() => {
  let changed = false;
  for (const b of db.battles) {
    if (b.state !== 'live' || Date.now() < b.revealAt) continue;
    if (b.curRound < b.rounds) {
      b.curRound++;
      b.results[b.curRound - 1].forEach((itemId, i) => b.totals[i] += byId[itemId].value);
      b.revealAt = Date.now() + 3600;
      io.emit('battle:' + b.id, battlePub(b));
    } else finishBattle(b);
    changed = true;
  }
  if (changed) { DB.save(); io.emit('battles:update'); }
  const done = db.battles.filter(b => b.state === 'done');
  if (done.length > 30) {
    const cut = done.slice(0, done.length - 30).map(b => b.id);
    db.battles = db.battles.filter(b => !cut.includes(b.id));
    DB.save(); io.emit('battles:update');
  }
}, 900);

function finishBattle(b) {
  b.state = 'done';
  if (b.mode === '2v2') {
    const t0 = b.totals[0] + b.totals[2], t1 = b.totals[1] + b.totals[3];
    b.winners = t0 >= t1 ? [0, 2] : [1, 3];
  } else {
    let best = 0; b.totals.forEach((t, i) => { if (t > b.totals[best]) best = i; });
    b.winners = [best];
  }
  const allItems = [];
  b.results.forEach(row => row.forEach(id => allItems.push(id)));
  allItems.sort((x, y) => byId[y].value - byId[x].value);
  const realWinners = b.winners.map(i => b.players[i]).filter(p => !p.bot);
  if (realWinners.length) {
    allItems.forEach((itemId, idx) => {
      const winner = realWinners[idx % realWinners.length];
      const u = userById(winner.id); if (!u) return;
      u.inv.push({ id: 'inv' + DB.nextId(), itemId, ts: Date.now() });
      if (idx === 0) { u.stats.battlesWon++; }
    });
    const w0 = userById(realWinners[0].id);
    const totalVal = b.totals.reduce((s, t) => s + t, 0);
    if (w0) feed({ userId: w0.id, game: 'battle', kind: 'coins', value: totalVal, caseId: b.caseId, label: `won a ${b.rounds}-round ${CASES_BY_ID[b.caseId].name} battle` });
    if (totalVal >= 50000 && tgbot) tgbot.announce(`⚔️ **${w0 ? w0.name : 'Someone'}** won a Case Battle for **${totalVal.toLocaleString()} coins**!`);
  }
  io.emit('battle:' + b.id, battlePub(b));
}

// ---------------- double / royal / rush ----------------
app.get('/api/double/state', w((req, res) => res.json(double.state())));
app.post('/api/double/bet', w((req, res) => { const { user } = auth(req); if (!user) throw { status: 401 }; double.bet(user, (req.body || {}).side, (req.body || {}).amount); res.json({ ok: true, balance: user.bal }); }));
app.get('/api/royal/state', w((req, res) => res.json(royal.state())));
app.post('/api/royal/join', w((req, res) => { const { user } = auth(req); if (!user) throw { status: 401 }; royal.join(user, (req.body || {}).amount); res.json({ ok: true, balance: user.bal }); }));
app.get('/api/rush/state', w((req, res) => res.json(rush.state())));
app.post('/api/rush/bet', w((req, res) => { const { user } = auth(req); if (!user) throw { status: 401 }; rush.join(user, (req.body || {}).amount, (req.body || {}).auto); res.json({ ok: true, balance: user.bal }); }));
app.post('/api/rush/cashout', w((req, res) => { const { user } = auth(req); if (!user) throw { status: 401 }; const r = rush.cashout(user.id); if (r.error) throw { status: 400, error: r.error }; res.json({ ...r, balance: user.bal }); }));

// ---------------- x50 ----------------
const X50 = [
  { m: 0, p: 0.54 },
  { m: 1.2, p: 0.18 },
  { m: 1.5, p: 0.14 },
  { m: 2, p: 0.088 },
  { m: 3, p: 0.04 },
  { m: 5, p: 0.01 },
  { m: 10, p: 0.0018 },
  { m: 50, p: 0.0002 },
];
app.post('/api/x50/spin', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const amount = Math.round((req.body || {}).amount);
  if (!Number.isFinite(amount) || amount < MIN_BET) throw { status: 400, error: `Minimum bet is ${MIN_BET}` };
  charge(user, amount, 'x50 spin');
  const roll = floats(user.seeds.server, user.seeds.client, user.seeds.nonce++)[0];
  let acc = 0, seg = X50[0];
  for (const s of X50) { acc += s.p; if (roll <= acc) { seg = s; break; } }
  const win = Math.floor(amount * seg.m);
  if (win > 0) credit(user, win, 'x50 win');
  if (seg.m >= 10) {
    feed({ userId: user.id, game: 'x50', kind: 'coins', value: win, label: `hit x${seg.m} on X50 → ${win.toLocaleString()}` });
    if (tgbot) tgbot.announce(`🎯 **${user.name}** hit **x${seg.m}** on X50 and won **${win.toLocaleString()} coins**!`);
  }
  res.json({ mult: seg.m, win, balance: user.bal, nonce: user.seeds.nonce });
}));

// ---------------- upgrader ----------------
app.get('/api/upgrader/targets', w((req, res) => {
  const bet = Math.max(0, Math.round(+(req.query.bet || 0)));
  const list = ITEMS.map(i => ({
    ...i,
    chance: bet > 0 ? Math.min(0.8, +(bet / i.value * 0.92).toFixed(4)) : 0,
  }));
  list.sort((a, b) => a.value - b.value);
  res.json(list);
}));

app.post('/api/upgrader/upgrade', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const { amount, itemIds = [], targetId } = req.body || {};
  const target = byId[targetId]; if (!target) throw { status: 400, error: 'Pick a target item' };
  let betValue = 0;
  if (Array.isArray(itemIds) && itemIds.length) {
    const toRemove = [];
    for (const id of itemIds) {
      const it = user.inv.find(x => x.id === id);
      if (!it) throw { status: 400, error: 'Item not in inventory' };
      const meta = byId[it.itemId];
      if (meta) betValue += meta.value;
      toRemove.push(id);
    }
    user.inv = user.inv.filter(x => !toRemove.includes(x.id));
  } else {
    betValue = Math.round(amount);
    if (betValue < MIN_BET) throw { status: 400, error: `Minimum is ${MIN_BET}` };
    charge(user, betValue, 'upgrader bet');
  }
  const chance = Math.min(0.8, betValue / target.value * 0.92);
  if (chance <= 0.005) throw { status: 400, error: 'Chance too low — pick a smaller target' };
  const roll = floats(user.seeds.server, user.seeds.client, user.seeds.nonce++)[0];
  const win = roll < chance;
  if (win) {
    user.inv.push({ id: 'inv' + DB.nextId(), itemId: target.id, ts: Date.now() });
    feed({ userId: user.id, game: 'upgrader', kind: 'item', value: target.value, item: { id: target.id, name: target.name, weapon: target.weapon, rarity: target.rarity, value: target.value, img: target.img || null }, label: `upgraded to ${target.name}` });
  } else {
    feed({ userId: user.id, game: 'upgrader', kind: 'coins', value: 0, label: `lost an upgrade to ${target.name}` });
  }
  DB.save();
  res.json({ win, chance, target, balance: user.bal, nonce: user.seeds.nonce });
}));

// ---------------- tasks ----------------
app.get('/api/tasks', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  res.json({ defs: TASK_DEFS, state: taskState(user), daily: claimDailyPeek(user), refCode: user.refCode, refCount: user.refCount });
}));
function claimDailyPeek(u) { const left = DAY_MS - (Date.now() - u.dailyAt); return left <= 0 ? { ready: true } : { ready: false, in: Math.floor(left / 3600000), min: Math.floor((left % 3600000) / 60000) }; }

app.post('/api/tasks/claim', w(async (req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const id = (req.body || {}).task;
  if (id === 'daily') { const r = claimDaily(user); if (!r.ok) throw { status: 400, error: `Come back in ${r.in}h ${r.min}m` }; return res.json({ ok: true, got: 300, balance: user.bal }); }
  const def = TASK_DEFS.find(t => t.id === id); if (!def) throw { status: 400, error: 'Unknown task' };
  if (def.auto) throw { status: 400, error: 'This task is credited automatically' };
  if (id === 'refer_link') {
    if (user.referLinkTask) throw { status: 400, error: 'Already claimed' };
    user.referLinkTask = true; credit(user, def.reward, 'task refer_link');
    return res.json({ ok: true, got: def.reward, balance: user.bal });
  }
  const last = user.tasks[id] || 0;
  if (Date.now() - last < DAY_MS) throw { status: 400, error: 'Already claimed today — come back tomorrow' };
  if ((id === 'steam_name' || id === 'steam_avatar' || id === 'steam_profile') && !user.tradeUrl) {
    throw { status: 400, error: 'Link your Steam trade URL in your profile first' };
  }
  if (id === 'daily_open' && !user.stats.opened) {
    throw { status: 400, error: 'Open at least one case first' };
  }
  user.tasks[id] = Date.now();
  credit(user, def.reward, 'task ' + id);
  res.json({ ok: true, got: def.reward, balance: user.bal });
}));

// ---------------- profile & Steam Trade URL ----------------
app.post('/api/profile/tradeurl', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const url = String((req.body || {}).url || '').trim();
  if (!/^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[A-Za-z0-9_-]+$/.test(url) && !url.includes('steamcommunity.com')) {
    throw { status: 400, error: 'Please enter a valid Steam Trade URL (e.g. https://steamcommunity.com/tradeoffer/new/?partner=...&token=...)' };
  }
  user.tradeUrl = url;
  let bonus = 0;
  if (!user.steamBonus) { user.steamBonus = true; bonus = 300; credit(user, 300, 'Steam link bonus'); }
  DB.save(); res.json({ ok: true, bonus, balance: user.bal, tradeUrl: user.tradeUrl });
}));

// ---------------- Deposits (PayForm, Unlimit, SkinsBack) ----------------
function newTx(user, method, details, amountUsd, coins) {
  const tx = {
    id: DB.nextId(),
    userId: user.id,
    method,
    details,
    amountUsd: amountUsd || null,
    coins: coins || null,
    ts: Date.now(),
    status: 'pending',
  };
  db.transactions.push(tx);
  DB.save();

  if (PAYMENTS === 'sandbox' && coins) {
    setTimeout(() => {
      const t = db.transactions.find(x => x.id === tx.id);
      if (t && t.status === 'pending') {
        t.status = 'approved';
        approveCredit(user, t.coins);
        io.to('u' + user.id).emit('deposit:approved', t);
      }
    }, 4000);
  }
  return tx;
}

function approveCredit(user, coins) {
  credit(user, coins, 'deposit');
  if (!user.firstDepositTask) {
    user.firstDepositTask = true;
    credit(user, 6500, 'task recharge');
  }
  DB.save();
}

app.get('/api/deposit/methods', w((req, res) => {
  res.json({
    mode: PAYMENTS,
    payformUrl: PAYFORM_URL,
    unlimitUrl: UNLIMIT_URL,
    skinsbackUrl: SKINSBACK_URL,
    cryptoNetworks: CRYPTO_NETWORKS,
    rate: RATE,
    min: MIN_DEP_USD,
  });
}));

// PayForm Crypto Deposit
app.post('/api/deposit/payform', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const { currency = 'USDTTRC', amountUsd, txid } = req.body || {};
  const usd = Math.round(+amountUsd);
  if (usd < MIN_DEP_USD) throw { status: 400, error: `Minimum deposit is $${MIN_DEP_USD}` };
  
  const tx = newTx(user, 'payform_crypto', {
    currency,
    txid: txid || `pf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    gateway: 'PayForm.me',
  }, usd, usd * RATE);

  res.json({
    tx,
    payUrl: `${PAYFORM_URL}?amount=${usd}&currency=${currency}&orderId=${tx.id}`,
    status: tx.status,
  });
}));

// Unlimit Cards (Visa / Mastercard) Deposit
app.post('/api/deposit/unlimit', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const { amountUsd, number, exp, cvc, name } = req.body || {};
  const usd = Math.round(+amountUsd);
  if (usd < MIN_DEP_USD) throw { status: 400, error: `Minimum deposit is $${MIN_DEP_USD}` };
  
  const card = String(number || '').replace(/\s+/g, '');
  const brand = card.startsWith('4') ? 'Visa' : (card.startsWith('5') ? 'Mastercard' : 'Credit Card');

  const tx = newTx(user, 'unlimit_card', {
    brand,
    last4: card ? card.slice(-4) : '****',
    name: name || user.name,
    gateway: 'Unlimit.com',
  }, usd, usd * RATE);

  res.json({
    tx,
    redirectUrl: `${UNLIMIT_URL}?amount=${usd}&orderId=${tx.id}`,
    status: tx.status,
  });
}));

// SkinsBack (CS2 Skins) Deposit
app.post('/api/deposit/skinsback', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const { items, tradeUrl, estimatedUsd } = req.body || {};
  const tUrl = user.tradeUrl || tradeUrl;
  if (!tUrl) throw { status: 400, error: 'Provide your Steam Trade URL first' };
  
  const usd = Math.max(1, Math.round(+(estimatedUsd || 10)));
  const tx = newTx(user, 'skinsback', {
    items: String(items || 'CS2 Inventory Skins').slice(0, 500),
    tradeUrl: tUrl,
    gateway: 'SkinsBack.com',
  }, usd, usd * RATE);

  res.json({
    tx,
    depositUrl: `${SKINSBACK_URL}?tradeUrl=${encodeURIComponent(tUrl)}&orderId=${tx.id}`,
    status: tx.status,
  });
}));

// ---------------- admin ----------------
app.get('/api/admin/pending', w((req, res) => {
  if ((req.query.key || req.headers['x-admin-key']) !== ADMIN_KEY) throw { status: 403, error: 'Bad admin key' };
  res.json({
    transactions: db.transactions.filter(t => t.status === 'pending').map(t => ({ ...t, user: (userById(t.userId) || {}).name })),
    withdrawals: db.withdrawals.filter(t => t.status === 'pending').map(t => ({ ...t, user: (userById(t.userId) || {}).name, items: t.items.map(id => (byId[id] || {}).name) })),
    stats: { users: db.users.length, coins: db.users.reduce((s, u) => s + u.bal, 0), opened: db.users.reduce((s, u) => s + u.stats.opened, 0) },
  });
}));

app.post('/api/admin/action', w((req, res) => {
  if ((req.body || {}).key !== ADMIN_KEY) throw { status: 403, error: 'Bad admin key' };
  const { type, id, coins } = req.body;
  if (type === 'tx') {
    const t = db.transactions.find(x => x.id === +id); if (!t) throw { status: 404 };
    const u = userById(t.userId); if (!u) throw { status: 404 };
    t.status = 'approved'; t.coins = Math.round(+coins || t.coins || 0);
    approveCredit(u, t.coins);
    io.to('u' + u.id).emit('deposit:approved', t);
  } else if (type === 'withdrawal') {
    const t = db.withdrawals.find(x => x.id === +id); if (!t) throw { status: 404 };
    t.status = (req.body || {}).approve === false ? 'rejected' : 'done';
    if (t.status === 'rejected') {
      const u = userById(t.userId);
      if (u) t.items.forEach(itemId => u.inv.push({ id: 'inv' + DB.nextId(), itemId, ts: Date.now() }));
    }
  } else throw { status: 400, error: 'Unknown type' };
  DB.save(); res.json({ ok: true });
}));

// ---------------- provably fair ----------------
app.get('/api/fair', w((req, res) => { const { user } = auth(req); if (!user) throw { status: 401 }; res.json({ serverSeedHash: hash(user.seeds.server), clientSeed: user.seeds.client, nonce: user.seeds.nonce }); }));
app.post('/api/fair/rotate', w((req, res) => {
  const { user } = auth(req); if (!user) throw { status: 401 };
  const revealed = user.seeds.server;
  user.seeds = { server: genSeed(), client: String((req.body || {}).client || genSeed().slice(0, 16)).slice(0, 32), nonce: 0 };
  DB.save(); res.json({ revealed, revealedHash: hash(revealed), ...{ serverSeedHash: hash(user.seeds.server), clientSeed: user.seeds.client } });
}));

// ---------------- sockets ----------------
io.on('connection', socket => {
  const token = (socket.handshake.auth && socket.handshake.auth.token) || '';
  const s = db.sessions[token];
  if (s && userById(s.userId)) socket.join('u' + s.userId);
});

// ---------------- static & boot ----------------
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  setHeaders: (res, filePath) => {
    if (/\.(js|css|html)$/.test(filePath)) res.setHeader('Cache-Control', 'no-cache');
  },
}));
app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// --- Authentic Community Live Feed Simulation ---
function simulateCommunityFeed() {
  const p = GAMER_PROFILES[Math.floor(Math.random() * GAMER_PROFILES.length)];
  const c = CASES[Math.floor(Math.random() * CASES.length)];
  const roll = Math.random();
  let acc = 0, item = byId[c.items[c.items.length - 1]];
  for (let i = 0; i < c.items.length; i++) {
    acc += c.w[i];
    if (roll <= acc) { item = byId[c.items[i]]; break; }
  }
  if (item) {
    feed({
      name: p.name,
      photo: p.photo,
      game: 'case',
      kind: 'item',
      value: item.value,
      caseId: c.id,
      item: { id: item.id, name: item.name, weapon: item.weapon, rarity: item.rarity, value: item.value, img: item.img || null },
    });
  }
  const nextDelay = 3500 + Math.random() * 4500;
  setTimeout(simulateCommunityFeed, nextDelay);
}
setTimeout(simulateCommunityFeed, 2000);

CASES.forEach(c => console.log(`[catalog] ${c.name.padEnd(18)} price ${String(c.price).padStart(6)}  EV ${(caseEV(c) / c.price * 100).toFixed(1)}%`));

server.listen(PORT, () => {
  console.log('');
  console.log('  ██████╗ ██████╗ ██████╗ ██╗    ██╗    ██████╗ ██╗    ██╗');
  console.log(' ██╔════╝██╔═══██╗██╔══██╗██║    ██║   ██╔═══██╗██║    ██║');
  console.log(' ██║     ██║   ██║██║  ██║██║ █╗ ██║   ██║   ██║██║    ██║');
  console.log(' ██║     ██║   ██║██║  ██║██║███╗██║   ██║   ██║██║    ██║');
  console.log(' ╚██████╗╚██████╔╝██████╔╝╚███╔███╔██╗╚██████╔╝╚██╗    ██╗');
  console.log('  ╚═════╝ ╚═════╝ ╚═════╝  ╚══╝╚══╝ ╚═╝ ╚═════╝  ╚═╝    ╚═╝');
  console.log(`  CDOW CS2 — CASES & DROP & OPEN & WIN    ${SITE_URL}`);
  console.log(`  Gateways: PayForm (Crypto) · Unlimit (Cards) · SkinsBack (Skins) | Mode: ${PAYMENTS}`);
  console.log(`  MADE BY VOLVIX`);
  console.log('');
});
process.on('SIGINT', () => { DB.saveNow(); process.exit(); });
