// CDOW — Standalone Client Simulation Engine for GitHub Pages (100% Free Hosting)
// Provides full standalone gaming: 52 cases, case battles, roulette, upgrader, x50, wallet, inventory.

(function() {
  const isGitHubPages = location.hostname.endsWith('github.io') || location.protocol === 'file:';

  // In-memory / localStorage state
  let user = JSON.parse(localStorage.getItem('cdow_gh_user') || 'null');
  if (!user) {
    user = {
      id: 'usr_guest',
      name: 'Player_' + Math.floor(1000 + Math.random() * 9000),
      steamId: '76561198' + Math.floor(100000000 + Math.random() * 900000000),
      photo: 'img/avatars/avatar_' + (Math.floor(Math.random() * 25) + 1) + '.svg',
      bal: 50000,
      inv: [],
      joined: Date.now()
    };
    localStorage.setItem('cdow_gh_user', JSON.stringify(user));
  }

  function saveUser() {
    localStorage.setItem('cdow_gh_user', JSON.stringify(user));
    if (window.APP && window.APP.user) window.APP.user.bal = user.bal;
    const el = document.querySelector('#balval');
    if (el) el.textContent = Math.round(user.bal).toLocaleString('en-US');
  }

  // Standalone Socket Mock
  class StandaloneSocket {
    constructor() { this.listeners = {}; }
    on(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); }
    off(ev, fn) { if (this.listeners[ev]) this.listeners[ev] = this.listeners[ev].filter(f => f !== fn); }
    emit(ev, data) { if (this.listeners[ev]) this.listeners[ev].forEach(f => f(data)); }
  }

  window.CDOW_STANDALONE = {
    isStatic: isGitHubPages,
    socket: new StandaloneSocket(),

    async handleApi(path, opts = {}) {
      const body = opts.body || {};
      const method = opts.method || 'GET';

      // 1. Config
      if (path === '/config') {
        return { siteName: 'CDOW', mode: 'standalone' };
      }

      // 2. Cases
      if (path === '/cases') {
        return (window.CDOW_CATALOG && window.CDOW_CATALOG.CASES) || [];
      }

      // 3. User & Auth
      if (path === '/me') {
        return user;
      }
      if (path === '/auth/steam-direct' || path === '/auth/demo') {
        const name = body.steamInput || 'Player';
        user.name = name;
        saveUser();
        return { token: 'gh_standalone_token', user };
      }

      // 4. Stats
      if (path === '/stats') {
        return {
          casesOpened: Number(localStorage.getItem('cdow_stat_cases') || 14820),
          activePlayers: 138,
          totalWon: 89450000
        };
      }

      // 5. Feed & Top Drops
      if (path === '/feed') {
        return [
          { name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg', value: 10000000, item: { name: 'AWP | Dragon Lore', weapon: 'sniper', rarity: 'covert', img: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa_nBovp3Pdwtj9cC_GaAd0DZdwQu9fuhS4kNy0NePntVTbjYpCyyT_3CgY5i9j_a9cBkcCWUKV' } },
          { name: 'PhantomBlade', photo: 'img/avatars/avatar_3.svg', value: 3400000, item: { name: '★ Butterfly Knife | Fade', weapon: 'knife', rarity: 'gold', img: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2avx-9ytd5lRi67gVNwsDvSwtqqc3iXZg4kCZYjReYLtRbum9XgYuvm5wbWjtgUzCn3iSsf8G81tFEeH9rw' } },
          { name: 'Vortex_CS', photo: 'img/avatars/avatar_1.svg', value: 12000000, item: { name: 'AK-47 | Wild Lotus', weapon: 'rifle', rarity: 'covert', img: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV61-LPGdCliWzeFkse1WQyC0nQlpsDuGyt-pdnyRPA4hDcYkR-QPuhi-wdPuYbyx5AaMidkQnC_-2ilIuzErvbi4ijV5Mw' } },
          { name: 'NeonRider', photo: 'img/avatars/avatar_4.svg', value: 2800000, item: { name: '★ Sport Gloves | Vice', weapon: 'gloves', rarity: 'gold', img: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H_KfG2Kv0ed4u95lRi67gVNx4T-Bw434IHyVb1QlAsd1FOUDthG4xNznMu3m4QXXg90Wzn_33C1I8G81tLaDi_rK' } }
        ];
      }
      if (path === '/drops/top') {
        return [
          { name: 'Krypton_9', photo: 'img/avatars/avatar_9.svg', item: 'M4A4 | Eye of Horus', value: 950000, from: 'M4 King Vault', rarity: 'covert' },
          { name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg', item: 'AWP | Dragon Lore', value: 10000000, from: 'CS2 OLYMPUS GRAIL 1M', rarity: 'covert' },
          { name: 'ViperX', photo: 'img/avatars/avatar_12.svg', item: 'M4A1-S | Hot Rod', value: 850000, from: 'CASE MYTHIC', rarity: 'classified' },
          { name: 'PhantomBlade', photo: 'img/avatars/avatar_3.svg', item: '★ Butterfly Knife | Fade', value: 3400000, from: 'Butterfly Dreams', rarity: 'gold' }
        ];
      }

      // 6. Case Open
      if (path === '/cases/open') {
        const c = (window.CDOW_CATALOG.CASES || []).find(x => x.id === body.caseId);
        if (!c) throw new Error('Case not found');
        if (user.bal < c.price) throw new Error('Insufficient coins balance');
        
        user.bal -= c.price;
        
        // Roll mathematically
        const roll = Math.random();
        let acc = 0, dropped = c.items[c.items.length - 1];
        for (let i = 0; i < c.items.length; i++) {
          acc += c.w[i];
          if (roll <= acc) { dropped = c.items[i]; break; }
        }
        
        // Add to inventory
        user.inv.push({ ...dropped, dropId: 'd_' + Date.now() });
        saveUser();
        
        const count = Number(localStorage.getItem('cdow_stat_cases') || 14820) + 1;
        localStorage.setItem('cdow_stat_cases', count);
        
        return { item: dropped, balance: user.bal };
      }

      // 7. Double Roulette
      if (path === '/double/bet') {
        const { color, amount } = body;
        if (!amount || amount < 10) throw new Error('Min bet is 10 coins');
        if (user.bal < amount) throw new Error('Insufficient balance');
        
        user.bal -= amount;
        
        // Double roll 0-14 (0=green 14x, 1-7=red 2x, 8-14=black 2x)
        const roll = Math.floor(Math.random() * 15);
        const winColor = roll === 0 ? 'green' : (roll <= 7 ? 'red' : 'black');
        let winAmt = 0;
        if (color === winColor) {
          winAmt = color === 'green' ? amount * 14 : amount * 2;
          user.bal += winAmt;
        }
        saveUser();
        return { roll, winColor, win: winAmt, balance: user.bal };
      }

      // 8. X50 Spin
      if (path === '/x50/spin') {
        const { amount } = body;
        if (!amount || amount < 10) throw new Error('Min bet is 10 coins');
        if (user.bal < amount) throw new Error('Insufficient balance');
        
        user.bal -= amount;
        
        // Balanced X50 odds: 0: 60%, 1.2: 18%, 1.5: 12%, 2: 6%, 3: 2.5%, 5: 1%, 10: 0.4%, 50: 0.1%
        const r = Math.random();
        let mult = 0;
        if (r < 0.60) mult = 0;
        else if (r < 0.78) mult = 1.2;
        else if (r < 0.90) mult = 1.5;
        else if (r < 0.96) mult = 2;
        else if (r < 0.985) mult = 3;
        else if (r < 0.995) mult = 5;
        else if (r < 0.999) mult = 10;
        else mult = 50;

        const winAmt = Math.round(amount * mult);
        user.bal += winAmt;
        saveUser();
        return { mult, win: winAmt, balance: user.bal };
      }

      // 9. Upgrader Roll
      if (path === '/upgrader/roll') {
        const { itemValue, targetValue, mode } = body;
        const mult = targetValue / itemValue;
        const winChance = (0.95 / mult); // 95% RTP
        const roll = Math.random() * 100;
        const targetNumber = mode === 'under' ? (winChance * 100) : (100 - (winChance * 100));
        const won = mode === 'under' ? (roll < targetNumber) : (roll > targetNumber);

        if (won) {
          user.bal += targetValue;
        }
        saveUser();
        return { roll: Number(roll.toFixed(2)), won, balance: user.bal };
      }

      // 10. Inventory & Wallet
      if (path === '/inventory') {
        return user.inv;
      }
      if (path === '/inventory/sell') {
        const { dropId, value } = body;
        const idx = user.inv.findIndex(i => i.dropId === dropId);
        if (idx >= 0) user.inv.splice(idx, 1);
        const coins = Math.round(value * 0.95);
        user.bal += coins;
        saveUser();
        return { success: true, coins, balance: user.bal };
      }
      if (path === '/wallet/deposit') {
        const amt = Number(body.amount) || 50000;
        user.bal += amt;
        saveUser();
        return { success: true, balance: user.bal, coins: amt };
      }

      return {};
    }
  };
})();
