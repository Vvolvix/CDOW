// CDOW — CS2 Items & 52 Cases Catalog. MADE BY VOLVIX.
const RARITY = {
  "consumer": {
    "name": "Consumer",
    "color": "#b0c3d9",
    "w": 0
  },
  "industrial": {
    "name": "Industrial",
    "color": "#5e98d9",
    "w": 0
  },
  "milspec": {
    "name": "Mil-Spec",
    "color": "#4b69ff",
    "w": 1
  },
  "restricted": {
    "name": "Restricted",
    "color": "#8847ff",
    "w": 2
  },
  "classified": {
    "name": "Classified",
    "color": "#d32ce6",
    "w": 3
  },
  "covert": {
    "name": "Covert",
    "color": "#eb4b4b",
    "w": 4
  },
  "gold": {
    "name": "★ Rare Special",
    "color": "#ffd700",
    "w": 5
  }
};
const ITEMS = [
  {
    "id": "it1",
    "name": "P250 | Sand Dune",
    "weapon": "pistol",
    "rarity": "consumer",
    "value": 20
  },
  {
    "id": "it2",
    "name": "Nova | Predator",
    "weapon": "heavy",
    "rarity": "consumer",
    "value": 35
  },
  {
    "id": "it3",
    "name": "FAMAS | Colony",
    "weapon": "rifle",
    "rarity": "consumer",
    "value": 50
  },
  {
    "id": "it4",
    "name": "MP7 | Forest DDPAT",
    "weapon": "smg",
    "rarity": "consumer",
    "value": 65
  },
  {
    "id": "it5",
    "name": "SG 553 | Army Sheen",
    "weapon": "rifle",
    "rarity": "consumer",
    "value": 80
  },
  {
    "id": "it6",
    "name": "G3SG1 | Desert Storm",
    "weapon": "sniper",
    "rarity": "consumer",
    "value": 95
  },
  {
    "id": "it7",
    "name": "MAG-7 | Storm",
    "weapon": "heavy",
    "rarity": "consumer",
    "value": 120
  },
  {
    "id": "it8",
    "name": "PP-Bizon | Urban Dashed",
    "weapon": "smg",
    "rarity": "consumer",
    "value": 150
  },
  {
    "id": "it9",
    "name": "M249 | Contrast Spray",
    "weapon": "heavy",
    "rarity": "consumer",
    "value": 180
  },
  {
    "id": "it10",
    "name": "Galil AR | Sage Spray",
    "weapon": "rifle",
    "rarity": "consumer",
    "value": 210
  },
  {
    "id": "it11",
    "name": "Dual Berettas | Colony",
    "weapon": "pistol",
    "rarity": "consumer",
    "value": 240
  },
  {
    "id": "it12",
    "name": "MP9 | Storm",
    "weapon": "smg",
    "rarity": "industrial",
    "value": 280
  },
  {
    "id": "it13",
    "name": "AUG | Sweeper",
    "weapon": "rifle",
    "rarity": "industrial",
    "value": 350
  },
  {
    "id": "it14",
    "name": "SSG 08 | Mainframe 001",
    "weapon": "sniper",
    "rarity": "industrial",
    "value": 450
  },
  {
    "id": "it15",
    "name": "Glock-18 | High Beam",
    "weapon": "pistol",
    "rarity": "industrial",
    "value": 550
  },
  {
    "id": "it16",
    "name": "Glock-18 | Grinder",
    "weapon": "pistol",
    "rarity": "industrial",
    "value": 750
  },
  {
    "id": "it17",
    "name": "Tec-9 | Bamboozle",
    "weapon": "pistol",
    "rarity": "industrial",
    "value": 880
  },
  {
    "id": "it18",
    "name": "UMP-45 | Urban DDPAT",
    "weapon": "smg",
    "rarity": "milspec",
    "value": 1200
  },
  {
    "id": "it19",
    "name": "MAC-10 | Silver",
    "weapon": "smg",
    "rarity": "industrial",
    "value": 1400
  },
  {
    "id": "it20",
    "name": "Five-SeveN | Case Hardened",
    "weapon": "pistol",
    "rarity": "industrial",
    "value": 1600
  },
  {
    "id": "it21",
    "name": "Desert Eagle | Mudder",
    "weapon": "pistol",
    "rarity": "industrial",
    "value": 1800
  },
  {
    "id": "it22",
    "name": "MAC-10 | Curse",
    "weapon": "smg",
    "rarity": "milspec",
    "value": 2200
  },
  {
    "id": "it23",
    "name": "AK-47 | Safari Mesh",
    "weapon": "rifle",
    "rarity": "milspec",
    "value": 2500
  },
  {
    "id": "it24",
    "name": "P90 | Grim",
    "weapon": "smg",
    "rarity": "milspec",
    "value": 2800
  },
  {
    "id": "it25",
    "name": "Desert Eagle | Light Rail",
    "weapon": "pistol",
    "rarity": "milspec",
    "value": 3500
  },
  {
    "id": "it26",
    "name": "M4A1-S | Night Terror",
    "weapon": "rifle",
    "rarity": "milspec",
    "value": 4200
  },
  {
    "id": "it27",
    "name": "P250 | Valence",
    "weapon": "pistol",
    "rarity": "milspec",
    "value": 4800
  },
  {
    "id": "it28",
    "name": "Music Kit | ALRT, DOPAMINE HIT",
    "weapon": "music",
    "rarity": "milspec",
    "value": 3500
  },
  {
    "id": "it29",
    "name": "Music Kit | bbno$, u mad!",
    "weapon": "music",
    "rarity": "milspec",
    "value": 4800
  },
  {
    "id": "it30",
    "name": "Music Kit | Knock2, dashstar*",
    "weapon": "music",
    "rarity": "milspec",
    "value": 5500
  },
  {
    "id": "it31",
    "name": "Music Kit | Denzel Curry, ULTIMATE",
    "weapon": "music",
    "rarity": "milspec",
    "value": 6500
  },
  {
    "id": "it32",
    "name": "Music Kit | AWOLNATION, I Am",
    "weapon": "music",
    "rarity": "milspec",
    "value": 8500
  },
  {
    "id": "it33",
    "name": "Music Kit | Mord Fustang, Diamonds",
    "weapon": "music",
    "rarity": "milspec",
    "value": 9500
  },
  {
    "id": "it34",
    "name": "Music Kit | The Verkkars, EZ4ENCE",
    "weapon": "music",
    "rarity": "restricted",
    "value": 12500
  },
  {
    "id": "it35",
    "name": "Music Kit | The Verkkars & n0thing, Flashbang Dance",
    "weapon": "music",
    "rarity": "restricted",
    "value": 14000
  },
  {
    "id": "it36",
    "name": "Sticker | High Heat",
    "weapon": "sticker",
    "rarity": "restricted",
    "value": 1500
  },
  {
    "id": "it37",
    "name": "Sticker | sdy (Holo) | Paris 2023",
    "weapon": "sticker",
    "rarity": "restricted",
    "value": 3200
  },
  {
    "id": "it38",
    "name": "Sticker | Apeks (Glitter) | Copenhagen 2024",
    "weapon": "sticker",
    "rarity": "restricted",
    "value": 4500
  },
  {
    "id": "it39",
    "name": "Sticker | Liquid (Holo) | 2020 RMR",
    "weapon": "sticker",
    "rarity": "classified",
    "value": 8500
  },
  {
    "id": "it40",
    "name": "Sticker | Boom (Gold) | 2020 RMR",
    "weapon": "sticker",
    "rarity": "covert",
    "value": 18000
  },
  {
    "id": "it41",
    "name": "Sticker | Rare Atom (Holo) | Shanghai 2024",
    "weapon": "sticker",
    "rarity": "classified",
    "value": 22000
  },
  {
    "id": "it42",
    "name": "Sticker | 3DMAX | Katowice 2014",
    "weapon": "sticker",
    "rarity": "classified",
    "value": 85000
  },
  {
    "id": "it43",
    "name": "Sticker | LGB eSports | Katowice 2014",
    "weapon": "sticker",
    "rarity": "classified",
    "value": 140000
  },
  {
    "id": "it44",
    "name": "Sticker | Fnatic | Katowice 2014",
    "weapon": "sticker",
    "rarity": "classified",
    "value": 180000
  },
  {
    "id": "it45",
    "name": "Sticker | HellRaisers | Katowice 2014",
    "weapon": "sticker",
    "rarity": "classified",
    "value": 250000
  },
  {
    "id": "it46",
    "name": "Sticker | Vox Eminor | Katowice 2014",
    "weapon": "sticker",
    "rarity": "classified",
    "value": 450000
  },
  {
    "id": "it47",
    "name": "Sticker | Team Dignitas | Katowice 2014",
    "weapon": "sticker",
    "rarity": "classified",
    "value": 650000
  },
  {
    "id": "it48",
    "name": "Sticker | Natus Vincere | Katowice 2014",
    "weapon": "sticker",
    "rarity": "covert",
    "value": 950000
  },
  {
    "id": "it49",
    "name": "Sticker | ESL Wolf (Foil) | Katowice 2014",
    "weapon": "sticker",
    "rarity": "covert",
    "value": 1200000
  },
  {
    "id": "it50",
    "name": "Sticker | ESL Skull (Foil) | Katowice 2014",
    "weapon": "sticker",
    "rarity": "covert",
    "value": 1500000
  },
  {
    "id": "it51",
    "name": "Sticker | Fnatic (Holo) | Katowice 2014",
    "weapon": "sticker",
    "rarity": "gold",
    "value": 3200000
  },
  {
    "id": "it52",
    "name": "Ground Rebel  | Elite Crew",
    "weapon": "agent",
    "rarity": "milspec",
    "value": 5500
  },
  {
    "id": "it53",
    "name": "Osiris | Elite Crew",
    "weapon": "agent",
    "rarity": "milspec",
    "value": 6500
  },
  {
    "id": "it54",
    "name": "Operator | FBI SWAT",
    "weapon": "agent",
    "rarity": "milspec",
    "value": 7500
  },
  {
    "id": "it55",
    "name": "3rd Commando Company | KSK",
    "weapon": "agent",
    "rarity": "restricted",
    "value": 12000
  },
  {
    "id": "it56",
    "name": "Seal Team 6 Soldier | NSWC SEAL",
    "weapon": "agent",
    "rarity": "restricted",
    "value": 14500
  },
  {
    "id": "it57",
    "name": "Michael Syfers  | FBI Sniper",
    "weapon": "agent",
    "rarity": "restricted",
    "value": 16500
  },
  {
    "id": "it58",
    "name": "The Elite Mr. Muhlik | Elite Crew",
    "weapon": "agent",
    "rarity": "classified",
    "value": 22000
  },
  {
    "id": "it59",
    "name": "Special Agent Ava | FBI",
    "weapon": "agent",
    "rarity": "classified",
    "value": 28000
  },
  {
    "id": "it60",
    "name": "Getaway Sally | The Professionals",
    "weapon": "agent",
    "rarity": "classified",
    "value": 34000
  },
  {
    "id": "it61",
    "name": "Vypa Sista of the Revolution | Guerrilla Warfare",
    "weapon": "agent",
    "rarity": "covert",
    "value": 42000
  },
  {
    "id": "it62",
    "name": "Sir Bloody Loudmouth Darryl | The Professionals",
    "weapon": "agent",
    "rarity": "covert",
    "value": 48000
  },
  {
    "id": "it63",
    "name": "Sir Bloody Miami Darryl | The Professionals",
    "weapon": "agent",
    "rarity": "covert",
    "value": 55000
  },
  {
    "id": "it64",
    "name": "Sir Bloody Silent Darryl | The Professionals",
    "weapon": "agent",
    "rarity": "covert",
    "value": 62000
  },
  {
    "id": "it65",
    "name": "Cmdr. Mae 'Dead Cold' Jamison | SWAT",
    "weapon": "agent",
    "rarity": "covert",
    "value": 68000
  },
  {
    "id": "it66",
    "name": "Cmdr. Davida 'Goggles' Fernandez | SEAL Frogman",
    "weapon": "agent",
    "rarity": "covert",
    "value": 75000
  },
  {
    "id": "it67",
    "name": "'The Doctor' Romanov | Sabre",
    "weapon": "agent",
    "rarity": "covert",
    "value": 85000
  },
  {
    "id": "it68",
    "name": "Sir Bloody Skullhead Darryl | The Professionals",
    "weapon": "agent",
    "rarity": "covert",
    "value": 95000
  },
  {
    "id": "it69",
    "name": "Cmdr. Frank 'Wet Sox' Baroud | SEAL Frogman",
    "weapon": "agent",
    "rarity": "covert",
    "value": 110000
  },
  {
    "id": "it70",
    "name": "Sir Bloody Darryl Royale | The Professionals",
    "weapon": "agent",
    "rarity": "covert",
    "value": 135000
  },
  {
    "id": "it71",
    "name": "MAC-10 | Sakkaku",
    "weapon": "smg",
    "rarity": "restricted",
    "value": 5500
  },
  {
    "id": "it72",
    "name": "AK-47 | Slate",
    "weapon": "rifle",
    "rarity": "restricted",
    "value": 6500
  },
  {
    "id": "it73",
    "name": "USP-S | Cortex",
    "weapon": "pistol",
    "rarity": "restricted",
    "value": 8500
  },
  {
    "id": "it74",
    "name": "Five-SeveN | Angry Mob",
    "weapon": "pistol",
    "rarity": "restricted",
    "value": 9500
  },
  {
    "id": "it75",
    "name": "M4A4 | Spider Lily",
    "weapon": "rifle",
    "rarity": "restricted",
    "value": 11000
  },
  {
    "id": "it76",
    "name": "AWP | Atheris",
    "weapon": "sniper",
    "rarity": "restricted",
    "value": 12500
  },
  {
    "id": "it77",
    "name": "Glock-18 | Water Elemental",
    "weapon": "pistol",
    "rarity": "restricted",
    "value": 14000
  },
  {
    "id": "it78",
    "name": "M4A4 | Cyber Security",
    "weapon": "rifle",
    "rarity": "restricted",
    "value": 16000
  },
  {
    "id": "it79",
    "name": "AK-47 | Ice Coaled",
    "weapon": "rifle",
    "rarity": "restricted",
    "value": 18000
  },
  {
    "id": "it80",
    "name": "M4A1-S | Decimator",
    "weapon": "rifle",
    "rarity": "restricted",
    "value": 19500
  },
  {
    "id": "it81",
    "name": "AK-47 | Redline",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 25000
  },
  {
    "id": "it82",
    "name": "M4A1-S | Cyrex",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 28000
  },
  {
    "id": "it83",
    "name": "Desert Eagle | Kumicho Dragon",
    "weapon": "pistol",
    "rarity": "classified",
    "value": 34000
  },
  {
    "id": "it84",
    "name": "AK-47 | Frontside Misty",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 38000
  },
  {
    "id": "it85",
    "name": "AWP | Neo-Noir",
    "weapon": "sniper",
    "rarity": "classified",
    "value": 42000
  },
  {
    "id": "it86",
    "name": "M4A4 | In Living Color",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 45000
  },
  {
    "id": "it87",
    "name": "USP-S | Monster Mashup",
    "weapon": "pistol",
    "rarity": "classified",
    "value": 48000
  },
  {
    "id": "it88",
    "name": "Desert Eagle | Code Red",
    "weapon": "pistol",
    "rarity": "classified",
    "value": 55000
  },
  {
    "id": "it89",
    "name": "AK-47 | Legion of Anubis",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 62000
  },
  {
    "id": "it90",
    "name": "AWP | Chromatic Aberration",
    "weapon": "sniper",
    "rarity": "classified",
    "value": 68000
  },
  {
    "id": "it91",
    "name": "M4A1-S | Golden Coil",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 72000
  },
  {
    "id": "it92",
    "name": "AK-47 | Asiimov",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 75000
  },
  {
    "id": "it93",
    "name": "Desert Eagle | Ocean Drive",
    "weapon": "pistol",
    "rarity": "covert",
    "value": 85000
  },
  {
    "id": "it94",
    "name": "AWP | Hyper Beast",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 88000
  },
  {
    "id": "it95",
    "name": "AK-47 | The Empress",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 95000
  },
  {
    "id": "it96",
    "name": "Desert Eagle | Printstream",
    "weapon": "pistol",
    "rarity": "covert",
    "value": 110000
  },
  {
    "id": "it97",
    "name": "M4A4 | The Emperor",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 130000
  },
  {
    "id": "it98",
    "name": "AWP | Asiimov",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 135000
  },
  {
    "id": "it99",
    "name": "AK-47 | Bloodsport",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 140000
  },
  {
    "id": "it100",
    "name": "M4A4 | Temukau",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 145000
  },
  {
    "id": "it101",
    "name": "USP-S | Printstream",
    "weapon": "pistol",
    "rarity": "covert",
    "value": 145000
  },
  {
    "id": "it102",
    "name": "AWP | Wildfire",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 160000
  },
  {
    "id": "it103",
    "name": "USP-S | Kill Confirmed",
    "weapon": "pistol",
    "rarity": "covert",
    "value": 190000
  },
  {
    "id": "it104",
    "name": "AWP | Containment Breach",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 260000
  },
  {
    "id": "it105",
    "name": "AK-47 | Fuel Injector",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 280000
  },
  {
    "id": "it106",
    "name": "M4A1-S | Printstream",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 290000
  },
  {
    "id": "it107",
    "name": "AWP | Oni Taiji",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 480000
  },
  {
    "id": "it108",
    "name": "★ Navaja Knife | Crimson Web",
    "weapon": "knife",
    "rarity": "gold",
    "value": 110000
  },
  {
    "id": "it109",
    "name": "★ Hydra Gloves | Emerald",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 140000
  },
  {
    "id": "it110",
    "name": "★ Gut Knife | Doppler",
    "weapon": "knife",
    "rarity": "gold",
    "value": 160000
  },
  {
    "id": "it111",
    "name": "★ Shadow Daggers | Fade",
    "weapon": "knife",
    "rarity": "gold",
    "value": 190000
  },
  {
    "id": "it112",
    "name": "★ Bowie Knife | Tiger Tooth",
    "weapon": "knife",
    "rarity": "gold",
    "value": 240000
  },
  {
    "id": "it113",
    "name": "★ Moto Gloves | Blood Pressure",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 260000
  },
  {
    "id": "it114",
    "name": "★ Huntsman Knife | Lore",
    "weapon": "knife",
    "rarity": "gold",
    "value": 320000
  },
  {
    "id": "it115",
    "name": "★ Sport Gloves | Big Game",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 380000
  },
  {
    "id": "it116",
    "name": "★ Specialist Gloves | Fade",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 550000
  },
  {
    "id": "it117",
    "name": "★ Stiletto Knife | Doppler",
    "weapon": "knife",
    "rarity": "gold",
    "value": 650000
  },
  {
    "id": "it118",
    "name": "★ Hand Wraps | Cobalt Skulls",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 650000
  },
  {
    "id": "it119",
    "name": "M4A1-S | Blue Phosphor",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 720000
  },
  {
    "id": "it120",
    "name": "AWP | Lightning Strike",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 750000
  },
  {
    "id": "it121",
    "name": "Desert Eagle | Blaze",
    "weapon": "pistol",
    "rarity": "restricted",
    "value": 780000
  },
  {
    "id": "it122",
    "name": "M4A1-S | Hot Rod",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 850000
  },
  {
    "id": "it123",
    "name": "★ Talon Knife | Fade",
    "weapon": "knife",
    "rarity": "gold",
    "value": 880000
  },
  {
    "id": "it124",
    "name": "AK-47 | Vulcan",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 950000
  },
  {
    "id": "it125",
    "name": "★ Skeleton Knife | Crimson Web",
    "weapon": "knife",
    "rarity": "gold",
    "value": 950000
  },
  {
    "id": "it126",
    "name": "M4A4 | Eye of Horus",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 950000
  },
  {
    "id": "it127",
    "name": "★ Driver Gloves | King Snake",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 980000
  },
  {
    "id": "it128",
    "name": "AWP | Fade",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 1100000
  },
  {
    "id": "it129",
    "name": "★ Karambit | Tiger Tooth",
    "weapon": "knife",
    "rarity": "gold",
    "value": 1150000
  },
  {
    "id": "it130",
    "name": "★ Karambit | Lore",
    "weapon": "knife",
    "rarity": "gold",
    "value": 1200000
  },
  {
    "id": "it131",
    "name": "M4A4 | Poseidon",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 1200000
  },
  {
    "id": "it132",
    "name": "M4A1-S | Imminent Danger",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 1300000
  },
  {
    "id": "it133",
    "name": "★ Butterfly Knife | Slaughter",
    "weapon": "knife",
    "rarity": "gold",
    "value": 1300000
  },
  {
    "id": "it134",
    "name": "★ M9 Bayonet | Marble Fade",
    "weapon": "knife",
    "rarity": "gold",
    "value": 1400000
  },
  {
    "id": "it135",
    "name": "★ Moto Gloves | Spearmint",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 1400000
  },
  {
    "id": "it136",
    "name": "★ Karambit | Marble Fade",
    "weapon": "knife",
    "rarity": "gold",
    "value": 1450000
  },
  {
    "id": "it137",
    "name": "M4A1-S | Knight",
    "weapon": "rifle",
    "rarity": "classified",
    "value": 1500000
  },
  {
    "id": "it138",
    "name": "Glock-18 | Fade",
    "weapon": "pistol",
    "rarity": "restricted",
    "value": 1600000
  },
  {
    "id": "it139",
    "name": "★ Karambit | Doppler",
    "weapon": "knife",
    "rarity": "gold",
    "value": 1650000
  },
  {
    "id": "it140",
    "name": "AK-47 | Fire Serpent",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 1800000
  },
  {
    "id": "it141",
    "name": "★ Specialist Gloves | Crimson Kimono",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 1900000
  },
  {
    "id": "it142",
    "name": "M4A1-S | Welcome to the Jungle",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 2100000
  },
  {
    "id": "it143",
    "name": "AWP | Medusa",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 2200000
  },
  {
    "id": "it144",
    "name": "AWP | Desert Hydra",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 2400000
  },
  {
    "id": "it145",
    "name": "★ Sport Gloves | Vice",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 2800000
  },
  {
    "id": "it146",
    "name": "AWP | The Prince",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 2900000
  },
  {
    "id": "it147",
    "name": "★ Karambit | Fade",
    "weapon": "knife",
    "rarity": "gold",
    "value": 3100000
  },
  {
    "id": "it148",
    "name": "★ Butterfly Knife | Fade",
    "weapon": "knife",
    "rarity": "gold",
    "value": 3400000
  },
  {
    "id": "it149",
    "name": "★ Sport Gloves | Pandora's Box",
    "weapon": "gloves",
    "rarity": "gold",
    "value": 3500000
  },
  {
    "id": "it150",
    "name": "AK-47 | Gold Arabesque",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 3500000
  },
  {
    "id": "it151",
    "name": "AUG | Akihabara Accept",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 4500000
  },
  {
    "id": "it152",
    "name": "M4A4 | Howl",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 6500000
  },
  {
    "id": "it153",
    "name": "AWP | Gungnir",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 8500000
  },
  {
    "id": "it154",
    "name": "AWP | Dragon Lore",
    "weapon": "sniper",
    "rarity": "covert",
    "value": 10000000
  },
  {
    "id": "it155",
    "name": "AK-47 | Wild Lotus",
    "weapon": "rifle",
    "rarity": "covert",
    "value": 12000000
  }
];
const byName = Object.fromEntries(ITEMS.map(it => [it.name, it]));
const byId = Object.fromEntries(ITEMS.map(it => [it.id, it]));
const CASES = [
  {
    "id": "dust_10c",
    "name": "10¢ Dust & Sand",
    "tier": "starter",
    "price": 100,
    "items": [
      "it1",
      "it2",
      "it4",
      "it5",
      "it6",
      "it7",
      "it8",
      "it9",
      "it10",
      "it11",
      "it12"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "quick_25c",
    "name": "25¢ Budget Luck",
    "tier": "starter",
    "price": 250,
    "items": [
      "it1",
      "it4",
      "it6",
      "it9",
      "it11",
      "it12",
      "it13",
      "it14",
      "it15",
      "it16",
      "it17"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "starter",
    "name": "50¢ Budget Luck",
    "tier": "starter",
    "price": 500,
    "items": [
      "it1",
      "it4",
      "it8",
      "it11",
      "it14",
      "it15",
      "it16",
      "it17",
      "it18",
      "it19",
      "it36"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "thrill_75c",
    "name": "75¢ Thrill Rush",
    "tier": "starter",
    "price": 750,
    "items": [
      "it1",
      "it5",
      "it8",
      "it12",
      "it15",
      "it16",
      "it17",
      "it18",
      "it19",
      "it36",
      "it20"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "starter_1usd",
    "name": "$1 Starter Box",
    "tier": "bronze",
    "price": 1000,
    "items": [
      "it1",
      "it5",
      "it9",
      "it13",
      "it17",
      "it18",
      "it19",
      "it36",
      "it20",
      "it21",
      "it22"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "milspec_rain",
    "name": "$1.50 Mil-Spec Rain",
    "tier": "bronze",
    "price": 1500,
    "items": [
      "it1",
      "it6",
      "it10",
      "it15",
      "it19",
      "it36",
      "it20",
      "it21",
      "it22",
      "it23",
      "it24"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "industrial_2usd",
    "name": "$2 Industrial Drop",
    "tier": "bronze",
    "price": 2000,
    "items": [
      "it1",
      "it6",
      "it12",
      "it17",
      "it21",
      "it22",
      "it23",
      "it24",
      "it37",
      "it25",
      "it28"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "bronze",
    "name": "Bronze Blitz",
    "tier": "bronze",
    "price": 2500,
    "items": [
      "it1",
      "it7",
      "it12",
      "it18",
      "it22",
      "it23",
      "it24",
      "it37",
      "it25",
      "it28",
      "it26"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "danger_3usd",
    "name": "$3 Danger Zone",
    "tier": "silver",
    "price": 3000,
    "items": [
      "it1",
      "it7",
      "it13",
      "it19",
      "it24",
      "it37",
      "it25",
      "it28",
      "it26",
      "it38",
      "it27"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "shadow_4usd",
    "name": "$4 Shadow Case",
    "tier": "silver",
    "price": 4000,
    "items": [
      "it1",
      "it8",
      "it15",
      "it20",
      "it28",
      "it26",
      "it38",
      "it27",
      "it29",
      "it30",
      "it52"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "silver",
    "name": "Silver Storm",
    "tier": "silver",
    "price": 5000,
    "items": [
      "it1",
      "it9",
      "it17",
      "it23",
      "it29",
      "it30",
      "it52",
      "it71",
      "it31",
      "it53",
      "it72"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "scout_6usd",
    "name": "$6 Wildfire Scout",
    "tier": "silver",
    "price": 6000,
    "items": [
      "it1",
      "it10",
      "it18",
      "it25",
      "it71",
      "it31",
      "it53",
      "it72",
      "it54",
      "it32",
      "it39"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "smg_frenzy",
    "name": "$7.50 SMG Frenzy",
    "tier": "silver",
    "price": 7500,
    "items": [
      "it1",
      "it10",
      "it36",
      "it26",
      "it72",
      "it54",
      "it32",
      "it39",
      "it73",
      "it33",
      "it74"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "music_8usd",
    "name": "CS2 Music Box",
    "tier": "silver",
    "price": 8000,
    "items": [
      "it1",
      "it11",
      "it36",
      "it38",
      "it54",
      "it32",
      "it39",
      "it73",
      "it33",
      "it74",
      "it75"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "gold",
    "name": "Golden Rush",
    "tier": "gold",
    "price": 10000,
    "items": [
      "it1",
      "it12",
      "it22",
      "it30",
      "it74",
      "it75",
      "it55",
      "it34",
      "it76",
      "it35",
      "it77"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "redline_12usd",
    "name": "$12 Redline Vault",
    "tier": "gold",
    "price": 12000,
    "items": [
      "it1",
      "it12",
      "it22",
      "it52",
      "it75",
      "it55",
      "it34",
      "it76",
      "it35",
      "it77",
      "it56"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "pistols",
    "name": "One Tap Pistols",
    "tier": "gold",
    "price": 15000,
    "items": [
      "it1",
      "it14",
      "it37",
      "it54",
      "it56",
      "it78",
      "it57",
      "it40",
      "it79",
      "it80",
      "it41"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "heavy_18usd",
    "name": "$18 Heavy Assault",
    "tier": "gold",
    "price": 18000,
    "items": [
      "it1",
      "it14",
      "it25",
      "it32",
      "it57",
      "it40",
      "it79",
      "it80",
      "it41",
      "it58",
      "it81"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "classified_20usd",
    "name": "$20 Classified Royale",
    "tier": "gold",
    "price": 20000,
    "items": [
      "it1",
      "it15",
      "it26",
      "it73",
      "it80",
      "it41",
      "it58",
      "it81",
      "it59",
      "it82",
      "it60"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "agents_25usd",
    "name": "Operation Agents",
    "tier": "gold",
    "price": 25000,
    "items": [
      "it1",
      "it15",
      "it38",
      "it74",
      "it58",
      "it81",
      "it59",
      "it82",
      "it60",
      "it83",
      "it84"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "stickers_30usd",
    "name": "Sticker Capsule",
    "tier": "gold",
    "price": 30000,
    "items": [
      "it1",
      "it16",
      "it27",
      "it55",
      "it82",
      "it60",
      "it83",
      "it84",
      "it61",
      "it85",
      "it86"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "ak47",
    "name": "AK-47 Legends",
    "tier": "gold",
    "price": 35000,
    "items": [
      "it1",
      "it17",
      "it29",
      "it76",
      "it83",
      "it84",
      "it61",
      "it85",
      "it86",
      "it62",
      "it87"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "m4_king",
    "name": "M4 King Vault",
    "tier": "diamond",
    "price": 40000,
    "items": [
      "it1",
      "it17",
      "it30",
      "it76",
      "it84",
      "it61",
      "it85",
      "it86",
      "it62",
      "it87",
      "it63"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "awp",
    "name": "AWP Sniper Elite",
    "tier": "diamond",
    "price": 45000,
    "items": [
      "it1",
      "it17",
      "it52",
      "it77",
      "it85",
      "it86",
      "it62",
      "it87",
      "it63",
      "it88",
      "it64"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "anime",
    "name": "Anime & Waifu Collection",
    "tier": "diamond",
    "price": 45000,
    "items": [
      "it1",
      "it17",
      "it52",
      "it77",
      "it85",
      "it86",
      "it62",
      "it87",
      "it63",
      "it88",
      "it64"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "diamond",
    "name": "Diamond Deck",
    "tier": "diamond",
    "price": 50000,
    "items": [
      "it1",
      "it18",
      "it71",
      "it78",
      "it87",
      "it63",
      "it88",
      "it64",
      "it89",
      "it65",
      "it90"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "deagle_beast",
    "name": "Desert Eagle Beast",
    "tier": "diamond",
    "price": 55000,
    "items": [
      "it1",
      "it18",
      "it71",
      "it78",
      "it87",
      "it63",
      "it88",
      "it64",
      "it89",
      "it65",
      "it90"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "emerald_dynasty",
    "name": "Emerald Dynasty",
    "tier": "diamond",
    "price": 60000,
    "items": [
      "it1",
      "it19",
      "it31",
      "it40",
      "it88",
      "it64",
      "it89",
      "it65",
      "it90",
      "it91",
      "it66"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "crimson_blood",
    "name": "Crimson Bloodline",
    "tier": "diamond",
    "price": 65000,
    "items": [
      "it1",
      "it19",
      "it53",
      "it79",
      "it89",
      "it65",
      "it90",
      "it91",
      "it66",
      "it92",
      "it42"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "covert_jackpot",
    "name": "Covert Jackpot Vault",
    "tier": "diamond",
    "price": 70000,
    "items": [
      "it1",
      "it36",
      "it72",
      "it41",
      "it90",
      "it91",
      "it66",
      "it92",
      "it42",
      "it67",
      "it93"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "cyberpunk_75usd",
    "name": "Neon Cyberpunk",
    "tier": "diamond",
    "price": 75000,
    "items": [
      "it1",
      "it36",
      "it54",
      "it41",
      "it91",
      "it66",
      "it92",
      "it42",
      "it67",
      "it93",
      "it94"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "elite_empire",
    "name": "Elite Empire",
    "tier": "diamond",
    "price": 80000,
    "items": [
      "it1",
      "it36",
      "it32",
      "it81",
      "it92",
      "it42",
      "it67",
      "it93",
      "it94",
      "it68",
      "it95"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "heavy_artillery",
    "name": "Heavy Artillery",
    "tier": "diamond",
    "price": 90000,
    "items": [
      "it1",
      "it20",
      "it73",
      "it60",
      "it94",
      "it68",
      "it95",
      "it69",
      "it96",
      "it108",
      "it97"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "knife",
    "name": "Knife Arena",
    "tier": "knife",
    "price": 100000,
    "items": [
      "it1",
      "it21",
      "it33",
      "it83",
      "it95",
      "it69",
      "it96",
      "it108",
      "it97",
      "it70",
      "it98"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "gloves",
    "name": "Gloves Paradise",
    "tier": "gloves",
    "price": 120000,
    "items": [
      "it1",
      "it22",
      "it74",
      "it85",
      "it108",
      "it97",
      "it70",
      "it98",
      "it43",
      "it99",
      "it109"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "karambit_kingdom",
    "name": "Karambit Kingdom",
    "tier": "knife",
    "price": 140000,
    "items": [
      "it1",
      "it22",
      "it55",
      "it62",
      "it98",
      "it43",
      "it99",
      "it109",
      "it100",
      "it101",
      "it102"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "doppler_phases",
    "name": "Doppler Phases",
    "tier": "knife",
    "price": 160000,
    "items": [
      "it1",
      "it24",
      "it76",
      "it64",
      "it101",
      "it102",
      "it110",
      "it44",
      "it103",
      "it111",
      "it112"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "butterfly",
    "name": "Butterfly Dreams",
    "tier": "knife",
    "price": 180000,
    "items": [
      "it1",
      "it24",
      "it35",
      "it89",
      "it110",
      "it44",
      "it103",
      "it111",
      "it112",
      "it45",
      "it104"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "m9_bayonet",
    "name": "M9 Bayonet Vault",
    "tier": "knife",
    "price": 200000,
    "items": [
      "it1",
      "it37",
      "it56",
      "it90",
      "it111",
      "it112",
      "it45",
      "it104",
      "it113",
      "it105",
      "it106"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "dragon",
    "name": "Dragon Lore Vault",
    "tier": "dragon",
    "price": 225000,
    "items": [
      "it1",
      "it37",
      "it56",
      "it90",
      "it111",
      "it112",
      "it45",
      "it104",
      "it113",
      "it105",
      "it106"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "skeleton_web",
    "name": "Skeleton Web",
    "tier": "knife",
    "price": 250000,
    "items": [
      "it1",
      "it37",
      "it56",
      "it91",
      "it112",
      "it45",
      "it104",
      "it113",
      "it105",
      "it106",
      "it114"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "vice_pandora",
    "name": "Vice & Pandora",
    "tier": "gloves",
    "price": 300000,
    "items": [
      "it1",
      "it25",
      "it40",
      "it67",
      "it106",
      "it114",
      "it115",
      "it46",
      "it107",
      "it116",
      "it47"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "talon_vortex",
    "name": "Talon Vortex",
    "tier": "knife",
    "price": 350000,
    "items": [
      "it1",
      "it28",
      "it40",
      "it93",
      "it114",
      "it115",
      "it46",
      "it107",
      "it116",
      "it47",
      "it117"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "mythic",
    "name": "CASE MYTHIC",
    "tier": "mythic",
    "price": 400000,
    "items": [
      "it1",
      "it28",
      "it79",
      "it93",
      "it115",
      "it46",
      "it107",
      "it116",
      "it47",
      "it117",
      "it118"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "blue_gem",
    "name": "Case Hardened Blue Gem",
    "tier": "knife",
    "price": 450000,
    "items": [
      "it1",
      "it28",
      "it79",
      "it93",
      "it115",
      "it46",
      "it107",
      "it116",
      "it47",
      "it117",
      "it118"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "katowice_2014",
    "name": "Katowice 2014 Relics",
    "tier": "vip",
    "price": 500000,
    "items": [
      "it1",
      "it28",
      "it80",
      "it68",
      "it107",
      "it116",
      "it47",
      "it117",
      "it118",
      "it119",
      "it120"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "fade_master",
    "name": "Fade Collection Master",
    "tier": "vip",
    "price": 600000,
    "items": [
      "it1",
      "it26",
      "it80",
      "it95",
      "it116",
      "it47",
      "it117",
      "it118",
      "it119",
      "it120",
      "it121"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "godlike_armory",
    "name": "Godlike Armory",
    "tier": "vip",
    "price": 700000,
    "items": [
      "it1",
      "it26",
      "it58",
      "it96",
      "it118",
      "it119",
      "it120",
      "it121",
      "it122",
      "it123",
      "it48"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "sovereign_diamond",
    "name": "Sovereign Diamond",
    "tier": "vip",
    "price": 750000,
    "items": [
      "it1",
      "it38",
      "it58",
      "it108",
      "it119",
      "it120",
      "it121",
      "it122",
      "it123",
      "it48",
      "it124"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "kingpin_vault",
    "name": "Kingpin Vault",
    "tier": "vip",
    "price": 850000,
    "items": [
      "it1",
      "it38",
      "it81",
      "it97",
      "it121",
      "it122",
      "it123",
      "it48",
      "it124",
      "it125",
      "it126"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "infinity_secret",
    "name": "Infinity Secret",
    "tier": "vip",
    "price": 900000,
    "items": [
      "it1",
      "it27",
      "it59",
      "it98",
      "it123",
      "it48",
      "it124",
      "it125",
      "it126",
      "it127",
      "it128"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  },
  {
    "id": "volvix",
    "name": "CS2 OLYMPUS GRAIL 1M",
    "tier": "volvix",
    "price": 1000000,
    "items": [
      "it1",
      "it29",
      "it83",
      "it109",
      "it127",
      "it128",
      "it129",
      "it49",
      "it130",
      "it131",
      "it132"
    ],
    "w": [
      0.2600000000000001,
      0.2300000000000001,
      0.20000000000000007,
      0.16000000000000006,
      0.13500000000000006,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001,
      0.002500000000000001
    ]
  }
];
const CASES_BY_ID = Object.fromEntries(CASES.map(c => [c.id, c]));
const caseEV = c => c.items.reduce((s, id, i) => s + (byId[id] ? byId[id].value : 0) * c.w[i], 0);
module.exports = { RARITY, ITEMS, byId, byName, CASES, CASES_BY_ID, caseEV };
