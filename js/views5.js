// CDOW views — Deposit, Tasks, Profile (inventory), Provably Fair. MADE BY VOLVIX.

// ---------------- DEPOSIT ----------------
register('deposit', async (view) => {
  const m = await api('/deposit/methods').catch(() => ({
    mode: 'live',
    payformUrl: 'https://payform.me/',
    unlimitUrl: 'https://www.unlimit.com/',
    skinsbackUrl: 'https://skinsback.com/',
    cryptoNetworks: [
      { id: 'USDTTRC', name: 'USDT (TRC20)', symbol: 'USDT', network: 'TRON' },
      { id: 'USDTBSC', name: 'USDT (BSC)', symbol: 'USDT', network: 'BNB Chain' },
      { id: 'USDTTON', name: 'USDT (TON)', symbol: 'USDT', network: 'TON' },
      { id: 'USDTERC', name: 'USDT (ERC20)', symbol: 'USDT', network: 'Ethereum' },
      { id: 'USDTPOLY', name: 'USDT (Polygon)', symbol: 'USDT', network: 'Polygon' },
      { id: 'USDTSOL', name: 'USDT (Solana)', symbol: 'USDT', network: 'Solana' },
      { id: 'TRX', name: 'TRX', symbol: 'TRX', network: 'TRON' },
      { id: 'TON', name: 'TON', symbol: 'TON', network: 'TON' },
      { id: 'ETH', name: 'ETH', symbol: 'ETH', network: 'Ethereum' },
      { id: 'LTC', name: 'LTC', symbol: 'LTC', network: 'Litecoin' },
      { id: 'SOL', name: 'SOL', symbol: 'SOL', network: 'Solana' },
      { id: 'MATIC', name: 'MATIC', symbol: 'MATIC', network: 'Polygon' },
      { id: 'BNB', name: 'BNB', symbol: 'BNB', network: 'BNB Chain' },
      { id: 'BTC', name: 'BTC', symbol: 'BTC', network: 'Bitcoin' },
    ],
    rate: 1000,
    min: 1,
  }));

  let tab = 'payform';
  let selCrypto = 'USDTTRC';
  const coins = usd => fmt((usd || 0) * m.rate);

  view.innerHTML = `
    <div class="page-head">
      <div class="page-title"><span class="pico">${ART.ICONS.plus}</span>Deposit</div>
      <div class="timer-pill">EXCHANGE RATE <span class="t">1000c = $1.00 USD</span></div>
    </div>
    
    <div class="dep-tabs" id="dtabs"></div>
    <div class="dep-box panel glow" id="depbody"></div>
    <div class="sec-title">Your transactions</div>
    <div class="panel" id="deptxs"><div class="muted">Loading…</div></div>`;

  const tabs = [
    ['payform', ART.ICONS.wallet, 'PayForm (Crypto)'],
    ['unlimit', ART.ICONS.card, 'Unlimit (Cards)'],
    ['skinsback', ART.ICONS.case, 'SkinsBack (CS2 Skins)'],
  ];

  function renderTabs() {
    $('#dtabs').innerHTML = tabs.map(([id, ic, label]) =>
      `<div class="dep-tab ${id === tab ? 'active' : ''}" data-tab="${id}">${ic}<span>${label}</span></div>`).join('');
    $$('#dtabs .dep-tab').forEach(t => t.onclick = () => {
      tab = t.dataset.tab;
      renderTabs();
      renderBody();
      SND.click();
    });
  }

  function amountRow() {
    return `<label class="f">DEPOSIT AMOUNT (USD) — MINIMUM $${m.min || 1}</label>
      <input type="number" id="dusd" value="10" min="${m.min || 1}" class="input" style="font-size:16px;font-weight:700">
      <div class="amt-grid">${[5, 10, 25, 50, 100, 250].map(v => `<div class="amt-chip" data-d="${v}">$${v}</div>`).join('')}</div>
      <div class="row" style="margin-top:10px;justify-content:space-between;background:rgba(233,189,92,.06);padding:10px 14px;border-radius:12px;border:1px solid rgba(233,189,92,.18)">
        <span class="muted">You receive on CDOW:</span>
        <b class="cyan" style="font-size:16px"><span id="dcoins">10,000</span> coins</b>
      </div>`;
  }

  function bindAmount() {
    const upd = () => {
      const v = +$('#dusd').value || 0;
      $('#dcoins').textContent = coins(v);
    };
    $('#dusd').oninput = upd;
    upd();
    $$('[data-d]').forEach(c => c.onclick = () => {
      $('#dusd').value = c.dataset.d;
      $('#dusd').oninput();
      SND.click();
    });
  }

  function renderBody() {
    const b = $('#depbody');
    if (tab === 'payform') {
      const networks = m.cryptoNetworks || [];
      b.innerHTML = `
        <div class="gateway-banner payform-banner">
          <div class="row" style="justify-content:space-between;flex-wrap:wrap">
            <div>
              <span class="badge ok" style="margin-bottom:6px">OFFICIAL GATEWAY</span>
              <h3 style="margin:2px 0">PayForm.me — Instant Crypto Deposit</h3>
              <p class="muted" style="font-size:12.5px">Zero fees, instant blockchain processing across 14+ networks.</p>
            </div>
            <a href="https://payform.me/" target="_blank" class="btn sm ghost" style="gap:6px">${ART.ICONS.external} Visit PayForm.me</a>
          </div>
        </div>

        <label class="f" style="margin-top:16px">SELECT CRYPTOCURRENCY NETWORK</label>
        <div class="crypto-token-grid">
          ${networks.map(n => `
            <div class="crypto-token-card ${n.id === selCrypto ? 'sel' : ''}" data-tok="${n.id}">
              <div class="tok-badge tok-${n.symbol.toLowerCase()}">${n.symbol}</div>
              <div class="tok-name">${n.id}</div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:16px">
          ${amountRow()}
        </div>

        <div class="row" style="margin-top:18px;gap:12px">
          <button class="btn green big grow" id="pfgo">${ART.ICONS.bolt} PROCEED WITH PAYFORM</button>
        </div>
        <div class="qr-note" style="margin-top:12px">⚡ Instant automated crediting after network confirmation via PayForm.me.</div>`;

      $$('.crypto-token-card').forEach(card => card.onclick = () => {
        selCrypto = card.dataset.tok;
        $$('.crypto-token-card').forEach(x => x.classList.remove('sel'));
        card.classList.add('sel');
        SND.click();
      });

      bindAmount();

      $('#pfgo').onclick = async () => {
        if (needLogin()) return;
        const amountUsd = +$('#dusd').value || 10;
        try {
          const res = await api('/deposit/payform', { method: 'POST', body: { currency: selCrypto, amountUsd } });
          modal(`<button class="close-x" onclick="closeModal()">✕</button>
            <div class="center">
              <div class="badge ok" style="margin-bottom:10px">PAYFORM INVOICE GENERATED</div>
              <h2>Deposit $${amountUsd} via ${selCrypto}</h2>
              <p class="muted" style="font-size:13px;margin:8px 0 16px">Your PayForm order <b>#${res.tx.id}</b> is ready. You will receive <b>${fmt(res.tx.coins)} coins</b>.</p>
              <div class="row center" style="gap:10px">
                <a href="${esc(res.payUrl)}" target="_blank" class="btn green big" onclick="closeModal()">${ART.ICONS.external} OPEN PAYFORM CHECKOUT</a>
                <button class="btn ghost big" onclick="closeModal()">Done</button>
              </div>
            </div>`);
          toast('PayForm transaction created — coins arrive upon payment!');
          SND.coin();
          loadTxs();
        } catch (e) {
          toast(e.message, 'err');
        }
      };

    } else if (tab === 'unlimit') {
      b.innerHTML = `
        <div class="gateway-banner unlimit-banner">
          <div class="row" style="justify-content:space-between;flex-wrap:wrap">
            <div>
              <span class="badge ok" style="margin-bottom:6px">OFFICIAL GATEWAY</span>
              <h3 style="margin:2px 0">Unlimit.com — Visa &amp; Mastercard</h3>
              <p class="muted" style="font-size:12.5px">Fast, 3D-Secure card payments worldwide via Unlimit.</p>
            </div>
            <a href="https://www.unlimit.com/" target="_blank" class="btn sm ghost" style="gap:6px">${ART.ICONS.external} Visit Unlimit.com</a>
          </div>
        </div>

        <div class="card-flip" style="margin:16px 0 14px">
          <div class="credit-card">
            <div class="row"><div class="cc-chip"></div><div class="grow"></div><div class="cc-brand" id="ccbrand">VISA / MASTERCARD</div></div>
            <div class="cc-num" id="ccnum">•••• •••• •••• ••••</div>
            <div class="cc-meta"><span id="ccname">CARDHOLDER NAME</span><span id="ccexp">MM/YY</span></div>
          </div>
        </div>

        ${amountRow()}

        <div style="margin-top:14px">
          <label class="f">CARD NUMBER</label>
          <input type="text" id="cardnum" class="input" maxlength="19" placeholder="4242 4242 4242 4242">
        </div>
        <div class="grid2" style="margin-top:10px">
          <div><label class="f">EXPIRY</label><input type="text" id="cardexp" class="input" maxlength="5" placeholder="12/28"></div>
          <div><label class="f">CVC</label><input type="text" id="cardcvc" class="input" maxlength="4" placeholder="123"></div>
        </div>
        <div style="margin-top:10px">
          <label class="f">CARDHOLDER NAME</label>
          <input type="text" id="cardname" class="input" placeholder="FULL NAME">
        </div>

        <button class="btn big full green" style="margin-top:18px" id="cardgo">
          PAY WITH UNLIMIT
        </button>
        <div class="qr-note" style="margin-top:10px">🔒 256-bit encrypted checkout handled by Unlimit.com.</div>`;

      bindAmount();

      $('#cardnum').oninput = e => {
        const v = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
        e.target.value = v; $('#ccnum').textContent = v.padEnd(19, '•');
        $('#ccbrand').textContent = v.startsWith('4') ? 'VISA' : v.startsWith('5') ? 'MASTERCARD' : 'CARD';
      };
      $('#cardexp').oninput = e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
        e.target.value = v; $('#ccexp').textContent = v || 'MM/YY';
      };
      $('#cardcvc').oninput = e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); };
      $('#cardname').oninput = e => { $('#ccname').textContent = e.target.value.toUpperCase() || 'CARDHOLDER NAME'; };

      $('#cardgo').onclick = async () => {
        if (needLogin()) return;
        const amountUsd = +$('#dusd').value || 10;
        try {
          const res = await api('/deposit/unlimit', {
            method: 'POST',
            body: {
              amountUsd,
              number: $('#cardnum').value,
              exp: $('#cardexp').value,
              cvc: $('#cardcvc').value,
              name: $('#cardname').value,
            },
          });
          toast('Unlimit card payment submitted — coins arriving shortly!');
          SND.cash();
          loadTxs();
        } catch (e) {
          toast(e.message, 'err');
        }
      };

    } else {
      // SkinsBack
      b.innerHTML = `
        <div class="gateway-banner skinsback-banner">
          <div class="row" style="justify-content:space-between;flex-wrap:wrap">
            <div>
              <span class="badge ok" style="margin-bottom:6px">OFFICIAL GATEWAY</span>
              <h3 style="margin:2px 0">SkinsBack.com — CS2 Skins Deposit</h3>
              <p class="muted" style="font-size:12.5px">Deposit your CS2 skins directly into CDOW coins instantly.</p>
            </div>
            <a href="https://skinsback.com/" target="_blank" class="btn sm ghost" style="gap:6px">${ART.ICONS.external} Visit SkinsBack.com</a>
          </div>
        </div>

        <div style="margin-top:16px">
          <div class="row" style="justify-content:space-between;margin-bottom:6px">
            <label class="f" style="margin-bottom:0">YOUR STEAM TRADE URL</label>
            <a href="https://steamcommunity.com/id/volvixxx/tradeoffers/privacy" target="_blank" class="tradeurl-helper-link">
              Where to find it? ${ART.ICONS.external}
            </a>
          </div>
          <input type="text" id="sktrade" class="input" style="font-size:13px" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." value="${esc(APP.user ? APP.user.tradeUrl : '')}">
        </div>

        <div style="margin-top:14px">
          <label class="f">SKINS TO DEPOSIT</label>
          <textarea id="skitems" rows="3" class="input" placeholder="e.g. AK-47 | Slate, AWP | Asiimov, ★ Flip Knife"></textarea>
        </div>

        <div style="margin-top:14px">
          <label class="f">ESTIMATED TOTAL VALUE (USD)</label>
          <input type="number" id="skval" class="input" value="25" min="1">
          <div class="muted" style="font-size:12px;margin-top:6px">Rate: 1000 coins per $1.00 USD value.</div>
        </div>

        <button class="btn big full green" style="margin-top:18px" id="skgo">
          DEPOSIT WITH SKINSBACK
        </button>
        <div class="qr-note" style="margin-top:10px">⚡ Instant trade offer bot powered by SkinsBack.com gateway.</div>`;

      $('#skgo').onclick = async () => {
        if (needLogin()) return;
        try {
          const res = await api('/deposit/skinsback', {
            method: 'POST',
            body: {
              items: $('#skitems').value,
              tradeUrl: $('#sktrade').value,
              estimatedUsd: +$('#skval').value,
            },
          });
          toast('SkinsBack deposit initiated — accept trade offer on Steam!');
          SND.coin();
          loadTxs();
        } catch (e) {
          toast(e.message, 'err');
        }
      };
    }
  }

  async function loadTxs() {
    const el = $('#deptxs');
    if (!APP.user) {
      el.innerHTML = '<div class="muted">Login to view your transaction history.</div>';
      return;
    }
    el.innerHTML = '<div class="muted">Transactions appear here after submitting.</div>';
  }

  renderTabs();
  renderBody();
  loadTxs();
});

// ---------------- TASKS ----------------
register('tasks', async (view) => {
  if (needLogin()) return;
  const { defs, state, daily, refCode, refCount } = await api('/tasks');
  const refLink = location.origin + '/?ref=' + refCode;
  const groups = [...new Set(defs.map(d => d.group))];
  view.innerHTML = `
    <div class="page-head"><div class="page-title"><span class="pico">${ART.ICONS.tasks}</span>Tasks &amp; Rewards</div></div>
    <div class="daily-hero">
      <div class="dnum">300</div>
      <div class="grow"><b style="font-size:16px">Daily Free Coins</b><div class="muted" style="font-size:12.5px">${daily.ready ? 'Ready to claim!' : `Come back in ${daily.in}h ${daily.min}m`}</div></div>
      <button class="btn gold big" id="dclaim" ${daily.ready ? '' : 'disabled'}>${ART.ICONS.gift} CLAIM 300</button>
    </div>
    <div class="panel glow" style="margin-bottom:20px">
      <div class="row" style="flex-wrap:wrap">
        <div class="grow"><b>👥 Your referral link</b>
          <div class="addr-box" style="margin-top:8px"><span class="grow" id="reflink">${esc(refLink)}</span><button class="btn sm ghost" id="refcopy">Copy</button></div>
          <div class="muted" style="font-size:12px;margin-top:6px">Invited: <b>${refCount}</b> friends · Earned: <b class="cyan">${fmt(refCount * 5000)}</b> coins (+5000 each)</div>
        </div>
      </div>
    </div>
    ${groups.map(g => `
      <div class="sec-title">${g}</div>
      ${defs.filter(d => d.group === g).map(d => {
        const s = state[d.id];
        const done = s && (s.done || (s.count !== undefined && false));
        return `<div class="task-card">
          <div class="task-ic">${ART.ICONS[d.id === 'invite' ? 'users' : d.id === 'recharge' ? 'wallet' : d.id === 'daily_open' ? 'case' : d.id.includes('steam') || d.id === 'refer_link' ? 'link' : 'gift']}</div>
          <div class="grow"><div class="task-name">${esc(d.name)}</div>
            <div class="task-meta">${d.type}${d.id === 'invite' ? ` · ${s.count} invited so far` : ''}${d.desc ? ' · ' + d.desc : ''}</div></div>
          ${d.auto
            ? (d.id === 'recharge' ? (s.done ? '<span class="task-done">✓ Claimed</span>' : '<span class="badge pend">Make a deposit</span>')
                                    : `<span class="task-reward">+${fmt(d.reward)}</span><span class="badge ok">Automatic</span>`)
            : d.id === 'refer_link'
              ? (s.done ? '<span class="task-done">✓ Claimed</span>' : `<button class="btn sm" data-claim="${d.id}">+${fmt(d.reward)}</button>`)
              : `<button class="btn sm" data-claim="${d.id}" ${s && s.ready ? '' : 'disabled'}>CLAIM +${fmt(d.reward)}</button>`}
        </div>`;
      }).join('')}`).join('')}
    <div class="sec-title">Other</div>
    <div class="muted" style="font-size:12.5px">Steam tasks: link your trade URL in <a href="#/profile">Profile</a> to unlock them.</div>`;
  $('#dclaim').onclick = async () => {
    try { const r = await api('/tasks/claim', { method: 'POST', body: { task: 'daily' } }); toast('Daily reward: +300 coins!'); SND.coin(); route(); }
    catch (e) { toast(e.message, 'err'); }
  };
  $('#refcopy').onclick = () => { navigator.clipboard.writeText(refLink); toast('Referral link copied!'); };
  $$('[data-claim]').forEach(b => b.onclick = async () => {
    try { const r = await api('/tasks/claim', { method: 'POST', body: { task: b.dataset.claim } }); toast(`Task rewarded: +${fmt(r.got)} coins!`); SND.coin(); route(); }
    catch (e) { toast(e.message, 'err'); }
  });
});

// ---------------- PROFILE (Steam Profile Sync & Trade URL) ----------------
register('profile', async (view) => {
  if (needLogin()) return;
  const u = await api('/me');
  const inv = await api('/inventory');
  let sel = new Set();
  const selVal = () => inv.filter(i => sel.has(i.id)).reduce((s, i) => s + (i ? i.value : 0), 0);

  view.innerHTML = `
    <div class="page-head">
      <div class="row">
        <div class="avatar" style="width:48px;height:48px;font-size:18px">
          ${u.photo ? `<img src="${esc(u.photo)}" alt="Avatar">` : esc(u.name.slice(0, 2).toUpperCase())}
        </div>
        <div>
          <div class="page-title" style="margin-bottom:0">${esc(u.name)}</div>
          <div class="muted" style="font-size:12px">Member since ${new Date(u.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
      <div class="row">
        <button class="btn ghost sm" id="syncSteamBtn" title="Re-fetch avatar & name from Steam">${ART.ICONS.refresh} Sync Steam Profile</button>
        <button class="btn ghost sm" id="logout">Logout</button>
      </div>
    </div>

    <div class="grid3" style="margin-bottom:20px">
      <div class="stat-box"><div class="sv">${fmt(u.stats.opened)}</div><div class="sl">Cases opened</div></div>
      <div class="stat-box"><div class="sv">${fmt(u.stats.wagered)}</div><div class="sl">Total wagered</div></div>
      <div class="stat-box"><div class="sv">${fmt(u.stats.battlesWon)}</div><div class="sl">Battles won</div></div>
    </div>

    <div class="panel" style="margin-bottom:20px">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap">
        <div>
          <b>🔗 Steam Trade URL</b> <span class="muted" style="font-size:12px">— link once and get <b class="cyan">+300 coins</b></span>
        </div>
        <a href="https://steamcommunity.com/id/volvixxx/tradeoffers/privacy" target="_blank" class="tradeurl-helper-link">
          Where to find it? ${ART.ICONS.external}
        </a>
      </div>
      <div class="row" style="margin-top:10px;flex-wrap:wrap">
        <input type="text" id="turl" class="input grow" style="min-width:260px" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..." value="${esc(u.tradeUrl)}">
        <button class="btn gold" id="tsave">Save Trade URL</button>
      </div>
      <div class="muted" style="font-size:11.5px;margin-top:6px">Required for skin withdrawals and automatic case battle delivery.</div>
    </div>

    <div class="page-title" style="font-size:18px;margin-bottom:12px">🎒 Inventory <span class="muted" style="font-size:13px">(${inv.length} items)</span></div>
    <div class="panel">
      <div class="row" style="margin-bottom:14px;flex-wrap:wrap">
        <span class="muted">Selected: <b class="cyan" id="selcount">0</b> items worth <b class="cyan" id="selval">0</b></span>
        <div class="grow"></div>
        <button class="btn gold" id="sellsel">SELL (90%)</button>
        <button class="btn" id="withdrawsel">${ART.ICONS.withdraw} WITHDRAW TO STEAM</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px" id="invgrid"></div>
    </div>`;

  function renderInv() {
    $('#invgrid').innerHTML = inv.map(i => `
      <div class="item-cell rar-${i.rarity} ${sel.has(i.id) ? 'big-win' : ''}" data-inv="${i.id}" style="cursor:pointer;width:100%">
        ${ART.itemArt(i)}<div class="i-name">${esc(i.name)}</div><div class="i-val">${fmt(i.value)}</div>
      </div>`).join('') || '<div class="muted" style="padding:20px">Your inventory is empty — go open some cases!</div>';
    $$('#invgrid .item-cell').forEach(c => c.onclick = () => {
      const id = c.dataset.inv;
      sel.has(id) ? sel.delete(id) : sel.add(id);
      c.classList.toggle('big-win'); SND.click(); updSel();
    });
  }
  const updSel = () => { $('#selcount').textContent = sel.size; $('#selval').textContent = fmt(selVal()); };
  renderInv(); updSel();

  $('#syncSteamBtn').onclick = async () => {
    try {
      const r = await api('/auth/steam-sync', { method: 'POST' });
      setUser(r.user);
      toast('Steam profile synced with latest avatar & name!');
      SND.coin();
      route();
    } catch (e) {
      toast(e.message, 'err');
    }
  };

  $('#tsave').onclick = async () => {
    try {
      const r = await api('/profile/tradeurl', { method: 'POST', body: { url: $('#turl').value } });
      toast(r.bonus ? `Steam Trade URL linked! +${r.bonus} bonus coins 🎉` : 'Trade URL saved successfully');
      SND.coin();
      refreshUser();
    } catch (e) {
      toast(e.message, 'err');
    }
  };

  $('#sellsel').onclick = async () => {
    if (!sel.size) return toast('Select items first', 'err');
    try {
      const r = await api('/inventory/sell', { method: 'POST', body: { ids: [...sel] } });
      setBal(r.balance);
      toast(`Sold for ${fmt(r.got)} coins`);
      SND.coin();
      route();
    } catch (e) {
      toast(e.message, 'err');
    }
  };

  $('#withdrawsel').onclick = async () => {
    if (!sel.size) return toast('Select items first', 'err');
    try {
      await api('/inventory/withdraw', { method: 'POST', body: { ids: [...sel] } });
      toast('Withdrawal requested — items will be sent via Steam Trade Offer');
      route();
    } catch (e) {
      toast(e.message, 'err');
    }
  };

  $('#logout').onclick = async () => {
    await api('/logout', { method: 'POST' }).catch(() => {});
    APP.token = ''; localStorage.removeItem('cdow_token'); setUser(null); location.hash = '#/';
  };
});

// ---------------- PROVABLY FAIR ----------------
register('fair', async (view) => {
  const f = APP.user ? await api('/fair') : null;
  view.innerHTML = `
    <div class="page-head"><div class="page-title"><span class="pico">${ART.ICONS.shield}</span>Provably Fair</div></div>
    <div class="panel glow">
      <p style="max-width:760px;line-height:1.8">Every roll on CDOW is generated with <b>HMAC-SHA256(serverSeed, clientSeed:nonce)</b> and is 100% verifiable.
      Your personal <b>server seed</b> is committed in advance as a SHA-256 hash. Rotate your seed at any time to reveal the old one and verify every past result.</p>
      ${f ? `
      <label class="f">SERVER SEED HASH (commitment)</label>
      <div class="addr-box mono" style="font-size:11px">${esc(f.serverSeedHash)}</div>
      <label class="f">CLIENT SEED (editable)</label>
      <div class="row"><input type="text" id="fclient" class="input grow" value="${esc(f.clientSeed)}"><button class="btn" id="frotate">Rotate &amp; Reveal</button></div>
      <label class="f">CURRENT NONCE</label>
      <div class="addr-box mono">${f.nonce}</div>
      <div id="frevealed" style="margin-top:12px"></div>` : '<p class="muted">Login to see your personal seeds.</p>'}
    </div>`;
  if (f) $('#frotate').onclick = async () => {
    try {
      const r = await api('/fair/rotate', { method: 'POST', body: { client: $('#fclient').value } });
      $('#frevealed').innerHTML = `✅ Old server seed revealed: <div class="addr-box mono" style="font-size:11px;margin-top:6px">${esc(r.revealed)}</div>
      <div class="muted" style="margin-top:6px">Verify: SHA-256 of the revealed seed = <span class="mono">${esc(r.revealedHash)}</span></div>`;
      toast('Seed rotated — old seed revealed'); route();
    } catch (e) { toast(e.message, 'err'); }
  };
});
