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
  // --- Micro Consumer Grade (50 - 450 coins = $0.05 - $0.45) ---
  I('P250 | Sand Dune', 'pistol', 'consumer', 50),
  I('Nova | Predator', 'heavy', 'consumer', 80),
  I('FAMAS | Colony', 'rifle', 'consumer', 110),
  I('MP7 | Forest DDPAT', 'smg', 'consumer', 140),
  I('SG 553 | Army Sheen', 'rifle', 'consumer', 170),
  I('G3SG1 | Desert Storm', 'sniper', 'consumer', 190),
  I('MAG-7 | Storm', 'heavy', 'consumer', 230),
  I('PP-Bizon | Urban Dashed', 'smg', 'consumer', 270),
  I('M249 | Contrast Spray', 'heavy', 'consumer', 310),
  I('Galil AR | Sage Spray', 'rifle', 'consumer', 360),
  I('Dual Berettas | Colony', 'pistol', 'consumer', 400),

  // --- Industrial Grade (450 - 950 coins = $0.45 - $0.95) ---
  I('MP9 | Storm', 'smg', 'industrial', 480),
  I('AUG | Sweeper', 'rifle', 'industrial', 550),
  I('SSG 08 | Mainframe 001', 'sniper', 'industrial', 650),
  I('Glock-18 | High Beam', 'pistol', 'industrial', 750),
  I('Glock-18 | Grinder', 'pistol', 'industrial', 850),
  I('Tec-9 | Bamboozle', 'pistol', 'industrial', 920),

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

