// CDOW — SVG art & 3D Case Assets, weapon silhouettes, icons. MADE BY VOLVIX.

const RAR = {
  consumer: '#b0c3d9',
  industrial: '#5e98d9',
  milspec: '#4b69ff',
  restricted: '#8847ff',
  classified: '#d32ce6',
  covert: '#eb4b4b',
  gold: '#ffd700',
};

const hue = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

const WEAPONS = {
  rifle: `<path d="M3 25 L14 23 L14 20 L22 19 L24 23 L38 23 L38 19 L52 19 L54 23 L92 23 L97 26 L97 30 L54 31 L52 35 L44 35 L42 31 L38 31 L36 46 L28 46 L30 31 L22 31 L20 35 L14 36 L14 33 L3 31 Z M56 13 L70 13 L71 17 L57 17 Z"/>`,
  sniper: `<path d="M2 28 L16 26 L16 22 L30 21 L32 25 L44 25 L44 21 L48 21 L48 25 L95 25 L99 27 L99 29 L48 31 L46 35 L40 35 L38 31 L30 31 L28 37 L22 47 L15 47 L19 35 L16 34 L16 31 L2 30 Z M34 12 L58 12 L58 18 L34 18 Z M36 18 L37 21 L55 21 L56 18 Z"/>`,
  pistol: `<path d="M18 20 L82 20 L84 26 L50 26 L50 30 L44 30 L42 26 L30 26 L30 32 L38 36 L38 44 L24 44 L22 34 L18 30 Z M46 26 L58 26 L58 28 L46 28 Z"/>`,
  smg: `<path d="M8 24 L24 22 L26 19 L58 19 L60 22 L90 22 L94 25 L94 28 L66 28 L66 31 L58 31 L56 28 L44 28 L42 34 L44 50 L34 50 L36 33 L33 29 L26 29 L24 33 L14 34 L14 30 L8 28 Z"/>`,
  heavy: `<path d="M4 26 L20 24 L24 20 L60 20 L62 24 L96 24 L99 27 L99 30 L62 30 L60 33 L48 33 L46 30 L24 30 L20 34 L8 35 L8 31 L4 30 Z M34 33 L46 33 L45 38 L35 38 Z"/>`,
  knife: `<path d="M8 34 Q30 8 78 14 Q60 22 52 30 Q40 40 30 42 L12 44 Q6 40 8 34 Z M30 42 L52 44 L50 50 L28 48 Z"/>`,
  gloves: `<path d="M25 14 Q25 8 31 8 Q37 8 37 14 L37 22 L40 12 Q41 6 47 7 Q52 8 51 14 L49 24 L52 16 Q54 11 59 12 Q64 14 62 20 L58 32 Q54 44 42 46 L36 46 Q26 46 24 34 L23 20 Q23 14 28 14 Z"/>`,
};

let svgN = 0;
function weaponSVG(weapon, name, rarity, w = 88, h = 52) {
  const c = RAR[rarity] || '#888';
  const hu = hue(name || 'weapon');
  const id = 'wg' + (++svgN);
  return `<svg class="w-art" viewBox="0 0 100 60" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hu},55%,38%)"/><stop offset=".55" stop-color="hsl(${hu},65%,52%)"/><stop offset="1" stop-color="hsl(${(hu+40)%360},70%,62%)"/>
    </linearGradient></defs>
    <g fill="url(#${id})" stroke="${c}" stroke-opacity=".55" stroke-width="1.2" stroke-linejoin="round"
       style="filter:drop-shadow(0 0 6px ${c}66)">${WEAPONS[weapon] || WEAPONS.rifle}</g></svg>`;
}

