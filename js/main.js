// CDOW — SPA core: state, router, header/sidebar, live ticker, login, toasts. MADE BY VOLVIX.
window.APP = {
  user: null, token: localStorage.getItem('cdow_token') || '',
  config: null, socket: null, cases: [],
  routes: {}, cleanups: [],
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = n => Math.round(n).toLocaleString('en-US');
function setBal(b) {
  if (typeof b !== 'number' || !isFinite(b)) return;
  if (APP.user) APP.user.bal = b;
  const el = $('#balval');
  if (el) {
    el.textContent = fmt(b);
    const pill = $('#balpill');
    if (pill) { pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }
  }
}
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, opts = {}) {
  if (window.CDOW_STANDALONE && window.CDOW_STANDALONE.isStatic) {
    return await window.CDOW_STANDALONE.handleApi(path, opts);
  }
  try {
    const r = await fetch('/api' + path, {
      method: opts.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...(APP.token ? { Authorization: 'Bearer ' + APP.token } : {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Request failed');
    return d;
  } catch (err) {
    if (window.CDOW_STANDALONE) {
      return await window.CDOW_STANDALONE.handleApi(path, opts);
    }
    throw err;
  }
}

function toast(msg, type = 'ok') {
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = (type === 'err' ? '⛔' : '✅') + '<span>' + esc(msg) + '</span>';
  $('#toasts').appendChild(t);
  setTimeout(() => { t.style.transition = '.4s'; t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; setTimeout(() => t.remove(), 400); }, 3800);
}
function onRoute(fn) { APP.cleanups.push(fn); }
function cleanup() { APP.cleanups.forEach(f => { try { f(); } catch {} }); APP.cleanups = []; }

function setUser(u) { APP.user = u; renderHeader(); }

async function boot() {
  APP.token = localStorage.getItem('cdow_token') || APP.token || 'guest_token';
  APP.config = await api('/config').catch(() => ({ siteName: 'CDOW' }));
  try { setUser(await api('/me')); } catch { setUser({ name: 'Player', bal: 50000, photo: 'img/avatars/avatar_1.svg' }); }
  APP.cases = await api('/cases').catch(() => (window.CDOW_CATALOG ? window.CDOW_CATALOG.CASES : []));
  try {
    if (typeof io === 'function') {
      APP.socket = io({ auth: { token: APP.token } });
      APP.socket.on('bal', b => { if (APP.user) { APP.user.bal = b; const el = $('#balval'); if (el) { el.textContent = fmt(b); $('#balpill').classList.remove('bump'); void $('#balpill').offsetWidth; $('#balpill').classList.add('bump'); } } });
      APP.socket.on('feed:new', e => pushTicker(e));
      APP.socket.on('deposit:approved', t => { toast(`Deposit approved: +${fmt(t.coins)} coins credited`); SND.cash(); if (APP.user) refreshUser(); });
    } else {
      APP.socket = window.CDOW_STANDALONE ? window.CDOW_STANDALONE.socket : { on:()=>{}, off:()=>{}, emit:()=>{} };
    }
  } catch {
    APP.socket = window.CDOW_STANDALONE ? window.CDOW_STANDALONE.socket : { on:()=>{}, off:()=>{}, emit:()=>{} };
  }
  renderShell();
  window.addEventListener('hashchange', route);
  route();
  loadFeed();
}
const refreshUser = async () => { if (APP.token) { try { setUser(await api('/me')); } catch {} } };

// ---------------- shell ----------------
function renderShell() {
  const navLinks = [
    ['', 'Games'],
    ['#/', 'home', 'Lobby'],
    ['#/cases', 'case', 'Cases'],
    ['#/battles', 'swords', 'Case Battles'],
    ['#/double', 'roulette', 'Double'],
    ['#/x50', 'wheel', 'X50'],
    ['#/upgrader', 'up', 'Upgrader'],
    ['#/royal', 'crown', 'Royal Battle'],
    ['#/rushmid', 'rocket', 'RUSHMID'],
    ['', 'Account'],
    ['#/deposit', 'plus', 'Deposit'],
    ['#/tasks', 'tasks', 'Tasks'],
    ['#/profile', 'user', 'Profile'],
    ['#/fair', 'shield', 'Provably Fair'],
  ];
  const navHTML = sec => sec[0] === ''
    ? `<div class="nav-sec">${sec[1]}</div>`
    : `<div class="nav-item" data-href="${sec[0]}" onclick="location.hash='${sec[0]}';closeDrawer()">${ART.ICONS[sec[1]]}<span>${sec[2]}</span></div>`;
  const sideHTML = `
    <div class="logo" onclick="location.hash='#/'">
      <img class="logo-img-main" src="img/logo.png" alt="CDOW CS2" draggable="false">
    </div>
    ${navLinks.map(navHTML).join('')}`;
  $('#app').innerHTML = `
  <aside class="sidebar">${sideHTML}</aside>
  <div class="drawer-backdrop" id="drawer-bk" onclick="closeDrawer()"></div>
  <aside class="drawer" id="drawer">
    <div class="drawer-head">
      <img class="logo-img-drawer" src="img/logo.png" alt="CDOW" draggable="false" onclick="location.hash='#/';closeDrawer()">
      <button class="close-x" onclick="closeDrawer()">✕</button>
    </div>
    ${sideHTML}
  </aside>
  <div class="main">
    <header class="topbar">
      <button class="hamburger" id="hmenub">☰</button>
      <div class="brand-mini" onclick="location.hash='#/'">
        <img class="logo-img-topbar" src="img/logo.png" alt="CDOW" draggable="false">
      </div>
      <div class="grow"></div>
      <div class="bal-pill ${APP.user ? '' : 'hidden'}" id="balpill" title="Your balance">${ART.ICONS.coin}<span id="balval" class="num">${APP.user ? fmt(APP.user.bal) : ''}</span></div>
      <button class="btn green" id="depbtn" onclick="location.hash='#/deposit'">${ART.ICONS.plus}<span class="btn-txt">Deposit</span></button>
      <button class="snd-btn" id="sndbtn" title="Sound on/off"></button>
      ${APP.user
        ? `<div class="user-chip" onclick="location.hash='#/profile'"><div class="avatar">${APP.user.photo ? `<img src="${esc(APP.user.photo)}" alt="Avatar">` : esc(APP.user.name.slice(0, 2).toUpperCase())}</div><span class="uc-name" style="font-weight:700;font-size:13px">${esc(APP.user.name)}</span></div>`
        : `<button class="btn steam-btn" id="loginbtn"><span class="btn-txt">LOGIN WITH STEAM</span></button>`}
    </header>
    <div class="ticker-wrap">
      <div class="ticker-label"><span class="live-dot"></span>LIVE WINS</div>
      <div class="ticker"><div class="ticker-track" id="ticker-track"></div></div>
    </div>
    <div class="content" id="view"></div>
    <footer class="footer">
      <div>CDOW — CS2 CASES &amp; DROP &amp; OPEN &amp; WIN</div>
      <div style="margin-top:6px">MADE BY <span class="volviX">VOLVIX</span></div>
      <div class="disc">This site is operated for entertainment. Virtual coins have no cash value outside the platform. CS2 is a trademark of Valve Corp. — CDOW is not affiliated with Valve. 18+ only. Play responsibly.</div>
    </footer>
  </div>`;
  const lb = $('#loginbtn'); if (lb) lb.onclick = loginModal;
  $('#depbtn').onclick = () => { SND.click(); if (!APP.user) return loginModal(); location.hash = '#/deposit'; };
  $('#hmenub').onclick = openDrawer;
  const sb = $('#sndbtn');
  const renderSnd = () => { sb.innerHTML = SND.muted ? ART.ICONS.mute : ART.ICONS.sound; sb.classList.toggle('off', SND.muted); };
  sb.onclick = () => { SND.setMuted(!SND.muted); renderSnd(); SND.click(); };
  renderSnd();
}
function openDrawer() { $('#drawer').classList.add('open'); $('#drawer-bk').classList.add('show'); SND.click(); }
function closeDrawer() { const d = $('#drawer'); if (!d) return; d.classList.remove('open'); $('#drawer-bk').classList.remove('show'); }
function renderHeader() { renderShell(); markNav(); }
function markNav() {
  const h = location.hash || '#/';
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.href === h));
}

// ---------------- Butter-Smooth Continuous Live Wins Ticker Engine ----------------
let tickerPos = 0;
let tickerItemsList = [];
let tickerPaused = false;
let animFrameId = null;

function tickItemHTML(e) {
  const rar = (e.item && e.item.rarity) || 'gold';
  const rarColor = ART.RAR[rar] || '#ffd700';
  return `<div class="tick-item ${e.big ? 'big' : ''}" onclick="${e.caseId ? `location.hash='#/case/${e.caseId}'` : `location.hash='#/profile'`}">
    <div class="avatar tick-avatar" style="border-color:${rarColor}44">${e.item ? ART.itemArt(e.item, 50, 32) : (e.name || 'P').slice(0, 2).toUpperCase()}</div>
    <div>
      <div class="ti-name">${esc(e.name)}</div>
      <div class="ti-item">${e.item ? esc(e.item.name) : esc(e.label || e.game)}</div>
    </div>
    <div class="ti-val" style="color:${rarColor}">${fmt(e.value)}</div>
  </div>`;
}

async function loadFeed() {
  const feed = await api('/feed').catch(() => []);
  const track = $('#ticker-track'); if (!track) return;
  tickerItemsList = feed.length ? feed : [
    { name: 'ShadowSniper99', photo: 'img/avatars/avatar_2.svg', value: 10000000, item: { name: 'AWP | Dragon Lore', weapon: 'sniper', rarity: 'covert', img: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa_nBovp3Pdwtj9cC_GaAd0DZdwQu9fuhS4kNy0NePntVTbjYpCyyT_3CgY5i9j_a9cBkcCWUKV' } },
    { name: 'PhantomBlade', photo: 'img/avatars/avatar_3.svg', value: 3400000, item: { name: '★ Butterfly Knife | Fade', weapon: 'knife', rarity: 'gold', img: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2avx-9ytd5lRi67gVNwsDvSwtqqc3iXZg4kCZYjReYLtRbum9XgYuvm5wbWjtgUzCn3iSsf8G81tFEeH9rw' } },
    { name: 'Vortex_CS', photo: 'img/avatars/avatar_1.svg', value: 12000000, item: { name: 'AK-47 | Wild Lotus', weapon: 'rifle', rarity: 'covert', img: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlV61-LPGdCliWzeFkse1WQyC0nQlpsDuGyt-pdnyRPA4hDcYkR-QPuhi-wdPuYbyx5AaMidkQnC_-2ilIuzErvbi4ijV5Mw' } },
    { name: 'NeonRider', photo: 'img/avatars/avatar_4.svg', value: 2800000, item: { name: '★ Sport Gloves | Vice', weapon: 'gloves', rarity: 'gold', img: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H_KfG2Kv0ed4u95lRi67gVNx4T-Bw434IHyVb1QlAsd1FOUDthG4xNznMu3m4QXXg90Wzn_33C1I8G81tLaDi_rK' } },
  ];

  renderInitialTicker();
  startTickerLoop();
}

function renderInitialTicker() {
  const track = $('#ticker-track');
  if (!track) return;
  track.innerHTML = '';
  // Fill track with enough items to ensure smooth infinite wrap
  const pool = [...tickerItemsList];
  while (pool.length < 24) pool.push(...tickerItemsList);
  pool.forEach(item => track.insertAdjacentHTML('beforeend', tickItemHTML(item)));
  
  const tickerWrap = $('.ticker');
  if (tickerWrap) {
    tickerWrap.onmouseenter = () => { tickerPaused = true; };
    tickerWrap.onmouseleave = () => { tickerPaused = false; };
  }
}

function startTickerLoop() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  const track = $('#ticker-track');
  if (!track) return;

  function step() {
    if (!tickerPaused && track && track.parentElement) {
      tickerPos += 0.85; // Smooth 60fps velocity (~50px/sec)
      const first = track.firstElementChild;
      if (first) {
        const itemWidth = first.offsetWidth + 10;
        if (tickerPos >= itemWidth) {
          tickerPos -= itemWidth;
          track.appendChild(first);
        }
      }
      track.style.transform = `translate3d(${-tickerPos}px, 0, 0)`;
    }
    animFrameId = requestAnimationFrame(step);
  }
  animFrameId = requestAnimationFrame(step);
}

function pushTicker(e) {
  tickerItemsList.unshift(e);
  if (tickerItemsList.length > 80) tickerItemsList.pop();
  const track = $('#ticker-track');
  if (!track) return;
  track.insertAdjacentHTML('beforeend', tickItemHTML(e));
}

// ---------------- Smart Steam Login & Profile Lookup ----------------
function steamLogin() {
  SND.click();
  const ref = localStorage.getItem('cdow_ref');
  location.href = '/auth/steam' + (ref ? '?ref=' + encodeURIComponent(ref) : '');
}

function loginModal() {
  closeModal();
  const ov = document.createElement('div');
  ov.className = 'modal-ov'; ov.id = 'modal-ov';
  ov.innerHTML = `<div class="modal" style="max-width:460px">
    <button class="close-x" onclick="closeModal()">✕</button>
    <div class="center" style="margin-bottom:12px">
      <img src="img/logo.png" style="max-width:190px;width:100%;height:auto;filter:drop-shadow(0 0 16px rgba(53,217,123,.3))" draggable="false">
    </div>
    <h2 class="center" style="font-size:22px;margin-bottom:4px">Sign In to CDOW</h2>
    <p class="muted center" style="font-size:13px">Instant CS2 skin case opening &amp; battles</p>
    
    <div style="margin-top:18px">
      <button class="btn steam-btn big full" id="msteamgo" onclick="steamLogin()">
        LOGIN WITH STEAM
      </button>
    </div>

    <div class="row center" style="margin:16px 0 14px">
      <div style="height:1px;background:var(--line2);flex:1"></div>
      <span class="muted" style="font-size:11px;padding:0 8px;letter-spacing:1px;text-transform:uppercase">or quick connect</span>
      <div style="height:1px;background:var(--line2);flex:1"></div>
    </div>

    <div>
      <label class="f" style="font-size:11.5px">STEAM USERNAME / VANITY / PROFILE URL</label>
      <div class="row" style="margin-top:6px">
        <input type="text" id="steamInput" class="input grow" placeholder="e.g. volvixxx or SteamID64" value="volvixxx">
        <button class="btn green" id="directConnectBtn">Connect</button>
      </div>
      <div class="muted" style="font-size:11px;margin-top:6px">⚡ Automatically loads your real Steam avatar photo and username.</div>
    </div>

    <div class="panel" style="margin-top:14px;padding:10px 12px;background:rgba(255,255,255,.02);font-size:11.5px;line-height:1.6">
      🔒 Secure &amp; Provably Fair · We never access your password · Virtual coins for CS2 entertainment.
    </div>
  </div>`;

  ov.addEventListener('click', e => { if (e.target === ov) closeModal(); });
  document.body.appendChild(ov);

  const btn = $('#directConnectBtn');
  if (btn) {
    btn.onclick = async () => {
      const val = ($('#steamInput').value || '').trim();
      if (!val) return toast('Please enter your Steam username or profile URL', 'err');
      btn.disabled = true;
      btn.textContent = 'Connecting…';
      try {
        const ref = localStorage.getItem('cdow_ref');
        const res = await api('/auth/steam-direct', { method: 'POST', body: { steamInput: val, ref } });
        APP.token = res.token;
        localStorage.setItem('cdow_token', res.token);
        setUser(res.user);
        closeModal();
        toast(`Welcome, ${res.user.name}! Connected with Steam avatar 🎉`);
        SND.coin();
        route();
      } catch (err) {
        toast(err.message, 'err');
        btn.disabled = false;
        btn.textContent = 'Connect';
      }
    };
  }
}

function closeModal() { const m = $('#modal-ov'); if (m) m.remove(); }

// ---------------- router ----------------
function register(name, fn) { APP.routes[name] = fn; }
function route() {
  cleanup(); closeModal();
  const hash = location.hash.replace(/^#\/?/, '');
  const [name, arg] = hash.split('/');
  const view = $('#view');
  view.innerHTML = '<div class="spin-loader"></div>';
  markNav();
  const fn = APP.routes[name || 'home'] || APP.routes.notfound;
  fn(view, arg);
  window.scrollTo(0, 0);
}
function needLogin() { if (!APP.user) { loginModal(); return true; } return false; }
function modal(html) {
  closeModal();
  const ov = document.createElement('div');
  ov.className = 'modal-ov'; ov.id = 'modal-ov';
  ov.innerHTML = `<div class="modal">${html}</div>`;
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(); });
  document.body.appendChild(ov);
  return ov;
}

// URL params: ref capture + token login
(() => {
  const p = new URLSearchParams(location.search);
  const ref = p.get('ref');
  if (ref && !localStorage.getItem('cdow_ref')) localStorage.setItem('cdow_ref', ref);
  const t = p.get('t');
  if (t) { localStorage.setItem('cdow_token', t); history.replaceState(null, '', location.pathname + location.hash); }
})();
