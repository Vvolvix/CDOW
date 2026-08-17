const fs = require('fs');

const RARITY = {
  consumer:   { name: 'Consumer',   color: '#b0c3d9', w: 0 },
  industrial: { name: 'Industrial', color: '#5e98d9', w: 0 },
  milspec:    { name: 'Mil-Spec',   color: '#4b69ff', w: 1 },
  restricted: { name: 'Restricted', color: '#8847ff', w: 2 },
  classified: { name: 'Classified', color: '#d32ce6', w: 3 },
  covert:     { name: 'Covert',     color: '#eb4b4b', w: 4 },
  gold:       { name: '★ Rare Special', color: '#ffd700', w: 5 },
};

let _id = 0;
const I = (name, weapon, rarity, value) => ({ id: 'it' + (++_id), name, weapon, rarity, value });

const ITEMS = [
  // --- Micro Consumer Grade (20 - 90 coins = $0.02 - $0.09) ---
  I('P250 | Sand Dune', 'pistol', 'consumer', 20),
  I('Nova | Predator', 'heavy', 'consumer', 35),
  I('FAMAS | Colony', 'rifle', 'consumer', 50),
  I('MP7 | Forest DDPAT', 'smg', 'consumer', 65),
  I('SG 553 | Army Sheen', 'rifle', 'consumer', 80),
  I('G3SG1 | Desert Storm', 'sniper', 'consumer', 95),
  I('MAG-7 | Storm', 'heavy', 'consumer', 120),
  I('PP-Bizon | Urban Dashed', 'smg', 'consumer', 150),
  I('M249 | Contrast Spray', 'heavy', 'consumer', 180),
  I('Galil AR | Sage Spray', 'rifle', 'consumer', 210),
  I('Dual Berettas | Colony', 'pistol', 'consumer', 240),

  // --- Industrial Grade (280 - 950 coins = $0.28 - $0.95) ---
  I('MP9 | Storm', 'smg', 'industrial', 280),
  I('AUG | Sweeper', 'rifle', 'industrial', 350),
  I('SSG 08 | Mainframe 001', 'sniper', 'industrial', 450),
  I('Glock-18 | High Beam', 'pistol', 'industrial', 550),
  I('Glock-18 | Grinder', 'pistol', 'industrial', 750),
  I('Tec-9 | Bamboozle', 'pistol', 'industrial', 880),

  // --- Mil-Spec Grade ($1 - $5 = 1,000 - 5,000 coins) ---
  I('UMP-45 | Urban DDPAT', 'smg', 'milspec', 1200),
  I('MAC-10 | Silver', 'smg', 'industrial', 1400),
  I('Five-SeveN | Case Hardened', 'pistol', 'industrial', 1600),
  I('Desert Eagle | Mudder', 'pistol', 'industrial', 1800),
  I('MAC-10 | Curse', 'smg', 'milspec', 2200),
  I('AK-47 | Safari Mesh', 'rifle', 'milspec', 2500),
  I('P90 | Grim', 'smg', 'milspec', 2800),
  I('Desert Eagle | Light Rail', 'pistol', 'milspec', 3500),
  I('M4A1-S | Night Terror', 'rifle', 'milspec', 4200),
  I('P250 | Valence', 'pistol', 'milspec', 4800),

  // --- CS2 Music Kits ($3.5 - $14 = 3,500 - 14,000 coins) ---
  I('Music Kit | ALRT, DOPAMINE HIT', 'music', 'milspec', 3500),
  I('Music Kit | bbno$, u mad!', 'music', 'milspec', 4800),
  I('Music Kit | Knock2, dashstar*', 'music', 'milspec', 5500),
  I('Music Kit | Denzel Curry, ULTIMATE', 'music', 'milspec', 6500),
  I('Music Kit | AWOLNATION, I Am', 'music', 'milspec', 8500),
  I('Music Kit | Mord Fustang, Diamonds', 'music', 'milspec', 9500),
  I('Music Kit | The Verkkars, EZ4ENCE', 'music', 'restricted', 12500),
  I('Music Kit | The Verkkars & n0thing, Flashbang Dance', 'music', 'restricted', 14000),

  // --- CS2 Stickers ($1.5 - $3,200 = 1,500 - 3,200,000 coins) ---
  I('Sticker | High Heat', 'sticker', 'restricted', 1500),
  I('Sticker | sdy (Holo) | Paris 2023', 'sticker', 'restricted', 3200),
  I('Sticker | Apeks (Glitter) | Copenhagen 2024', 'sticker', 'restricted', 4500),
  I('Sticker | Liquid (Holo) | 2020 RMR', 'sticker', 'classified', 8500),
  I('Sticker | Boom (Gold) | 2020 RMR', 'sticker', 'covert', 18000),
  I('Sticker | Rare Atom (Holo) | Shanghai 2024', 'sticker', 'classified', 22000),
  I('Sticker | 3DMAX | Katowice 2014', 'sticker', 'classified', 85000),
  I('Sticker | LGB eSports | Katowice 2014', 'sticker', 'classified', 140000),
  I('Sticker | Fnatic | Katowice 2014', 'sticker', 'classified', 180000),
  I('Sticker | HellRaisers | Katowice 2014', 'sticker', 'classified', 250000),
  I('Sticker | Vox Eminor | Katowice 2014', 'sticker', 'classified', 450000),
  I('Sticker | Team Dignitas | Katowice 2014', 'sticker', 'classified', 650000),
  I('Sticker | Natus Vincere | Katowice 2014', 'sticker', 'covert', 950000),
  I('Sticker | ESL Wolf (Foil) | Katowice 2014', 'sticker', 'covert', 1200000),
  I('Sticker | ESL Skull (Foil) | Katowice 2014', 'sticker', 'covert', 1500000),
  I('Sticker | Fnatic (Holo) | Katowice 2014', 'sticker', 'gold', 3200000),

  // --- CS2 Agents ($5.5 - $135 = 5,500 - 135,000 coins) ---
  I('Ground Rebel  | Elite Crew', 'agent', 'milspec', 5500),
  I('Osiris | Elite Crew', 'agent', 'milspec', 6500),
  I('Operator | FBI SWAT', 'agent', 'milspec', 7500),
  I('3rd Commando Company | KSK', 'agent', 'restricted', 12000),
  I('Seal Team 6 Soldier | NSWC SEAL', 'agent', 'restricted', 14500),
  I('Michael Syfers  | FBI Sniper', 'agent', 'restricted', 16500),
  I('The Elite Mr. Muhlik | Elite Crew', 'agent', 'classified', 22000),
  I('Special Agent Ava | FBI', 'agent', 'classified', 28000),
  I('Getaway Sally | The Professionals', 'agent', 'classified', 34000),
  I('Vypa Sista of the Revolution | Guerrilla Warfare', 'agent', 'covert', 42000),
  I('Sir Bloody Loudmouth Darryl | The Professionals', 'agent', 'covert', 48000),
  I('Sir Bloody Miami Darryl | The Professionals', 'agent', 'covert', 55000),
  I('Sir Bloody Silent Darryl | The Professionals', 'agent', 'covert', 62000),
  I('Cmdr. Mae \'Dead Cold\' Jamison | SWAT', 'agent', 'covert', 68000),
  I('Cmdr. Davida \'Goggles\' Fernandez | SEAL Frogman', 'agent', 'covert', 75000),
  I('\'The Doctor\' Romanov | Sabre', 'agent', 'covert', 85000),
  I('Sir Bloody Skullhead Darryl | The Professionals', 'agent', 'covert', 95000),
  I('Cmdr. Frank \'Wet Sox\' Baroud | SEAL Frogman', 'agent', 'covert', 110000),
  I('Sir Bloody Darryl Royale | The Professionals', 'agent', 'covert', 135000),

  // --- Restricted Weapons ($5.5 - $19.5 = 5,500 - 19,500 coins) ---
  I('MAC-10 | Sakkaku', 'smg', 'restricted', 5500),
  I('AK-47 | Slate', 'rifle', 'restricted', 6500),
  I('USP-S | Cortex', 'pistol', 'restricted', 8500),
  I('Five-SeveN | Angry Mob', 'pistol', 'restricted', 9500),
  I('M4A4 | Spider Lily', 'rifle', 'restricted', 11000),
  I('AWP | Atheris', 'sniper', 'restricted', 12500),
  I('Glock-18 | Water Elemental', 'pistol', 'restricted', 14000),
  I('M4A4 | Cyber Security', 'rifle', 'restricted', 16000),
  I('AK-47 | Ice Coaled', 'rifle', 'restricted', 18000),
  I('M4A1-S | Decimator', 'rifle', 'restricted', 19500),

  // --- Classified Weapons ($25 - $72 = 25,000 - 72,000 coins) ---
  I('AK-47 | Redline', 'rifle', 'classified', 25000),
  I('M4A1-S | Cyrex', 'rifle', 'classified', 28000),
  I('Desert Eagle | Kumicho Dragon', 'pistol', 'classified', 34000),
  I('AK-47 | Frontside Misty', 'rifle', 'classified', 38000),
  I('AWP | Neo-Noir', 'sniper', 'classified', 42000),
  I('M4A4 | In Living Color', 'rifle', 'classified', 45000),
  I('USP-S | Monster Mashup', 'pistol', 'classified', 48000),
  I('Desert Eagle | Code Red', 'pistol', 'classified', 55000),
  I('AK-47 | Legion of Anubis', 'rifle', 'classified', 62000),
  I('AWP | Chromatic Aberration', 'sniper', 'classified', 68000),
  I('M4A1-S | Golden Coil', 'rifle', 'classified', 72000),

  // --- Covert High-Tier Weapons ($75 - $480 = 75,000 - 480,000 coins) ---
  I('AK-47 | Asiimov', 'rifle', 'covert', 75000),
  I('Desert Eagle | Ocean Drive', 'pistol', 'covert', 85000),
  I('AWP | Hyper Beast', 'sniper', 'covert', 88000),
  I('AK-47 | The Empress', 'rifle', 'covert', 95000),
  I('Desert Eagle | Printstream', 'pistol', 'covert', 110000),
  I('M4A4 | The Emperor', 'rifle', 'covert', 130000),
  I('AWP | Asiimov', 'sniper', 'covert', 135000),
  I('AK-47 | Bloodsport', 'rifle', 'covert', 140000),
  I('M4A4 | Temukau', 'rifle', 'covert', 145000),
  I('USP-S | Printstream', 'pistol', 'covert', 145000),
  I('AWP | Wildfire', 'sniper', 'covert', 160000),
  I('USP-S | Kill Confirmed', 'pistol', 'covert', 190000),
  I('AWP | Containment Breach', 'sniper', 'covert', 260000),
  I('AK-47 | Fuel Injector', 'rifle', 'covert', 280000),
  I('M4A1-S | Printstream', 'rifle', 'covert', 290000),
  I('AWP | Oni Taiji', 'sniper', 'covert', 480000),

  // --- Entry Level & Mid-Tier Knives & Gloves ($110 - $650 = 110,000 - 650,000 coins) ---
  I('★ Navaja Knife | Crimson Web', 'knife', 'gold', 110000),
  I('★ Hydra Gloves | Emerald', 'gloves', 'gold', 140000),
  I('★ Gut Knife | Doppler', 'knife', 'gold', 160000),
  I('★ Shadow Daggers | Fade', 'knife', 'gold', 190000),
  I('★ Bowie Knife | Tiger Tooth', 'knife', 'gold', 240000),
  I('★ Moto Gloves | Blood Pressure', 'gloves', 'gold', 260000),
  I('★ Huntsman Knife | Lore', 'knife', 'gold', 320000),
  I('★ Sport Gloves | Big Game', 'gloves', 'gold', 380000),
  I('★ Specialist Gloves | Fade', 'gloves', 'gold', 550000),
  I('★ Stiletto Knife | Doppler', 'knife', 'gold', 650000),
  I('★ Hand Wraps | Cobalt Skulls', 'gloves', 'gold', 650000),

  // --- High-Tier Knives, Gloves & Rifles ($650 - $1,900 = 650,000 - 1,900,000 coins) ---
  I('M4A1-S | Blue Phosphor', 'rifle', 'classified', 720000),
  I('AWP | Lightning Strike', 'sniper', 'covert', 750000),
  I('Desert Eagle | Blaze', 'pistol', 'restricted', 780000),
  I('M4A1-S | Hot Rod', 'rifle', 'classified', 850000),
  I('★ Talon Knife | Fade', 'knife', 'gold', 880000),
  I('AK-47 | Vulcan', 'rifle', 'covert', 950000),
  I('★ Skeleton Knife | Crimson Web', 'knife', 'gold', 950000),
  I('M4A4 | Eye of Horus', 'rifle', 'covert', 950000),
  I('★ Driver Gloves | King Snake', 'gloves', 'gold', 980000),
  I('AWP | Fade', 'sniper', 'covert', 1100000),
  I('★ Karambit | Tiger Tooth', 'knife', 'gold', 1150000),
  I('★ Karambit | Lore', 'knife', 'gold', 1200000),
  I('M4A4 | Poseidon', 'rifle', 'classified', 1200000),
  I('M4A1-S | Imminent Danger', 'rifle', 'covert', 1300000),
  I('★ Butterfly Knife | Slaughter', 'knife', 'gold', 1300000),
  I('★ M9 Bayonet | Marble Fade', 'knife', 'gold', 1400000),
  I('★ Moto Gloves | Spearmint', 'gloves', 'gold', 1400000),
  I('★ Karambit | Marble Fade', 'knife', 'gold', 1450000),
  I('M4A1-S | Knight', 'rifle', 'classified', 1500000),
  I('Glock-18 | Fade', 'pistol', 'restricted', 1600000),
  I('★ Karambit | Doppler', 'knife', 'gold', 1650000),
  I('AK-47 | Fire Serpent', 'rifle', 'covert', 1800000),
  I('★ Specialist Gloves | Crimson Kimono', 'gloves', 'gold', 1900000),

  // --- God-Tier Grails ($2,100 - $12,000 = 2,100,000 - 12,000,000 coins) ---
  I('M4A1-S | Welcome to the Jungle', 'rifle', 'covert', 2100000),
  I('AWP | Medusa', 'sniper', 'covert', 2200000),
  I('AWP | Desert Hydra', 'sniper', 'covert', 2400000),
  I('★ Sport Gloves | Vice', 'gloves', 'gold', 2800000),
  I('AWP | The Prince', 'sniper', 'covert', 2900000),
  I('★ Karambit | Fade', 'knife', 'gold', 3100000),
  I('★ Butterfly Knife | Fade', 'knife', 'gold', 3400000),
  I('★ Sport Gloves | Pandora\'s Box', 'gloves', 'gold', 3500000),
  I('AK-47 | Gold Arabesque', 'rifle', 'covert', 3500000),
  I('AUG | Akihabara Accept', 'rifle', 'covert', 4500000),
  I('M4A4 | Howl', 'rifle', 'covert', 6500000),
  I('AWP | Gungnir', 'sniper', 'covert', 8500000),
  I('AWP | Dragon Lore', 'sniper', 'covert', 10000000),
  I('AK-47 | Wild Lotus', 'rifle', 'covert', 12000000),
];

