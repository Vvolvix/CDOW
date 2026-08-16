const fs = require('fs');
const catalog = require('../src/catalog');
const skinImages = require('../src/skin-images.json');

// Map every case so items contains full resolved objects with real Steam CDN image URLs
const resolvedCases = catalog.CASES.map(c => ({
  ...c,
  items: c.items.map(id => {
    const it = catalog.byId[id];
    return {
      ...it,
      img: skinImages[it.name] || it.img || ''
    };
  }),
  ev: Math.round(catalog.caseEV(c))
}));

const jsCode = `// CDOW Catalog & Real CS2 Steam CDN Skin Images Bundle
window.CDOW_CATALOG = ${JSON.stringify({
  CASES: resolvedCases,
  ITEMS: catalog.ITEMS.map(it => ({ ...it, img: skinImages[it.name] || it.img || '' })),
  RARITY: catalog.RARITY
})};
window.CDOW_SKIN_IMAGES = ${JSON.stringify(skinImages)};
`;

fs.writeFileSync('public/js/catalog-data.js', jsCode, 'utf8');
fs.writeFileSync('js/catalog-data.js', jsCode, 'utf8');
console.log('Successfully compiled catalog-data.js with all 52 cases fully resolved with Steam CDN skin images!');
