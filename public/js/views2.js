// CDOW views — Case Battles: lobby, create, arena with synced mini-reels. MADE BY VOLVIX.

register('battles', (view) => {
  let battles = [];
  async function refresh() {
    battles = await api('/battles').catch(() => []);
    const open = battles.filter(b => b.state === 'lobby');
    const live = battles.filter(b => b.state === 'live');
    const done = battles.filter(b => b.state === 'done').slice(0, 6);
    view.innerHTML = `
      <div class="page-head">
        <div class="page-title"><span class="pico">${ART.ICONS.swords}</span>Case Battles</div>
        <button class="btn big" id="createbtn">${ART.ICONS.plus} Create Battle</button>
      </div>
      ${live.length ? `<div class="sec-title">Live now</div><div class="grid2">${live.map(battleCard).join('')}</div>` : ''}
      <div class="sec-title">Open battles (${open.length})</div>
      ${open.length ? `<div class="grid2">${open.map(battleCard).join('')}</div>` : `<div class="panel muted center" style="padding:34px">No open battles — create one and invite players, or fill with bots for instant action!</div>`}
      ${done.length ? `<div class="sec-title">Recent battles</div><div class="grid2">${done.map(battleCard).join('')}</div>` : ''}
    `;
    $('#createbtn').onclick = createModal;
  }
  refresh();
  const t = setInterval(refresh, 4000); onRoute(() => clearInterval(t));
  const so = APP.socket.on('battles:update', refresh); onRoute(() => APP.socket.off('battles:update', refresh));
});

function battleCard(b) {
  const slots = { '1v1': 2, '1v1v1': 3, '1v1v1v1': 4, '2v2': 4 }[b.mode] || 2;
  return `<div class="battle-card" onclick="location.hash='#/battle/${b.id}'">
    ${ART.caseSVG(APP.cases.find(c => c.id === b.caseId)?.tier || 'starter', 64, 54)}
    <div class="grow">
      <div style="font-weight:800;font-size:14.5px">${esc(b.caseName)}</div>
      <div class="muted" style="font-size:12px">${b.mode} · ${b.rounds} round${b.rounds > 1 ? 's' : ''} · ${fmt(b.price * b.rounds)} coins</div>
    </div>
    <div class="battle-slots">${Array.from({ length: slots }, (_, i) =>
      `<div class="bslot ${b.players[i] ? 'filled' : ''}" ${b.players[i] ? `title="${esc(b.players[i].name)}"` : ''}>${b.players[i] ? `<div class="avatar sm">${b.players[i].photo ? `<img src="${esc(b.players[i].photo)}">` : esc(b.players[i].name.slice(0, 2).toUpperCase())}</div>` : '+'}</div>`).join('')}
    </div>
    <span class="badge ${b.state === 'lobby' ? 'pend' : b.state === 'live' ? 'ok' : 'no'}">${b.state.toUpperCase()}</span>
  </div>`;
}

function createModal() {
  if (needLogin()) return;
  let caseId = APP.cases[0].id, rounds = 3, mode = '1v1';
  const ov = modal(`<button class="close-x" onclick="closeModal()">✕</button>
    <h2>⚔️ Create Battle</h2>
    <label class="f">CASE</label>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-height:200px;overflow-y:auto;padding:4px" id="csgrid"></div>
    <label class="f">MODE</label>
    <div class="amt-grid" id="modegrid" style="grid-template-columns:repeat(4,1fr)"></div>
    <label class="f">ROUNDS</label>
    <div class="amt-grid" id="roundgrid" style="grid-template-columns:repeat(4,1fr)"></div>
    <div class="row" style="margin-top:18px;justify-content:space-between">
      <div class="muted">Total cost: <b class="cyan" id="costprev"></b></div>
      <button class="btn" id="gob">Create</button>
    </div>`);
  const cs = $('#csgrid');
  APP.cases.forEach(c => {
    const d = document.createElement('div');
    d.className = 'case-card'; d.style.padding = '8px 4px';
    d.innerHTML = `${ART.caseSVG(c.tier, 64, 54)}<div style="font-size:10.5px;font-weight:700">${esc(c.name)}</div>`;
    d.onclick = () => { caseId = c.id; [...cs.children].forEach(x => x.style.borderColor = ''); d.style.borderColor = 'var(--cyan)'; upd(); SND.click(); };
    cs.appendChild(d);
  });
  cs.children[0].style.borderColor = 'var(--cyan)';
  const drawChips = (el, items, val, cb) => {
    el.innerHTML = '';
    items.forEach(([label, v]) => {
      const d = document.createElement('div');
      d.className = 'amt-chip' + (v === val ? ' sel' : ''); d.textContent = label;
      d.onclick = () => { cb(v); drawChips(el, items, v, cb); SND.click(); };
      el.appendChild(d);
    });
  };
  const modes = [['1v1', '1v1'], ['1v1v1', '3P'], ['FFA', '1v1v1v1'], ['2v2', '2v2']];
  drawChips($('#modegrid'), modes, mode, v => { mode = v; upd(); });
  drawChips($('#roundgrid'), [[1, 1], [2, 2], [3, 3], [5, 5]], rounds, v => { rounds = v; upd(); });
  const upd = () => $('#costprev').textContent = fmt((APP.cases.find(c => c.id === caseId) || { price: 100 }).price * rounds) + ' coins';
  upd();
  $('#gob').onclick = async () => {
    try {
      const b = await api('/battles/create', { method: 'POST', body: { caseId, rounds, mode } });
      closeModal(); location.hash = '#/battle/' + b.id;
    } catch (e) { toast(e.message, 'err'); }
  };
}