const byName = Object.fromEntries(ITEMS.map(it => [it.name, it]));
const byId = Object.fromEntries(ITEMS.map(it => [it.id, it]));

// 52 Cases definition with accurate prices
const CASE_LIST = [
  { id: 'dust_10c', name: '10¢ Dust & Sand', tier: 'starter', price: 100 },
  { id: 'quick_25c', name: '25¢ Budget Luck', tier: 'starter', price: 250 },
  { id: 'starter', name: '50¢ Budget Luck', tier: 'starter', price: 500 },
  { id: 'thrill_75c', name: '75¢ Thrill Rush', tier: 'starter', price: 750 },
  { id: 'starter_1usd', name: '$1 Starter Box', tier: 'bronze', price: 1000 },
  { id: 'milspec_rain', name: '$1.50 Mil-Spec Rain', tier: 'bronze', price: 1500 },
  { id: 'industrial_2usd', name: '$2 Industrial Drop', tier: 'bronze', price: 2000 },
  { id: 'bronze', name: 'Bronze Blitz', tier: 'bronze', price: 2500 },
  { id: 'danger_3usd', name: '$3 Danger Zone', tier: 'silver', price: 3000 },
  { id: 'shadow_4usd', name: '$4 Shadow Case', tier: 'silver', price: 4000 },
  { id: 'silver', name: 'Silver Storm', tier: 'silver', price: 5000 },
  { id: 'scout_6usd', name: '$6 Wildfire Scout', tier: 'silver', price: 6000 },
  { id: 'smg_frenzy', name: '$7.50 SMG Frenzy', tier: 'silver', price: 7500 },
  { id: 'music_8usd', name: 'CS2 Music Box', tier: 'silver', price: 8000 },
  { id: 'gold', name: 'Golden Rush', tier: 'gold', price: 10000 },
  { id: 'redline_12usd', name: '$12 Redline Vault', tier: 'gold', price: 12000 },
  { id: 'pistols', name: 'One Tap Pistols', tier: 'gold', price: 15000 },
  { id: 'heavy_18usd', name: '$18 Heavy Assault', tier: 'gold', price: 18000 },
  { id: 'classified_20usd', name: '$20 Classified Royale', tier: 'gold', price: 20000 },
  { id: 'agents_25usd', name: 'Operation Agents', tier: 'gold', price: 25000 },
  { id: 'stickers_30usd', name: 'Sticker Capsule', tier: 'gold', price: 30000 },
  { id: 'ak47', name: 'AK-47 Legends', tier: 'gold', price: 35000 },
  { id: 'm4_king', name: 'M4 King Vault', tier: 'diamond', price: 40000 },
  { id: 'awp', name: 'AWP Sniper Elite', tier: 'diamond', price: 45000 },
  { id: 'anime', name: 'Anime & Waifu Collection', tier: 'diamond', price: 45000 },
  { id: 'diamond', name: 'Diamond Deck', tier: 'diamond', price: 50000 },
  { id: 'deagle_beast', name: 'Desert Eagle Beast', tier: 'diamond', price: 55000 },
  { id: 'emerald_dynasty', name: 'Emerald Dynasty', tier: 'diamond', price: 60000 },
  { id: 'crimson_blood', name: 'Crimson Bloodline', tier: 'diamond', price: 65000 },
  { id: 'covert_jackpot', name: 'Covert Jackpot Vault', tier: 'diamond', price: 70000 },
  { id: 'cyberpunk_75usd', name: 'Neon Cyberpunk', tier: 'diamond', price: 75000 },
  { id: 'elite_empire', name: 'Elite Empire', tier: 'diamond', price: 80000 },
  { id: 'heavy_artillery', name: 'Heavy Artillery', tier: 'diamond', price: 90000 },
  { id: 'knife', name: 'Knife Arena', tier: 'knife', price: 100000 },
  { id: 'gloves', name: 'Gloves Paradise', tier: 'gloves', price: 120000 },
  { id: 'karambit_kingdom', name: 'Karambit Kingdom', tier: 'knife', price: 140000 },
  { id: 'doppler_phases', name: 'Doppler Phases', tier: 'knife', price: 160000 },
  { id: 'butterfly', name: 'Butterfly Dreams', tier: 'knife', price: 180000 },
  { id: 'm9_bayonet', name: 'M9 Bayonet Vault', tier: 'knife', price: 200000 },
  { id: 'dragon', name: 'Dragon Lore Vault', tier: 'dragon', price: 225000 },
  { id: 'skeleton_web', name: 'Skeleton Web', tier: 'knife', price: 250000 },
  { id: 'vice_pandora', name: 'Vice & Pandora', tier: 'gloves', price: 300000 },
  { id: 'talon_vortex', name: 'Talon Vortex', tier: 'knife', price: 350000 },
  { id: 'mythic', name: 'CASE MYTHIC', tier: 'mythic', price: 400000 },
  { id: 'blue_gem', name: 'Case Hardened Blue Gem', tier: 'knife', price: 450000 },
  { id: 'katowice_2014', name: 'Katowice 2014 Relics', tier: 'vip', price: 500000 },
  { id: 'fade_master', name: 'Fade Collection Master', tier: 'vip', price: 600000 },
  { id: 'godlike_armory', name: 'Godlike Armory', tier: 'vip', price: 700000 },
  { id: 'sovereign_diamond', name: 'Sovereign Diamond', tier: 'vip', price: 750000 },
  { id: 'kingpin_vault', name: 'Kingpin Vault', tier: 'vip', price: 850000 },
  { id: 'infinity_secret', name: 'Infinity Secret', tier: 'vip', price: 900000 },
  { id: 'volvix', name: 'CS2 OLYMPUS GRAIL 1M', tier: 'volvix', price: 1000000 }
];

