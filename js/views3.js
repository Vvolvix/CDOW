// CDOW views — Double roulette, X50 wheel, Upgrader. MADE BY VOLVIX.

// ---------------- DOUBLE ----------------
register('double', (view) => {
  let st = null, mySide = null, myAmount = 100, spinning = false;
  const NUM_ORDER = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];
  const STEP = 82; // cell width + gap

  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico">${ART.ICONS.roulette}</span>Double</div>
      <div class="timer-pill" id="dtimer"><span class="t">--</span></div>
    </div>
    <div class="dbl-history" id="dhist"></div>
    <div class="dbl-roulette">
      <div class="reel-marker"></div>
      <div class="dbl-track" id="dbl-track"></div>
    </div>
    <div class="dbl-bet-grid">
      ${['cyan', 'dark', 'gold'].map(s => `
        <div class="dbl-bet-btn b-${s}" data-side="${s}">
          <div class="mult">×${s === 'gold' ? 14 : 2}</div>
          <div class="tot" id="tot-${s}">0 coins</div>
        </div>`).join('')}
    </div>
    <div class="panel" style="margin-top:16px">
      <div class="row" style="flex-wrap:wrap">
        <input type="number" id="damt" value="100" min="10" style="max-width:160px" class="input">
        ${[100, 500, 1000, 5000, 25000].map(v => `<div class="amt-chip" data-v="${v}" style="padding:7px 12px">${fmt(v)}</div>`).join('')}
        <div class="grow"></div>
        <div class="muted" style="font-size:12px" id="mybetinfo"></div>
        <button class="btn big green" id="dbet">PLACE BET</button>
      </div>
    </div>
    <div class="grid3" style="margin-top:16px">
      ${['cyan', 'dark', 'gold'].map(s => `<div class="panel"><b class="cyan" style="text-transform:capitalize">${s} (×${s === 'gold' ? 14 : 2})</b><div class="bets-list" id="bets-${s}" style="margin-top:10px;max-height:280px;overflow-y:auto"></div></div>`).join('')}
    </div>`;

  const track = $('#dbl-track');

  // Fill initial track so it is ALWAYS visible and never empty
  function initTrack() {
    if (!track) return;
    track.innerHTML = '';
    for (let k = 0; k < 6; k++) {
      NUM_ORDER.forEach(n => {
        const side = n === 0 ? 'gold' : (n <= 7 ? 'dark' : 'cyan');
        track.insertAdjacentHTML('beforeend', `<div class="dbl-cell c-${side}"><span>${n}</span><small>${side === 'gold' ? '×14' : '×2'}</small></div>`);
      });
    }
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
  }
  initTrack();

  $$('.dbl-bet-btn').forEach(b => b.onclick = () => {
    mySide = b.dataset.side;
    $$('.dbl-bet-btn').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel');
    SND.click();
  });
  $$('[data-v]').forEach(c => c.onclick = () => { $('#damt').value = c.dataset.v; SND.click(); });

  function renderState() {
    if (!st) return;
    $('#dhist').innerHTML = (st.history || []).slice().reverse().map(h => `<div class="dh-dot dh-${h.side}">${h.num}</div>`).join('');
    
    ['cyan', 'dark', 'gold'].forEach(s => {
      $('#tot-' + s).textContent = fmt((st.totals || {})[s] || 0) + ' coins';
      $('#bets-' + s).innerHTML = st.bets.filter(b => b.s === s).map(b =>
        `<div class="bet-row"><div class="avatar sm">${b.p ? `<img src="${esc(b.p)}">` : esc(b.n.slice(0, 2).toUpperCase())}</div><span class="grow" style="font-size:12.5px">${esc(b.n)}</span><b class="num" style="font-size:12px">${fmt(b.a)}</b></div>`).join('') || '<div class="muted" style="font-size:12px">No bets yet</div>';
    });

    const mine = st.bets.filter(b => APP.user && b.u === APP.user.id);
    $('#mybetinfo').textContent = mine.length ? 'Your bet: ' + mine.map(b => `${fmt(b.a)} on ${b.s}`).join(', ') : '';
    
    const left = Math.max(0, Math.round((st.endsAt - Date.now()) / 1000));
    const pill = $('#dtimer');
    pill.className = 'timer-pill' + (left <= 5 && st.phase === 'bet' ? ' urgent' : '');
    pill.innerHTML = st.phase === 'bet' ? `⏳ Betting ends in <span class="t">${left}s</span>` : st.phase === 'spin' ? '🎰 Rolling…' : '✅ Round complete';
    
    if (st.phase === 'spin' && !spinning) runSpin();
  }

  function runSpin() {
    spinning = true;
    const num = st.result ? st.result.num : 0;
    
    // Rebuild track with winning pocket at index 55
    track.innerHTML = '';
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    void track.offsetWidth;

    const winIdx = 55;
    for (let i = 0; i < 70; i++) {
      const n = i === winIdx ? num : NUM_ORDER[i % NUM_ORDER.length];
      const side = n === 0 ? 'gold' : (n <= 7 ? 'dark' : 'cyan');
      track.insertAdjacentHTML('beforeend', `<div class="dbl-cell c-${side}"><span>${n}</span><small>${side === 'gold' ? '×14' : '×2'}</small></div>`);
    }

    const wrap = track.parentElement;
    const target = winIdx * STEP + 37 - wrap.clientWidth / 2 + (Math.random() - 0.5) * 14;

    requestAnimationFrame(() => {
      track.style.transition = 'transform 8.5s cubic-bezier(.08, .82, .14, 1)';
      track.style.transform = `translateX(${-target}px)`;
    });

    let delay = 50;
    const tickLoop = () => {
      if (delay > 340) return;
      SND.tick(false);
      delay *= 1.11;
      setTimeout(tickLoop, delay);
    };
    tickLoop();

    setTimeout(() => {
      spinning = false;
      const side = num === 0 ? 'gold' : (num <= 7 ? 'dark' : 'cyan');
      side === 'gold' ? SND.bigWin() : SND.win();
    }, 8600);
  }

  $('#dbet').onclick = async () => {
    if (needLogin()) return;
    if (!mySide) return toast('Pick a side first (cyan / dark / gold)', 'err');
    try {
      myAmount = Math.max(10, Math.round(+$('#damt').value || 0));
      const r = await api('/double/bet', { method: 'POST', body: { side: mySide, amount: myAmount } });
      setBal(r.balance);
      toast(`Bet placed: ${fmt(myAmount)} on ${mySide}`);
      SND.coin();
    } catch (e) {
      toast(e.message, 'err');
    }
  };

  (async () => { st = await api('/double/state'); renderState(); })();
  const h = s => { st = s; renderState(); };
  APP.socket.on('double', h);
  onRoute(() => APP.socket.off('double', h));
  const t = setInterval(() => { if (st && st.phase === 'bet') renderState(); }, 1000);
  onRoute(() => clearInterval(t));
});

// ---------------- X50 (with Live Community Bets & Emerald/Gold Theme) ----------------
register('x50', (view) => {
  const SEGMENTS = [0, 1.2, 0, 1.5, 0, 2, 0, 1.2, 0, 3, 0, 1.5, 0, 2, 0, 1.2, 0, 5, 0, 10, 0, 50];
  const N = SEGMENTS.length;
  
  // Custom theme colors: 50x in Gold Gradient, 10x in Pure Gold, others in dark & light emerald greens, 0 in dark carbon
  const segColor = m => {
    if (m === 50) return 'url(#xg)';  // Gold gradient
    if (m === 10) return '#ffd700';    // Pure Gold
    if (m === 0) return '#06110a';     // Dark Emerald Carbon
    if (m === 5) return '#34d399';     // Light Bright Emerald Green
    if (m === 3) return '#10b981';     // Vivid Emerald Green
    if (m === 2) return '#059669';     // Medium Emerald Green
    if (m === 1.5) return '#047857';   // Dark Emerald Green
    return '#064e3b';                  // Deep Forest Emerald (1.2)
  };
  const R = 150, cx = 160, cy = 160;
  let rot = 0, spinning = false;

  const BOT_BETS = [
    { n: 'Vortex_CS', p: 'img/avatars/avatar_1.svg', a: 2500, m: 2, win: 5000 },
    { n: 'ShadowSniper99', p: 'img/avatars/avatar_2.svg', a: 1000, m: 3, win: 3000 },
    { n: 'NeonRider', p: 'img/avatars/avatar_4.svg', a: 500, m: 50, win: 25000 },
    { n: 'CyberGhost', p: 'img/avatars/avatar_5.svg', a: 5000, m: 1.5, win: 7500 },
    { n: 'ApexPredator', p: 'img/avatars/avatar_6.svg', a: 10000, m: 2, win: 20000 },
    { n: 'SilentReaper', p: 'img/avatars/avatar_7.svg', a: 1500, m: 5, win: 7500 },
    { n: 'FrostByte', p: 'img/avatars/avatar_11.svg', a: 3000, m: 1.2, win: 3600 },
    { n: 'NovaStrike', p: 'img/avatars/avatar_8.svg', a: 800, m: 10, win: 8000 },
  ];

  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico" style="color:#ffd700">${ART.ICONS.wheel}</span>X50 <span class="muted" style="font-size:14px">— spin up to ×50</span></div>
      <div class="timer-pill" style="border-color:rgba(255,215,0,.35);color:#ffd700">MAX JACKPOT <span class="t" style="color:#ffd700">×50 GOLD</span></div>
    </div>
    
    <div class="grid2" style="align-items:start">
      <div class="panel glow x50-stage" style="border-color:rgba(16,185,129,.25);box-shadow:0 10px 30px rgba(16,185,129,.08)">
        <div class="x50-wheel-box">
          <div class="x50-pointer" style="border-top-color:#ffd700"></div>
          <svg id="x50wheel" viewBox="0 0 320 320" style="width:100%;height:100%;transition:none">
            <defs>
              <linearGradient id="xg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fff07c"/>
                <stop offset="50%" stop-color="#ffd700"/>
                <stop offset="100%" stop-color="#f59e0b"/>
              </linearGradient>
            </defs>
            <circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="#040b06" stroke="rgba(16,185,129,.35)" stroke-width="2.5"/>
            <g id="x50segs"></g>
            <circle cx="${cx}" cy="${cy}" r="34" fill="#040c07" stroke="rgba(255,215,0,.6)" stroke-width="2.5"/>
            <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-family="Sora" font-weight="800" font-size="17" fill="#ffd700">×50</text>
          </svg>
        </div>
        <div class="x50-result" id="x50res"></div>
        <div class="row" style="flex-wrap:wrap;justify-content:center">
          <input type="number" id="xamt" value="100" min="10" style="max-width:150px" class="input">
          ${[100, 500, 1000, 5000].map(v => `<div class="amt-chip" data-x="${v}" style="padding:7px 12px">${fmt(v)}</div>`).join('')}
          <button class="btn big gold" id="xspin" style="background:linear-gradient(135deg,#ffd700,#f59e0b);color:#020503">${ART.ICONS.bolt} SPIN WHEEL</button>
        </div>
        <div class="muted" style="font-size:12px;color:rgba(16,185,129,.85)">Multiplier breakdown: <span style="color:#ffd700;font-weight:700">×50 (Gold)</span>, <span style="color:#ffd700;font-weight:700">×10 (Gold)</span>, <span style="color:#34d399">×5 (Light Emerald)</span>, <span style="color:#10b981">×3</span>, <span style="color:#059669">×2</span>, <span style="color:#047857">×1.5</span>, <span style="color:#064e3b">×1.2 (Dark Emerald)</span></div>
      </div>

      <!-- Live Community Room Bets -->
      <div class="panel" style="padding:20px">
        <div style="font-family:var(--display);font-weight:700;font-size:15px;margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span class="live-dot"></span>Live Community Bets
        </div>
        <div class="pick-list" id="x50-live-bets" style="max-height:360px">
          ${BOT_BETS.map(b => `
            <div class="item-row" style="cursor:default">
              <div class="avatar sm"><img src="${b.p}" alt=""></div>
              <div class="grow" style="min-width:0">
                <div style="font-weight:700;font-size:12.5px">${esc(b.n)}</div>
                <div class="muted" style="font-size:11px">Bet: ${fmt(b.a)} on ×${b.m}</div>
              </div>
              <div style="font-weight:800;font-size:13px;color:var(--cyan)">+${fmt(b.win)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;

  const segs = $('#x50segs');
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / N) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0), x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const mid = (a0 + a1) / 2;
    segs.insertAdjacentHTML('beforeend', `
      <path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${segColor(SEGMENTS[i])}" stroke="#04060b" stroke-width="2" opacity="${SEGMENTS[i] === 0 ? 0.55 : 1}"/>
      <text x="${(cx + R * 0.72 * Math.cos(mid)).toFixed(1)}" y="${(cy + R * 0.72 * Math.sin(mid) + 4).toFixed(1)}" text-anchor="middle" font-family="Sora" font-weight="800" font-size="13" fill="${SEGMENTS[i] === 0 ? '#4a5568' : '#fff'}" transform="rotate(${(mid * 180 / Math.PI + 90).toFixed(1)} ${(cx + R * 0.72 * Math.cos(mid)).toFixed(1)} ${(cy + R * 0.72 * Math.sin(mid)).toFixed(1)})">${SEGMENTS[i] === 0 ? '✕' : '×' + SEGMENTS[i]}</text>`);
  }
  $$('[data-x]').forEach(c => c.onclick = () => { $('#xamt').value = c.dataset.x; SND.click(); });
  const wheel = $('#x50wheel');
  const applyRot = () => wheel.style.transform = `rotate(${rot}deg)`;
  applyRot();

  // Background live bets simulation
  const betTimer = setInterval(() => {
    const list = $('#x50-live-bets');
    if (!list) return;
    const rndAv = Math.floor(Math.random() * 25) + 1;
    const gamerNames = ['ViperX', 'AeroBlast', 'TitanFall', 'EchoWolf', 'ZenithCS', 'HyperDrive', 'OmegaFox', 'Pulse_99', 'SpectreCS', 'RedlineMaster', 'MatrixPlayer', 'HavocCS', 'StrikeForce'];
    const nm = gamerNames[Math.floor(Math.random() * gamerNames.length)];
    const mults = [1.2, 1.5, 2, 3, 5, 10, 50];
    const m = mults[Math.floor(Math.random() * mults.length)];
    const a = [500, 1000, 2500, 5000, 10000][Math.floor(Math.random() * 5)];
    const win = Math.round(a * m);
    
    const row = `
      <div class="item-row" style="cursor:default;animation:mIn .3s">
        <div class="avatar sm"><img src="img/avatars/avatar_${rndAv}.svg" alt=""></div>
        <div class="grow" style="min-width:0">
          <div style="font-weight:700;font-size:12.5px">${esc(nm)}</div>
          <div class="muted" style="font-size:11px">Bet: ${fmt(a)} on ×${m}</div>
        </div>
        <div style="font-weight:800;font-size:13px;color:var(--cyan)">+${fmt(win)}</div>
      </div>`;
    list.insertAdjacentHTML('afterbegin', row);
    if (list.children.length > 8) list.lastElementChild.remove();
  }, 4200);
  onRoute(() => clearInterval(betTimer));

  $('#xspin').onclick = async () => {
    if (spinning) return;
    if (needLogin()) return;
    const amount = Math.max(10, Math.round(+$('#xamt').value || 0));
    spinning = true; $('#xspin').disabled = true; $('#x50res').textContent = '';
    let r;
    try { r = await api('/x50/spin', { method: 'POST', body: { amount } }); setBal(r.balance); }
    catch (e) { spinning = false; $('#xspin').disabled = false; return toast(e.message, 'err'); }
    const idx = SEGMENTS.findIndex(m => m === r.mult);
    const segMid = 360 - ((idx + 0.5) / N) * 360;
    const target = rot + 360 * 6 + ((segMid - (rot % 360)) + 360) % 360;
    SND.whoosh();
    wheel.style.transition = 'transform 5.2s cubic-bezier(.15,.8,.15,1)';
    rot = target; applyRot();
    let delay = 55; const tickLoop = () => { if (delay > 300) return; SND.tick(r.mult >= 10); delay *= 1.12; setTimeout(tickLoop, delay); }; tickLoop();
    setTimeout(() => {
      spinning = false; $('#xspin').disabled = false;
      const res = $('#x50res');
      if (r.mult === 50) { res.className = 'x50-result jackpot'; res.textContent = '🎉 ×50 JACKPOT 🎉'; SND.bigWin(); }
      else if (r.mult > 0) { res.className = 'x50-result'; res.style.color = segColor(r.mult); res.textContent = '×' + r.mult; SND.win(); }
      else { res.className = 'x50-result'; res.style.color = 'var(--red)'; res.textContent = '×0 — no win'; SND.lose(); }
      if (r.win > 0) toast(`You won ${fmt(r.win)} coins!`);
    }, 5300);
  };
});

