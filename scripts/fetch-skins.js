// Fetch real CS2 skin images from ByMykel/CSGO-API for our catalog.
// Downloads matched images locally → public/img/skins/, saves map → src/skin-images.json
const fs = require('fs');
const path = require('path');
const { ITEMS } = require('../src/catalog');

const API = 'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json';
const IMG_DIR = path.join(__dirname, '..', 'public', 'img', 'skins');
const MAP_FILE = path.join(__dirname, 'skin-images.json');

// custom aliases for themed/unique items that don't exist verbatim in CS2
const ALIAS = {
  '★ Karambit | Blue Gem 387': '★ Karambit | Case Hardened',
  '★ Butterfly Knife | Blue Gem': '★ Butterfly Knife | Case Hardened',
  '★ Butterfly Knife | Fade #661': '★ Butterfly Knife | Fade',
  '★ Karambit | Doppler Sapphire': '★ Karambit | Doppler',
};

(async () => {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log('downloading skins.json ...');
  const skins = await (await fetch(API)).json();
  console.log('skins loaded:', skins.length);
  const byName = new Map(skins.map(s => [s.name, s]));

  const map = {};
  let ok = 0, miss = [];
  for (const it of ITEMS) {
    const target = ALIAS[it.name] || it.name;
    const s = byName.get(target) || byName.get(target.replace('★ ', '★ '));
    if (!s || !s.image) { miss.push(it.name); continue; }
    const ext = path.extname(new URL(s.image).pathname) || '.png';
    const file = s.id + ext;
    try {
      const r = await fetch(s.image);
      if (!r.ok) throw new Error(r.status);
      fs.writeFileSync(path.join(IMG_DIR, file), Buffer.from(await r.arrayBuffer()));
      map[it.name] = '/img/skins/' + file;
      ok++;
    } catch (e) { miss.push(it.name + ' (dl fail ' + e.message + ')'); }
  }
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2));
  console.log(`downloaded: ${ok}/${ITEMS.length}`);
  if (miss.length) console.log('missing:\n  ' + miss.join('\n  '));
})();
