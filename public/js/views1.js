// CDOW views — home, cases grid, case opening with sound-synced reel. MADE BY VOLVIX.

// ---- reel engine (shared with battles) ----
function buildReelCells(container, pool, winner, count = 75, winIdx = 62) {
  container.innerHTML = '';
  const cells = [];
  for (let i = 0; i < count; i++) {
    const it = i === winIdx ? winner : pool[Math.floor(Math.random() * pool.length)];
    cells.push(it);
    container.insertAdjacentHTML('beforeend', itemCellHTML(it));
  }
  return cells;
}

function itemCellHTML(it, big = false) {
  const r = (it && it.rarity && ART.RAR[it.rarity]) || '#888';
  return `<div class="item-cell rar-${it ? it.rarity : 'consumer'} ${it && it.rarity === 'gold' ? 'gold-item' : ''}" title="${esc(it ? it.name : '')}">
    ${ART.itemArt(it)}
    <div class="i-name">${esc(it ? it.name : '')}</div>
    <div class="i-val" style="color:${r}">${fmt(it ? it.value : 0)}</div>
  </div>`;
}

function animateReel(reelEl, winIdx, duration = 8500, { mini = false, onDone = null } = {}) {
  return new Promise(resolve => {
    const wrap = reelEl.parentElement;
    const winCell = reelEl.children[winIdx];
    if (!winCell) return resolve();

    // Mathematically exact center of winning item cell relative to reel container
    const cellCenter = winCell.offsetLeft + (winCell.offsetWidth / 2);
    const wrapCenter = wrap.clientWidth / 2;
    
    // Natural slight jitter (+/- 18% of cell width) so it lands naturally, but ALWAYS 100% inside the winning box
    const maxJitter = winCell.offsetWidth * 0.18;
    const jitter = (Math.random() - 0.5) * 2 * maxJitter;
    const target = Math.max(0, cellCenter - wrapCenter + jitter);

    SND.whoosh();
    reelEl.style.transition = 'none';
    reelEl.style.transform = 'translateX(0)';
    void reelEl.offsetWidth; // force browser style recalculation

    // Dramatic, suspenseful deceleration curve
    reelEl.style.transition = `transform ${duration}ms cubic-bezier(.07, .84, .12, 1)`;
    reelEl.style.transform = `translateX(${-target}px)`;

    let stopped = false;
    const t0 = performance.now();
    let lastIdx = -1;

    (function frame() {
      if (stopped) return;
      const now = performance.now();
      const p = Math.min(1, (now - t0) / duration);
      
      // Motion blur during the high-speed phase
      reelEl.style.filter = p < 0.82 ? `blur(${(3.2 * (1 - p)).toFixed(2)}px)` : 'none';

      // Detect current item under the center needle for synchronized clicking
      try {
        const m = new DOMMatrixReadOnly(getComputedStyle(reelEl).transform);
        const curX = Math.abs(m.m41);
        const centerPos = curX + wrapCenter;

        for (let i = 0; i < reelEl.children.length; i++) {
          const cell = reelEl.children[i];
          if (cell.offsetLeft <= centerPos && (cell.offsetLeft + cell.offsetWidth) >= centerPos) {
            if (i !== lastIdx) {
              lastIdx = i;
              const rare = cell.classList.contains('rar-gold') || cell.classList.contains('rar-covert') || cell.classList.contains('rar-classified');
              SND.tick(!mini && !!rare);
            }
            break;
          }
        }
      } catch {}

      if (p < 1) requestAnimationFrame(frame);
    })();

    let done = false;
    const finish = () => {
      if (done) return;
      done = true; stopped = true;
      reelEl.style.filter = 'none';
      if (winCell) winCell.classList.add('big-win');
      onDone && onDone();
      resolve();
    };

    reelEl.addEventListener('transitionend', ev => { if (ev.propertyName === 'transform') finish(); }, { once: true });
    setTimeout(finish, duration + 800);
  });
}

