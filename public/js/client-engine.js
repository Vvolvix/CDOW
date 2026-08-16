// CDOW — Complete Standalone Client Simulation Engine for GitHub Pages (100% Free Hosting)
// Implements 100% of all platform endpoints: 52 cases, Case Battles, Double, Upgrader, X50, Royal, Rushmid, Profile, Inventory, Tasks, Deposit.

(function() {
  const isStaticHost = location.hostname.endsWith('github.io') || location.protocol === 'file:';

  // 1. Initial State — Fresh visitors start as GUEST (Unauthenticated, 0 coins)
  let user = JSON.parse(localStorage.getItem('cdow_user') || 'null');

  function saveUser() {
    if (user) {
      localStorage.setItem('cdow_user', JSON.stringify(user));
      if (window.APP) window.APP.user = user;
    } else {
      localStorage.removeItem('cdow_user');
      if (window.APP) window.APP.user = null;
    }
    const el = document.querySelector('#balval');
    if (el) el.textContent = user ? Math.round(user.bal).toLocaleString('en-US') : '0';
  }

  // Standalone Event Emitter (Socket.io mock)
  class StandaloneSocket {
    constructor() { this.listeners = {}; }
    on(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); return this; }
    off(ev, fn) { if (this.listeners[ev]) this.listeners[ev] = this.listeners[ev].filter(f => f !== fn); return this; }
    emit(ev, data) { if (this.listeners[ev]) this.listeners[ev].forEach(f => f(data)); return this; }
  }

  const socket = new StandaloneSocket();

  // Community Bots
  const BOTS = [
    { id: 'b1', name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg' },
    { id: 'b2', name: 'Vortex_CS', photo: 'img/avatars/avatar_1.svg' },
    { id: 'b3', name: 'PhantomBlade', photo: 'img/avatars/avatar_3.svg' },
    { id: 'b4', name: 'NeonRider', photo: 'img/avatars/avatar_4.svg' },
    { id: 'b5', name: 'Krypton_9', photo: 'img/avatars/avatar_9.svg' },
    { id: 'b6', name: 'ViperX', photo: 'img/avatars/avatar_12.svg' },
    { id: 'b7', name: 'ApexPredator', photo: 'img/avatars/avatar_7.svg' },
    { id: 'b8', name: 'Titan_Strike', photo: 'img/avatars/avatar_15.svg' }
  ];

  // ---------------- DOUBLE ROULETTE ENGINE ----------------
  const NUM_ORDER = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];
  let dblState = {
    phase: 'bet', endsAt: Date.now() + 15000,
    bets: [], totals: { cyan: 0, dark: 0, gold: 0 },
    history: [
      { num: 3, side: 'cyan' }, { num: 8, side: 'dark' }, { num: 0, side: 'gold' },
      { num: 12, side: 'cyan' }, { num: 6, side: 'dark' }, { num: 1, side: 'dark' }
    ],
    result: null
  };

  setInterval(() => {
    const now = Date.now();
    if (dblState.phase === 'bet') {
      // Simulate random bot bets
      if (Math.random() < 0.35 && dblState.bets.length < 8) {
        const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
        const side = Math.random() < 0.15 ? 'gold' : (Math.random() < 0.5 ? 'cyan' : 'dark');
        const amt = [100, 250, 500, 1000, 2500][Math.floor(Math.random() * 5)];
        dblState.bets.push({ u: bot.id, n: bot.name, p: bot.photo, s: side, a: amt });
        dblState.totals[side] += amt;
      }
      if (now >= dblState.endsAt) {
        dblState.phase = 'spin';
        const winNum = NUM_ORDER[Math.floor(Math.random() * NUM_ORDER.length)];
        const winSide = winNum === 0 ? 'gold' : (winNum <= 7 ? 'dark' : 'cyan');
        dblState.result = { num: winNum, side: winSide };
        dblState.endsAt = now + 6500;
        
        // Award user if bet
        if (user) {
          const userBets = dblState.bets.filter(b => b.u === user.id);
          userBets.forEach(b => {
            if (b.s === winSide) {
              const winAmt = b.a * (winSide === 'gold' ? 14 : 2);
              user.bal += winAmt;
              user.stats.won += winAmt;
              saveUser();
            }
          });
        }
      }
    } else if (dblState.phase === 'spin') {
      if (now >= dblState.endsAt) {
        dblState.phase = 'bet';
        dblState.history.push(dblState.result);
        if (dblState.history.length > 20) dblState.history.shift();
        dblState.bets = [];
        dblState.totals = { cyan: 0, dark: 0, gold: 0 };
        dblState.result = null;
        dblState.endsAt = now + 15000;
      }
    }
    socket.emit('double', dblState);
  }, 1000);

  // ---------------- X50 WHEEL ENGINE ----------------
  const X_SECTORS = [
    { mult: 50, color: 'gold' }, { mult: 0, color: 'black' }, { mult: 1.5, color: 'green' },
    { mult: 0, color: 'black' }, { mult: 2, color: 'green' }, { mult: 0, color: 'black' },
    { mult: 1.2, color: 'green' }, { mult: 0, color: 'black' }, { mult: 3, color: 'green' },
    { mult: 0, color: 'black' }, { mult: 10, color: 'gold' }, { mult: 0, color: 'black' },
    { mult: 1.2, color: 'green' }, { mult: 0, color: 'black' }, { mult: 5, color: 'green' },
    { mult: 0, color: 'black' }
  ];
  let x50State = {
    phase: 'bet', endsAt: Date.now() + 15000,
    bets: [], totals: { 0: 0, 1.2: 0, 1.5: 0, 2: 0, 3: 0, 5: 0, 10: 0, 50: 0 },
    history: [1.2, 0, 2, 0, 1.5, 5, 0, 10, 0, 1.2],
    result: null
  };

  setInterval(() => {
    const now = Date.now();
    if (x50State.phase === 'bet') {
      if (Math.random() < 0.35 && x50State.bets.length < 8) {
        const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
        const mult = [1.2, 1.5, 2, 3, 5, 10, 50][Math.floor(Math.random() * 7)];
        const amt = [100, 250, 500, 1000][Math.floor(Math.random() * 4)];
        x50State.bets.push({ u: bot.id, n: bot.name, p: bot.photo, m: mult, a: amt });
        x50State.totals[mult] = (x50State.totals[mult] || 0) + amt;
      }
      if (now >= x50State.endsAt) {
        x50State.phase = 'spin';
        const secIdx = Math.floor(Math.random() * X_SECTORS.length);
        const winSec = X_SECTORS[secIdx];
        x50State.result = { index: secIdx, mult: winSec.mult };
        x50State.endsAt = now + 6500;

        if (user) {
          const userBets = x50State.bets.filter(b => b.u === user.id);
          userBets.forEach(b => {
            if (b.m === winSec.mult) {
              const winAmt = Math.round(b.a * winSec.mult);
              user.bal += winAmt;
              user.stats.won += winAmt;
              saveUser();
            }
          });
        }
      }
    } else if (x50State.phase === 'spin') {
      if (now >= x50State.endsAt) {
        x50State.phase = 'bet';
        x50State.history.push(x50State.result.mult);
        if (x50State.history.length > 20) x50State.history.shift();
        x50State.bets = [];
        x50State.totals = { 0: 0, 1.2: 0, 1.5: 0, 2: 0, 3: 0, 5: 0, 10: 0, 50: 0 };
        x50State.result = null;
        x50State.endsAt = now + 15000;
      }
    }
    socket.emit('x50', x50State);
  }, 1000);

  // ---------------- CASE BATTLES STATE ----------------
  let battleIdSeq = 100;
  let battlesList = [
    {
      id: 'bat_1', caseId: 'ak47', caseName: 'AK-47 Legends', mode: '1v1', rounds: 3, price: 35000,
      state: 'lobby', creatorId: 'b1',
      players: [{ id: 'b1', name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg', total: 0, drops: [] }],
      results: []
    },
    {
      id: 'bat_2', caseId: 'starter_1usd', caseName: '$1 Starter Box', mode: '1v1', rounds: 5, price: 1000,
      state: 'lobby', creatorId: 'b2',
      players: [{ id: 'b2', name: 'Vortex_CS', photo: 'img/avatars/avatar_1.svg', total: 0, drops: [] }],
      results: []
    }
  ];

  // ---------------- STANDALONE API ROUTER ----------------
  window.CDOW_STANDALONE = {
    isStatic: isStaticHost,
    socket: socket,

    async handleApi(path, opts = {}) {
      const body = opts.body || {};
      const method = opts.method || 'GET';

      // 1. Config
      if (path === '/config') {
        return { siteName: 'CDOW', mode: 'standalone' };
      }

      // 2. Cases List
      if (path === '/cases') {
        return (window.CDOW_CATALOG && window.CDOW_CATALOG.CASES) || [];
      }

      // 3. User & Authentication
      if (path === '/me') {
        if (!user) throw new Error('Not authenticated');
        return user;
      }
      if (path === '/auth/steam-direct' || path === '/auth/demo' || path === '/auth/steam') {
        const name = (body.steamInput || 'Player_' + Math.floor(1000 + Math.random() * 9000)).trim();
        user = {
          id: 'usr_' + Date.now().toString(36),
          name: name,
          steamId: '76561198' + Math.floor(100000000 + Math.random() * 900000000),
          photo: 'img/avatars/avatar_' + (Math.floor(Math.random() * 25) + 1) + '.svg',
          bal: 0, // Starts at 0 coins as requested
          inv: [],
          tradeUrl: '',
          refCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          refCount: 0,
          dailyAt: 0,
          stats: { opened: 0, wagered: 0, won: 0, battlesWon: 0 },
          createdAt: Date.now()
        };
        saveUser();
        return { token: 'gh_standalone_token', user };
      }
      if (path === '/auth/steam-sync') {
        if (!user) throw new Error('Not authenticated');
        user.photo = 'img/avatars/avatar_' + (Math.floor(Math.random() * 25) + 1) + '.svg';
        saveUser();
        return { user };
      }
      if (path === '/profile/tradeurl') {
        if (!user) throw new Error('Not authenticated');
        user.tradeUrl = body.url || '';
        let bonus = 0;
        if (!user.tradeBonus) {
          user.tradeBonus = true;
          bonus = 300;
          user.bal += bonus;
        }
        saveUser();
        return { ok: true, bonus };
      }

      // 4. Stats & Feed
      if (path === '/stats') {
        return {
          casesOpened: Number(localStorage.getItem('cdow_stat_cases') || 14820),
          activePlayers: 138,
          totalWon: 89450000
        };
      }
      if (path === '/feed') {
        const skins = window.CDOW_SKIN_IMAGES || {};
        return [
          { name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg', value: 10000000, item: { name: 'AWP | Dragon Lore', weapon: 'sniper', rarity: 'covert', img: skins['AWP | Dragon Lore'] } },
          { name: 'PhantomBlade', photo: 'img/avatars/avatar_3.svg', value: 3400000, item: { name: '★ Butterfly Knife | Fade', weapon: 'knife', rarity: 'gold', img: skins['★ Butterfly Knife | Fade'] } },
          { name: 'Vortex_CS', photo: 'img/avatars/avatar_1.svg', value: 12000000, item: { name: 'AK-47 | Wild Lotus', weapon: 'rifle', rarity: 'covert', img: skins['AK-47 | Wild Lotus'] } },
          { name: 'NeonRider', photo: 'img/avatars/avatar_4.svg', value: 2800000, item: { name: '★ Sport Gloves | Vice', weapon: 'gloves', rarity: 'gold', img: skins['★ Sport Gloves | Vice'] } }
        ];
      }
      if (path === '/drops/top') {
        const skins = window.CDOW_SKIN_IMAGES || {};
        return [
          { name: 'Krypton_9', photo: 'img/avatars/avatar_9.svg', item: { name: 'M4A4 | Eye of Horus', rarity: 'covert', img: skins['M4A4 | Eye of Horus'] }, value: 950000, from: 'M4 King Vault', rarity: 'covert' },
          { name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg', item: { name: 'AWP | Dragon Lore', rarity: 'covert', img: skins['AWP | Dragon Lore'] }, value: 10000000, from: 'CS2 OLYMPUS GRAIL 1M', rarity: 'covert' },
          { name: 'ViperX', photo: 'img/avatars/avatar_12.svg', item: { name: 'M4A1-S | Hot Rod', rarity: 'classified', img: skins['M4A1-S | Hot Rod'] }, value: 850000, from: 'CASE MYTHIC', rarity: 'classified' },
          { name: 'PhantomBlade', photo: 'img/avatars/avatar_3.svg', item: { name: '★ Butterfly Knife | Fade', rarity: 'gold', img: skins['★ Butterfly Knife | Fade'] }, value: 3400000, from: 'Butterfly Dreams', rarity: 'gold' }
        ];
      }

      // 5. Case Opening
      if (path === '/cases/open') {
        if (!user) throw new Error('Please sign in first');
        const c = (window.CDOW_CATALOG.CASES || []).find(x => x.id === body.caseId);
        if (!c) throw new Error('Case not found');
        if (user.bal < c.price) throw new Error('Insufficient coins balance — top up your account');

        user.bal -= c.price;
        user.stats.opened += 1;
        user.stats.wagered += c.price;

        const roll = Math.random();
        let acc = 0, dropped = c.items[c.items.length - 1];
        for (let i = 0; i < c.items.length; i++) {
          acc += c.w[i];
          if (roll <= acc) { dropped = c.items[i]; break; }
        }

        const skinImg = (window.CDOW_SKIN_IMAGES && window.CDOW_SKIN_IMAGES[dropped.name]) || dropped.img;
        const itemObj = { ...dropped, id: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), img: skinImg };
        user.inv.unshift(itemObj);
        user.stats.won += dropped.value;
        saveUser();

        const count = Number(localStorage.getItem('cdow_stat_cases') || 14820) + 1;
        localStorage.setItem('cdow_stat_cases', count);

        return { item: itemObj, balance: user.bal };
      }

      // 6. Double State & Bet
      if (path === '/double/state') {
        return dblState;
      }
      if (path === '/double/bet') {
        if (!user) throw new Error('Please sign in first');
        if (dblState.phase !== 'bet') throw new Error('Betting is closed for this roll');
        const { side, amount } = body;
        const amt = Math.max(10, Math.round(+amount || 0));
        if (user.bal < amt) throw new Error('Insufficient coins balance');

        user.bal -= amt;
        user.stats.wagered += amt;
        saveUser();

        dblState.bets.push({ u: user.id, n: user.name, p: user.photo, s: side, a: amt });
        dblState.totals[side] = (dblState.totals[side] || 0) + amt;
        socket.emit('double', dblState);

        return { ok: true, balance: user.bal };
      }

      // 7. X50 State & Bet
      if (path === '/x50/state') {
        return x50State;
      }
      if (path === '/x50/bet') {
        if (!user) throw new Error('Please sign in first');
        if (x50State.phase !== 'bet') throw new Error('Betting is closed for this spin');
        const { mult, amount } = body;
        const amt = Math.max(10, Math.round(+amount || 0));
        if (user.bal < amt) throw new Error('Insufficient coins balance');

        user.bal -= amt;
        user.stats.wagered += amt;
        saveUser();

        x50State.bets.push({ u: user.id, n: user.name, p: user.photo, m: mult, a: amt });
        x50State.totals[mult] = (x50State.totals[mult] || 0) + amt;
        socket.emit('x50', x50State);

        return { ok: true, balance: user.bal };
      }

      // 8. Upgrader Targets & Roll
      if (path.startsWith('/upgrader/targets')) {
        const bet = +(path.split('bet=')[1] || 100);
        const skins = window.CDOW_SKIN_IMAGES || {};
        const items = (window.CDOW_CATALOG && window.CDOW_CATALOG.ITEMS) || [];
        return items.map((it, idx) => ({
          id: 'upg_' + idx,
          name: it.name,
          rarity: it.rarity,
          weapon: it.weapon || 'rifle',
          value: it.value,
          img: skins[it.name]
        })).sort((a, b) => a.value - b.value);
      }
      if (path === '/upgrader/roll') {
        if (!user) throw new Error('Please sign in first');
        const { bet, targetId, itemIds, mode } = body;
        const skins = window.CDOW_SKIN_IMAGES || {};
        const items = (window.CDOW_CATALOG && window.CDOW_CATALOG.ITEMS) || [];
        const targets = items.map((it, idx) => ({
          id: 'upg_' + idx, name: it.name, rarity: it.rarity, weapon: it.weapon || 'rifle', value: it.value, img: skins[it.name]
        }));
        const target = targets.find(t => t.id === targetId) || targets[0];
        
        // Deduct items or balance
        if (itemIds && itemIds.length) {
          user.inv = user.inv.filter(i => !itemIds.includes(i.id));
        } else {
          const amt = Math.max(10, Math.round(+bet || 10));
          if (user.bal < amt) throw new Error('Insufficient coins balance');
          user.bal -= amt;
        }

        const betVal = Math.max(10, +bet || 10);
        user.stats.wagered += betVal;

        const mult = target.value / betVal;
        const winChance = Math.min(0.8, (0.92 / mult));
        const roll = Math.random() * 100;
        const targetNumber = mode === 'under' ? (winChance * 100) : (100 - (winChance * 100));
        const won = mode === 'under' ? (roll < targetNumber) : (roll > targetNumber);

        if (won) {
          user.inv.unshift({ ...target, id: 'inv_' + Date.now() });
          user.stats.won += target.value;
        }
        saveUser();

        return { roll: Number(roll.toFixed(2)), won, balance: user.bal, target };
      }

      // 9. Case Battles
      if (path === '/battles') {
        return battlesList;
      }
      if (path === '/battles/create') {
        if (!user) throw new Error('Please sign in first');
        const { caseId, rounds, mode } = body;
        const c = (window.CDOW_CATALOG.CASES || []).find(x => x.id === caseId);
        if (!c) throw new Error('Case not found');
        const cost = c.price * rounds;
        if (user.bal < cost) throw new Error('Insufficient coins balance for this battle');

        user.bal -= cost;
        user.stats.wagered += cost;
        saveUser();

        const newBat = {
          id: 'bat_' + (++battleIdSeq),
          caseId: c.id,
          caseName: c.name,
          mode: mode || '1v1',
          rounds: rounds || 3,
          price: c.price,
          state: 'lobby',
          creatorId: user.id,
          players: [{ id: user.id, name: user.name, photo: user.photo, total: 0, drops: [] }],
          results: []
        };
        battlesList.unshift(newBat);
        socket.emit('battles:update', battlesList);
        return newBat;
      }
      if (path.startsWith('/battles/') && !path.includes('/join') && !path.includes('/bot')) {
        const id = path.split('/')[2];
        const b = battlesList.find(x => x.id === id);
        if (!b) throw new Error('Battle not found');
        return b;
      }
      if (path.includes('/bot')) {
        const id = path.split('/')[2];
        const b = battlesList.find(x => x.id === id);
        if (!b) throw new Error('Battle not found');
        const bot = BOTS[Math.floor(Math.random() * BOTS.length)];
        b.players.push({ id: bot.id, name: bot.name, photo: bot.photo, total: 0, drops: [] });
        
        const slots = { '1v1': 2, '1v1v1': 3, '1v1v1v1': 4, '2v2': 4 }[b.mode] || 2;
        if (b.players.length >= slots) {
          b.state = 'live';
          // Run battle simulation
          const c = (window.CDOW_CATALOG.CASES || []).find(x => x.id === b.caseId);
          b.results = [];
          for (let r = 0; r < b.rounds; r++) {
            const roundDrops = [];
            b.players.forEach(p => {
              const roll = Math.random();
              let acc = 0, dropped = c.items[c.items.length - 1];
              for (let i = 0; i < c.items.length; i++) {
                acc += c.w[i];
                if (roll <= acc) { dropped = c.items[i]; break; }
              }
              const skinImg = (window.CDOW_SKIN_IMAGES && window.CDOW_SKIN_IMAGES[dropped.name]) || dropped.img;
              const dropItem = { ...dropped, img: skinImg };
              p.total += dropped.value;
              p.drops.push(dropItem);
              roundDrops.push(dropItem);
            });
            b.results.push(roundDrops);
          }
          b.state = 'done';
          
          // Determine winner
          const winner = [...b.players].sort((a, b) => b.total - a.total)[0];
          if (user && winner.id === user.id) {
            user.stats.battlesWon += 1;
            b.players.forEach(p => {
              p.drops.forEach(d => user.inv.unshift({ ...d, id: 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6) }));
            });
            saveUser();
          }
        }
        socket.emit('battles:update', battlesList);
        return b;
      }

      // 10. Inventory & Selling
      if (path === '/inventory') {
        return user ? user.inv : [];
      }
      if (path === '/inventory/sell') {
        if (!user) throw new Error('Please sign in first');
        const ids = body.ids || (body.dropId ? [body.dropId] : []);
        let totalCoins = 0;
        ids.forEach(id => {
          const idx = user.inv.findIndex(i => i.id === id || i.dropId === id);
          if (idx >= 0) {
            const it = user.inv.splice(idx, 1)[0];
            totalCoins += Math.round(it.value * 0.90);
          }
        });
        user.bal += totalCoins;
        saveUser();
        return { success: true, coins: totalCoins, balance: user.bal };
      }

      // 11. Tasks & Daily Rewards
      if (path === '/tasks') {
        const DAY_MS = 22 * 3600 * 1000;
        const dailyReady = !user || (Date.now() - user.dailyAt >= DAY_MS);
        return {
          defs: [
            { id: 'invite', name: 'Invite a friend', reward: 5000, type: 'Unlimited', group: 'TOP Tasks', desc: 'Invite friends with your referral link. +5000 for each one who joins.', auto: true },
            { id: 'recharge', name: 'Recharge balance', reward: 6500, type: 'One-time', group: 'TOP Tasks', desc: 'Make your first deposit. +6500 automatically.', auto: true },
            { id: 'daily_open', name: 'Open any case today', reward: 250, type: 'Daily', group: 'Daily Freebies' },
            { id: 'refer_link', name: 'Share your referral link', reward: 500, type: 'One-time', group: 'Other' }
          ],
          state: {
            invite: { count: user ? user.refCount : 0 },
            recharge: { done: false },
            daily_open: { ready: true },
            refer_link: { done: false }
          },
          daily: {
            ready: dailyReady,
            in: 22,
            min: 0
          },
          refCode: user ? user.refCode : 'CDOW',
          refCount: user ? user.refCount : 0
        };
      }
      if (path === '/tasks/claim') {
        if (!user) throw new Error('Please sign in first');
        user.bal += 300;
        user.dailyAt = Date.now();
        saveUser();
        return { ok: true, balance: user.bal };
      }

      // 12. Deposits (PayForm, Unlimit, SkinsBack)
      if (path.startsWith('/deposit/')) {
        if (!user) throw new Error('Please sign in first');
        const amtCoins = (body.amountUsd ? body.amountUsd * 1000 : (body.estimatedUsd ? body.estimatedUsd * 1000 : 25000));
        user.bal += amtCoins;
        saveUser();
        return {
          tx: { id: 'tx_' + Date.now(), coins: amtCoins },
          payUrl: 'https://payform.me/'
        };
      }

      // 13. Royal & Rushmid
      if (path === '/royal/state') {
        return { pot: 12500, players: [{ n: 'Vortex_CS', p: 'img/avatars/avatar_1.svg', a: 5000, chance: 40 }], phase: 'bet', endsAt: Date.now() + 25000, history: [] };
      }
      if (path === '/rushmid/state') {
        return { phase: 'bet', mult: 1.00, history: [1.45, 2.80, 1.12, 5.40, 1.88], endsAt: Date.now() + 15000 };
      }

      return {};
    }
  };
})();