// Curate each case ensuring at least 5 distinct filler weapons strictly UNDER price
const CASES = CASE_LIST.map(cDef => {
  const price = cDef.price;
  
  // 1. Find all available items under price
  const availableFillers = ITEMS.filter(it => it.value < price).sort((a, b) => a.value - b.value);
  
  // 2. Select 5 distinct filler items (spread across low to mid-range under price)
  let selectedFillers = [];
  if (availableFillers.length >= 5) {
    const step = (availableFillers.length - 1) / 4;
    for (let i = 0; i < 5; i++) {
      const idx = Math.min(availableFillers.length - 1, Math.round(i * step));
      if (!selectedFillers.includes(availableFillers[idx])) {
        selectedFillers.push(availableFillers[idx]);
      }
    }
    // If duplicates occurred due to rounding, fill remaining
    for (const it of availableFillers) {
      if (selectedFillers.length >= 5) break;
      if (!selectedFillers.includes(it)) selectedFillers.push(it);
    }
  } else {
    selectedFillers = availableFillers.slice(0, 5);
  }

  // 3. Find jackpots with value >= price (or highest tier grails)
  let availableJackpots = ITEMS.filter(it => it.value >= price).sort((a, b) => a.value - b.value);
  if (!availableJackpots.length) {
    availableJackpots = ITEMS.filter(it => it.value >= 1000000);
  }
  
  // Select 3 to 6 jackpots
  const selectedJackpots = availableJackpots.slice(0, 6);

  // 4. Combine items: 5 fillers + jackpots
  const allItems = [...selectedFillers, ...selectedJackpots];
  
  // 5. Probability distribution:
  // 5 Fillers get 98.5% total probability (with varied drops: 26%, 23%, 20%, 16%, 13.5%)
  // Jackpots get 1.5% total probability (making high-value drops challenging and rare)
  const fillerWeights = [0.26, 0.23, 0.20, 0.16, 0.135];
  const jackpotTotalWeight = 0.015;
  const eachJackpotWeight = selectedJackpots.length ? (jackpotTotalWeight / selectedJackpots.length) : 0;

  const w = [];
  for (let i = 0; i < selectedFillers.length; i++) {
    w.push(fillerWeights[i] || 0.10);
  }
  for (let i = 0; i < selectedJackpots.length; i++) {
    w.push(eachJackpotWeight);
  }

  // Normalize weights to sum exactly to 1.0
  const sumW = w.reduce((a, b) => a + b, 0);
  const normalizedW = w.map(weight => weight / sumW);

  return {
    id: cDef.id,
    name: cDef.name,
    tier: cDef.tier,
    price: cDef.price,
    items: allItems.map(it => it.id),
    w: normalizedW
  };
});

