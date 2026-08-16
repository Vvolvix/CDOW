// CDOW end-to-end API smoke test. Run: node test.js
const B = 'http://localhost:3000/api';
let token = '', pass = 0, fail = 0;
const log = (ok, name, extra = '') => { ok ? pass++ : fail++; console.log(`${ok ? '✅' : '❌'} ${name}${extra ? ' — ' + extra : ''}`); };

async function api(p, opts = {}) {
  const r = await fetch(B + p, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || r.status);
  return d;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  // config
  const cfg = await api('/config');
  log(cfg.siteName === 'CDOW' && cfg.madeBy === 'MADE BY VOLVIX', 'config', `payments=${cfg.payments}`);
  log(Array.isArray(await api('/cases')) && (await api('/cases')).length === 9, 'cases list (9)');
  log(Array.isArray(await api('/feed')), 'feed');

  // dev login
  const me = await api('/auth/dev', { method: 'POST', body: { name: 'VolvixTest' } });
  token = me.token;
  log(me.user.bal === 1000, 'dev login + welcome balance', `bal=${me.user.bal}`);

  // case open (starter=100)
  const opened = await api('/cases/open', { method: 'POST', body: { caseId: 'starter' } });
  log(opened.item.value > 0 && opened.balance === 900, 'case open', `${opened.item.name} (${opened.item.value})`);

  // inventory + sell
  const inv = await api('/inventory');
  log(inv.length === 1, 'inventory has item');
  const sold = await api('/inventory/sell', { method: 'POST', body: { ids: [inv[0].id] } });
  log(sold.got > 0, 'sell item', `got=${sold.got}`);

  // x50
  const x = await api('/x50/spin', { method: 'POST', body: { amount: 100 } });
  log([0, 1.2, 1.5, 2, 3, 5, 10, 50].includes(x.mult), 'x50 spin', `mult=x${x.mult}`);

  // upgrader
  const tg = await api('/upgrader/targets?bet=500');
  log(tg.length > 0, 'upgrader targets', `${tg.length} options`);
  const up = await api('/upgrader/upgrade', { method: 'POST', body: { amount: 500, targetId: tg[0].id } });
  log(typeof up.win === 'boolean', 'upgrader roll', `chance=${(up.chance * 100).toFixed(1)}% win=${up.win}`);

  // double — wait for betting phase then bet
  let ds = await api('/double/state');
  for (let i = 0; i < 60 && ds.phase !== 'bet'; i++) { await sleep(500); ds = await api('/double/state'); }
  const dbet = await api('/double/bet', { method: 'POST', body: { side: 'cyan', amount: 50 } });
  log(dbet.ok, 'double bet placed', `phase=${ds.phase}`);
  // wait result
  for (let i = 0; i < 60 && ds.phase !== 'result'; i++) { await sleep(500); ds = await api('/double/state'); }
  log(ds.phase === 'result' && ds.result && ds.history.length > 0, 'double round completed', `result=${ds.result.num}/${ds.result.side}`);

  // royal join
  const rj = await api('/royal/join', { method: 'POST', body: { amount: 50 } });
  log(rj.ok, 'royal join');

  // rush: wait bet phase, bet with auto-cashout x1.5, verify payout eventually
  let rs = await api('/rush/state');
  for (let i = 0; i < 60 && rs.phase !== 'bet'; i++) { await sleep(500); rs = await api('/rush/state'); }
  const rb = await api('/rush/bet', { method: 'POST', body: { amount: 50, auto: 1.5 } });
  log(rb.ok, 'rush bet w/ auto 1.5');
  let finished = false, autoCashed = false;
  for (let i = 0; i < 80 && !finished; i++) {
    rs = await api('/rush/state');
    if (rs.phase === 'bust') {
      const mine = rs.bets.find(b => b.a === 50);
      const crash = rs.history.length ? rs.history[rs.history.length - 1].m : 99;
      autoCashed = !mine || mine.c === true || crash < 1.5; // lost is legit if busted below auto target
      finished = true;
    }
    await sleep(300);
  }
  log(finished && autoCashed, 'rush round finished (auto-cashout applied)', `history=${rs.history.length}`);

  // battles: create + bots
  const bt = await api('/battles/create', { method: 'POST', body: { caseId: 'starter', rounds: 2, mode: '1v1' } });
  log(bt.state === 'lobby', 'battle created', bt.id);
  const started = await api(`/battles/${bt.id}/fillbots`, { method: 'POST' });
  log(started.state === 'live' && started.players.length === 2, 'battle filled with bots & live');
  let fin = started;
  for (let i = 0; i < 30 && fin.state !== 'done'; i++) { await sleep(900); fin = await api(`/battles/${fin.id}`); }
  log(fin.state === 'done' && fin.winners.length === 1, 'battle finished with winner', `winner=${fin.players[fin.winners[0]].name}`);

  // tasks
  const tasks = await api('/tasks');
  log(tasks.defs.length === 7 && tasks.daily.ready, 'tasks defs + daily ready');
  const daily = await api('/tasks/claim', { method: 'POST', body: { task: 'daily' } });
  log(daily.got === 300, 'daily claim +300');
  const rl = await api('/tasks/claim', { method: 'POST', body: { task: 'refer_link' } });
  log(rl.got === 500, 'refer_link task +500');

  // trade url + steam bonus
  const tu = await api('/profile/tradeurl', { method: 'POST', body: { url: 'https://steamcommunity.com/tradeoffer/new/?partner=123456&token=AbCd-EfGh' } });
  log(tu.bonus === 300, 'steam trade URL bonus +300');

  // deposit card (sandbox → auto approve)
  const before = (await api('/me')).bal;
  const dep = await api('/deposit/card', { method: 'POST', body: { amountUsd: 10, number: '4242424242424242' } });
  log(dep.tx.status === 'pending', 'card deposit submitted');
  await sleep(5500);
  const after = (await api('/me')).bal;
  log(after === before + 10000 + 6500, 'sandbox deposit auto-approved (+10000 & +6500 task)', `${before}→${after}`);

  // provably fair rotate
  const fr = await api('/fair/rotate', { method: 'POST', body: { client: 'myseed' } });
  log(fr.clientSeed === 'myseed' && fr.revealed.length > 10, 'fair rotate reveals seed');

  // feed populated
  const feed = await api('/feed');
  log(feed.length > 0, 'live feed has entries', `${feed.length}`);

  console.log(`\n${'='.repeat(46)}\n${fail === 0 ? '🎉 ALL TESTS PASSED' : '💥 FAILURES'} — ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error('💥 TEST CRASHED:', e.message); process.exit(1); });