// ---------------- UPGRADER (with Multipliers x1.5, x2, x3, x4, x5 & Fixed Non-Stuck Rotation) ----------------
register('upgrader', (view) => {
  let bet = 1000, targets = [], target = null, invSel = new Set(), inv = [], spinning = false;
  let filterRarity = 'all', searchQuery = '';
  let totalNeedleRot = 0; // Accumulator so needle NEVER gets stuck

  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico">${ART.ICONS.up}</span>Upgrader</div>
      <div class="timer-pill">FEE-FREE CS2 UPGRADES <span class="t">×0.92</span></div>
    </div>

    <div class="upg-stage">
      <div class="panel">
        <b>Your bet</b>
        <label class="f">COINS</label>
        <input type="number" id="uamt" value="1000" min="10" class="input">
        <div class="row" style="flex-wrap:wrap;margin:6px 0 10px">
          ${[500, 1000, 5000, 10000, 25000].map(v => `<div class="amt-chip" data-u="${v}" style="padding:6px 11px;font-size:12px">${fmt(v)}</div>`).join('')}
        </div>

        <label class="f" style="margin-top:10px">QUICK MULTIPLIER (TARGET VALUE)</label>
        <div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:12px" id="upgmults">
          ${[1.5, 2, 3, 4, 5, 10].map(m => `<button class="btn sm ghost" data-m="${m}" style="padding:5px 10px;font-size:12px;font-weight:800">×${m}</button>`).join('')}
        </div>

        <label class="f">OR PICK FROM INVENTORY (<span id="invselcount">0</span> items)</label>
        <div class="pick-list" id="uinv" style="max-height:220px"></div>
      </div>

      <div class="panel upg-gauge-wrap glow">
        <div class="upg-arrow">${ART.ICONS.up}</div>
        <svg viewBox="0 0 200 200" width="230" height="230">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#131a29" stroke-width="16"/>
          <circle id="uarc" cx="100" cy="100" r="80" fill="none" stroke="#e9bd5c" stroke-width="16" stroke-linecap="round"
            stroke-dasharray="0 502" transform="rotate(-90 100 100)" style="filter:drop-shadow(0 0 10px rgba(233,189,92,.6))"/>
          <g id="uneedle" style="transform-origin:100px 100px"><line x1="100" y1="100" x2="100" y2="28" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="100" r="7.5" fill="#e9bd5c"/></g>
        </svg>
        <div class="upg-chance" id="uchance">--%</div>
        <div class="muted" style="font-size:12px">win chance</div>
        <button class="btn big green" id="ugo" style="margin-top:16px;padding:14px 34px;font-size:15px" ${APP.user ? '' : 'disabled'}>${ART.ICONS.bolt} UPGRADE</button>
      </div>

      <div class="panel">
        <div class="row" style="justify-content:space-between;margin-bottom:6px">
          <b>Target weapon</b>
          <span class="muted" style="font-size:12px" id="targetcount">Loading…</span>
        </div>
        <input type="text" id="usearch" class="input" placeholder="🔍 Search weapon or skin…" style="padding:7px 12px;font-size:12.5px;margin-bottom:8px">
        <div class="row" style="gap:4px;flex-wrap:wrap;margin-bottom:8px" id="rarityfilters">
          <button class="btn sm ghost sel" data-rf="all" style="padding:4px 8px;font-size:11px">All</button>
          <button class="btn sm ghost" data-rf="gold" style="padding:4px 8px;font-size:11px;color:#ffd700">★ Knives</button>
          <button class="btn sm ghost" data-rf="covert" style="padding:4px 8px;font-size:11px;color:#eb4b4b">Covert</button>
          <button class="btn sm ghost" data-rf="classified" style="padding:4px 8px;font-size:11px;color:#d32ce6">Classified</button>
        </div>
        <div class="pick-list" id="utargets" style="max-height:360px"></div>
      </div>
    </div>`;

  const needle = $('#uneedle');

  async function loadTargets() {
    targets = await api('/upgrader/targets?bet=' + betValue()).catch(() => []);
    renderTargetList();
  }

  function renderTargetList() {
    const listEl = $('#utargets');
    if (!listEl) return;
    const q = searchQuery.toLowerCase().trim();
    const filtered = targets.filter(t => {
      if (filterRarity !== 'all' && t.rarity !== filterRarity) return false;
      if (q && !t.name.toLowerCase().includes(q)) return false;
      return true;
    });

    $('#targetcount').textContent = `${filtered.length} skins`;

    listEl.innerHTML = filtered.map(t => {
      const isSel = target && target.id === t.id;
      const ch = Math.min(0.8, (betValue() / t.value * 0.92));
      const chPercent = (ch * 100).toFixed(1);
      return `
      <div class="item-row rar-${t.rarity} ${isSel ? 'sel' : ''}" data-tid="${t.id}">
        ${ART.itemArt(t, 52, 32)}
        <div class="grow">
          <div class="i-name">${esc(t.name)}</div>
          <div class="muted" style="font-size:11px">${chPercent}% win chance</div>
        </div>
        <div class="i-val" style="color:${ART.RAR[t.rarity] || '#888'}">${fmt(t.value)}</div>
      </div>`;
    }).join('') || '<div class="muted" style="padding:14px">No skins match filter</div>';

    $$('#utargets .item-row').forEach(r => r.onclick = () => {
      const tid = r.dataset.tid;
      target = targets.find(x => x.id === tid) || null;
      $$('#utargets .item-row').forEach(x => x.classList.remove('sel'));
      r.classList.add('sel');
      upd();
      SND.click();
    });
  }

  async function loadInv() {
    if (!APP.user) { $('#uinv').innerHTML = '<div class="muted" style="font-size:12px">Login to use items</div>'; return; }
    inv = await api('/inventory').catch(() => []);
    $('#uinv').innerHTML = inv.slice(0, 50).map(i => `
      <div class="item-row rar-${i.rarity}" data-inv="${i.id}">
        ${ART.itemArt(i, 46, 28)}
        <div class="grow i-name" style="font-size:11.5px">${esc(i.name)}</div>
        <div class="i-val" style="font-size:12px">${fmt(i.value)}</div>
      </div>`).join('') || '<div class="muted" style="font-size:12px">Inventory empty — open some cases!</div>';

    $$('#uinv .item-row').forEach(r => r.onclick = () => {
      const id = r.dataset.inv;
      invSel.has(id) ? invSel.delete(id) : invSel.add(id);
      r.classList.toggle('sel');
      $('#invselcount').textContent = invSel.size;
      upd();
      SND.click();
    });
  }

  const betValue = () => invSel.size ? [...invSel].reduce((s, id) => s + (inv.find(i => i.id === id) || { value: 0 }).value, 0) : bet;

  function upd() {
    const curBet = betValue();
    const ch = target ? Math.min(0.8, curBet / target.value * 0.92) : 0;
    $('#uchance').textContent = target ? (ch * 100).toFixed(1) + '%' : '--%';
    $('#uarc').setAttribute('stroke-dasharray', `${(ch * 502).toFixed(1)} 502`);
    $('#ugo').disabled = !target || spinning || ch <= 0.0001;
  }

  $('#uamt').oninput = () => {
    bet = Math.max(10, Math.round(+$('#uamt').value || 10));
    invSel.clear();
    $('#invselcount').textContent = 0;
    $$('#uinv .item-row').forEach(r => r.classList.remove('sel'));
    upd();
    renderTargetList();
  };

  $$('[data-u]').forEach(c => c.onclick = () => {
    $('#uamt').value = c.dataset.u;
    $('#uamt').oninput();
    SND.click();
  });

  // Quick Multiplier handler
  $$('#upgmults button').forEach(btn => btn.onclick = () => {
    const m = +btn.dataset.m;
    SND.click();
    if (!targets.length) return;

    if (target) {
      // Adjust bet to hit multiplier
      const neededBet = Math.max(10, Math.round(target.value / m));
      $('#uamt').value = neededBet;
      bet = neededBet;
      invSel.clear();
      $('#invselcount').textContent = 0;
      upd();
      renderTargetList();
      toast(`Bet adjusted to ${fmt(neededBet)} for ×${m} multiplier!`);
    } else {
      // Find closest skin matching bet * m
      const targetVal = betValue() * m;
      let closest = targets[0], minDiff = Infinity;
      targets.forEach(t => {
        const diff = Math.abs(t.value - targetVal);
        if (diff < minDiff) { minDiff = diff; closest = t; }
      });
      target = closest;
      upd();
      renderTargetList();
      const el = $(`[data-tid="${closest.id}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      toast(`Selected ${closest.name} for ×${m} upgrade!`);
    }
  });

  $('#usearch').oninput = e => {
    searchQuery = e.target.value;
    renderTargetList();
  };

  $$('#rarityfilters button').forEach(btn => btn.onclick = () => {
    filterRarity = btn.dataset.rf;
    $$('#rarityfilters button').forEach(x => x.classList.remove('sel'));
    btn.classList.add('sel');
    renderTargetList();
    SND.click();
  });

  $('#ugo').onclick = async () => {
    if (spinning || !target) return;
    if (needLogin()) return;
    spinning = true;
    $('#ugo').disabled = true;
    let r;
    try {
      r = await api('/upgrader/upgrade', { method: 'POST', body: { amount: invSel.size ? 0 : betValue(), itemIds: invSel.size ? [...invSel] : [], targetId: target.id } });
      setBal(r.balance);
    } catch (e) {
      spinning = false; upd(); return toast(e.message, 'err');
    }

    const ch = r.chance;
    const finalAngle = r.win ? Math.random() * ch * 360 : ch * 360 + Math.random() * (1 - ch) * 360;

    // ACCUMULATING ROTATION: guarantees 6 full brand-new 360 spins on every single roll!
    totalNeedleRot += 360 * 6 + ((finalAngle - (totalNeedleRot % 360) + 360) % 360);
    needle.style.transition = 'transform 5.5s cubic-bezier(.10, .82, .15, 1)';
    needle.style.transform = `rotate(${totalNeedleRot}deg)`;
    
    let delay = 50;
    const tl = () => { if (delay > 300) return; SND.tick(false); delay *= 1.11; setTimeout(tl, delay); };
    tl();

    setTimeout(() => {
      spinning = false;
      r.win ? SND.bigWin() : SND.lose();
      
      modal(`<button class="close-x" onclick="closeModal()">✕</button>
        <div class="center win-modal-body">
          <div class="win-modal-header" style="color:${r.win ? 'var(--green)' : 'var(--red)'}">${r.win ? '🎉 UPGRADE SUCCESS!' : '💀 UPGRADE FAILED'}</div>
          <div class="win-modal-card-wrap">
            <div class="win-card rar-${r.target.rarity}">
              ${ART.itemArt(r.target, 140, 85)}
              <div class="win-card-rarity">${(r.target.rarity || 'CS2').toUpperCase()}</div>
            </div>
          </div>
          <h2 class="win-modal-title" style="color:${r.win ? 'var(--green)' : 'var(--red)'}">${esc(r.target.name)}</h2>
          <div class="win-modal-val">Chance: <b class="gold">${(r.chance * 100).toFixed(1)}%</b> · Value: <b class="gold">${fmt(r.target.value)}</b> coins</div>
          <div class="row center" style="margin-top:16px"><button class="btn green big" onclick="closeModal()">Continue</button></div>
        </div>`);

      invSel.clear();
      $('#invselcount').textContent = 0;
      loadInv();
      upd();
    }, 5700);
  };

  loadTargets();
  loadInv();
});
