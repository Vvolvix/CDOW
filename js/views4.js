// CDOW views — Royal Battle jackpot & RUSHMID crash. MADE BY VOLVIX.

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

// ---------------- RUSHMID (Crash) ----------------
register('rushmid', (view) => {
  let st = null, points = [], raf = null, busted = false;
  const GROWTH = 0.22; // matches server
  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico">${ART.ICONS.rocket}</span>RUSHMID</div>
      <div class="timer-pill" id="rutimer"><span class="t">--</span></div>
    </div>
    <div class="rush-history" id="ruhist"></div>
    <div class="rush-stage">
      <div class="rush-canvas-wrap">
        <canvas id="rucanvas" style="width:100%;height:100%"></canvas>
        <div class="rush-mult" id="rumult">1.00×</div>
      </div>
      <div class="panel" style="margin-top:14px">
        <div class="row" style="flex-wrap:wrap">
          <input type="number" id="ruamt" value="100" min="10" style="max-width:140px" class="input" placeholder="Bet">
          <input type="number" id="ruauto" min="0" step="0.1" style="max-width:140px" class="input" placeholder="Auto cashout ×">
          ${[100, 500, 1000, 5000].map(v => `<div class="amt-chip" data-ru="${v}" style="padding:7px 12px">${fmt(v)}</div>`).join('')}
          <div class="grow"></div>
          <button class="btn big" id="rubet">PLACE BET</button>
          <button class="btn gold big hidden" id="rucash">CASH OUT <span id="rucashval"></span></button>
        </div>
      </div>
    </div>
    <div class="sec-title">Round bets</div>
    <div class="panel"><div class="bets-list" id="rubets"></div></div>`;
  $$('[data-ru]').forEach(c => c.onclick = () => { $('#ruamt').value = c.dataset.ru; SND.click(); });

  const cv = $('#rucanvas'), ctx2 = cv.getContext('2d');
  function sizeCanvas() { cv.width = cv.clientWidth * devicePixelRatio; cv.height = cv.clientHeight * devicePixelRatio; }
  sizeCanvas(); window.addEventListener('resize', sizeCanvas); onRoute(() => window.removeEventListener('resize', sizeCanvas));

  function draw(now) {
    const W = cv.width, H = cv.height, dpr = devicePixelRatio;
    ctx2.clearRect(0, 0, W, H);
    // grid
    ctx2.strokeStyle = 'rgba(255,255,255,.04)'; ctx2.lineWidth = 1;
    for (let i = 1; i < 6; i++) { ctx2.beginPath(); ctx2.moveTo(0, H * i / 6); ctx2.lineTo(W, H * i / 6); ctx2.stroke(); }
    const mult = curMult();
    const maxM = Math.max(2, mult * 1.15);
    const T = 14000;
    const n = points.length;
    if (n > 1) {
      const grad = ctx2.createLinearGradient(0, 0, 0, H);
      const col = busted ? '255,70,85' : '233,189,92';
      grad.addColorStop(0, `rgba(${col},.28)`); grad.addColorStop(1, `rgba(${col},0)`);
      ctx2.beginPath();
      points.forEach((p, i) => {
        const x = (p.t / T) * W, y = H - (Math.min(p.m, maxM) / maxM) * (H * 0.86) - H * 0.06;
        i === 0 ? ctx2.moveTo(x, y) : ctx2.lineTo(x, y);
      });
      ctx2.strokeStyle = busted ? '#ff4655' : '#e9bd5c'; ctx2.lineWidth = 3 * dpr;
      ctx2.shadowColor = busted ? '#ff4655' : '#e9bd5c'; ctx2.shadowBlur = 14;
      ctx2.stroke();
      ctx2.shadowBlur = 0;
      const lx = (points[n - 1].t / T) * W, ly = H - (Math.min(points[n - 1].m, maxM) / maxM) * (H * 0.86) - H * 0.06;
      ctx2.lineTo(lx, H); ctx2.lineTo(0, H); ctx2.closePath();
      ctx2.fillStyle = grad; ctx2.fill();
    }
  }
  function curMult() {
    if (!st) return 1;
    if (st.phase === 'run') return Math.exp(GROWTH * (Date.now() - st.startedAt) / 1000);
    return st.phase === 'bust' || st.phase === 'bet' ? (st.mult || 1) : 1;
  }
  function loop() {
    if (st && st.phase === 'run') {
      const m = curMult();
      points.push({ t: Date.now() - st.startedAt, m });
      $('#rumult').textContent = m.toFixed(2) + '×';
      const myBet = st.bets.find(b => APP.user && b.u === APP.user.id);
      if (myBet && !myBet.c) $('#rucashval').textContent = '(+' + fmt(myBet.a * m) + ')';
    }
    draw();
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop); onRoute(() => cancelAnimationFrame(raf));

  function render() {
    if (!st) return;
    $('#ruhist').innerHTML = (st.history || []).slice().reverse().map(hh =>
      `<div class="rh-pill ${hh.m >= 10 ? 'hi' : hh.m >= 2 ? 'mid' : 'lo'}">${hh.m.toFixed(2)}×</div>`).join('');
    $('#rubets').innerHTML = st.bets.map(b => `
      <div class="bet-row"><div class="avatar sm">${esc(b.n.slice(0, 2).toUpperCase())}</div>
        <span class="grow">${esc(b.n)}</span><b class="num">${fmt(b.a)}</b>
        ${b.c ? `<span class="side-tag st-win">×${b.at.toFixed(2)}</span>` : st.phase === 'bust' ? '<span class="side-tag st-lose">LOST</span>' : '<span class="side-tag" style="background:rgba(233,189,92,.12);color:var(--cyan)">IN</span>'}
      </div>`).join('') || '<div class="muted">No bets yet this round</div>';
    const betting = st.phase === 'bet';
    $('#rubet').classList.toggle('hidden', !betting);
    $('#ruamt').disabled = !betting; $('#ruauto').disabled = !betting;
    const myBet = st.bets.find(b => APP.user && b.u === APP.user.id);
    $('#rucash').classList.toggle('hidden', !(st.phase === 'run' && myBet && !myBet.c));
    const left = Math.max(0, Math.ceil((st.endsAt - Date.now()) / 1000));
    $('#rutimer').innerHTML = betting ? `⏳ Betting closes in <span class="t">${left}s</span>` : st.phase === 'run' ? '🚀 RISING' : '💥 CRASHED';
    if (st.phase === 'bet') { points = []; busted = false; $('#rumult').textContent = '1.00×'; $('#rumult').classList.remove('crashed'); }
  }
  $('#rubet').onclick = async () => {
    if (needLogin()) return;
    try {
      const amount = Math.max(10, Math.round(+$('#ruamt').value || 0));
      const auto = Math.round((+$('#ruauto').value || 0) * 100) / 100;
      await api('/rush/bet', { method: 'POST', body: { amount, auto } });
      toast('Bet placed — get ready to rush! 🚀'); SND.coin();
    } catch (e) { toast(e.message, 'err'); }
  };
  $('#rucash').onclick = async () => {
    try {
      const r = await api('/rush/cashout', { method: 'POST' });
      setBal(r.balance);
      toast(`Cashed out ×${r.mult.toFixed(2)} — won ${fmt(r.win)} coins!`); SND.cash();
    } catch (e) { toast(e.message, 'err'); }
  };
  (async () => { st = await api('/rush/state'); render(); })();
  const h = s => {
    st = s;
    if (st.phase !== 'run') { st.startedAt = st.startedAt || 0; }
    render();
  };
  APP.socket.on('rush', h); onRoute(() => APP.socket.off('rush', h));
  APP.socket.on('rush:bust', ({ crashAt }) => {
    busted = true; SND.bust();
    const m = $('#rumult');
    m.textContent = crashAt.toFixed(2) + '×';
    m.classList.add('crashed');
    if (st) st.mult = crashAt;
  });
  onRoute(() => APP.socket.off('rush:bust'));
  const t = setInterval(render, 900); onRoute(() => clearInterval(t));
});