// ---------------- home ----------------
register('home', async (view) => {
  const games = [
    ['#/cases', 'case', 'Cases', 'Open CS2 cases with real skins'],
    ['#/battles', 'swords', 'Case Battles', '1v1 to 2v2 — winner takes all'],
    ['#/double', 'roulette', 'Double', 'Cyan ×2 · Dark ×2 · Gold ×14'],
    ['#/x50', 'wheel', 'X50', 'Spin the multiwheel — up to ×50'],
    ['#/upgrader', 'up', 'Upgrader', 'Upgrade coins into rare CS2 skins'],
    ['#/royal', 'crown', 'Royal Battle', 'Jackpot — one takes the crown'],
    ['#/rushmid', 'rocket', 'RUSHMID', 'Cash out before the rush busts'],
    ['#/tasks', 'tasks', 'Tasks & Rewards', 'Daily freebies & +5000 referrals'],
  ];

  view.innerHTML = `
    <div class="hero">
      <img class="hero-bg" src="img/hero.png" alt="" draggable="false">
      <div class="hero-inner">
        <h1>OPEN. DROP. <span class="gr">WIN BIG.</span></h1>
        <p>The premier luxury CS2 unboxing experience — dedicated AK-47, AWP, Knife & Glove cases, live battles, upgraders, and instant Steam withdrawals.</p>
        <div class="btns">
          <button class="btn big green" onclick="${APP.user ? `location.hash='#/cases'` : `loginModal()`}">${ART.ICONS.fire} ${APP.user ? 'OPEN CASES' : 'START WINNING'}</button>
          <button class="btn ghost big" onclick="location.hash='#/battles'">${ART.ICONS.swords} CASE BATTLES</button>
        </div>
      </div>
    </div>

    <!-- Live Real-Time Stats Counter -->
    <div class="stats-counter-strip" id="home-stats-strip">
      <div class="stat-counter-card">
        <div class="stat-counter-val" id="stat-cases">--</div>
        <div class="stat-counter-lbl">Cases Unboxed</div>
      </div>
      <div class="stat-counter-card">
        <div class="stat-counter-val" id="stat-players">--</div>
        <div class="stat-counter-lbl">Active Players</div>
      </div>
      <div class="stat-counter-card">
        <div class="stat-counter-val" id="stat-coins">--</div>
        <div class="stat-counter-lbl">Total Coins Won</div>
      </div>
      <div class="stat-counter-card">
        <div class="stat-counter-val" id="stat-status">ONLINE</div>
        <div class="stat-counter-lbl">Instant Withdrawals</div>
      </div>
    </div>

    <div class="sec-title">Games</div>
    <div class="game-grid">
      ${games.map(([href, ic, t, d]) => `<div class="game-card" onclick="location.hash='${href}'"><div class="shine"></div><div class="gico">${ART.ICONS[ic]}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>

    <div class="sec-title">👑 Featured High-Roller VIP Cases</div>
    <div class="case-grid">${APP.cases.slice().sort((a, b) => b.price - a.price).slice(0, 8).map(caseCardHTML).join('')}</div>
    <div style="margin-top:20px;text-align:center"><button class="btn ghost big" onclick="location.hash='#/cases'">View all ${APP.cases.length} cases →</button></div>

    <!-- Top Drops of the Day (Hall of Fame) -->
    <div class="sec-title">Top Drops of the Day</div>
    <div class="top-drops-grid" id="top-drops-list">
      <div class="panel center" style="padding:20px">Loading top drops…</div>
    </div>

    <!-- Why Play on CDOW with Emerald Green Icons -->
    <div class="sec-title">Why Play on CDOW</div>
    <div class="features-grid">
      <div class="feat-card">
        <div class="feat-ic-box">${ART.ICONS.shield}</div>
        <h4>100% Provably Fair</h4>
        <p>Every unbox, roll, and upgrade is mathematically verified using cryptographic SHA-256 seed hashing.</p>
      </div>
      <div class="feat-card">
        <div class="feat-ic-box">${ART.ICONS.bolt}</div>
        <h4>Instant Steam Trade URLs</h4>
        <p>Direct automated CS2 skin withdrawals to your Steam Trade URL within seconds.</p>
      </div>
      <div class="feat-card">
        <div class="feat-ic-box">${ART.ICONS.card}</div>
        <h4>0% Deposit Fees</h4>
        <p>PayForm Crypto, Unlimit Cards, and SkinsBack inventory deposits credited at maximum exchange rates.</p>
      </div>
      <div class="feat-card">
        <div class="feat-ic-box">${ART.ICONS.gift}</div>
        <h4>Daily Free Coins &amp; Referrals</h4>
        <p>Claim daily freebies every 24 hours and earn +5,000 coins for every CS2 player invited.</p>
      </div>
    </div>
  `;

  // Fetch real platform stats
  async function loadStats() {
    try {
      const stats = await api('/stats');
      if ($('#stat-cases')) $('#stat-cases').textContent = fmt(stats.casesOpened || 0);
      if ($('#stat-players')) $('#stat-players').textContent = fmt(stats.activePlayers || 1);
      if ($('#stat-coins')) $('#stat-coins').textContent = fmt(stats.totalWon || 0);
    } catch {}
  }
  loadStats();

  // Fetch real top drops with resilient artwork
  async function loadTopDrops() {
    try {
      const drops = await api('/drops/top');
      const container = $('#top-drops-list');
      if (!container || !drops || !drops.length) return;
      container.innerHTML = drops.map(d => {
        const rar = d.rarity || 'gold';
        const color = ART.RAR[rar] || '#ffd700';
        return `
        <div class="top-drop-card rar-${rar}">
          <div class="top-drop-user">
            <div class="avatar sm"><img src="${esc(d.photo || 'img/avatars/avatar_1.svg')}" alt=""></div>
            <div>
              <div style="font-weight:700;font-size:13px">${esc(d.name)}</div>
              <div class="muted" style="font-size:11px">from ${esc(d.from || 'Case')}</div>
            </div>
          </div>
          <div class="top-drop-img">
            ${ART.itemArt(typeof d.item === 'object' && d.item ? d.item : { name: d.item || d.name, rarity: d.rarity || 'gold', weapon: 'rifle' }, 120, 75)}
          </div>
          <div class="top-drop-info">
            <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(d.item || '')}</div>
            <div style="color:${color};font-weight:800;font-size:14px;margin-top:2px">${fmt(d.value || 0)} coins</div>
          </div>
        </div>`;
      }).join('');
    } catch {}
  }
  loadTopDrops();

  const statsSub = s => {
    if ($('#stat-cases')) $('#stat-cases').textContent = fmt(s.casesOpened || 0);
    if ($('#stat-players')) $('#stat-players').textContent = fmt(s.activePlayers || 1);
    if ($('#stat-coins')) $('#stat-coins').textContent = fmt(s.totalWon || 0);
  };
  APP.socket.on('stats:update', statsSub);
  onRoute(() => APP.socket.off('stats:update', statsSub));
});

// ---------------- cases ----------------
function caseCardHTML(c) {
  return `<div class="case-card" onclick="location.hash='#/case/${c.id}'">
    <div class="case-art-wrap">${ART.caseSVG(c)}</div>
    <h3>${esc(c.name)}</h3>
    <div class="case-price">${ART.ICONS.coin}${fmt(c.price)}</div>
  </div>`;
}
register('cases', (view) => {
  let activeTab = 'all', query = '';
  
  function filterCases() {
    return APP.cases.filter(c => {
      if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (activeTab === 'budget') return c.price <= 5000;
      if (activeTab === 'mid') return c.price > 5000 && c.price <= 50000;
      if (activeTab === 'weapons') return ['ak47', 'howl', 'awp', 'anime', 'pistols', 'redline_12usd', 'heavy_18usd', 'scout_6usd', 'smg_frenzy'].includes(c.id);
      if (activeTab === 'knives') return c.tier === 'knife' || c.tier === 'gloves' || c.id.includes('knife') || c.id.includes('gloves') || c.id.includes('karambit') || c.id.includes('butterfly') || c.id.includes('doppler');
      if (activeTab === 'high') return c.price >= 60000 && c.price < 450000;
      if (activeTab === 'vip') return c.price >= 450000;
      return true;
    });
  }

  function renderGrid() {
    const list = filterCases();
    const grid = $('#all-cases-grid');
    if (!grid) return;
    grid.innerHTML = list.length ? list.map(caseCardHTML).join('') : '<div class="panel center" style="padding:40px;grid-column:1/-1">No cases match this filter.</div>';
  }

  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico">${ART.ICONS.case}</span>CS2 3D Cases <span class="muted" style="font-size:15px">(${APP.cases.length} total)</span></div>
      <div class="row" style="gap:8px">
        <input type="text" id="case-search" class="input" placeholder="Search 52 cases…" style="max-width:220px;padding:8px 12px;font-size:13px">
      </div>
    </div>
    
    <div class="dep-tabs" style="margin-bottom:20px;overflow-x:auto;padding-bottom:4px">
      <div class="dep-tab active" data-tab="all">All Cases (${APP.cases.length})</div>
      <div class="dep-tab" data-tab="budget">Budget (100 – 5k)</div>
      <div class="dep-tab" data-tab="mid">Mid-Tier (6k – 50k)</div>
      <div class="dep-tab" data-tab="weapons">Weapons &amp; Rifles</div>
      <div class="dep-tab" data-tab="knives">Knives &amp; Gloves</div>
      <div class="dep-tab" data-tab="high">High Roller (60k – 400k)</div>
      <div class="dep-tab" data-tab="vip" style="color:var(--gold)">👑 VIP Pinnacle (450k – 1M)</div>
    </div>

    <div class="case-grid" id="all-cases-grid">${APP.cases.map(caseCardHTML).join('')}</div>`;

  $$('.dep-tab[data-tab]').forEach(tab => {
    tab.onclick = () => {
      $$('.dep-tab[data-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      renderGrid();
      SND.click();
    };
  });

  const searchInput = $('#case-search');
  if (searchInput) {
    searchInput.oninput = (e) => {
      query = e.target.value.trim();
      renderGrid();
    };
  }
});
register('notfound', (view) => { view.innerHTML = `<div class="panel center" style="padding:60px"><h2>404 — Nothing dropped here 👻</h2></div>`; });

