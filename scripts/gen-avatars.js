const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(__dirname, 'public', 'img', 'avatars');
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

const AVATAR_DATA = [
  { name: 'Vortex_CS', bg1: '#0a2215', bg2: '#35d97b', symbol: '⚔️' },
  { name: 'ShadowSniper99', bg1: '#140c24', bg2: '#9c27b0', symbol: '🎯' },
  { name: 'PhantomBlade', bg1: '#26060c', bg2: '#ff1744', symbol: '🗡️' },
  { name: 'NeonRider', bg1: '#001a29', bg2: '#00e5ff', symbol: '⚡' },
  { name: 'CyberGhost', bg1: '#002620', bg2: '#00bfa5', symbol: '👾' },
  { name: 'ApexPredator', bg1: '#211700', bg2: '#ffd600', symbol: '👑' },
  { name: 'SilentReaper', bg1: '#14141e', bg2: '#90caf9', symbol: '💀' },
  { name: 'NovaStrike', bg1: '#240030', bg2: '#e040fb', symbol: '💥' },
  { name: 'Krypton_9', bg1: '#00220d', bg2: '#00e676', symbol: '☣️' },
  { name: 'DarkMatter', bg1: '#0d0d0d', bg2: '#3d5afe', symbol: '🌌' },
  { name: 'FrostByte', bg1: '#002236', bg2: '#40c4ff', symbol: '❄️' },
  { name: 'ViperX', bg1: '#132900', bg2: '#76ff03', symbol: '🐍' },
  { name: 'GlitchCS', bg1: '#29001b', bg2: '#ff4081', symbol: '🕹️' },
  { name: 'AeroBlast', bg1: '#002626', bg2: '#1de9b6', symbol: '🌪️' },
  { name: 'TitanFall', bg1: '#211600', bg2: '#ff9100', symbol: '🛡️' },
  { name: 'EchoWolf', bg1: '#131720', bg2: '#80cbc4', symbol: '🐺' },
  { name: 'ZenithCS', bg1: '#19002e', bg2: '#d500f9', symbol: '🔮' },
  { name: 'HyperDrive', bg1: '#2e1400', bg2: '#ff3d00', symbol: '🚀' },
  { name: 'OmegaFox', bg1: '#291000', bg2: '#ff6d00', symbol: '🦊' },
  { name: 'Pulse_99', bg1: '#002418', bg2: '#00e676', symbol: '💚' },
  { name: 'SpectreCS', bg1: '#121220', bg2: '#8c9eff', symbol: '👻' },
  { name: 'RedlineMaster', bg1: '#240505', bg2: '#ff5252', symbol: '🏎️' },
  { name: 'MatrixPlayer', bg1: '#001e08', bg2: '#69f0ae', symbol: '💻' },
  { name: 'HavocCS', bg1: '#261600', bg2: '#ffab00', symbol: '🔥' },
  { name: 'StrikeForce', bg1: '#081d26', bg2: '#40c4ff', symbol: '🎖️' }
];

AVATAR_DATA.forEach((av, i) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="bg_${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${av.bg1}" />
      <stop offset="100%" stop-color="${av.bg2}" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#bg_${i})" />
  <circle cx="50" cy="50" r="38" fill="rgba(0,0,0,0.35)" stroke="${av.bg2}" stroke-width="2.5" stroke-opacity="0.5" />
  <text x="50" y="58" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="34" text-anchor="middle" dominant-baseline="middle">${av.symbol}</text>
</svg>`;
  fs.writeFileSync(path.join(avatarsDir, `avatar_${i + 1}.svg`), svg, 'utf8');
});

console.log(`Generated ${AVATAR_DATA.length} local gamer avatars in public/img/avatars/`);