// Real CS2 skin image with resilient fallback
function itemArt(item, w = 88, h = 52) {
  if (!item) return '';
  const name = String(item.name || '');
  const safeName = name.replace(/[&<>"']/g, '');
  const imgUrl = item.img || (window.CATALOG_ITEMS && window.CATALOG_ITEMS[name]);
  
  if (imgUrl) {
    return `<img class="w-art w-art-img" src="${imgUrl}" width="${w}" height="${h}" alt="${safeName}" loading="lazy" draggable="false" onerror="this.onerror=null;this.style.opacity='0.9'">`;
  }
  return weaponSVG(item.weapon, item.name, item.rarity, w, h);
}

const LOGO = '<img src="/img/logo.png" alt="CDOW" draggable="false">';

// 3D Generated Case Render with fallback (supporting 52 cases and LOL artwork)
function caseSVG(caseOrTier, w = 140, h = 110) {
  const id = typeof caseOrTier === 'object' && caseOrTier ? (caseOrTier.id || caseOrTier.tier) : (caseOrTier || 'starter');
  const name = typeof caseOrTier === 'object' && caseOrTier ? caseOrTier.name : '';
  return `<img class="case-art" src="/img/cases/${encodeURIComponent(id)}.png" width="${w}" height="${h}" onerror="if(!this.dataset.r){this.dataset.r=1;this.src='/img/cases/${encodeURIComponent(id)}.jpg';}else if(this.dataset.r=='1'){this.dataset.r=2;this.src='/img/cases/${encodeURIComponent(name)}.png';}else{this.onerror=null;this.src='/img/cases/starter.jpg';}" alt="${esc(name || id)}" loading="lazy" draggable="false">`;
}

const I = (p, vb = '0 0 24 24') => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${p}</svg>`;
const ICONS = {
  logo: `<svg viewBox="0 0 48 48" width="38" height="38" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#35d97b"/><stop offset="1" stop-color="#1ab85c"/></linearGradient></defs>
    <path d="M24 3 L44 24 L24 45 L4 24 Z" fill="none" stroke="url(#lg1)" stroke-width="3"/>
    <path d="M24 12 L36 24 L24 36 L12 24 Z" fill="url(#lg1)" opacity=".9"/>
    <circle cx="24" cy="24" r="3.4" fill="#04060b"/></svg>`,
  home: I('<path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>'),
  case: I('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M7 7l2-3h6l2 3M3 12h18M12 12v3"/>'),
  swords: I('<path d="M4 4l7 7M3 21l6-6M14 14l7-10M20 4h-4M20 4v4M10 10L4 4h4v0M13 13l7 7M17 21l4-4"/>'),
  roulette: I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>'),
  wheel: I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3l3 6M21 12l-6 3M12 21l-3-6M3 12l6-3"/>'),
  up: I('<path d="M12 19V5M5 12l7-7 7 7"/>'),
  crown: I('<path d="M3 17l2-9 5 4 2-7 2 7 5-4 2 9zM5 21h14"/>'),
  rocket: I('<path d="M12 15c-2 0-5-1-7-3 2-7 7-10 7-10s5 3 7 10c-2 2-5 3-7 3zM12 15v6M8 14l-3 2 1 3M16 14l3 2-1 3"/>'),
  coin: `<svg class="coin-ic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="cg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#35d97b"/><stop offset="1" stop-color="#1ab85c"/></linearGradient></defs>
    <path d="M12 2l9 10-9 10-9-10z" fill="url(#cg2)" stroke="#fff" stroke-opacity=".25"/>
    <text x="12" y="15.5" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="11" fill="#04160a">C</text></svg>`,
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
  check: I('<path d="M20 6L9 17l-5-5"/>'),
  tasks: I('<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
  shield: I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'),
  sound: I('<path d="M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'),
  mute: I('<path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/>'),
  withdraw: I('<path d="M12 19V5M5 12l7-7 7 7M12 12h0"/>'),
  gift: I('<rect x="3" y="8" width="18" height="4"/><path d="M5 12v8h14v-8M12 8v12M12 8s-4 0-5-2 1-4 3-2c1.5 1.5 2 4 2 4s.5-2.5 2-4c2-2 4 0 3 2s-5 2-5 2z"/>'),
  users: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5 6.5-5s6.5 1.5 6.5 5M16 5a3.5 3.5 0 0 1 0 7M21.5 20c0-3-2-4.5-5-5"/>'),
  card: I('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),
  wallet: I('<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 12h4M3 7l16-3"/>'),
  link: I('<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7L12.5 18.5"/>'),
  fire: I('<path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-3 3 0-3-1-7-4-9 0 3-1 4-3 6-1.5 1.7-3 3.5-3 7 0 4 3 7 9 7z"/>'),
  bolt: I('<path d="M13 2L3 14h7l-1 8 11-13h-7z"/>'),
  external: I('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>'),
  refresh: I('<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'),
};

window.ART = { weaponSVG, itemArt, caseSVG, LOGO, ICONS, RAR };
