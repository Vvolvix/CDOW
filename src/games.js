// Round-based game engines: Double roulette, Royal Battle jackpot, RUSHMID crash. MADE BY VOLVIX.
const { genSeed, hash, floats } = require('./fair');

const MIN_BET = 10;

// Community player roster for dynamic live multiplayer atmosphere
const COMMUNITY_PLAYERS = [
  { n: 'm0NESY_peek', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'NiKo_CS2', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'ZywOo_99', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'b1t_headshot', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'Donk_CS', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'Ropz_Lurker', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'S1mple_CS', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'device_dev1ce', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'Aleksib_IGL', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'Twistzz_Aim', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'flameZ_Go', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'Spinx_CS', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'frozen_cs', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
  { n: 'broky_awp', p: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
];

// ---------------- DOUBLE ----------------
// 15 pockets: 0 = GOLD x14, 1-7 DARK x2, 8-14 CYAN x2.
const pocket = n => n === 0 ? 'gold' : (n <= 7 ? 'dark' : 'cyan');
const PAY = { cyan: 2, dark: 2, gold: 14 };

function makeDouble(io, ctx) {
  const d = { round: 1, phase: 'bet', endsAt: 0, bets: [], result: null, history: [], serverSeed: '', seedHash: '' };

  const publicState = () => ({
    round: d.round,
    phase: d.phase,
    endsAt: d.endsAt,
    bets: d.bets.map(b => ({ u: b.u, n: b.n, p: b.p, s: b.s, a: b.a })),
    totals: {
      cyan: d.bets.filter(b => b.s === 'cyan').reduce((s, b) => s + b.a, 0),
      dark: d.bets.filter(b => b.s === 'dark').reduce((s, b) => s + b.a, 0),
      gold: d.bets.filter(b => b.s === 'gold').reduce((s, b) => s + b.a, 0),
    },
    result: d.result,
    history: d.history.slice(-18),
    seedHash: d.seedHash,
  });

  function seedCommunityBets() {
    const numBots = 4 + Math.floor(Math.random() * 6);
    const shuffled = [...COMMUNITY_PLAYERS].sort(() => Math.random() - 0.5).slice(0, numBots);
    
    shuffled.forEach((bot, idx) => {
      setTimeout(() => {
        if (d.phase !== 'bet') return;
        const sideRoll = Math.random();
        const s = sideRoll < 0.46 ? 'cyan' : (sideRoll < 0.92 ? 'dark' : 'gold');
        const a = s === 'gold'
          ? [100, 250, 500, 1000][Math.floor(Math.random() * 4)]
          : [250, 500, 1000, 2500, 5000, 10000][Math.floor(Math.random() * 6)];
        
        d.bets.push({ u: 'bot_' + idx, n: bot.n, p: bot.p, s, a, bot: true });
        io.emit('double', publicState());
      }, (idx + 1) * 1200 + Math.random() * 800);
    });
  }

  function newRound() {
    d.round++;
    d.phase = 'bet';
    d.bets = [];
    d.result = null;
    d.endsAt = Date.now() + 19000;
    d.serverSeed = genSeed();
    d.seedHash = hash(d.serverSeed);
    seedCommunityBets();
  }
  newRound();

  function bet(user, side, amount) {
    if (d.phase !== 'bet') throw { status: 400, error: 'Betting is closed for this round' };
    if (!PAY[side]) throw { status: 400, error: 'Invalid side' };
    amount = Math.round(amount);
    if (!Number.isFinite(amount) || amount < MIN_BET) throw { status: 400, error: `Minimum bet is ${MIN_BET}` };
    ctx.charge(user, amount, 'double bet');
    d.bets.push({ u: user.id, n: user.name, p: user.photo, s: side, a: amount, bot: false });
    io.emit('double', publicState());
  }

  function settle() {
    const roll = floats(d.serverSeed, `double-${d.round}`, 0)[0];
    const num = Math.floor(roll * 15);
    const side = pocket(num);
    d.result = { num, side };
    d.phase = 'result';

    for (const b of d.bets) {
      if (side === b.s) {
        const win = b.a * PAY[side];
        if (!b.bot) {
          const u = ctx.userById(b.u);
          if (u) ctx.credit(u, win, 'double win');
          if (win >= 5000) {
            ctx.feed({ userId: b.u, game: 'double', kind: 'coins', value: win, label: `won ${win.toLocaleString()} on ${side.toUpperCase()} ×${PAY[side]}` });
          }
        }
      }
    }

    d.history.push({ num, side, round: d.round });
    if (side === 'gold') ctx.announce(`🎲 DOUBLE hit **GOLD ×14** (round #${d.round})! Winners paid out!`);
    d.endsAt = Date.now() + 6000;
    io.emit('double', publicState());
    io.emit('double:payout', { result: d.result, seed: d.serverSeed });
  }

  setInterval(() => {
    if (d.phase === 'bet' && Date.now() >= d.endsAt) {
      d.phase = 'spin';
      d.endsAt = Date.now() + 9000;
      const roll = floats(d.serverSeed, `double-${d.round}`, 0)[0];
      d.result = { num: Math.floor(roll * 15) };
      io.emit('double', publicState());
    } else if (d.phase === 'spin' && Date.now() >= d.endsAt) {
      settle();
    } else if (d.phase === 'result' && Date.now() >= d.endsAt) {
      newRound();
    }
  }, 500);

  return { state: publicState, bet };
}

// ---------------- ROYAL BATTLE (jackpot) ----------------
function makeRoyal(io, ctx) {
  const r = { round: 1, phase: 'bet', endsAt: Date.now() + 30000, pot: 0, players: [], history: [] };

  const publicState = () => ({
    round: r.round,
    phase: r.phase,
    endsAt: r.endsAt,
    pot: r.pot,
    players: r.players.map(p => ({ u: p.u, n: p.n, p: p.p, a: p.a, chance: r.pot ? +(p.a / r.pot * 100).toFixed(2) : 0 })),
    history: r.history.slice(-10),
  });

  function join(user, amount) {
    if (r.phase !== 'bet') throw { status: 400, error: 'Round in progress — wait for the next one' };
    amount = Math.round(amount);
    if (!Number.isFinite(amount) || amount < MIN_BET) throw { status: 400, error: `Minimum is ${MIN_BET}` };
    ctx.charge(user, amount, 'royal join');
    const ex = r.players.find(p => p.u === user.id);
    if (ex) ex.a += amount; else r.players.push({ u: user.id, n: user.name, p: user.photo, a: amount });
    r.pot = r.players.reduce((s, p) => s + p.a, 0);
    io.emit('royal', publicState());
  }

  setInterval(() => {
    if (r.phase === 'bet' && Date.now() >= r.endsAt) {
      if (r.players.length < 2) {
        // Add a random challenger bot so jackpot is always exciting
        const bot = COMMUNITY_PLAYERS[Math.floor(Math.random() * COMMUNITY_PLAYERS.length)];
        const bAmt = [500, 1000, 2500, 5000][Math.floor(Math.random() * 4)];
        r.players.push({ u: 'bot_royal_' + Date.now(), n: bot.n, p: bot.p, a: bAmt, bot: true });
        r.pot = r.players.reduce((s, p) => s + p.a, 0);
        r.endsAt = Date.now() + 8000;
        io.emit('royal', publicState());
        return;
      }
      const seed = genSeed();
      const roll = floats(seed, `royal-${r.round}`, 0)[0];
      let acc = 0, winner = r.players[r.players.length - 1];
      for (const p of r.players) {
        acc += p.a / r.pot;
        if (roll <= acc) { winner = p; break; }
      }
      const prize = Math.floor(r.pot * 0.95);
      if (!winner.bot) {
        const wu = ctx.userById(winner.u);
        if (wu) ctx.credit(wu, prize, 'royal win');
      }
      r.phase = 'result';
      r.winner = { u: winner.u, n: winner.n, prize, chance: +(winner.a / r.pot * 100).toFixed(2) };
      r.history.push({ round: r.round, n: winner.n, prize });
      ctx.feed({ userId: winner.u, game: 'royal', kind: 'coins', value: prize, label: `won the ROYAL pot ${prize.toLocaleString()}` });
      if (prize >= 25000) ctx.announce(`👑 ROYAL BATTLE: **${winner.n}** takes the whole pot — **${prize.toLocaleString()} coins**!`);
      io.emit('royal', publicState());
      setTimeout(() => {
        r.round++;
        r.phase = 'bet';
        r.pot = 0;
        r.players = [];
        r.winner = null;
        r.endsAt = Date.now() + 30000;
        io.emit('royal', publicState());
      }, 7000);
    }
  }, 400);

  return { state: publicState, join };
}

// ---------------- RUSHMID (crash) ----------------
function makeRush(io, ctx) {
  const GROWTH = 0.22;
  const r = { round: 1, phase: 'bet', endsAt: Date.now() + 12000, startedAt: 0, mult: 1.00, crashAt: 1.00, bets: [], history: [], seed: '', seedHash: '' };

  const publicState = () => ({
    round: r.round,
    phase: r.phase,
    endsAt: r.endsAt,
    startedAt: r.startedAt,
    mult: r.mult,
    bets: r.bets.map(b => ({ u: b.u, n: b.n, p: b.p, a: b.a, c: b.c, at: b.at, auto: b.auto })),
    history: r.history.slice(-16),
    seedHash: r.seedHash,
  });

  function newRound() {
    r.round++;
    r.phase = 'bet';
    r.bets = [];
    r.mult = 1.00;
    r.startedAt = 0;
    r.endsAt = Date.now() + 12000;
    r.seed = genSeed();
    r.seedHash = hash(r.seed);
    const roll = floats(r.seed, `rush-${r.round}`, 0)[0];
    const e = 0.04;
    const raw = (1 - e) / (1 - roll);
    r.crashAt = Math.max(1.00, Math.floor(raw * 100) / 100);
    io.emit('rush', publicState());
  }
  newRound();

  function join(user, amount, auto) {
    if (r.phase !== 'bet') throw { status: 400, error: 'Betting closed for this round' };
    amount = Math.round(amount);
    if (!Number.isFinite(amount) || amount < MIN_BET) throw { status: 400, error: `Minimum is ${MIN_BET}` };
    ctx.charge(user, amount, 'rush bet');
    r.bets.push({ u: user.id, n: user.name, p: user.photo, a: amount, auto: auto ? Math.max(1.01, auto) : 0, c: false, at: 0 });
    io.emit('rush', publicState());
  }

  function cashout(userId) {
    if (r.phase !== 'run') return { error: 'Round is not running' };
    const b = r.bets.find(x => x.u === userId);
    if (!b) return { error: 'No active bet' };
    if (b.c) return { error: 'Already cashed out' };
    b.c = true;
    b.at = r.mult;
    const win = Math.floor(b.a * b.at);
    const u = ctx.userById(userId);
    if (u) ctx.credit(u, win, 'rush cashout');
    if (win >= 5000) {
      ctx.feed({ userId, game: 'rushmid', kind: 'coins', value: win, label: `cashed out ×${b.at.toFixed(2)} on RUSHMID → ${win.toLocaleString()}` });
    }
    io.emit('rush', publicState());
    return { win, mult: b.at, balance: u ? u.bal : 0 };
  }

  setInterval(() => {
    const now = Date.now();
    if (r.phase === 'bet' && now >= r.endsAt) {
      r.phase = 'run';
      r.startedAt = now;
      r.mult = 1.00;
      io.emit('rush', publicState());
    } else if (r.phase === 'run') {
      const elapsed = (now - r.startedAt) / 1000;
      r.mult = +(Math.exp(GROWTH * elapsed)).toFixed(2);
      r.bets.forEach(b => {
        if (!b.c && b.auto && r.mult >= b.auto && b.auto <= r.crashAt) {
          b.c = true;
          b.at = b.auto;
          const win = Math.floor(b.a * b.at);
          const u = ctx.userById(b.u);
          if (u) ctx.credit(u, win, 'rush auto-cashout');
          io.emit('rush', publicState());
        }
      });
      if (r.mult >= r.crashAt) {
        r.phase = 'bust';
        r.mult = r.crashAt;
        r.history.push({ m: r.crashAt, round: r.round });
        io.emit('rush:bust', { crashAt: r.crashAt, seed: r.seed });
        io.emit('rush', publicState());
        setTimeout(newRound, 4500);
      }
    }
  }, 100);

  return { state: publicState, join, cashout };
}

module.exports = { makeDouble, makeRoyal, makeRush };