const CASES_BY_ID = Object.fromEntries(CASES.map(c => [c.id, c]));
const caseEV = c => c.items.reduce((s, id, i) => s + (byId[id] ? byId[id].value : 0) * c.w[i], 0);

console.log('Sample Case (AK-47 Legends, Price: 35,000):');
const akCase = CASES_BY_ID['ak47'];
console.log('AK-47 Items:');
akCase.items.forEach((id, i) => {
  const it = byId[id];
  console.log(`  [${(akCase.w[i] * 100).toFixed(2)}%] ${it.name} (${it.value.toLocaleString()} coins) — ${it.value < akCase.price ? 'UNDER PRICE' : 'JACKPOT'}`);
});

console.log('\nSample Case (CS2 OLYMPUS GRAIL 1M, Price: 1,000,000):');
const olympusCase = CASES_BY_ID['volvix'];
olympusCase.items.forEach((id, i) => {
  const it = byId[id];
  console.log(`  [${(olympusCase.w[i] * 100).toFixed(2)}%] ${it.name} (${it.value.toLocaleString()} coins) — ${it.value < olympusCase.price ? 'UNDER PRICE' : 'JACKPOT'}`);
});

// Write to src/catalog.js
const catalogCode = `// CDOW — CS2 Items & 52 Cases Catalog. MADE BY VOLVIX.
const RARITY = ${JSON.stringify(RARITY, null, 2)};
const ITEMS = ${JSON.stringify(ITEMS, null, 2)};
const byName = Object.fromEntries(ITEMS.map(it => [it.name, it]));
const byId = Object.fromEntries(ITEMS.map(it => [it.id, it]));
const CASES = ${JSON.stringify(CASES, null, 2)};
const CASES_BY_ID = Object.fromEntries(CASES.map(c => [c.id, c]));
const caseEV = ${caseEV.toString()};
module.exports = { RARITY, ITEMS, byId, byName, CASES, CASES_BY_ID, caseEV };
`;

fs.writeFileSync('./src/catalog.js', catalogCode, 'utf8');
console.log('\nSuccessfully generated src/catalog.js with balanced 5-filler distributions across all 52 cases!');
