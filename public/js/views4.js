// CDOW views — Royal Battle jackpot & CS2 Crash Rocket. MADE BY VOLVIX.

// ---------------- ROYAL BATTLE ----------------
register('royal', (view) => {
  let st = null;
  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico">${ART.ICONS.crown}</span>Royal Battle</div>
      <div class="timer-pill" id="rtimer"><span class="t">--</span></div>
    </div>
    <div class="grid2">
      <div class="panel glow royal-pot">
        <div class="muted" style="letter-spacing:2px;font-size:11px;font-weight:700">CURRENT ROYAL POT</div>
        <div class="pot-val num" id="rpot">0</div>
        <div class="muted" id="rplayers" style="margin-bottom:16px">0 players</div>
        <div class="row" style="justify-content:center;flex-wrap:wrap">
          <input type="number" id="ramt" value="500" min="10" style="max-width:150px" class="input">
          ${[100, 500, 2500, 10000].map(v => `<div class="amt-chip" data-r="${v}" style="padding:7px 12px">${fmt(v)}</div>`).join('')}
          <button class="btn gold big" id="rjoin">${ART.ICONS.crown} ENTER</button>
        </div>
        <div class="muted" style="font-size:11.5px;margin-top:12px">Winner takes 95% of the pot · chance = your share of the pot</div>
      </div>
      <div class="panel">
        <b>Contributors</b>
        <div class="royal-players" id="rlist" style="margin-top:12px"></div>
      </div>
    </div>
    <div class="sec-title">Past royals</div>
    <div id="rhist" class="row" style="flex-wrap:wrap;gap:8px"></div>`;
  $$('[data-r]').forEach(c => c.onclick = () => { $('#ramt').value = c.dataset.r; SND.click(); });
  $('#rjoin').onclick = async () => {
    if (needLogin()) return;
    try {
      const amount = Math.max(10, Math.round(+$('#ramt').value || 0));
      const r = await api('/royal/join', { method: 'POST', body: { amount } });
      setBal(r.balance);
      toast('You entered the Royal! Good luck 👑'); SND.coin();
    } catch (e) { toast(e.message, 'err'); }
  };
  function render() {
    if (!st) return;
    $('#rpot').textContent = fmt(st.pot);
    $('#rplayers').textContent = st.players.length + ' players';
    $('#rlist').innerHTML = st.players.map(p => `
      <div class="bet-row">
        <div class="avatar sm">${p.p ? `<img src="${esc(p.p)}">` : esc(p.n.slice(0, 2).toUpperCase())}</div>
        <div class="grow"><b>${esc(p.n)}</b><div class="royal-bar"><div style="width:${p.chance}%"></div></div></div>
        <div style="text-align:right"><b class="num">${fmt(p.a)}</b><div class="muted" style="font-size:11px">${p.chance}%</div></div>
      </div>`).join('') || '<div class="muted">Nobody entered yet — be the first!</div>';
    $('#rhist').innerHTML = (st.history || []).slice().reverse().map(h =>
      `<div class="bet-row" style="padding:7px 12px">👑 <b>${esc(h.n)}</b> won <b class="gold num">${fmt(h.prize)}</b></div>`).join('') || '<div class="muted">No rounds finished yet</div>';
    const left = Math.max(0, Math.ceil((st.endsAt - Date.now()) / 1000));
    $('#rtimer').innerHTML = st.phase === 'bet' ? `⏳ <span class="t">${left}s</span> until draw` : '👑 Winner picked!';
  }
  (async () => { st = await api('/royal/state'); render(); })();
  const h = s => { st = s; render(); };
  APP.socket.on('royal', h); onRoute(() => APP.socket.off('royal', h));
  const t = setInterval(render, 1000); onRoute(() => clearInterval(t));
});

// ---------------- CS2 CRASH ROCKET ----------------
register('crash', (view) => {
  let st = null, points = [], raf = null, busted = false;
  const GROWTH = 0.22;
  
  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico" style="color:var(--green)">${ART.ICONS.rocket}</span>Crash Rocket <span class="muted" style="font-size:14px">— cash out before the rocket crashes</span></div>
      <div class="timer-pill" id="rutimer"><span class="t">--</span></div>
    </div>
    
    <!-- Past Multipliers History Strip -->
    <div class="rush-history" id="ruhist"></div>
    
    <div class="rush-stage">
      <div class="rush-canvas-wrap" style="position:relative;border:1px solid rgba(16,185,129,.2);border-radius:12px;overflow:hidden;background:#030805">
        <canvas id="rucanvas" style="width:100%;height:320px;display:block"></canvas>
        <div class="rush-mult" id="rumult" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--display);font-size:54px;font-weight:900;text-shadow:0 0 30px rgba(16,185,129,.4);pointer-events:none">1.00×</div>
      </div>
      
      <div class="panel" style="margin-top:14px">
        <div class="row" style="flex-wrap:wrap;gap:10px;align-items:center">
          <div style="display:flex;flex-direction:column;gap:4px">
            <span class="muted" style="font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Bet Coins</span>
            <input type="number" id="ruamt" value="100" min="10" style="max-width:140px" class="input" placeholder="Bet">
          </div>
          <div style="display:flex;flex-direction:column;gap:4px">
            <span class="muted" style="font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Auto Cashout</span>
            <input type="number" id="ruauto" min="0" step="0.1" style="max-width:140px" class="input" placeholder="e.g. 2.00×">
          </div>
          <div class="row" style="gap:6px;margin-top:18px">
            ${[100, 500, 1000, 5000].map(v => `<div class="amt-chip" data-ru="${v}" style="padding:7px 12px">${fmt(v)}</div>`).join('')}
          </div>
          <div class="grow"></div>
          <div style="margin-top:18px">
            <button class="btn green big" id="rubet" style="min-width:160px">${ART.ICONS.rocket} PLACE BET</button>
            <button class="btn gold big hidden" id="rucash" style="min-width:180px;background:linear-gradient(135deg,#ffd700,#f59e0b);color:#020503;font-weight:800;animation:glowPulse 1s infinite">CASH OUT <span id="rucashval"></span></button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="sec-title" style="margin-top:24px">Live Round Bets</div>
    <div class="panel"><div class="bets-list" id="rubets" style="max-height:280px;overflow-y:auto"></div></div>`;

  $$('[data-ru]').forEach(c => c.onclick = () => { $('#ruamt').value = c.dataset.ru; SND.click(); });

  const cv = $('#rucanvas');
  const ctx2 = cv.getContext('2d');
  function sizeCanvas() {
    if (!cv) return;
    cv.width = cv.clientWidth * (window.devicePixelRatio || 1);
    cv.height = cv.clientHeight * (window.devicePixelRatio || 1);
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  onRoute(() => window.removeEventListener('resize', sizeCanvas));

  function draw() {
    if (!cv || !ctx2) return;
    const W = cv.width, H = cv.height, dpr = window.devicePixelRatio || 1;
    ctx2.clearRect(0, 0, W, H);
    
    // Grid Lines
    ctx2.strokeStyle = 'rgba(16,185,129,0.06)';
    ctx2.lineWidth = 1 * dpr;
    for (let i = 1; i < 6; i++) {
      ctx2.beginPath();
      ctx2.moveTo(0, H * i / 6);
      ctx2.lineTo(W, H * i / 6);
      ctx2.stroke();
    }
    for (let j = 1; j < 8; j++) {
      ctx2.beginPath();
      ctx2.moveTo(W * j / 8, 0);
      ctx2.lineTo(W * j / 8, H);
      ctx2.stroke();
    }

    const mult = curMult();
    const maxM = Math.max(2.2, mult * 1.15);
    const T = Math.max(8000, points.length ? points[points.length - 1].t * 1.25 : 8000);
    const n = points.length;

    if (n > 1) {
      const grad = ctx2.createLinearGradient(0, 0, 0, H);
      const isRed = busted;
      const col = isRed ? '239,68,68' : '16,185,129';
      grad.addColorStop(0, `rgba(${col}, 0.28)`);
      grad.addColorStop(1, `rgba(${col}, 0)`);

      ctx2.beginPath();
      points.forEach((p, i) => {
        const x = (p.t / T) * (W * 0.88) + W * 0.04;
        const y = H - (Math.min(p.m, maxM) / maxM) * (H * 0.78) - H * 0.08;
        if (i === 0) ctx2.moveTo(x, y);
        else ctx2.lineTo(x, y);
      });

      ctx2.strokeStyle = isRed ? '#ef4444' : '#10b981';
      ctx2.lineWidth = 3.5 * dpr;
      ctx2.shadowColor = isRed ? '#ef4444' : '#10b981';
      ctx2.shadowBlur = 18 * dpr;
      ctx2.stroke();
      ctx2.shadowBlur = 0;

      // Close polygon for glowing gradient fill underneath
      const last = points[n - 1];
      const lx = (last.t / T) * (W * 0.88) + W * 0.04;
      const ly = H - (Math.min(last.m, maxM) / maxM) * (H * 0.78) - H * 0.08;
      ctx2.lineTo(lx, H);
      ctx2.lineTo(points[0].t / T * (W * 0.88) + W * 0.04, H);
      ctx2.closePath();
      ctx2.fillStyle = grad;
      ctx2.fill();

      // Draw Rocket Comet Head
      ctx2.save();
      ctx2.fillStyle = isRed ? '#ef4444' : '#ffd700';
      ctx2.shadowColor = isRed ? '#ef4444' : '#ffd700';
      ctx2.shadowBlur = 20 * dpr;
      ctx2.beginPath();
      ctx2.arc(lx, ly, 6 * dpr, 0, Math.PI * 2);
      ctx2.fill();
      ctx2.restore();
    }
  }

  function curMult() {
    if (!st) return 1;
    if (st.phase === 'run') {
      const elapsed = (Date.now() - (st.startedAt || Date.now())) / 1000;
      return Math.min(st.crashAt || 999, Math.exp(GROWTH * elapsed));
    }
    return (st.phase === 'bust' || st.phase === 'bet') ? (st.mult || 1) : 1;
  }

  function loop() {
    if (st && st.phase === 'run') {
      const m = curMult();
      points.push({ t: Date.now() - st.startedAt, m });
      const multEl = $('#rumult');
      if (multEl) {
        multEl.textContent = m.toFixed(2) + '×';
        multEl.style.color = m >= 10 ? '#ffd700' : m >= 2 ? '#34d399' : '#fff';
      }
      const myBet = st.bets.find(b => APP.user && b.u === APP.user.id);
      if (myBet && !myBet.c) {
        const cashVal = $('#rucashval');
        if (cashVal) cashVal.textContent = `(+${fmt(myBet.a * m)} coins)`;
      }
    }
    draw();
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  onRoute(() => cancelAnimationFrame(raf));

  function render() {
    if (!st) return;
    
    // History strip
    const histEl = $('#ruhist');
    if (histEl) {
      histEl.innerHTML = (st.history || []).slice().reverse().map(hh => {
        const val = typeof hh === 'number' ? hh : (hh.m || 1);
        const cls = val >= 10 ? 'hi' : val >= 2 ? 'mid' : 'lo';
        return `<div class="rh-pill ${cls}" style="font-weight:800;font-size:12.5px;padding:4px 10px;border-radius:6px;background:${val>=10?'rgba(255,215,0,.15)':val>=2?'rgba(16,185,129,.15)':'rgba(148,163,184,.15)'};color:${val>=10?'#ffd700':val>=2?'#10b981':'#94a3b8'}">${val.toFixed(2)}×</div>`;
      }).join('');
    }

    // Bets List
    const betsEl = $('#rubets');
    if (betsEl) {
      betsEl.innerHTML = st.bets.map(b => `
        <div class="bet-row" style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.03)">
          <div class="avatar sm"><img src="${b.p || 'img/avatars/avatar_1.svg'}" alt="" style="width:28px;height:28px;border-radius:50%"></div>
          <span class="grow" style="font-weight:700;font-size:13px">${esc(b.n)}</span>
          <b class="num" style="font-size:13px">${fmt(b.a)} coins</b>
          ${b.c ? `<span class="side-tag st-win" style="background:rgba(16,185,129,.2);color:#10b981;padding:3px 8px;border-radius:4px;font-weight:800;font-size:11.5px">×${b.at.toFixed(2)} (+${fmt(b.a * b.at)})</span>` : (st.phase === 'bust' ? '<span class="side-tag st-lose" style="background:rgba(239,68,68,.2);color:#ef4444;padding:3px 8px;border-radius:4px;font-weight:800;font-size:11.5px">CRASHED</span>' : '<span class="side-tag" style="background:rgba(16,185,129,.12);color:var(--green);padding:3px 8px;border-radius:4px;font-weight:800;font-size:11.5px">FLYING 🚀</span>')}
        </div>`).join('') || '<div class="muted" style="padding:14px;text-align:center">No bets placed yet this round</div>';
    }

    const betting = st.phase === 'bet';
    const betBtn = $('#rubet');
    const cashBtn = $('#rucash');
    const amtInput = $('#ruamt');
    const autoInput = $('#ruauto');
    
    if (betBtn) betBtn.classList.toggle('hidden', !betting);
    if (amtInput) amtInput.disabled = !betting;
    if (autoInput) autoInput.disabled = !betting;

    const myBet = st.bets.find(b => APP.user && b.u === APP.user.id);
    if (cashBtn) cashBtn.classList.toggle('hidden', !(st.phase === 'run' && myBet && !myBet.c));

    const timerEl = $('#rutimer');
    if (timerEl) {
      const left = Math.max(0, Math.ceil(((st.endsAt || Date.now()) - Date.now()) / 1000));
      timerEl.innerHTML = betting
        ? `⏳ Next round in <span class="t" style="color:var(--green);font-weight:800">${left}s</span>`
        : st.phase === 'run' ? '🚀 <span style="color:#ffd700;font-weight:800">FLYING...</span>' : '💥 <span style="color:#ef4444;font-weight:800">CRASHED</span>';
    }

    if (st.phase === 'bet') {
      points = [];
      busted = false;
      const multEl = $('#rumult');
      if (multEl) {
        multEl.textContent = '1.00×';
        multEl.style.color = '#fff';
      }
    }
  }

  $('#rubet').onclick = async () => {
    if (needLogin()) return;
    try {
      const amount = Math.max(10, Math.round(+$('#ruamt').value || 0));
      const auto = Math.round((+$('#ruauto').value || 0) * 100) / 100;
      const r = await api('/crash/bet', { method: 'POST', body: { amount, auto } });
      setBal(r.balance);
      toast('Bet placed — get ready for takeoff! 🚀');
      SND.coin();
    } catch (e) {
      toast(e.message, 'err');
    }
  };

  $('#rucash').onclick = async () => {
    try {
      const r = await api('/crash/cashout', { method: 'POST' });
      setBal(r.balance);
      toast(`Cashed out at ×${r.mult.toFixed(2)} — won +${fmt(r.win)} coins! 🎉`);
      SND.cash();
    } catch (e) {
      toast(e.message, 'err');
    }
  };

  (async () => {
    st = await api('/crash/state');
    render();
  })();

  const h = s => {
    st = s;
    render();
  };

  APP.socket.on('crash', h);
  APP.socket.on('rush', h);
  onRoute(() => {
    APP.socket.off('crash', h);
    APP.socket.off('rush', h);
  });

  APP.socket.on('rush:bust', ({ crashAt }) => {
    busted = true;
    SND.bust();
    const m = $('#rumult');
    if (m) {
      m.textContent = (crashAt || 1).toFixed(2) + '×';
      m.style.color = '#ef4444';
    }
    if (st) st.mult = crashAt;
  });
  onRoute(() => APP.socket.off('rush:bust'));

  const t = setInterval(render, 500);
  onRoute(() => clearInterval(t));
});

register('rushmid', (view) => APP.routes.crash(view));