register('battle', async (view, id) => {
  let b = await api('/battles/' + id).catch(() => null);
  if (!b) { view.innerHTML = '<div class="panel">Battle not found.</div>'; return; }
  let lastRound = 0;
  const meIn = () => b.players.some(p => !p.bot && p.id === APP.user?.id);
  const isCreator = () => b.players[0] && !b.players[0].bot && b.players[0].id === APP.user?.id;
  const slots = { '1v1': 2, '1v1v1': 3, '1v1v1v1': 4, '2v2': 4 }[b.mode] || 2;

  function render() {
    const c = APP.cases.find(x => x.id === b.caseId);
    view.innerHTML = `
      <div class="page-head">
        <div class="page-title"><span class="pico">${ART.ICONS.swords}</span>${esc(b.caseName)} <span class="muted" style="font-size:15px">· ${b.mode} · ${b.rounds} rounds</span></div>
        <button class="btn ghost" onclick="location.hash='#/battles'">← All battles</button>
      </div>
      ${b.state === 'lobby' ? `
        <div class="panel glow center" style="padding:30px">
          <div class="battle-slots" style="justify-content:center">${Array.from({ length: slots }, (_, i) =>
            `<div class="bslot" style="width:64px;height:64px;font-size:26px" ${b.players[i] ? `title="${esc(b.players[i].name)}"` : ''}>${b.players[i] ? `<div class="avatar">${b.players[i].photo ? `<img src="${esc(b.players[i].photo)}">` : esc(b.players[i].name.slice(0, 2).toUpperCase())}</div>` : '+'}</div>`).join('')}</div>
          <div class="muted" style="margin:14px 0 18px">${b.players.length}/${slots} players joined · ${fmt(b.price * b.rounds)} coins each</div>
          <div class="row" style="justify-content:center">
            ${!meIn() ? `<button class="btn big" id="joinb">JOIN — ${fmt(b.price * b.rounds)}</button>` : ''}
            ${isCreator() ? `<button class="btn gold big" id="botb">🤖 FILL WITH BOTS &amp; START</button>` : ''}
            ${meIn() && !isCreator() ? '<span class="muted">Waiting for host to start…</span>' : ''}
          </div>
        </div>` : ''}
      <div class="battle-arena" style="grid-template-columns:repeat(${Math.min(slots, 2)},1fr)">
        ${b.players.map((p, i) => `
          <div class="arena-player ${b.state === 'done' ? (b.winners && b.winners.includes(i) ? 'winner' : 'loser') : ''}" data-pi="${i}">
            <div class="row">
              <div class="avatar">${p.photo ? `<img src="${esc(p.photo)}">` : esc(p.name.slice(0, 2).toUpperCase())}</div>
              <div class="grow"><b>${esc(p.name)}</b> ${p.bot ? '<span class="badge pend">BOT</span>' : ''}<div class="muted" style="font-size:11.5px">${b.mode === '2v2' ? 'Team ' + (i % 2 + 1) + ' · ' : ''}Total: <span class="num" id="tot-${i}">${fmt(p.total)}</span></div></div>
              ${b.state === 'done' && b.winners && b.winners.includes(i) ? '<span style="font-size:22px">👑</span>' : ''}
            </div>
            ${b.state !== 'lobby' ? `<div class="mini-reel-wrap"><div class="reel-marker"></div><div class="mini-reel" id="mr-${i}"></div></div>
            <div class="row" style="gap:6px;flex-wrap:wrap" id="items-${i}">${p.items.map(it => it ? `<span class="badge" style="border:1px solid ${ART.RAR[it.rarity] || '#888'};color:${ART.RAR[it.rarity] || '#888'}">${esc((it.name || '').split('|')[1] || it.name)}</span>` : '').join('')}</div>` : ''}
          </div>`).join('')}
      </div>`;
    if (b.state === 'lobby') {
      const jb = $('#joinb'); jb && (jb.onclick = async () => {
        try { b = await api(`/battles/${id}/join`, { method: 'POST' }); render(); }
        catch (e) { toast(e.message, 'err'); }
      });
      const bb = $('#botb'); bb && (bb.onclick = async () => {
        try { b = await api(`/battles/${id}/fillbots`, { method: 'POST' }); render(); }
        catch (e) { toast(e.message, 'err'); }
      });
    } else if (b.state === 'live') {
      lastRound = b.curRound;
      spinAll(b.curRound);
    }
  }

  async function spinAll(round) {
    const c = APP.cases.find(x => x.id === b.caseId);
    if (!c) return;
    const ps = b.players;
    for (let i = 0; i < ps.length; i++) {
      const revealed = b.players[i].items[round - 1];
      const mr = $('#mr-' + i); if (!mr || !revealed) continue;
      mr.innerHTML = ''; mr.style.transform = 'translateX(0)';
      buildReelCells(mr, c.items, revealed, 24, 20);
      setTimeout(() => animateReel(mr, 20, 3200, { mini: true }), i * 350);
    }
    setTimeout(() => SND.win(), 3500);
  }

  render();
  const handler = async (nb) => {
    b = nb;
    if (b.state === 'live' && b.curRound > lastRound) { render(); }
    else if (b.state === 'done') { render(); }
    else render();
  };
  APP.socket.on('battle:' + id, handler); onRoute(() => APP.socket.off('battle:' + id, handler));
  const t = setInterval(async () => {
    const nb = await api('/battles/' + id).catch(() => null);
    if (nb && (nb.curRound !== b.curRound || nb.state !== b.state)) handler(nb);
  }, 2000);
  onRoute(() => clearInterval(t));
});