// ---------------- case opening ----------------
register('case', async (view, id) => {
  const c = APP.cases.find(x => x.id === id) || (await api('/cases').then(cs => cs.find(x => x.id === id)).catch(() => null));
  if (!c) { view.innerHTML = '<div class="panel">Case not found.</div>'; return; }
  const sorted = c.items.slice().sort((a, b) => a.value - b.value);
  let demo = localStorage.getItem('cdow_demo') === '1';
  let spinning = false;

  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico">${ART.ICONS.case}</span>${esc(c.name)}</div>
      <div class="row">
        <div class="row" style="gap:7px"><span class="muted" style="font-size:12px">DEMO</span><div class="demo-switch ${demo ? 'on' : ''}" id="demo-sw"></div></div>
        <div class="timer-pill">${ART.ICONS.coin}<span class="t num">${fmt(c.price)}</span></div>
      </div>
    </div>
    <div class="reel-wrap">
      <div class="reel-fade l"></div><div class="reel-fade r"></div>
      <div class="reel-marker"></div>
      <div class="reel" id="reel" style="transform:translateX(0)"></div>
    </div>
    <div class="case-open-bar">
      <button class="btn big green" id="openbtn" style="padding:16px 38px;font-size:16px">${ART.ICONS.fire} OPEN CASE — ${fmt(c.price)} COINS</button>
      <span class="muted" style="font-size:12.5px" id="openhint">${demo ? 'Demo mode: free spins, no real items' : 'Real open — items go to your inventory'}</span>
    </div>
    <div class="sec-title">Possible drops (${sorted.length} skins)</div>
    <div class="pool-strip">${sorted.map(i => `<div style="width:130px">${itemCellHTML(i)}</div>`).join('')}</div>
  `;

  const reel = $('#reel');
  for (let i = 0; i < 30; i++) reel.insertAdjacentHTML('beforeend', itemCellHTML(sorted[Math.floor(Math.random() * sorted.length)]));

  $('#demo-sw').onclick = () => {
    demo = !demo; localStorage.setItem('cdow_demo', demo ? '1' : '0');
    $('#demo-sw').classList.toggle('on', demo);
    $('#openhint').textContent = demo ? 'Demo mode: free spins, no real items' : 'Real open — items go to your inventory';
    SND.click();
  };

  $('#openbtn').onclick = async () => {
    if (spinning) return;
    if (!demo && needLogin()) return;
    SND.click();
    let winner, invId = null;
    try {
      if (demo) {
        winner = c.items[Math.floor(Math.random() * c.items.length)];
      } else {
        const r = await api('/cases/open', { method: 'POST', body: { caseId: c.id } });
        winner = r.item;
        invId = r.invId;
        setBal(r.balance);
      }
    } catch (e) {
      return toast(e.message, 'err');
    }

    spinning = true;
    $('#openbtn').disabled = true;
    
    // Build 75 cells with the exact winner at index 62
    const winIdx = 62;
    buildReelCells(reel, c.items, winner, 75, winIdx);

    // Animate with exact precision and longer 8.5s duration
    await animateReel(reel, winIdx, 8500);

    spinning = false;
    $('#openbtn').disabled = false;
    const big = winner.rarity === 'gold' || winner.value >= c.price * 20;
    big ? SND.bigWin() : SND.win();
    const r = ART.RAR[winner.rarity] || '#ffd700';

    // Perfectly centered, luxurious win modal
    modal(`<button class="close-x" onclick="closeModal()">✕</button>
      <div class="center win-modal-body">
        <div class="win-modal-header" style="color:${r}">${demo ? 'DEMO UNBOXING' : 'YOU UNBOXED'}</div>
        <div class="win-modal-card-wrap">
          <div class="win-card rar-${winner.rarity}">
            ${ART.itemArt(winner, 140, 85)}
            <div class="win-card-rarity">${(winner.rarity || 'CS2').toUpperCase()}</div>
          </div>
        </div>
        <h2 class="win-modal-title" style="color:${r}">${esc(winner.name)}</h2>
        <div class="win-modal-val">Value: <b class="gold">${fmt(winner.value)}</b> coins</div>
        ${demo ? '' : `<div class="row center" style="margin-top:18px;gap:10px">
          <button class="btn ghost" id="keepbtn" onclick="closeModal()">Keep item</button>
          <button class="btn gold" id="sellbtn">Sell for ${fmt(winner.value * 0.95)}</button>
        </div>`}
      </div>`);

    if (!demo) {
      $('#keepbtn').onclick = () => { closeModal(); toast('Item added to your inventory'); };
      $('#sellbtn').onclick = async () => {
        try {
          const r2 = await api('/inventory/sell', { method: 'POST', body: { ids: [invId] } });
          setBal(r2.balance);
          closeModal();
          toast('Sold for ' + fmt(r2.got) + ' coins (95% value)');
          SND.coin();
        } catch (e) {
          toast(e.message, 'err');
        }
      };
    }
  };
});