// Curated 52 Cases where for EVERY case, majority of items are strictly under price
const CASE_DEFS = [
  // 1. 10c (100)
  {
    id: 'dust_10c', name: '10¢ Dust & Sand', tier: 'starter', price: 100,
    fillers: ['P250 | Sand Dune', 'Nova | Predator'],
    jackpots: ['FAMAS | Colony', 'MP7 | Forest DDPAT', 'SG 553 | Army Sheen', 'Glock-18 | Grinder']
  },
  // 2. 25c (250)
  {
    id: 'quick_25c', name: '25¢ Budget Luck', tier: 'starter', price: 250,
    fillers: ['P250 | Sand Dune', 'Nova | Predator', 'FAMAS | Colony', 'MP7 | Forest DDPAT', 'SG 553 | Army Sheen', 'G3SG1 | Desert Storm'],
    jackpots: ['PP-Bizon | Urban Dashed', 'Glock-18 | Grinder', 'AK-47 | Slate']
  },
  // 3. 50c (500)
  {
    id: 'starter', name: '50¢ Budget Luck', tier: 'starter', price: 500,
    fillers: ['P250 | Sand Dune', 'Nova | Predator', 'FAMAS | Colony', 'MP7 | Forest DDPAT', 'SG 553 | Army Sheen', 'G3SG1 | Desert Storm', 'MAG-7 | Storm', 'Dual Berettas | Colony', 'MP9 | Storm'],
    jackpots: ['AUG | Sweeper', 'Glock-18 | Grinder', 'AK-47 | Slate', 'USP-S | Cortex']
  },
  // 4. 75c (750)
  {
    id: 'thrill_75c', name: '75¢ Thrill Rush', tier: 'starter', price: 750,
    fillers: ['Nova | Predator', 'FAMAS | Colony', 'MP7 | Forest DDPAT', 'SG 553 | Army Sheen', 'MAG-7 | Storm', 'MP9 | Storm', 'AUG | Sweeper', 'SSG 08 | Mainframe 001'],
    jackpots: ['Glock-18 | Grinder', 'AK-47 | Slate', 'USP-S | Cortex']
  },
  // 5. $1 (1,000)
  {
    id: 'starter_1usd', name: '$1 Starter Box', tier: 'bronze', price: 1000,
    fillers: ['FAMAS | Colony', 'MP7 | Forest DDPAT', 'SG 553 | Army Sheen', 'MAG-7 | Storm', 'MP9 | Storm', 'AUG | Sweeper', 'SSG 08 | Mainframe 001', 'Glock-18 | High Beam', 'Glock-18 | Grinder'],
    jackpots: ['UMP-45 | Urban DDPAT', 'AK-47 | Slate', 'AK-47 | Redline', '★ Gut Knife | Doppler']
  },
  // 6. $1.50 (1,500)
  {
    id: 'milspec_rain', name: '$1.50 Mil-Spec Rain', tier: 'bronze', price: 1500,
    fillers: ['MP9 | Storm', 'AUG | Sweeper', 'SSG 08 | Mainframe 001', 'Glock-18 | High Beam', 'Glock-18 | Grinder', 'Tec-9 | Bamboozle', 'UMP-45 | Urban DDPAT', 'MAC-10 | Silver'],
    jackpots: ['Five-SeveN | Case Hardened', 'AK-47 | Slate', 'USP-S | Cortex', 'M4A1-S | Cyrex']
  },
  // 7. $2 (2,000)
  {
    id: 'industrial_2usd', name: '$2 Industrial Drop', tier: 'bronze', price: 2000,
    fillers: ['SSG 08 | Mainframe 001', 'Glock-18 | High Beam', 'Glock-18 | Grinder', 'Tec-9 | Bamboozle', 'UMP-45 | Urban DDPAT', 'MAC-10 | Silver', 'Five-SeveN | Case Hardened', 'Desert Eagle | Mudder'],
    jackpots: ['MAC-10 | Curse', 'AK-47 | Slate', 'AK-47 | Redline', 'Desert Eagle | Code Red']
  },
  // 8. $2.50 (2,500)
  {
    id: 'bronze', name: 'Bronze Blitz', tier: 'bronze', price: 2500,
    fillers: ['Glock-18 | Grinder', 'Tec-9 | Bamboozle', 'UMP-45 | Urban DDPAT', 'MAC-10 | Silver', 'Five-SeveN | Case Hardened', 'Desert Eagle | Mudder', 'MAC-10 | Curse'],
    jackpots: ['AK-47 | Safari Mesh', 'AK-47 | Slate', 'USP-S | Cortex', 'AK-47 | Redline', '★ Shadow Daggers | Fade']
  },
  // 9. $3 (3,000)
  {
    id: 'danger_3usd', name: '$3 Danger Zone', tier: 'silver', price: 3000,
    fillers: ['UMP-45 | Urban DDPAT', 'MAC-10 | Silver', 'Five-SeveN | Case Hardened', 'Desert Eagle | Mudder', 'MAC-10 | Curse', 'AK-47 | Safari Mesh', 'P90 | Grim'],
    jackpots: ['Desert Eagle | Light Rail', 'AK-47 | Slate', 'AWP | Atheris']
  },
  // 10. $4 (4,000)
  {
    id: 'shadow_4usd', name: '$4 Shadow Case', tier: 'silver', price: 4000,
    fillers: ['Desert Eagle | Mudder', 'MAC-10 | Curse', 'AK-47 | Safari Mesh', 'P90 | Grim', 'Desert Eagle | Light Rail'],
    jackpots: ['M4A1-S | Night Terror', 'P250 | Valence', 'AK-47 | Slate', '★ Shadow Daggers | Fade']
  },
  // 11. $5 (5,000)
  {
    id: 'silver', name: 'Silver Storm', tier: 'silver', price: 5000,
    fillers: ['MAC-10 | Curse', 'AK-47 | Safari Mesh', 'P90 | Grim', 'Desert Eagle | Light Rail', 'M4A1-S | Night Terror', 'P250 | Valence'],
    jackpots: ['AK-47 | Slate', 'USP-S | Cortex', 'M4A4 | Spider Lily', 'AK-47 | Redline', '★ Bowie Knife | Tiger Tooth']
  },
  // 12. $6 (6,000)
  {
    id: 'scout_6usd', name: '$6 Wildfire Scout', tier: 'silver', price: 6000,
    fillers: ['AK-47 | Safari Mesh', 'Desert Eagle | Light Rail', 'M4A1-S | Night Terror', 'P250 | Valence', 'MAC-10 | Sakkaku'],
    jackpots: ['AK-47 | Slate', 'AWP | Atheris', 'AWP | Neo-Noir', 'AWP | Wildfire']
  },
  // 13. $7.50 (7,500)
  {
    id: 'smg_frenzy', name: '$7.50 SMG Frenzy', tier: 'silver', price: 7500,
    fillers: ['UMP-45 | Urban DDPAT', 'MAC-10 | Silver', 'MAC-10 | Curse', 'P90 | Grim', 'MAC-10 | Sakkaku'],
    jackpots: ['USP-S | Cortex', 'M4A1-S | Decimator', 'AK-47 | Redline', '★ Hydra Gloves | Emerald']
  },
  // 14. $8 (8,000)
  {
    id: 'music', name: 'CS2 Music Box', tier: 'platinum', price: 8000,
    fillers: ['Music Kit | ALRT, DOPAMINE HIT', 'Music Kit | bbno$, u mad!', 'Music Kit | Knock2, dashstar*', 'Music Kit | Denzel Curry, ULTIMATE'],
    jackpots: ['Music Kit | AWOLNATION, I Am', 'Music Kit | Mord Fustang, Diamonds', 'Music Kit | The Verkkars, EZ4ENCE', 'Music Kit | The Verkkars & n0thing, Flashbang Dance']
  },
  // 15. $10 (10,000)
  {
    id: 'gold', name: 'Golden Rush', tier: 'gold', price: 10000,
    fillers: ['Desert Eagle | Light Rail', 'M4A1-S | Night Terror', 'P250 | Valence', 'MAC-10 | Sakkaku', 'AK-47 | Slate', 'USP-S | Cortex', 'Five-SeveN | Angry Mob'],
    jackpots: ['M4A4 | Spider Lily', 'AWP | Atheris', 'AK-47 | Redline', '★ Huntsman Knife | Lore']
  },
  // 16. $12 (12,000)
  {
    id: 'redline_12usd', name: '$12 Redline Vault', tier: 'gold', price: 12000,
    fillers: ['AK-47 | Safari Mesh', 'M4A1-S | Night Terror', 'MAC-10 | Sakkaku', 'AK-47 | Slate', 'USP-S | Cortex', 'M4A4 | Spider Lily'],
    jackpots: ['AWP | Atheris', 'AK-47 | Ice Coaled', 'AK-47 | Redline', 'AK-47 | Bloodsport', 'AK-47 | Fire Serpent']
  },
  // 17. $15 (15,000)
  {
    id: 'pistols', name: 'One Tap Pistols', tier: 'pistols', price: 15000,
    fillers: ['P250 | Sand Dune', 'Glock-18 | High Beam', 'Five-SeveN | Case Hardened', 'Desert Eagle | Light Rail', 'P250 | Valence', 'USP-S | Cortex', 'Five-SeveN | Angry Mob', 'Glock-18 | Water Elemental'],
    jackpots: ['Desert Eagle | Kumicho Dragon', 'Desert Eagle | Code Red', 'Desert Eagle | Printstream', 'USP-S | Kill Confirmed', 'Desert Eagle | Blaze', 'Glock-18 | Fade']
  },
  // 18. $18 (18,000)
  {
    id: 'heavy_18usd', name: '$18 Heavy Assault', tier: 'gold', price: 18000,
    fillers: ['MAG-7 | Storm', 'M249 | Contrast Spray', 'Nova | Predator', 'M4A4 | Spider Lily', 'AWP | Atheris', 'M4A4 | Cyber Security'],
    jackpots: ['AK-47 | Ice Coaled', 'AK-47 | Redline', 'AK-47 | Asiimov', 'AK-47 | The Empress']
  },
  // 19. $20 (20,000)
  {
    id: 'classified_20usd', name: '$20 Classified Royale', tier: 'platinum', price: 20000,
    fillers: ['P250 | Valence', 'AK-47 | Slate', 'USP-S | Cortex', 'Five-SeveN | Angry Mob', 'M4A4 | Spider Lily', 'AWP | Atheris', 'Glock-18 | Water Elemental', 'M4A4 | Cyber Security', 'AK-47 | Ice Coaled', 'M4A1-S | Decimator'],
    jackpots: ['AK-47 | Redline', 'M4A1-S | Cyrex', 'Desert Eagle | Kumicho Dragon', 'AWP | Neo-Noir', 'M4A4 | In Living Color']
  },
  // 20. $25 (25,000)
  {
    id: 'agents', name: 'Operation Agents', tier: 'elite', price: 25000,
    fillers: ['Ground Rebel  | Elite Crew', 'Osiris | Elite Crew', 'Operator | FBI SWAT', '3rd Commando Company | KSK', 'Seal Team 6 Soldier | NSWC SEAL', 'Michael Syfers  | FBI Sniper', 'The Elite Mr. Muhlik | Elite Crew'],
    jackpots: ['Special Agent Ava | FBI', 'Getaway Sally | The Professionals', 'Vypa Sista of the Revolution | Guerrilla Warfare', 'Sir Bloody Silent Darryl | The Professionals', 'Sir Bloody Darryl Royale | The Professionals']
  },
  // 21. $30 (30,000)
  {
    id: 'stickers', name: 'Sticker Capsule', tier: 'diamond', price: 30000,
    fillers: ['Sticker | High Heat', 'Sticker | sdy (Holo) | Paris 2023', 'Sticker | Apeks (Glitter) | Copenhagen 2024', 'Sticker | Liquid (Holo) | 2020 RMR', 'Sticker | Boom (Gold) | 2020 RMR', 'Sticker | Rare Atom (Holo) | Shanghai 2024'],
    jackpots: ['Sticker | 3DMAX | Katowice 2014', 'Sticker | LGB eSports | Katowice 2014', 'Sticker | Fnatic | Katowice 2014', 'Sticker | HellRaisers | Katowice 2014', 'Sticker | Vox Eminor | Katowice 2014', 'Sticker | Fnatic (Holo) | Katowice 2014']
  },
  // 22. $35 (35,000)
  {
    id: 'ak47', name: 'AK-47 Legends', tier: 'ak47', price: 35000,
    fillers: ['AK-47 | Safari Mesh', 'AK-47 | Slate', 'AK-47 | Ice Coaled', 'AK-47 | Redline'],
    jackpots: ['AK-47 | Frontside Misty', 'AK-47 | Legion of Anubis', 'AK-47 | Asiimov', 'AK-47 | The Empress', 'AK-47 | Bloodsport', 'AK-47 | Fuel Injector', 'AK-47 | Vulcan', 'AK-47 | Fire Serpent', 'AK-47 | Wild Lotus']
  },
  // 23. $40 (40,000)
  {
    id: 'howl', name: 'M4 King Vault', tier: 'howl', price: 40000,
    fillers: ['M4A1-S | Night Terror', 'M4A4 | Spider Lily', 'M4A4 | Cyber Security', 'M4A1-S | Decimator', 'M4A1-S | Cyrex'],
    jackpots: ['M4A4 | In Living Color', 'M4A1-S | Golden Coil', 'M4A4 | The Emperor', 'M4A1-S | Printstream', 'M4A1-S | Blue Phosphor', 'M4A4 | Eye of Horus', 'M4A4 | Howl']
  },
  // 24. $45 (45,000)
  {
    id: 'awp', name: 'AWP Sniper Elite', tier: 'awp', price: 45000,
    fillers: ['SSG 08 | Mainframe 001', 'AWP | Atheris', 'AWP | Neo-Noir', 'AWP | Chromatic Aberration'],
    jackpots: ['AWP | Hyper Beast', 'AWP | Asiimov', 'AWP | Wildfire', 'AWP | Containment Breach', 'AWP | Oni Taiji', 'AWP | Lightning Strike', 'AWP | Fade', 'AWP | Dragon Lore']
  },
  // 25. $45 (45,000)
  {
    id: 'anime', name: 'Anime & Waifu Collection', tier: 'platinum', price: 45000,
    fillers: ['MAC-10 | Sakkaku', 'Desert Eagle | Kumicho Dragon', 'AWP | Neo-Noir'],
    jackpots: ['M4A4 | In Living Color', 'M4A4 | Temukau', 'AWP | Oni Taiji', 'AUG | Akihabara Accept']
  },
  // 26. $50 (50,000)
  {
    id: 'diamond', name: 'Diamond Deck', tier: 'diamond', price: 50000,
    fillers: ['AK-47 | Slate', 'USP-S | Cortex', 'Five-SeveN | Angry Mob', 'M4A4 | Spider Lily', 'AWP | Atheris', 'AK-47 | Redline', 'M4A1-S | Cyrex', 'AWP | Neo-Noir', 'M4A4 | In Living Color'],
    jackpots: ['AK-47 | Asiimov', 'AWP | Hyper Beast', 'AK-47 | The Empress', 'USP-S | Kill Confirmed', '★ Navaja Knife | Crimson Web', '★ Gut Knife | Doppler']
  },
  // 27. $55 (55,000)
  {
    id: 'deagle', name: 'Desert Eagle Beast', tier: 'gold', price: 55000,
    fillers: ['Desert Eagle | Mudder', 'Desert Eagle | Light Rail', 'Desert Eagle | Kumicho Dragon'],
    jackpots: ['Desert Eagle | Code Red', 'Desert Eagle | Ocean Drive', 'Desert Eagle | Printstream', 'Desert Eagle | Blaze']
  },
  // 28. $60 (60,000)
  {
    id: 'emerald', name: 'Emerald Dynasty', tier: 'diamond', price: 60000,
    fillers: ['P250 | Valence', 'AK-47 | Ice Coaled', 'M4A1-S | Decimator', 'AK-47 | Frontside Misty', 'Desert Eagle | Code Red'],
    jackpots: ['★ Hydra Gloves | Emerald', 'M4A1-S | Blue Phosphor', 'AK-47 | Fire Serpent', 'AK-47 | Wild Lotus']
  },
  // 29. $65 (65,000)
  {
    id: 'crimson', name: 'Crimson Bloodline', tier: 'gold', price: 65000,
    fillers: ['FAMAS | Colony', 'AK-47 | Redline', 'M4A1-S | Cyrex', 'Desert Eagle | Code Red', 'AK-47 | Legion of Anubis'],
    jackpots: ['AK-47 | Bloodsport', '★ Navaja Knife | Crimson Web', '★ Moto Gloves | Blood Pressure', '★ Skeleton Knife | Crimson Web', '★ Specialist Gloves | Crimson Kimono']
  },
  // 30. $70 (70,000)
  {
    id: 'covert_vault', name: 'Covert Jackpot Vault', tier: 'gold', price: 70000,
    fillers: ['AK-47 | Redline', 'M4A1-S | Cyrex', 'AWP | Neo-Noir', 'M4A4 | In Living Color', 'Desert Eagle | Code Red', 'AK-47 | Legion of Anubis', 'AWP | Chromatic Aberration'],
    jackpots: ['AK-47 | Asiimov', 'AWP | Hyper Beast', 'AK-47 | The Empress', 'M4A4 | The Emperor', 'M4A1-S | Printstream', 'M4A4 | Howl']
  },
  // 31. $75 (75,000)
  {
    id: 'neon', name: 'Neon Cyberpunk', tier: 'diamond', price: 75000,
    fillers: ['M4A4 | Cyber Security', 'AK-47 | Ice Coaled', 'M4A1-S | Decimator', 'AWP | Neo-Noir', 'M4A4 | In Living Color', 'AWP | Chromatic Aberration', 'M4A1-S | Golden Coil'],
    jackpots: ['Desert Eagle | Ocean Drive', 'M4A1-S | Printstream', 'USP-S | Printstream', '★ Specialist Gloves | Fade']
  },
  // 32. $80 (80,000)
  {
    id: 'elite', name: 'Elite Empire', tier: 'elite', price: 80000,
    fillers: ['AK-47 | Redline', 'M4A1-S | Cyrex', 'AWP | Neo-Noir', 'M4A4 | In Living Color', 'Desert Eagle | Code Red', 'AK-47 | Legion of Anubis', 'M4A1-S | Golden Coil', 'AK-47 | Asiimov'],
    jackpots: ['Desert Eagle | Ocean Drive', 'AWP | Hyper Beast', 'AK-47 | The Empress', 'M4A4 | The Emperor', 'USP-S | Kill Confirmed', '★ Gut Knife | Doppler']
  },
  // 33. $90 (90,000)
  {
    id: 'heavy_artillery', name: 'Heavy Artillery', tier: 'gold', price: 90000,
    fillers: ['MAG-7 | Storm', 'M249 | Contrast Spray', 'Nova | Predator', 'M4A4 | Cyber Security', 'M4A4 | In Living Color', 'AK-47 | Asiimov', 'Desert Eagle | Ocean Drive', 'AWP | Hyper Beast'],
    jackpots: ['AK-47 | The Empress', 'M4A4 | The Emperor', 'AWP | Asiimov', 'AK-47 | Bloodsport', 'AWP | Oni Taiji']
  },
  // 34. $100 (100,000)
  {
    id: 'knife_arena', name: 'Knife Arena', tier: 'knife', price: 100000,
    fillers: ['AK-47 | Redline', 'M4A1-S | Cyrex', 'AWP | Neo-Noir', 'M4A4 | In Living Color', 'AK-47 | Asiimov', 'AWP | Hyper Beast', 'AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport'],
    jackpots: ['★ Navaja Knife | Crimson Web', '★ Gut Knife | Doppler', '★ Shadow Daggers | Fade', '★ Bowie Knife | Tiger Tooth', '★ Huntsman Knife | Lore', '★ Stiletto Knife | Doppler', '★ Talon Knife | Fade', '★ Butterfly Knife | Fade']
  },
  // 35. $120 (120,000)
  {
    id: 'gloves', name: 'Gloves Paradise', tier: 'gloves', price: 120000,
    fillers: ['AWP | Neo-Noir', 'AK-47 | Asiimov', 'AWP | Hyper Beast', 'AK-47 | The Empress', 'Desert Eagle | Printstream', 'M4A4 | The Emperor', 'AWP | Asiimov', 'AK-47 | Bloodsport'],
    jackpots: ['★ Hydra Gloves | Emerald', '★ Moto Gloves | Blood Pressure', '★ Sport Gloves | Big Game', '★ Specialist Gloves | Fade', '★ Hand Wraps | Cobalt Skulls', '★ Driver Gloves | King Snake', '★ Sport Gloves | Vice', '★ Sport Gloves | Pandora\'s Box']
  },
  // 36. $140 (140,000)
  {
    id: 'karambit', name: 'Karambit Kingdom', tier: 'knife', price: 140000,
    fillers: ['AK-47 | Asiimov', 'AWP | Hyper Beast', 'AK-47 | The Empress', 'M4A4 | The Emperor', 'AWP | Asiimov', 'AK-47 | Bloodsport', 'M4A4 | Temukau', 'USP-S | Printstream'],
    jackpots: ['★ Karambit | Tiger Tooth', '★ Karambit | Lore', '★ Karambit | Marble Fade', '★ Karambit | Doppler', '★ Karambit | Fade']
  },
  // 37. $160 (160,000)
  {
    id: 'doppler', name: 'Doppler Phases', tier: 'knife', price: 160000,
    fillers: ['M4A1-S | Decimator', 'AWP | Neo-Noir', 'AK-47 | Asiimov', 'AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport', 'M4A4 | Temukau', 'USP-S | Printstream'],
    jackpots: ['★ Gut Knife | Doppler', '★ Stiletto Knife | Doppler', '★ Karambit | Doppler']
  },
  // 38. $180 (180,000)
  {
    id: 'butterfly', name: 'Butterfly Dreams', tier: 'knife', price: 180000,
    fillers: ['AK-47 | Asiimov', 'AWP | Hyper Beast', 'AK-47 | The Empress', 'M4A4 | The Emperor', 'AWP | Asiimov', 'AK-47 | Bloodsport', 'M4A4 | Temukau', 'USP-S | Printstream', 'AWP | Wildfire'],
    jackpots: ['★ Bowie Knife | Tiger Tooth', '★ Huntsman Knife | Lore', '★ Butterfly Knife | Slaughter', '★ Butterfly Knife | Fade']
  },
  // 39. $200 (200,000)
  {
    id: 'm9_bayonet', name: 'M9 Bayonet Vault', tier: 'knife', price: 200000,
    fillers: ['AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport', 'USP-S | Printstream', 'AWP | Wildfire', 'USP-S | Kill Confirmed'],
    jackpots: ['★ Huntsman Knife | Lore', '★ M9 Bayonet | Marble Fade']
  },
  // 40. $225 (225,000)
  {
    id: 'legendary', name: 'Dragon Lore Vault', tier: 'legendary', price: 225000,
    fillers: ['AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport', 'USP-S | Printstream', 'AWP | Wildfire', 'USP-S | Kill Confirmed'],
    jackpots: ['AWP | Containment Breach', 'AWP | Lightning Strike', 'AWP | Fade', 'AWP | Medusa', 'AWP | Dragon Lore']
  },
  // 41. $250 (250,000)
  {
    id: 'skeleton', name: 'Skeleton Web', tier: 'knife', price: 250000,
    fillers: ['AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport', 'USP-S | Printstream', 'AWP | Wildfire', 'USP-S | Kill Confirmed'],
    jackpots: ['★ Skeleton Knife | Crimson Web', '★ Specialist Gloves | Crimson Kimono']
  },
  // 42. $300 (300,000)
  {
    id: 'vice_pandora', name: 'Vice & Pandora', tier: 'gloves', price: 300000,
    fillers: ['AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'AWP | Containment Breach', 'AK-47 | Fuel Injector', 'M4A1-S | Printstream'],
    jackpots: ['★ Sport Gloves | Big Game', '★ Specialist Gloves | Fade', '★ Sport Gloves | Vice', '★ Sport Gloves | Pandora\'s Box']
  },
  // 43. $350 (350,000)
  {
    id: 'talon', name: 'Talon Vortex', tier: 'knife', price: 350000,
    fillers: ['AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'AWP | Containment Breach', 'AK-47 | Fuel Injector', 'M4A1-S | Printstream'],
    jackpots: ['★ Huntsman Knife | Lore', '★ Talon Knife | Fade', '★ Butterfly Knife | Slaughter']
  },
  // 44. $400 (400,000)
  {
    id: 'volvix', name: 'CASE MYTHIC', tier: 'volvix', price: 400000,
    fillers: ['AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'AWP | Containment Breach', 'AK-47 | Fuel Injector', 'M4A1-S | Printstream', '★ Navaja Knife | Crimson Web', '★ Gut Knife | Doppler', '★ Bowie Knife | Tiger Tooth'],
    jackpots: ['★ Karambit | Doppler', 'AK-47 | Fire Serpent', '★ Butterfly Knife | Fade', '★ Sport Gloves | Pandora\'s Box', 'AK-47 | Gold Arabesque', 'M4A4 | Howl', 'AWP | Dragon Lore', 'AK-47 | Wild Lotus']
  },
  // 45. $450 (450,000)
  {
    id: 'blue_gem', name: 'Case Hardened Blue Gem', tier: 'legendary', price: 450000,
    fillers: ['Five-SeveN | Case Hardened', 'AK-47 | The Empress', 'M4A4 | The Emperor', 'AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'AK-47 | Fuel Injector', 'M4A1-S | Printstream', '★ Navaja Knife | Crimson Web', '★ Shadow Daggers | Fade', '★ Bowie Knife | Tiger Tooth'],
    jackpots: ['★ Karambit | Doppler', 'AK-47 | Fire Serpent', '★ Butterfly Knife | Fade']
  },
  // 46. $500 (500,000)
  {
    id: 'katowice_relics', name: 'Katowice 2014 Relics', tier: 'diamond', price: 500000,
    fillers: ['Sticker | High Heat', 'Sticker | 3DMAX | Katowice 2014', 'Sticker | LGB eSports | Katowice 2014', 'Sticker | Fnatic | Katowice 2014', 'Sticker | HellRaisers | Katowice 2014', 'Sticker | Vox Eminor | Katowice 2014'],
    jackpots: ['Sticker | Team Dignitas | Katowice 2014', 'Sticker | Natus Vincere | Katowice 2014', 'Sticker | ESL Skull (Foil) | Katowice 2014', 'Sticker | Fnatic (Holo) | Katowice 2014']
  },
  // 47. $600 (600,000)
  {
    id: 'fade_master', name: 'Fade Collection Master', tier: 'legendary', price: 600000,
    fillers: ['AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'M4A1-S | Printstream', '★ Navaja Knife | Crimson Web', '★ Shadow Daggers | Fade', '★ Bowie Knife | Tiger Tooth', '★ Huntsman Knife | Lore', '★ Specialist Gloves | Fade'],
    jackpots: ['★ Talon Knife | Fade', 'AWP | Fade', 'Glock-18 | Fade', '★ Karambit | Fade', '★ Butterfly Knife | Fade']
  },
  // 48. $700 (700,000)
  {
    id: 'godlike_armory', name: 'Godlike Armory', tier: 'volvix', price: 700000,
    fillers: ['AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'AK-47 | Fuel Injector', 'M4A1-S | Printstream', 'AWP | Oni Taiji', '★ Gut Knife | Doppler', '★ Shadow Daggers | Fade', '★ Bowie Knife | Tiger Tooth', '★ Huntsman Knife | Lore', '★ Specialist Gloves | Fade', '★ Stiletto Knife | Doppler'],
    jackpots: ['M4A1-S | Blue Phosphor', 'M4A1-S | Hot Rod', 'AK-47 | Vulcan', 'M4A4 | Eye of Horus', 'M4A1-S | Knight', 'AK-47 | Fire Serpent', '★ Sport Gloves | Vice', 'M4A4 | Howl']
  },
  // 49. $750 (750,000)
  {
    id: 'sovereign_diamond', name: 'Sovereign Diamond', tier: 'volvix', price: 750000,
    fillers: ['AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'AK-47 | Fuel Injector', 'M4A1-S | Printstream', 'AWP | Oni Taiji', '★ Gut Knife | Doppler', '★ Shadow Daggers | Fade', '★ Bowie Knife | Tiger Tooth', '★ Huntsman Knife | Lore', '★ Specialist Gloves | Fade', '★ Stiletto Knife | Doppler', '★ Hand Wraps | Cobalt Skulls'],
    jackpots: ['M4A1-S | Blue Phosphor', 'AWP | Lightning Strike', 'Desert Eagle | Blaze', 'M4A1-S | Hot Rod', 'AK-47 | Vulcan', 'M4A4 | Eye of Horus', 'AWP | Fade', '★ Karambit | Lore', 'M4A1-S | Knight', 'AK-47 | Fire Serpent', 'AWP | Dragon Lore', 'AK-47 | Wild Lotus']
  },
  // 50. $850 (850,000)
  {
    id: 'kingpin_vault', name: 'Kingpin Vault', tier: 'volvix', price: 850000,
    fillers: ['AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'AK-47 | Fuel Injector', 'M4A1-S | Printstream', 'AWP | Oni Taiji', '★ Gut Knife | Doppler', '★ Shadow Daggers | Fade', '★ Bowie Knife | Tiger Tooth', '★ Huntsman Knife | Lore', '★ Specialist Gloves | Fade', '★ Stiletto Knife | Doppler', '★ Hand Wraps | Cobalt Skulls', 'M4A1-S | Blue Phosphor', 'AWP | Lightning Strike', 'Desert Eagle | Blaze'],
    jackpots: ['M4A1-S | Hot Rod', '★ Talon Knife | Fade', 'AK-47 | Vulcan', 'M4A4 | Eye of Horus', 'AWP | Fade', '★ Karambit | Lore', '★ M9 Bayonet | Marble Fade', 'M4A1-S | Knight', 'AK-47 | Fire Serpent', '★ Sport Gloves | Vice', 'M4A4 | Howl', 'AWP | Dragon Lore', 'AK-47 | Wild Lotus']
  },
  // 51. $900 (900,000)
  {
    id: 'infinity_secret', name: 'Infinity Secret', tier: 'volvix', price: 900000,
    fillers: ['AK-47 | Bloodsport', 'USP-S | Kill Confirmed', 'AK-47 | Fuel Injector', 'M4A1-S | Printstream', 'AWP | Oni Taiji', '★ Gut Knife | Doppler', '★ Shadow Daggers | Fade', '★ Bowie Knife | Tiger Tooth', '★ Huntsman Knife | Lore', '★ Specialist Gloves | Fade', '★ Stiletto Knife | Doppler', '★ Hand Wraps | Cobalt Skulls', 'M4A1-S | Blue Phosphor', 'AWP | Lightning Strike', 'Desert Eagle | Blaze', 'M4A1-S | Hot Rod'],
    jackpots: ['★ Talon Knife | Fade', 'AK-47 | Vulcan', 'M4A4 | Eye of Horus', '★ Karambit | Tiger Tooth', '★ Karambit | Lore', '★ Butterfly Knife | Slaughter', '★ Karambit | Doppler', 'AK-47 | Fire Serpent', '★ Butterfly Knife | Fade', '★ Sport Gloves | Vice', 'AK-47 | Gold Arabesque', 'M4A4 | Howl', 'AWP | Dragon Lore']
  },
  // 52. $1,000 (1,000,000) — CS2 OLYMPUS GRAIL 1M
  {
    id: 'olympus_1m', name: 'CS2 OLYMPUS GRAIL 1M', tier: 'volvix', price: 1000000,
    fillers: [
      'AK-47 | Bloodsport',
      'USP-S | Kill Confirmed',
      'AK-47 | Fuel Injector',
      'M4A1-S | Printstream',
      'AWP | Oni Taiji',
      '★ Gut Knife | Doppler',
      '★ Shadow Daggers | Fade',
      '★ Bowie Knife | Tiger Tooth',
      '★ Huntsman Knife | Lore',
      '★ Specialist Gloves | Fade',
      '★ Stiletto Knife | Doppler',
      '★ Hand Wraps | Cobalt Skulls',
      'M4A1-S | Blue Phosphor',
      'AWP | Lightning Strike',
      'Desert Eagle | Blaze',
      'M4A1-S | Hot Rod',
      '★ Talon Knife | Fade',
      'AK-47 | Vulcan',
      'M4A4 | Eye of Horus',
      '★ Driver Gloves | King Snake'
    ],
    jackpots: [
      'AWP | Fade',
      '★ Karambit | Tiger Tooth',
      '★ Karambit | Lore',
      '★ Butterfly Knife | Slaughter',
      '★ M9 Bayonet | Marble Fade',
      '★ Karambit | Doppler',
      'AK-47 | Fire Serpent',
      '★ Specialist Gloves | Crimson Kimono',
      '★ Sport Gloves | Vice',
      '★ Butterfly Knife | Fade',
      '★ Sport Gloves | Pandora\'s Box',
      'AK-47 | Gold Arabesque',
      'M4A4 | Howl',
      'AWP | Gungnir',
      'AWP | Dragon Lore',
      'AK-47 | Wild Lotus'
    ]
  }
];

const code = `// CDOW — CS2 Items & 52 Cases Catalog. MADE BY VOLVIX.
// Value in coins: 1,000 coins = $1.00 USD (Max case price: 1,000,000 coins = $1,000.00).

const RARITY = ${JSON.stringify(RARITY, null, 2)};

let _id = 0;
const I = (name, weapon, rarity, value) => ({ id: 'it' + (++_id), name, weapon, rarity, value });

const ITEMS = [
${ITEMS.map(i => `  I(${JSON.stringify(i.name)}, ${JSON.stringify(i.weapon)}, ${JSON.stringify(i.rarity)}, ${i.value}),`).join('\n')}
];

// Attach real Steam image URLs
const skinImages = require('./skin-images.json');
let mappedCount = 0;
ITEMS.forEach(it => {
  if (skinImages[it.name]) {
    it.img = skinImages[it.name];
    mappedCount++;
  }
});
console.log(\`[catalog] real skin images loaded: \${mappedCount}/\${ITEMS.length}\`);

const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const byName = Object.fromEntries(ITEMS.map(i => [i.name, i]));
const getItemId = name => (byName[name] && byName[name].id) || ITEMS[0].id;

// Safe Profit-Protecting Case Constructor
function createCase({ id, name, tier, price, fillers, jackpots }) {
  const allItemNames = [...fillers, ...jackpots];
  const items = allItemNames.map(getItemId);
  
  // Microscopic jackpot odds (0.00005% - 0.0001%) so winning over price is near-impossible
  const jackpotWeight = jackpots.length ? 0.0001 / jackpots.length : 0;
  const fillerTotalWeight = 1.0 - (jackpotWeight * jackpots.length);
  
  const w = [];
  const fCount = fillers.length;
  let sumF = 0;
  for (let i = 0; i < fCount; i++) sumF += (fCount - i);
  for (let i = 0; i < fCount; i++) {
    w.push(((fCount - i) / sumF) * fillerTotalWeight);
  }
  for (let i = 0; i < jackpots.length; i++) {
    w.push(jackpotWeight);
  }
  
  return { id, name, tier, price, items, w };
}

const RAW_CASES = ${JSON.stringify(CASE_DEFS, null, 2)};

const CASES = RAW_CASES.map(createCase);
CASES.forEach(c => {
  const sum = c.w.reduce((a, b) => a + b, 0);
  c.w = c.w.map(w => w / sum);
});

const CASES_BY_ID = Object.fromEntries(CASES.map(c => [c.id, c]));
const caseEV = c => c.items.reduce((s, id, i) => s + (byId[id] ? byId[id].value : 0) * c.w[i], 0);

module.exports = { RARITY, ITEMS, byId, byName, CASES, CASES_BY_ID, caseEV };
`;

fs.writeFileSync('./src/catalog.js', code, 'utf8');
console.log('Successfully generated clean, profitable 52-case catalog.js!');
