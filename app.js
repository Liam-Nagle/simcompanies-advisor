'use strict';

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────────────────────────── */
const PROXY_URL  = 'https://simcompanies-advisor.onrender.com';
const BASE       = 'https://www.simcompanies.com';
const TTL        = 5 * 60 * 1000;
const ENCYC_TTL  = 6 * 60 * 60 * 1000;

/* ─────────────────────────────────────────────────────────────────────────────
   ENCYCLOPEDIA
   PROD: kind → { n:name, pph:producedPerHour, i:[{k:inputKind, a:amtPerOutput}] }
   BLDS: [{k:kind, n:name, w:wages/hr, c:category, o:[outputKinds]}]
   Recipes for items 55+ are estimates — core chain (1-54) is verified.
───────────────────────────────────────────────────────────────────────────── */
const PROD = {
  1:  {n:'Power',                  pph:2566.94, i:[]},
  2:  {n:'Water',                  pph:1626.43, i:[{k:1,a:0.2}]},
  3:  {n:'Apples',                 pph:202.19,  i:[{k:2,a:3},{k:66,a:1}]},
  4:  {n:'Oranges',                pph:186.01,  i:[{k:2,a:3},{k:66,a:1}]},
  5:  {n:'Grapes',                 pph:161.75,  i:[{k:2,a:4},{k:66,a:1}]},
  6:  {n:'Grain',                  pph:808.75,  i:[{k:2,a:0.5},{k:66,a:1}]},
  7:  {n:'Steak',                  pph:25.67,   i:[{k:115,a:0.125}]},
  8:  {n:'Sausages',               pph:77.01,   i:[{k:116,a:0.0625}]},
  9:  {n:'Eggs',                   pph:316.47,  i:[{k:2,a:0.4},{k:6,a:0.5}]},
  10: {n:'Crude Oil',              pph:41.52,   i:[{k:1,a:25}]},
  11: {n:'Petrol',                 pph:111.41,  i:[{k:1,a:15},{k:10,a:0.75},{k:73,a:0.25}]},
  12: {n:'Diesel',                 pph:115.13,  i:[{k:1,a:15},{k:10,a:0.75},{k:73,a:0.25}]},
  13: {n:'Transport',              pph:3173.95, i:[{k:12,a:0.005},{k:1,a:0.01}]},
  14: {n:'Minerals',               pph:119.23,  i:[{k:1,a:20},{k:2,a:1}]},
  15: {n:'Bauxite',                pph:96.52,   i:[{k:1,a:14},{k:2,a:0.5}]},
  16: {n:'Silicon',                pph:154.02,  i:[{k:1,a:3},{k:44,a:2}]},
  17: {n:'Chemicals',              pph:213.91,  i:[{k:1,a:0.2},{k:14,a:1}]},
  18: {n:'Aluminium',              pph:119.79,  i:[{k:1,a:15},{k:15,a:1}]},
  19: {n:'Plastic',                pph:204.25,  i:[{k:1,a:5},{k:10,a:0.2}]},
  20: {n:'Processors',             pph:9.18,    i:[{k:16,a:4},{k:17,a:1}]},
  21: {n:'Electronic Components',  pph:41.33,   i:[{k:16,a:3},{k:17,a:1}]},
  22: {n:'Batteries',              pph:25.26,   i:[{k:17,a:4}]},
  23: {n:'Displays',               pph:32.14,   i:[{k:16,a:5},{k:17,a:4}]},
  24: {n:'Smart Phones',           pph:11.48,   i:[{k:20,a:2},{k:21,a:1},{k:22,a:1},{k:23,a:1},{k:18,a:2}]},
  25: {n:'Tablets',                pph:11.48,   i:[{k:20,a:2},{k:21,a:1},{k:22,a:1},{k:23,a:2},{k:18,a:3}]},
  26: {n:'Laptops',                pph:9.18,    i:[{k:20,a:4},{k:21,a:3},{k:22,a:2},{k:23,a:2},{k:19,a:3}]},
  27: {n:'Monitors',               pph:18.37,   i:[{k:21,a:2},{k:23,a:3},{k:19,a:3}]},
  28: {n:'Televisions',            pph:16.07,   i:[{k:20,a:1},{k:21,a:4},{k:23,a:4},{k:19,a:5}]},
  29: {n:'Plant Research',         pph:4.78,    i:[]},
  30: {n:'Energy Research',        pph:3.30,    i:[]},
  31: {n:'Mining Research',        pph:3.00,    i:[]},
  32: {n:'Electronics Research',   pph:2.40,    i:[]},
  33: {n:'Breeding Research',      pph:3.85,    i:[]},
  34: {n:'Chemistry Research',     pph:4.71,    i:[]},
  35: {n:'Software',               pph:5.71,    i:[]},
  40: {n:'Cotton',                 pph:258.80,  i:[{k:2,a:4},{k:66,a:1}]},
  41: {n:'Fabric',                 pph:241.12,  i:[{k:1,a:15},{k:40,a:1}]},
  42: {n:'Iron Ore',               pph:181.69,  i:[{k:1,a:20},{k:2,a:1}]},
  43: {n:'Steel',                  pph:192.52,  i:[{k:1,a:10},{k:42,a:1}]},
  44: {n:'Sand',                   pph:1419.44, i:[{k:1,a:5}]},
  45: {n:'Glass',                  pph:128.35,  i:[{k:1,a:8},{k:44,a:1}]},
  46: {n:'Leather',                pph:30.14,   i:[{k:1,a:5},{k:115,a:0.25}]},
  47: {n:'On-board Computer',      pph:13.78,   i:[{k:20,a:2},{k:21,a:1}]},
  48: {n:'Electric Motor',         pph:30.78,   i:[{k:1,a:5},{k:21,a:2}]},
  49: {n:'Luxury Car Interior',    pph:19.93,   i:[{k:18,a:3},{k:23,a:2}]},
  50: {n:'Basic Interior',         pph:31.89,   i:[{k:19,a:2},{k:21,a:1}]},
  51: {n:'Car Body',               pph:23.92,   i:[{k:43,a:5},{k:18,a:2}]},
  52: {n:'Combustion Engine',      pph:5.60,    i:[{k:17,a:3},{k:43,a:2}]},
  53: {n:'Economy E-Car',          pph:19.93,   i:[{k:51,a:1},{k:50,a:1},{k:22,a:2}]},
  54: {n:'Luxury E-Car',           pph:3.99,    i:[{k:51,a:1},{k:49,a:1},{k:22,a:2}]},
  55: {n:'Economy Car',            pph:13.95,   i:[{k:51,a:1},{k:50,a:1},{k:52,a:1}]},
  56: {n:'Luxury Car',             pph:1.99,    i:[{k:51,a:1},{k:49,a:1},{k:52,a:1}]},
  57: {n:'Truck',                  pph:4.78,    i:[{k:51,a:2},{k:50,a:1},{k:52,a:1}]},
  58: {n:'Automotive Research',    pph:4.19,    i:[]},
  59: {n:'Fashion Research',       pph:6.78,    i:[]},
  60: {n:'Underwear',              pph:165.77,  i:[{k:41,a:1}]},
  61: {n:'Gloves',                 pph:143.17,  i:[{k:41,a:1}]},
  62: {n:'Dress',                  pph:150.70,  i:[{k:41,a:2}]},
  63: {n:'Stiletto Heel',          pph:97.96,   i:[{k:41,a:1},{k:46,a:1}]},
  64: {n:'Handbags',               pph:67.82,   i:[{k:46,a:2}]},
  65: {n:'Sneakers',               pph:173.31,  i:[{k:41,a:2}]},
  66: {n:'Seeds',                  pph:889.63,  i:[]},
  67: {n:'Xmas Crackers',          pph:222.47,  i:[]},
  68: {n:'Gold Ore',               pph:56.78,   i:[{k:1,a:20}]},
  69: {n:'Golden Bars',            pph:29.95,   i:[{k:1,a:20},{k:68,a:1}]},
  70: {n:'Luxury Watch',           pph:18.84,   i:[{k:69,a:0.1},{k:21,a:5}]},
  71: {n:'Necklace',               pph:41.44,   i:[{k:69,a:0.1},{k:21,a:3}]},
  72: {n:'Sugarcane',              pph:647.00,  i:[{k:2,a:3},{k:66,a:1}]},
  73: {n:'Ethanol',                pph:60.94,   i:[{k:72,a:4},{k:1,a:5}]},
  74: {n:'Methane',                pph:55.36,   i:[]},
  75: {n:'Carbon Fibers',          pph:245.11,  i:[{k:10,a:2},{k:1,a:3}]},
  76: {n:'Carbon Composite',       pph:68.45,   i:[{k:75,a:5},{k:17,a:3}]},
  77: {n:'Fuselage',               pph:3.30,    i:[{k:76,a:5},{k:18,a:3}]},
  78: {n:'Wing',                   pph:8.11,    i:[{k:76,a:4},{k:18,a:2}]},
  79: {n:'High-grade E-comps',     pph:1.84,    i:[{k:20,a:2},{k:21,a:2},{k:16,a:5}]},
  80: {n:'Flight Computer',        pph:2.26,    i:[{k:79,a:2},{k:21,a:3}]},
  81: {n:'Cockpit',                pph:2.26,    i:[{k:79,a:2},{k:80,a:1}]},
  82: {n:'Attitude Control',       pph:2.72,    i:[{k:79,a:2},{k:21,a:2}]},
  83: {n:'Rocket Fuel',            pph:77.99,   i:[{k:74,a:4},{k:17,a:2}]},
  84: {n:'Propellant Tank',        pph:4.51,    i:[{k:76,a:3},{k:43,a:2}]},
  85: {n:'Solid Fuel Booster',     pph:0.28,    i:[{k:83,a:10},{k:84,a:1}]},
  86: {n:'Rocket Engine',          pph:0.28,    i:[{k:79,a:3},{k:43,a:5}]},
  87: {n:'Heat Shield',            pph:12.01,   i:[{k:76,a:4},{k:17,a:2}]},
  88: {n:'Ion Drive',              pph:0.56,    i:[{k:79,a:5},{k:17,a:5}]},
  89: {n:'Jet Engine',             pph:0.84,    i:[{k:18,a:3},{k:43,a:3},{k:21,a:2}]},
  90: {n:'Sub-orbital 2nd Stage',  pph:3.00,    i:[{k:84,a:1},{k:82,a:1},{k:86,a:1}]},
  91: {n:'Sub-orbital Rocket',     pph:0.63,    i:[{k:85,a:2},{k:90,a:1}]},
  92: {n:'Orbital Booster',        pph:1.50,    i:[{k:84,a:2},{k:86,a:2},{k:87,a:1}]},
  93: {n:'Starship',               pph:0.30,    i:[{k:85,a:3},{k:92,a:1},{k:88,a:1}]},
  94: {n:'BFR',                    pph:0.21,    i:[{k:93,a:1},{k:88,a:2}]},
  95: {n:'Jumbo Jet',              pph:0.06,    i:[{k:77,a:1},{k:78,a:2},{k:89,a:2},{k:81,a:1}]},
  96: {n:'Luxury Jet',             pph:0.17,    i:[{k:77,a:1},{k:78,a:1},{k:89,a:1},{k:81,a:1}]},
  97: {n:'Single Engine Plane',    pph:1.48,    i:[{k:77,a:1},{k:89,a:1},{k:80,a:1}]},
  98: {n:'Quadcopter',             pph:12.45,   i:[{k:21,a:3},{k:19,a:2},{k:48,a:1}]},
  99: {n:'Satellite',              pph:0.40,    i:[{k:79,a:3},{k:82,a:1}]},
 100: {n:'Aerospace Research',     pph:0.35,    i:[]},
 101: {n:'Reinforced Concrete',    pph:188.27,  i:[{k:103,a:2},{k:43,a:1},{k:44,a:2}]},
 102: {n:'Bricks',                 pph:367.35,  i:[{k:104,a:3},{k:1,a:5}]},
 103: {n:'Cement',                 pph:298.47,  i:[{k:105,a:3},{k:1,a:5}]},
 104: {n:'Clay',                   pph:1078.77, i:[{k:1,a:5}]},
 105: {n:'Limestone',              pph:794.89,  i:[{k:1,a:3}]},
 106: {n:'Wood',                   pph:76.83,   i:[]},
 107: {n:'Steel Beams',            pph:129.98,  i:[{k:43,a:5},{k:1,a:10}]},
 108: {n:'Planks',                 pph:115.13,  i:[{k:106,a:5},{k:1,a:5}]},
 109: {n:'Windows',                pph:16.71,   i:[{k:45,a:4},{k:18,a:1}]},
 110: {n:'Tools',                  pph:26.00,   i:[{k:43,a:2},{k:1,a:5}]},
 111: {n:'Construction Units',     pph:0.99,    i:[{k:101,a:5},{k:110,a:2},{k:108,a:3},{k:109,a:2}]},
 112: {n:'Bulldozer',              pph:5.58,    i:[{k:43,a:10},{k:52,a:1},{k:48,a:1}]},
 113: {n:'Materials Research',     pph:3.42,    i:[]},
 114: {n:'Robots',                 pph:6.00,    i:[{k:20,a:4},{k:21,a:3},{k:48,a:2}]},
 115: {n:'Cows',                   pph:37.68,   i:[{k:139,a:2},{k:2,a:1}]},
 116: {n:'Pigs',                   pph:82.89,   i:[{k:139,a:2},{k:6,a:1}]},
 117: {n:'Milk',                   pph:120.56,  i:[{k:115,a:0.125},{k:2,a:2}]},
 118: {n:'Coffee Beans',           pph:412.46,  i:[{k:2,a:3},{k:66,a:1}]},
 119: {n:'Coffee Powder',          pph:22.96,   i:[{k:118,a:5},{k:1,a:3}]},
 120: {n:'Vegetables',             pph:283.06,  i:[{k:2,a:3},{k:66,a:1}]},
 121: {n:'Bread',                  pph:11.96,   i:[{k:137,a:2}]},
 122: {n:'Cheese',                 pph:5.51,    i:[{k:117,a:4}]},
 123: {n:'Apple Pie',              pph:5.98,    i:[{k:137,a:2},{k:3,a:4},{k:135,a:1}]},
 124: {n:'Orange Juice',           pph:91.41,   i:[{k:4,a:4},{k:1,a:2}]},
 125: {n:'Apple Cider',            pph:36.56,   i:[{k:3,a:4},{k:1,a:2}]},
 126: {n:'Ginger Beer',            pph:73.13,   i:[{k:135,a:2},{k:1,a:2}]},
 127: {n:'Frozen Pizza',           pph:9.18,    i:[{k:137,a:1},{k:138,a:1},{k:122,a:1}]},
 128: {n:'Pasta',                  pph:18.37,   i:[{k:133,a:2},{k:9,a:1}]},
 129: {n:'Hamburger',              pph:0.52,    i:[{k:7,a:2},{k:121,a:1},{k:138,a:1}]},
 130: {n:'Lasagna',                pph:1.56,    i:[{k:128,a:2},{k:138,a:1},{k:122,a:1}]},
 131: {n:'Meat Balls',             pph:1.04,    i:[{k:8,a:2},{k:138,a:1}]},
 132: {n:'Cocktails',              pph:0.52,    i:[{k:73,a:2},{k:124,a:1}]},
 133: {n:'Flour',                  pph:87.25,   i:[{k:6,a:5},{k:1,a:3}]},
 134: {n:'Butter',                 pph:13.78,   i:[{k:117,a:2},{k:1,a:2}]},
 135: {n:'Sugar',                  pph:41.33,   i:[{k:72,a:5},{k:1,a:3}]},
 136: {n:'Cocoa',                  pph:169.84,  i:[{k:2,a:3},{k:66,a:1}]},
 137: {n:'Dough',                  pph:11.96,   i:[{k:133,a:2},{k:2,a:1}]},
 138: {n:'Sauce',                  pph:0.78,    i:[{k:120,a:3},{k:1,a:1}]},
 139: {n:'Fodder',                 pph:284.70,  i:[{k:6,a:5},{k:1,a:3}]},
 140: {n:'Chocolate',              pph:3.21,    i:[{k:136,a:3},{k:135,a:2}]},
 141: {n:'Vegetable Oil',          pph:36.74,   i:[{k:120,a:4},{k:1,a:3}]},
 142: {n:'Salad',                  pph:2.09,    i:[{k:120,a:3},{k:141,a:1}]},
 143: {n:'Samosa',                 pph:1.83,    i:[{k:133,a:2},{k:120,a:2},{k:138,a:1}]},
 145: {n:'Recipes',                pph:3.81,    i:[]},
};

// maxLvl sourced from /api/v2/constants/buildings/ levelImages array lengths
const BLDS = [
  {k:'E', n:'Power Plant',                   w:414,   c:'production', maxLvl:15, o:[1]},
  {k:'W', n:'Water Reservoir',               w:345,   c:'production', maxLvl:15, o:[2]},
  {k:'P', n:'Farm',                          w:103.5, c:'production', maxLvl:15, o:[3,4,5,6,40,66,72,106,118,120,136]},
  {k:'F', n:'Ranch',                         w:138,   c:'production', maxLvl:6,  o:[9,46,115,116,117]},
  {k:'M', n:'Mine',                          w:276,   c:'production', maxLvl:15, o:[14,15,68,42],    hasAbundance:true},
  {k:'O', n:'Oil Rig',                       w:517.5, c:'production', maxLvl:15, o:[10,74],           hasAbundance:true},
  {k:'Q', n:'Quarry',                        w:276,   c:'production', maxLvl:15, o:[44,104,105],      hasAbundance:true},
  {k:'S', n:'Shipping Depot',                w:310.5, c:'production', maxLvl:6,  o:[13]},
  {k:'Y', n:'Factory',                       w:414,   c:'production', maxLvl:15, o:[16,17,18,69,43,45,76,67]},
  {k:'R', n:'Refinery',                      w:483,   c:'production', maxLvl:6,  o:[11,12,19,75,83]},
  {k:'L', n:'Electronics Factory',           w:379.5, c:'production', maxLvl:15, o:[20,21,22,23,24,25,26,27,28,114,47,79]},
  {k:'T', n:'Fashion Factory',               w:138,   c:'production', maxLvl:6,  o:[41,60,61,62,63,64,65,70,71]},
  {k:'1', n:'Car Factory',                   w:448.5, c:'production', maxLvl:5,  o:[49,50,51,53,54,55,56,57,112]},
  {k:'D', n:'Propulsion Factory',            w:621,   c:'production', maxLvl:15, o:[48,52,85,86,88,89]},
  {k:'7', n:'Aerospace Factory',             w:586.5, c:'production', maxLvl:15, o:[77,78,84,87,90,92,93]},
  {k:'8', n:'Aerospace Electronics',         w:724.5, c:'production', maxLvl:15, o:[80,81,82,98,99]},
  {k:'9', n:'Vertical Integration Facility', w:759,   c:'production', maxLvl:15, o:[91,94]},
  {k:'0', n:'Hangar',                        w:759,   c:'production', maxLvl:15, o:[95,96,97]},
  {k:'o', n:'Concrete Plant',                w:379.5, c:'production', maxLvl:15, o:[101,102,103]},
  {k:'x', n:'Construction Factory',          w:483,   c:'production', maxLvl:15, o:[107,108,109,110]},
  {k:'g', n:'General Contractor',            w:345,   c:'production', maxLvl:15, o:[111]},
  {k:'e', n:'Slaughterhouse',                w:414,   c:'production', maxLvl:15, o:[7,8]},
  {k:'i', n:'Mill',                          w:379.5, c:'production', maxLvl:15, o:[119,133,139]},
  {k:'j', n:'Bakery',                        w:448.5, c:'production', maxLvl:15, o:[137,121,123]},
  {k:'m', n:'Catering',                      w:655.5, c:'production', maxLvl:15, o:[138,129,130,131,142,132,143]},
  {k:'k', n:'Food Processing Plant',         w:379.5, c:'production', maxLvl:15, o:[141,128,134,122,135,127,140]},
  {k:'6', n:'Beverage Factory',              w:241.5, c:'production', maxLvl:15, o:[73,124,125,126]},
  {k:'p', n:'Plant Research Center',         w:448.5, c:'research',   maxLvl:1,  o:[29]},
  {k:'h', n:'Physics Laboratory',            w:586.5, c:'research',   maxLvl:3,  o:[30,31,32]},
  {k:'b', n:'Breeding Laboratory',           w:414,   c:'research',   maxLvl:3,  o:[33]},
  {k:'c', n:'Chemistry Laboratory',          w:414,   c:'research',   maxLvl:3,  o:[34,113]},
  {k:'a', n:'Automotive R&D',                w:552,   c:'research',   maxLvl:3,  o:[58]},
  {k:'f', n:'Fashion & Design',              w:448.5, c:'research',   maxLvl:3,  o:[59]},
  {k:'s', n:'Software R&D',                  w:448.5, c:'research',   maxLvl:3,  o:[35]},
  {k:'l', n:'Launch Pad',                    w:724.5, c:'research',   maxLvl:3,  o:[100]},
  {k:'q', n:'Kitchen',                       w:517.5, c:'research',   maxLvl:3,  o:[145]},
  // Retail/sale buildings — rpph is estimated units sold per hour per level
  {k:'G', n:'Grocery Store',     w:138,   c:'retail', maxLvl:3, rpph:100, o:[121,117,122,9,120,134,124,125,126,119,3,4,5,6,72]},
  {k:'N', n:'Restaurant',        w:207,   c:'retail', maxLvl:3, rpph:10,  o:[129,127,130,131,132,142,143]},
  {k:'C', n:'Clothing Store',    w:138,   c:'retail', maxLvl:3, rpph:30,  o:[60,61,62,63,64,65]},
  {k:'U', n:'Electronics Store', w:207,   c:'retail', maxLvl:3, rpph:8,   o:[24,25,26,27,28]},
  {k:'V', n:'Auto Dealership',   w:276,   c:'retail', maxLvl:3, rpph:2,   o:[55,56,53,54,57]},
  {k:'B', n:'Jewelry Store',     w:172.5, c:'retail', maxLvl:3, rpph:5,   o:[70,71]},
];

/* ─────────────────────────────────────────────────────────────────────────────
   CACHE
───────────────────────────────────────────────────────────────────────────── */
function cGet(k, ttl = TTL) {
  try {
    const raw = localStorage.getItem('sc_' + k);
    if (!raw) return null;
    const { d, t } = JSON.parse(raw);
    return (Date.now() - t < ttl) ? d : null;
  } catch { return null; }
}
function cSet(k, d) {
  try { localStorage.setItem('sc_' + k, JSON.stringify({ d, t: Date.now() })); } catch {}
}
function cAge(k) {
  try {
    const raw = localStorage.getItem('sc_' + k);
    if (!raw) return null;
    return Math.floor((Date.now() - JSON.parse(raw).t) / 1000);
  } catch { return null; }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SESSION COOKIE  (for optional financial snapshot)
───────────────────────────────────────────────────────────────────────────── */
function getStoredCookie() { return localStorage.getItem('sc_cookie') || ''; }
function saveStoredCookie(v) { localStorage.setItem('sc_cookie', v.trim()); }
function clearStoredCookie() { localStorage.removeItem('sc_cookie'); }

/* ─────────────────────────────────────────────────────────────────────────────
   FETCH via proxy
───────────────────────────────────────────────────────────────────────────── */
async function apiFetch(path, cacheKey, force = false) {
  if (!force) {
    const hit = cGet(cacheKey);
    if (hit !== null) return hit;
  }
  const headers = {};
  const cookie = getStoredCookie();
  if (cookie) headers['X-Sim-Cookie'] = cookie;
  const res = await fetch(PROXY_URL + path, { headers });
  if (res.status === 401 || res.status === 403) throw { type: 'auth', status: res.status, path };
  if (!res.ok) throw { type: 'http', status: res.status, path };
  const data = await res.json();
  cSet(cacheKey, data);
  return data;
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────────────────────────── */
let ticker    = [];
let tickerAge = null;

// Player buildings: array of {bk: buildingKind, pk: productKind, qty: number}
function loadPlayerBuildings() {
  try {
    const raw = localStorage.getItem('sc_player_buildings');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function savePlayerBuildings(arr) {
  try { localStorage.setItem('sc_player_buildings', JSON.stringify(arr)); } catch {}
}

let playerBuildings = loadPlayerBuildings();

// Returns the effective abundance multiplier for a player building entry.
// Mine, Oil Rig and Quarry are the only buildings where this is < 1.
// Expected (mean) value is 0.6; valid range 0.10–1.00.
function getAbundance(entry) {
  const bld = BLDS.find(b => b.k === entry.bk);
  if (!bld?.hasAbundance) return 1.0;
  return entry.abundance ?? 0.6;
}

function getAO()  { return parseFloat(localStorage.getItem('sc_ao')  || '0') || 0; }
function setAO(v)  { localStorage.setItem('sc_ao',  String(v)); }
function getPSB() { return parseFloat(localStorage.getItem('sc_psb') || '0') || 0; }
function setPSB(v) { localStorage.setItem('sc_psb', String(v)); }
function getSSB() { return parseFloat(localStorage.getItem('sc_ssb') || '0') || 0; }
function setSSB(v) { localStorage.setItem('sc_ssb', String(v)); }

let surRows = [];
let defRows = [];
const sortSt = {
  s: { col: 'mv',      dir: 'desc' },
  d: { col: 'buyCost', dir: 'desc' },
};

let oppLevel  = 1;
let oppOwned  = false;
let oppSearch = '';

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS / ERROR
───────────────────────────────────────────────────────────────────────────── */
function status(msg, loading) {
  document.getElementById('stext').textContent = msg;
  document.getElementById('spin').style.display = loading ? 'block' : 'none';
}
function setRight(msg) {
  document.getElementById('sright').textContent = msg;
}
function showErr(msg, detail) {
  document.getElementById('errBox').innerHTML =
    `<div class="error-box"><strong>Error:</strong> ${esc(msg)}` +
    (detail ? `<br><small style="color:#fca5a5">${esc(detail)}</small>` : '') + `</div>`;
}
function clearErr() { document.getElementById('errBox').innerHTML = ''; }

/* ─────────────────────────────────────────────────────────────────────────────
   BUILDING ENTRY UI
───────────────────────────────────────────────────────────────────────────── */
function populateBldTypeDropdown() {
  const sel = document.getElementById('bldType');
  sel.innerHTML = '<option value="">— Select building —</option>';
  for (const [label, cat] of [['Production','production'],['Retail / Sale','retail'],['Research','research']]) {
    const grp = document.createElement('optgroup');
    grp.label = label;
    for (const b of BLDS.filter(x => x.c === cat)) {
      const opt = document.createElement('option');
      opt.value = b.k;
      opt.textContent = b.n;
      grp.appendChild(opt);
    }
    sel.appendChild(grp);
  }
}

function updateProductDropdown(bldKind) {
  const sel = document.getElementById('bldProduct');
  sel.innerHTML = '<option value="">— Select product —</option>';
  if (!bldKind) return;
  const bld = BLDS.find(b => b.k === bldKind);
  if (!bld) return;
  for (const pk of bld.o) {
    const prod = PROD[pk];
    if (!prod) continue;
    const opt = document.createElement('option');
    opt.value = pk;
    opt.textContent = prod.n;
    sel.appendChild(opt);
  }
  if (bld.o.length === 1) sel.value = bld.o[0];
}

function updateLevelDropdown(bldKind) {
  const sel = document.getElementById('bldLevel');
  sel.innerHTML = '';
  const bld = BLDS.find(b => b.k === bldKind);
  const max = bld ? bld.maxLvl : 1;
  for (let i = 1; i <= max; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Lvl ${i}`;
    sel.appendChild(opt);
  }
}

document.getElementById('bldType').addEventListener('change', e => {
  updateProductDropdown(e.target.value);
  updateLevelDropdown(e.target.value);
});

document.getElementById('addBldBtn').addEventListener('click', () => {
  const bk  = document.getElementById('bldType').value;
  const pk  = parseInt(document.getElementById('bldProduct').value);
  const lvl = parseInt(document.getElementById('bldLevel').value) || 1;
  const qty = parseInt(document.getElementById('bldQty').value) || 1;

  if (!bk || !pk) {
    document.getElementById('addBldError').textContent = 'Select a building type and product.';
    return;
  }
  document.getElementById('addBldError').textContent = '';

  // Merge only if same building + product + level
  const existing = playerBuildings.find(e => e.bk === bk && e.pk === pk && (e.lvl || 1) === lvl);
  if (existing) {
    existing.qty += qty;
  } else {
    const bldDef = BLDS.find(b => b.k === bk);
    const entry = { bk, pk, qty, lvl };
    if (bldDef?.c === 'retail') entry.targetRate = (bldDef.rpph || 0) * lvl * 24;
    if (bldDef?.hasAbundance)   entry.abundance  = 0.6;  // default 60% (statistical mean)
    playerBuildings.push(entry);
  }
  savePlayerBuildings(playerBuildings);
  document.getElementById('bldQty').value = 1;
  renderBuildingList();
  recalculate();
});

document.getElementById('bldQty').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('addBldBtn').click();
});

document.getElementById('clearBldBtn').addEventListener('click', () => {
  if (playerBuildings.length === 0) return;
  playerBuildings = [];
  savePlayerBuildings(playerBuildings);
  renderBuildingList();
  recalculate();
});

document.getElementById('aoInput').addEventListener('input', e => {
  setAO(parseFloat(e.target.value) || 0);
  recalculate();
});
document.getElementById('psbInput').addEventListener('input', e => {
  setPSB(parseFloat(e.target.value) || 0);
  recalculate();
});
document.getElementById('ssbInput').addEventListener('input', e => {
  setSSB(parseFloat(e.target.value) || 0);
  recalculate();
});

document.getElementById('bldTbody').addEventListener('click', e => {
  const btn = e.target.closest('[data-remove]');
  if (btn) {
    const idx = parseInt(btn.dataset.remove);
    playerBuildings.splice(idx, 1);
    savePlayerBuildings(playerBuildings);
    renderBuildingList();
    recalculate();
    return;
  }
  const tog = e.target.closest('.tog[data-bld-tog]');
  if (tog) {
    const idx = parseInt(tog.dataset.bldTog);
    const det = document.getElementById('bdet' + idx);
    if (!det) return;
    const en = playerBuildings[idx];
    if (en) det.querySelector('td').innerHTML = buildProfitDetail(en.bk, en.pk, en.lvl || 1, en.qty, getAbundance(en));
    det.classList.toggle('hide');
    tog.classList.toggle('open', !det.classList.contains('hide'));
  }
});

document.getElementById('bldTbody').addEventListener('change', e => {
  const qtyInp = e.target.closest('[data-qty-idx]');
  if (qtyInp) {
    const idx = parseInt(qtyInp.dataset.qtyIdx);
    const val = parseInt(qtyInp.value) || 1;
    if (val < 1) { qtyInp.value = 1; return; }
    playerBuildings[idx].qty = val;
    savePlayerBuildings(playerBuildings);
    renderBuildingList();
    recalculate();
    return;
  }
  const lvlInp = e.target.closest('[data-lvl-idx]');
  if (lvlInp) {
    const idx = parseInt(lvlInp.dataset.lvlIdx);
    const bld = BLDS.find(b => b.k === playerBuildings[idx].bk);
    const max = bld ? bld.maxLvl : 1;
    const val = Math.min(max, Math.max(1, parseInt(lvlInp.value) || 1));
    playerBuildings[idx].lvl = val;
    savePlayerBuildings(playerBuildings);
    renderBuildingList();
    recalculate();
    return;
  }
  const rateInp = e.target.closest('[data-rate-idx]');
  if (rateInp) {
    const idx = parseInt(rateInp.dataset.rateIdx);
    const val = Math.max(0, parseFloat(rateInp.value) || 0);
    playerBuildings[idx].targetRate = val;
    savePlayerBuildings(playerBuildings);
    renderBuildingList();
    recalculate();
    return;
  }
  const abundInp = e.target.closest('[data-abund-idx]');
  if (abundInp) {
    const idx = parseInt(abundInp.dataset.abundIdx);
    const pct = Math.min(100, Math.max(10, parseFloat(abundInp.value) || 60));
    abundInp.value = pct;                                 // clamp displayed value
    playerBuildings[idx].abundance = pct / 100;
    savePlayerBuildings(playerBuildings);
    renderBuildingList();
    recalculate();
  }
});

function renderBuildingList() {
  const tbody = document.getElementById('bldTbody');
  const count = document.getElementById('bldCount');
  count.textContent = playerBuildings.length;

  if (!playerBuildings.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="color:var(--muted);padding:14px 12px;font-size:12px">
      No buildings added yet. Use the form above to add your buildings.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = playerBuildings.map((e, i) => {
    const bld      = BLDS.find(b => b.k === e.bk);
    const prod     = PROD[e.pk];
    const lvl      = e.lvl || 1;
    const maxLvl   = bld?.maxLvl || 1;
    const isRetail  = bld?.c === 'retail';
    const canDrill  = !isRetail;
    const abundance = getAbundance(e);
    let rateStr;
    if (isRetail) {
      rateStr = `<input type="number" class="qty-inp" value="${Math.round(e.targetRate ?? (bld.rpph || 0) * lvl * 24)}" min="0"
               data-rate-idx="${i}" title="Units sold per day per building — edit to match your in-game rate"
               style="width:70px;background:var(--bg3);border:1px solid var(--amber);color:var(--amber);border-radius:4px;padding:2px 5px;font-size:12px;text-align:right">
               <span style="font-size:10px;color:var(--muted)">/day</span>`;
    } else {
      const psb = 1 + getPSB() / 100;
      const ppd = prod ? prod.pph * lvl * e.qty * 24 * psb * abundance : 0;
      const abundInput = bld?.hasAbundance
        ? `<div style="margin-bottom:3px;display:flex;align-items:center;gap:3px">
             <input type="number" class="qty-inp" value="${Math.round(abundance * 100)}" min="10" max="100"
                    data-abund-idx="${i}" title="Resource abundance % (10–100). Default 60% is the expected average."
                    style="width:40px;border-color:var(--amber);color:var(--amber)">
             <span style="font-size:10px;color:var(--amber)">% abund.</span>
           </div>` : '';
      rateStr = abundInput + `<span style="color:var(--muted)">${fmtN(ppd)}/day</span>`;
    }
    const profitCell = (() => {
      if (isRetail) return `<span style="color:var(--muted)">—</span>`;
      const p = calcBuildingProfit(e.bk, e.pk, lvl, e.qty, abundance);
      if (!p) return `<span style="color:var(--muted)">—</span>`;
      const c = p.profitDay >= 0 ? 'var(--green)' : 'var(--red)';
      const mkt2 = buildMarketMap();
      const warn = prod?.i?.some(inp => !mkt2[+inp.k]) ? ' <span style="color:var(--amber)" title="One or more input prices are $0 in the market ticker — actual profit may differ">⚠</span>' : '';
      let upgradeHint = '';
      if (bld && lvl < (bld.maxLvl || 1)) {
        // Use qty=1 so gain is per-building, not inflated by building count
        const curr1 = calcBuildingProfit(e.bk, e.pk, lvl,     1, abundance);
        const nxt1  = calcBuildingProfit(e.bk, e.pk, lvl + 1, 1, abundance);
        if (curr1 && nxt1) {
          const gain    = nxt1.profitDay - curr1.profitDay;
          const upgCU   = bld.costUnits != null ? bld.costUnits * lvl : null;
          const cuP     = mkt2[111] || 0;
          const upgCost = upgCU != null && cuP > 0 ? upgCU * cuP : null;
          const payback = upgCost != null && gain > 0 ? Math.ceil(upgCost / gain) : null;
          const gc      = gain >= 0 ? 'var(--green)' : 'var(--red)';
          const totalNote = e.qty > 1 ? ` (×${e.qty} = ${gain>=0?'+':''}${fmtSC(gain*e.qty)}/day)` : '';
          const payNote   = payback != null ? ` · ${payback}d payback` : '';
          upgradeHint = `<div style="font-size:10px;color:${gc};margin-top:2px;white-space:nowrap">&#x2191; Lvl ${lvl+1}: ${gain >= 0 ? '+' : ''}${fmtSC(gain)}/day each${totalNote}${payNote}</div>`;
        }
      }
      return `<div><span style="color:${c};font-weight:600">${p.profitDay >= 0 ? '+' : ''}${fmtSC(p.profitDay)}/day</span>${warn}</div>${upgradeHint}`;
    })();
    return `<tr class="bld-row">
      <td>${canDrill ? `<span class="tog" id="btog${i}" data-bld-tog="${i}">&#9658;</span>` : ''}</td>
      <td><div class="res">${iconHtml(e.pk)}${esc(bld?.n || e.bk)}${isRetail ? ' <span class="chip chip-buy" style="font-size:9px;padding:1px 5px">RETAIL</span>' : ''}</div></td>
      <td style="color:var(--text)">${esc(prod?.n || '?')}</td>
      <td class="num">
        <input type="number" class="qty-inp" value="${lvl}" min="1" max="${maxLvl}"
               data-lvl-idx="${i}" style="width:44px;background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:2px 5px;font-size:12px;text-align:right">
      </td>
      <td class="num">
        <input type="number" class="qty-inp" value="${e.qty}" min="1"
               data-qty-idx="${i}" style="width:60px;background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:2px 5px;font-size:12px;text-align:right">
      </td>
      <td class="num" style="font-size:11px">${rateStr}</td>
      <td class="num" style="font-size:11px">${profitCell}</td>
      <td style="text-align:right"><button class="sbtn" data-remove="${i}" title="Remove">&#10005;</button></td>
    </tr>
    ${canDrill ? `<tr class="detail-tr hide" id="bdet${i}"><td colspan="8"></td></tr>` : ''}`;
  }).join('');
}

/* ─────────────────────────────────────────────────────────────────────────────
   CALCULATION ENGINE
───────────────────────────────────────────────────────────────────────────── */
function buildMarketMap() {
  const m = {};
  for (const t of ticker) m[+t.kind] = +(t.price || 0);
  return m;
}

function calcBuildingProfit(bk, pk, lvl, qty, abundance = 1.0) {
  const bld  = BLDS.find(b => b.k === bk);
  const prod = PROD[+pk];
  if (!bld || !prod || !ticker.length) return null;
  const mkt    = buildMarketMap();
  const psb    = 1 + getPSB() / 100;
  const l      = lvl || 1;
  const q      = qty || 1;
  const ab     = bld.hasAbundance ? abundance : 1.0;
  const pphEff = prod.pph * l * psb * ab;                       // abundance scales production rate
  const matCPU = prod.i.reduce((s, i) => s + i.a * (mkt[+i.k] || 0), 0);
  const revDay = pphEff * 24 * (mkt[+pk] || 0) * q;
  const matDay = pphEff * 24 * matCPU * q;
  const wagDay = bld.w * l * 24 * q * (1 + getAO() / 100);     // wages are fixed regardless of abundance
  return { revDay, matDay, wagDay, profitDay: revDay - matDay - wagDay, pphEff, ab };
}

function recalculate() {
  if (!ticker.length) return;
  calculate();
  renderSurplus();
  renderDeficit();
  updateSummary();
  renderOpportunities();
}

function calculate() {
  const marketMap = {};
  for (const t of ticker) marketMap[+t.kind] = +(t.price || 0);

  const produced = {};
  const consumed = {};

  for (const entry of playerBuildings) {
    const prod = PROD[+entry.pk];
    if (!prod) continue;
    const bld = BLDS.find(b => b.k === entry.bk);
    const lvl = entry.lvl || 1;

    if (bld?.c === 'retail') {
      const ssb    = 1 + getSSB() / 100;
      const rate   = entry.targetRate != null ? entry.targetRate : ((bld?.rpph || 0) * lvl * 24);
      const demand = rate * entry.qty * ssb;
      consumed[+entry.pk] = (consumed[+entry.pk] || 0) + demand;
    } else {
      const psb      = 1 + getPSB() / 100;
      const ab       = getAbundance(entry);
      const unitsDay = prod.pph * lvl * entry.qty * 24 * psb * ab;
      produced[+entry.pk] = (produced[+entry.pk] || 0) + unitsDay;
      for (const inp of prod.i) {
        consumed[+inp.k] = (consumed[+inp.k] || 0) + inp.a * unitsDay;
      }
    }
  }

  surRows = [];
  defRows = [];
  const marketMap2 = marketMap;

  const allKinds = new Set([
    ...Object.keys(produced).map(Number),
    ...Object.keys(consumed).map(Number),
  ]);

  for (const kind of allKinds) {
    const p   = produced[kind] || 0;
    const c   = consumed[kind] || 0;
    const net = p - c;
    if (Math.abs(net) < 0.001) continue;

    const name  = PROD[kind]?.n || `Resource #${kind}`;
    const price = marketMap2[kind] || 0;

    if (net > 0) {
      surRows.push({ kind, name, produced: p, consumed: c, net, price, mv: net * price });
    } else {
      const deficit  = Math.abs(net);
      const buyCost  = deficit * price;
      const mvb      = calcMVB(kind, deficit, marketMap2);
      const rec      = mvb ? (mvb.buyTotal <= mvb.makeTotal ? 'buy' : 'make') : 'buy';
      defRows.push({ kind, name, produced: p, consumed: c, net, price, buyCost, mvb, rec });
    }
  }

  doSort('s');
  doSort('d');
}

function calcMVB(kindId, deficitPerDay, marketMap) {
  const bld  = BLDS.find(b => b.o.includes(+kindId));
  if (!bld) return null;
  const prod = PROD[+kindId];
  if (!prod) return null;

  const ab       = bld.hasAbundance ? 0.6 : 1.0;   // use expected abundance for MvB recommendation
  const effPph   = prod.pph * ab;
  const wageCPU  = effPph > 0 ? bld.w * (1 + getAO() / 100) / effPph : 0;
  let   matCPU   = 0;
  for (const inp of prod.i) {
    matCPU += inp.a * (marketMap[+inp.k] || 0);
  }

  const makeCPU   = wageCPU + matCPU;
  const buyCPU    = marketMap[+kindId] || 0;
  const makeTotal = makeCPU * deficitPerDay;
  const buyTotal  = buyCPU * deficitPerDay;

  const bldP = calcBuildingProfit(bld.k, +kindId, 1, 1);

  return {
    makeCPU, buyCPU, makeTotal, buyTotal, wageCPU, matCPU,
    saving: Math.abs(makeTotal - buyTotal),
    deficitPerDay,
    bldName: bld.n,
    bldKind: bld.k,
    bldProfitDay: bldP ? bldP.profitDay : null,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   SORT
───────────────────────────────────────────────────────────────────────────── */
function applySort(tbl, col, dir) {
  sortSt[tbl] = { col, dir };
  doSort(tbl);
  if (tbl === 's') renderSurplus(); else renderDeficit();

  const prefix = tbl === 's' ? 'ss' : 'ds';
  document.querySelectorAll(`[id^="${prefix}-"]`).forEach(b => b.classList.remove('active'));
  document.getElementById(`${prefix}-${col}`)?.classList.add('active');
}
function doSort(tbl) {
  const { col, dir } = sortSt[tbl];
  const rows = tbl === 's' ? surRows : defRows;
  rows.sort((a, b) => {
    const av = a[col], bv = b[col];
    if (typeof av === 'string') return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return dir === 'asc' ? (av - bv) : (bv - av);
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   RENDER — SURPLUS
───────────────────────────────────────────────────────────────────────────── */
function renderSurplus() {
  const card = document.getElementById('surCard');
  document.getElementById('surCount').textContent = surRows.length;
  if (!surRows.length) { card.style.display = 'none'; return; }
  card.style.display = 'block';

  document.getElementById('surTbody').innerHTML = surRows.map(r => `
    <tr>
      <td><div class="res">${iconHtml(r.kind)}${esc(r.name)}</div></td>
      <td class="num">${fmtN(r.produced)}</td>
      <td class="num">${fmtN(r.consumed)}</td>
      <td class="num" style="color:var(--green)">+${fmtN(r.net)}</td>
      <td class="num" style="color:var(--gold)">${fmtSC(r.mv)}</td>
    </tr>`).join('');
}

/* ─────────────────────────────────────────────────────────────────────────────
   RENDER — DEFICIT
───────────────────────────────────────────────────────────────────────────── */
function renderDeficit() {
  const card = document.getElementById('defCard');
  document.getElementById('defCount').textContent = defRows.length;
  if (!defRows.length) { card.style.display = 'none'; return; }
  card.style.display = 'block';

  document.getElementById('defTbody').innerHTML = defRows.map((r, i) => {
    const chipHtml = r.mvb
      ? `<span class="chip chip-${r.rec}">${r.rec === 'buy' ? 'Buy' : 'Make'} &mdash; save ${fmtSC(r.mvb.saving)}/day</span>`
      : `<span style="color:var(--muted);font-size:11px">—</span>`;

    return `
    <tr class="def-row" data-idx="${i}" style="cursor:pointer">
      <td><span class="tog" id="tog${i}">&#9658;</span></td>
      <td><div class="res">${iconHtml(r.kind)}${esc(r.name)}</div></td>
      <td class="num">${r.produced > 0.001 ? fmtN(r.produced) : '—'}</td>
      <td class="num">${fmtN(r.consumed)}</td>
      <td class="num" style="color:var(--amber)">${fmtN(r.net)}</td>
      <td class="num">${fmtSC(r.buyCost)}/day</td>
      <td>${chipHtml}</td>
    </tr>
    <tr class="detail-tr hide" id="det${i}">
      <td colspan="7">${mvbDetail(r)}</td>
    </tr>`;
  }).join('');
}

function mvbDetail(r) {
  const m = r.mvb;
  if (!m) return `<div class="detail-inner"><p style="color:var(--muted);font-size:13px">No producer building found in the encyclopedia for this resource.</p></div>`;

  const buyWins = m.buyTotal <= m.makeTotal;
  return `<div class="detail-inner">
    <div class="mvb-grid">
      <div class="mvb-box ${buyWins ? 'win' : ''}">
        <div class="mvb-lbl">${buyWins ? '&#10003; ' : ''}Buy from Market</div>
        <div class="mvb-cost">${fmtSC(m.buyTotal)}/day</div>
        <div class="mvb-break">${fmtSC(m.buyCPU)}/unit &times; ${fmtN(m.deficitPerDay)} units/day</div>
      </div>
      <div class="mvb-box ${!buyWins ? 'win2' : ''}">
        <div class="mvb-lbl">${!buyWins ? '&#10003; ' : ''}Produce in ${esc(m.bldName)}</div>
        <div class="mvb-cost">${fmtSC(m.makeTotal)}/day</div>
        <div class="mvb-break">
          ${fmtSC(m.makeCPU)}/unit total<br>
          Wages: ${fmtSC(m.wageCPU)}/unit<br>
          Materials: ${fmtSC(m.matCPU)}/unit
        </div>
        ${!buyWins ? `<div class="ao-warn">&#9888; Adding a ${esc(m.bldName)} increases admin overhead</div>` : ''}
      </div>
      <div class="mvb-box">
        <div class="mvb-lbl">Daily Saving</div>
        <div class="mvb-cost" style="color:${buyWins ? 'var(--green)' : 'var(--amber)'}">
          ${fmtSC(m.saving)}/day
        </div>
        <div class="mvb-break">${buyWins ? 'Buying is cheaper' : 'Producing is cheaper'}</div>
      </div>
    </div>
    <div class="detail-note">
      Deficit: ${fmtN(m.deficitPerDay)}/day &nbsp;&middot;&nbsp;
      Market: ${fmtSC(m.buyCPU)}/unit &nbsp;&middot;&nbsp;
      Make cost: ${fmtSC(m.makeCPU)}/unit
    </div>
    ${m.bldProfitDay !== null ? (() => {
      const c = m.bldProfitDay >= 0 ? 'var(--green)' : 'var(--red)';
      return `<div style="margin-top:10px;padding:10px 12px;background:var(--bg3);border-radius:6px;font-size:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="color:var(--muted)">Level 1 ${esc(m.bldName)} full profit:</span>
        <strong style="color:${c}">${m.bldProfitDay >= 0 ? '+' : ''}${fmtSC(m.bldProfitDay)}/day</strong>
        <span style="color:var(--muted)">— includes all production beyond your ${fmtN(m.deficitPerDay)}/day deficit</span>
      </div>`;
    })() : ''}
  </div>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROFIT BREAKDOWN DETAIL
───────────────────────────────────────────────────────────────────────────── */
function buildProfitDetail(bk, pk, lvl, qty, abundance = 1.0) {
  const bld  = BLDS.find(b => b.k === bk);
  const prod = PROD[+pk];
  if (!bld || !prod || !ticker.length)
    return '<div class="detail-inner" style="color:var(--muted);font-size:12px">No data available.</div>';

  const mkt         = buildMarketMap();
  const psb         = 1 + getPSB() / 100;
  const ao          = getAO();
  const l           = lvl || 1;
  const q           = qty || 1;
  const ab          = bld.hasAbundance ? abundance : 1.0;
  const pphEff      = prod.pph * l * psb * ab;       // abundance scales production rate
  const unitDay     = pphEff * 24 * q;
  const price       = mkt[+pk] || 0;
  const revDay      = unitDay * price;

  // Wage cost per unit = bld.w × (1 + AO%) / (pph × PSB × abundance)
  const wagCPUBase  = pphEff > 0 ? bld.w / (pphEff / l) : 0;  // pphEff/l = per-unit effective rate
  const aoCPU       = wagCPUBase * ao / 100;
  const wagCPUTotal = wagCPUBase + aoCPU;
  const wagBaseDay  = bld.w * l * 24 * q;
  const aoWagDay    = wagBaseDay * ao / 100;
  const wagDay      = wagBaseDay + aoWagDay;

  const inputs = prod.i.map(inp => ({
    k:    +inp.k,
    n:    PROD[+inp.k]?.n || `Resource #${inp.k}`,
    a:    inp.a,
    p:    mkt[+inp.k] || 0,
    cpu:  inp.a * (mkt[+inp.k] || 0),
    cDay: inp.a * unitDay * (mkt[+inp.k] || 0),
    zero: !mkt[+inp.k],
  }));
  const matCPU  = inputs.reduce((s, i) => s + i.cpu, 0);
  const matDay  = inputs.reduce((s, i) => s + i.cDay, 0);
  const profCPU = price - matCPU - wagCPUTotal;
  const profDay = revDay - matDay - wagDay;
  const margin  = revDay > 0 ? profDay / revDay * 100 : 0;
  const pc      = profDay >= 0 ? 'var(--green)' : 'var(--red)';

  const basePph   = prod.pph * psb;
  const afterAbund = basePph * ab;
  const lvlPph    = afterAbund * l;
  const perBldDay = fmtN(lvlPph * 24);
  const abundStr  = ab < 1 ? ` × ${Math.round(ab * 100)}% abund.` : '';
  const rateNote  = l > 1
    ? `${fmtN(basePph)}/hr${abundStr} × Lvl ${l} = ${fmtN(lvlPph)}/hr = ${perBldDay}/day${q > 1 ? ` × ${q} bldgs = ${fmtN(unitDay)}/day` : ''}`
    : `${fmtN(basePph)}/hr${abundStr} = ${perBldDay}/day${q > 1 ? ` × ${q} bldgs = ${fmtN(unitDay)}/day` : ''}`;

  const hdr = `
    <div class="pb-row" style="border-bottom:1px solid var(--border);margin-bottom:4px;padding-bottom:4px">
      <div class="pb-label" style="font-weight:600;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em">Item</div>
      <div class="pb-price" style="font-weight:600;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em">Per Unit</div>
      <div class="pb-amount" style="font-weight:600;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.05em">Per Day</div>
    </div>`;

  const revRow = `
    <div class="pb-row">
      <div class="pb-label">
        ${iconHtml(+pk)}<strong>${esc(prod.n)}</strong>
        <span style="color:var(--muted);font-size:10px;margin-left:4px">${rateNote}</span>
      </div>
      <div class="pb-price" style="color:var(--green)">${price ? '+' + fmtSC(price) : '<span style="color:var(--amber)">no price</span>'}</div>
      <div class="pb-amount" style="color:var(--green)">+${fmtSC(revDay)}</div>
    </div>`;

  const inputRows = inputs.map(inp => `
    <div class="pb-row">
      <div class="pb-label" style="padding-left:18px;color:var(--muted)">
        ${iconHtml(inp.k)}${esc(inp.n)}
        <span style="opacity:.5;font-size:10px">${fmtN(inp.a)}× per unit</span>
        ${inp.zero ? `<span style="color:var(--amber)" title="No market price — treated as $0">⚠</span>` : ''}
      </div>
      <div class="pb-price">${inp.zero ? '<span style="color:var(--amber)">no price</span>' : '−' + fmtSC(inp.cpu)}</div>
      <div class="pb-amount" style="color:var(--red)">−${fmtSC(inp.cDay)}</div>
    </div>`).join('');

  const wagRow = `
    <div class="pb-row">
      <div class="pb-label" style="color:var(--muted)">
        Wages (${esc(bld.n)}${l > 1 ? ' Lvl ' + l : ''}${q > 1 ? ' ×' + q : ''})
        <span style="opacity:.5;font-size:10px">${fmtSC(bld.w * l)}/hr</span>
      </div>
      <div class="pb-price">−${fmtSC(wagCPUBase)}</div>
      <div class="pb-amount" style="color:var(--red)">−${fmtSC(wagBaseDay)}</div>
    </div>`;

  const aoRow = ao > 0 ? `
    <div class="pb-row">
      <div class="pb-label" style="color:var(--muted);padding-left:18px">
        Admin Overhead (${ao}%)
      </div>
      <div class="pb-price">−${fmtSC(aoCPU)}</div>
      <div class="pb-amount" style="color:var(--red)">−${fmtSC(aoWagDay)}</div>
    </div>` : '';

  const profRow = `
    <div class="pb-row">
      <div class="pb-label" style="font-size:13px;font-weight:700">
        Profit / day
        <span style="font-size:10px;font-weight:400;color:var(--muted);margin-left:6px">${margin.toFixed(1)}% margin</span>
      </div>
      <div class="pb-price" style="color:${pc};font-weight:600">${profCPU >= 0 ? '+' : ''}${fmtSC(profCPU)}</div>
      <div class="pb-amount" style="font-size:14px;color:${pc}">${profDay >= 0 ? '+' : ''}${fmtSC(profDay)}</div>
    </div>`;

  return `<div class="detail-inner">
    <div class="profit-breakdown">
      ${hdr}
      ${revRow}
      ${inputRows}
      ${wagRow}
      ${aoRow}
      <div class="pb-divider"></div>
      ${profRow}
    </div>
  </div>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   RENDER — BUILDING PROFITABILITY
───────────────────────────────────────────────────────────────────────────── */
function renderOpportunities() {
  const card = document.getElementById('oppCard');
  if (!ticker.length) { card.style.display = 'none'; return; }

  const mkt    = buildMarketMap();
  const psb    = 1 + getPSB() / 100;
  const lvl    = oppLevel;
  const search = oppSearch.toLowerCase();

  const rows = [];
  for (const bld of BLDS) {
    if (bld.c === 'retail') continue;
    for (const pk of bld.o) {
      const prod = PROD[pk];
      if (!prod) continue;
      const ab      = bld.hasAbundance ? 0.6 : 1.0;
      const pphEff  = prod.pph * lvl * psb * ab;
      const matCPU  = prod.i.reduce((s, i) => s + i.a * (mkt[+i.k] || 0), 0);
      const revDay  = pphEff * 24 * (mkt[+pk] || 0);
      const matDay  = pphEff * 24 * matCPU;
      const wagDay  = bld.w * lvl * 24 * (1 + getAO() / 100);
      const profDay = revDay - matDay - wagDay;
      const owned         = playerBuildings.some(e => e.bk === bld.k && e.pk === pk);
      const missingInputs = prod.i.some(inp => !mkt[+inp.k]);
      rows.push({ bldName: bld.n, bk: bld.k, pk, prodName: prod.n, revDay, matDay, wagDay, profDay, owned, missingInputs, hasAbundance: bld.hasAbundance });
    }
  }

  let filtered = rows;
  if (oppOwned)  filtered = filtered.filter(r => r.owned);
  if (search)    filtered = filtered.filter(r =>
    r.bldName.toLowerCase().includes(search) || r.prodName.toLowerCase().includes(search)
  );
  filtered.sort((a, b) => b.profDay - a.profDay);

  document.getElementById('oppSub').textContent =
    `Level ${lvl} · 1 building · current market prices${filtered.length !== rows.length ? ` · ${filtered.length} shown` : ''}`;

  card.style.display = 'block';
  document.getElementById('oppTbody').innerHTML = filtered.map((r, i) => {
    const pc   = r.profDay >= 0 ? 'var(--green)' : 'var(--red)';
    const bg   = r.owned ? 'background:rgba(34,197,94,.05);' : '';
    const warn = r.missingInputs
      ? ' <span style="color:var(--amber)" title="One or more input prices are $0 — profit may be overstated">⚠</span>'
      : '';
    const abundNote = r.hasAbundance
      ? ' <span style="color:var(--amber);font-size:10px" title="Calculated at 60% default abundance (statistical mean). Actual profit depends on your building\'s abundance.">60% abund.</span>'
      : '';
    return `
    <tr class="opp-row" data-idx="${i}" data-bk="${r.bk}" data-pk="${r.pk}" style="cursor:pointer;${bg}">
      <td><span class="tog" id="otog${i}">&#9658;</span></td>
      <td>${esc(r.bldName)}${r.owned ? ' <span class="badge" style="color:var(--green);border-color:var(--green)">owned</span>' : ''}</td>
      <td><div class="res">${iconHtml(r.pk)}${esc(r.prodName)}</div></td>
      <td class="num" style="color:var(--muted)">${fmtSC(r.revDay)}/day</td>
      <td class="num" style="color:var(--muted)">${fmtSC(r.matDay + r.wagDay)}/day</td>
      <td class="num" style="color:${pc};font-weight:600">${r.profDay >= 0 ? '+' : ''}${fmtSC(r.profDay)}/day${warn}${abundNote}</td>
    </tr>
    <tr class="detail-tr hide" id="odet${i}"><td colspan="6"></td></tr>`;
  }).join('');
}

/* ─────────────────────────────────────────────────────────────────────────────
   EVENT DELEGATION — deficit rows
───────────────────────────────────────────────────────────────────────────── */
document.getElementById('defTbody').addEventListener('click', e => {
  const row = e.target.closest('.def-row');
  if (!row) return;
  const i   = row.dataset.idx;
  const det = document.getElementById('det' + i);
  const tog = document.getElementById('tog' + i);
  det.classList.toggle('hide');
  tog.classList.toggle('open', !det.classList.contains('hide'));
});

/* ─────────────────────────────────────────────────────────────────────────────
   EVENT DELEGATION — opp rows
───────────────────────────────────────────────────────────────────────────── */
document.getElementById('oppTbody').addEventListener('click', e => {
  const row = e.target.closest('.opp-row');
  if (!row) return;
  const i   = row.dataset.idx;
  const det = document.getElementById('odet' + i);
  const tog = document.getElementById('otog' + i);
  const oppBld = BLDS.find(b => b.k === row.dataset.bk);
  const oppAb  = oppBld?.hasAbundance ? 0.6 : 1.0;
  det.querySelector('td').innerHTML = buildProfitDetail(row.dataset.bk, parseInt(row.dataset.pk), oppLevel, 1, oppAb);
  det.classList.toggle('hide');
  tog.classList.toggle('open', !det.classList.contains('hide'));
});

/* ─────────────────────────────────────────────────────────────────────────────
   BUILDING PROFITABILITY CONTROLS
───────────────────────────────────────────────────────────────────────────── */
document.getElementById('oppLevel').addEventListener('input', e => {
  oppLevel = Math.max(1, parseInt(e.target.value) || 1);
  renderOpportunities();
});
document.getElementById('oppSearch').addEventListener('input', e => {
  oppSearch = e.target.value;
  renderOpportunities();
});
document.getElementById('oppOwnedBtn').addEventListener('click', () => {
  oppOwned = !oppOwned;
  document.getElementById('oppOwnedBtn').classList.toggle('active', oppOwned);
  renderOpportunities();
});

/* ─────────────────────────────────────────────────────────────────────────────
   SORT BUTTONS
───────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('[data-sort]').forEach(btn => {
  btn.addEventListener('click', () => applySort(btn.dataset.tbl, btn.dataset.col, btn.dataset.dir));
});
document.querySelectorAll('th[data-sort-tbl]').forEach(th => {
  th.addEventListener('click', () => {
    const tbl = th.dataset.sortTbl;
    const col = th.dataset.sortCol;
    const dir = (sortSt[tbl].col === col && sortSt[tbl].dir === 'asc') ? 'desc' : 'asc';
    applySort(tbl, col, dir);
  });
});

/* ─────────────────────────────────────────────────────────────────────────────
   SUMMARY LINE
───────────────────────────────────────────────────────────────────────────── */
function updateSummary() {
  const strip = document.getElementById('summaryStrip');
  if (!playerBuildings.length) {
    status('No buildings configured — add your buildings in the panel above.', false);
    setRight('');
    strip.style.display = 'none';
    return;
  }
  const totalMV  = surRows.reduce((s, r) => s + r.mv, 0);
  const totalDef = defRows.reduce((s, r) => s + r.buyCost, 0);
  const net      = totalMV - totalDef;
  const netColor = net >= 0 ? 'var(--green)' : 'var(--red)';

  const totalProfit = playerBuildings.reduce((sum, e) => {
    const bld = BLDS.find(b => b.k === e.bk);
    if (!bld || bld.c !== 'production') return sum;
    const p = calcBuildingProfit(e.bk, e.pk, e.lvl || 1, e.qty, getAbundance(e));
    return p ? sum + p.profitDay : sum;
  }, 0);
  const profitColor = totalProfit >= 0 ? 'var(--green)' : 'var(--red)';

  // Best upgrade: sort by payback period (upgrade cost ÷ daily gain) so higher levels
  // don't dominate just because they have the same absolute gain but cost far more.
  // Upgrade cost: costUnits × N Construction Units for Lvl N → N+1
  const cuPrice = buildMarketMap()[111] || 0;
  const best = playerBuildings
    .map(e => {
      const bld2 = BLDS.find(b => b.k === e.bk);
      if (!bld2 || bld2.c !== 'production') return null;
      const lv = e.lvl || 1;
      if (lv >= bld2.maxLvl) return null;
      const ab   = getAbundance(e);
      const curr = calcBuildingProfit(e.bk, e.pk, lv,     1, ab);
      const next = calcBuildingProfit(e.bk, e.pk, lv + 1, 1, ab);
      if (!curr || !next) return null;
      const gain = next.profitDay - curr.profitDay;
      // costUnits × lv = CU needed; × cuPrice = monetary cost
      const upgCU   = bld2.costUnits != null ? bld2.costUnits * lv : null;
      const upgCost = upgCU != null && cuPrice > 0 ? upgCU * cuPrice : null;
      const payback = upgCost != null && gain > 0 ? upgCost / gain : null;
      return { gain, upgCU, upgCost, payback, bldName: bld2.n, prodName: PROD[e.pk]?.n || '', lv, qty: e.qty };
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Prefer shortest payback; fall back to highest gain if costs unknown
      if (a.payback != null && b.payback != null) return a.payback - b.payback;
      if (a.payback != null) return -1;
      if (b.payback != null) return  1;
      return b.gain - a.gain;
    })[0] || null;

  const bestTile = best ? (() => {
    const gc = best.gain >= 0 ? 'var(--green)' : 'var(--red)';
    const paybackLine = best.payback != null
      ? `<div style="font-size:10px;color:var(--muted);margin-top:2px">
           ~${Math.ceil(best.payback)} day payback &middot; ${fmtN(best.upgCU, 0)} CU (${fmtSC(best.upgCost)})
         </div>` : '';
    const totalLine = best.qty > 1
      ? `<div style="font-size:10px;color:var(--muted);margin-top:1px">per building &times; ${best.qty} = ${fmtSC(best.gain * best.qty)}/day total</div>` : '';
    return `
    <div class="sum-tile" style="min-width:170px">
      <div class="sum-lbl" style="color:var(--amber)">Best Upgrade &#x2191;</div>
      <div style="font-size:14px;font-weight:700;color:var(--text);margin:3px 0 1px">${esc(best.bldName)}</div>
      <div style="font-size:11px;color:var(--muted)">${esc(best.prodName)}</div>
      <div style="font-size:13px;font-weight:700;margin-top:4px;color:${gc}">
        Lvl ${best.lv}&#x2192;${best.lv + 1}: ${best.gain >= 0 ? '+' : ''}${fmtSC(best.gain)}/day
      </div>
      ${totalLine}
      ${paybackLine}
    </div>`;
  })() : '';

  strip.className = 'sum-strip';
  strip.style.display = '';
  strip.innerHTML = `
    <div class="sum-tile">
      <div class="sum-lbl">Buildings</div>
      <div class="sum-val">${playerBuildings.length}</div>
    </div>
    <div class="sum-tile">
      <div class="sum-lbl">Surplus Items</div>
      <div class="sum-val" style="color:var(--green)">${surRows.length}</div>
    </div>
    <div class="sum-tile">
      <div class="sum-lbl">Deficit Items</div>
      <div class="sum-val" style="color:${defRows.length ? 'var(--amber)' : 'var(--muted)'}">${defRows.length}</div>
    </div>
    <div class="sum-tile" style="border-color:${netColor}">
      <div class="sum-lbl">Gross / Day</div>
      <div class="sum-val" style="color:${netColor}">${net >= 0 ? '+' : ''}${fmtSC(net)}</div>
    </div>
    <div class="sum-tile" style="border-color:${profitColor}">
      <div class="sum-lbl">Net Profit / Day</div>
      <div class="sum-val" style="color:${profitColor}">${totalProfit >= 0 ? '+' : ''}${fmtSC(totalProfit)}</div>
    </div>
    ${bestTile}`;

  document.getElementById('spin').style.display = 'none';
  if (tickerAge !== null) {
    const mins = Math.ceil(tickerAge / 60);
    setRight(`Prices ${tickerAge < 60 ? tickerAge + 's' : mins + 'm'} old`);
  }
  document.getElementById('stext').textContent = '';
}

/* ─────────────────────────────────────────────────────────────────────────────
   BUILDING CONSTANTS  (wages, maxLvl from live API, cached 6h)
───────────────────────────────────────────────────────────────────────────── */
function applyBuildingConstants(data) {
  for (const b of data) {
    // API may return db_letter (snake_case) or dbLetter (camelCase)
    const letter = b.db_letter != null ? String(b.db_letter)
                 : b.dbLetter  != null ? String(b.dbLetter)
                 : null;
    if (!letter) continue;
    const bld = BLDS.find(x => x.k === letter);
    if (!bld) continue;
    if (Array.isArray(b.levelImages) && b.levelImages.length > 0) bld.maxLvl = b.levelImages.length;
    if (b.wages != null && +b.wages > 0) bld.w = +b.wages;
    // costUnits = number of Construction Units (kind 111) required per level upgrade
    const cu = b.costUnits ?? b.cost_units ?? null;
    if (cu != null && +cu > 0) bld.costUnits = +cu;
  }
}

async function loadBuildingConstants(force = false) {
  if (!force) {
    const cached = cGet('bldConst', ENCYC_TTL);
    if (cached) { applyBuildingConstants(cached); return; }
  }
  try {
    const res = await fetch(`${PROXY_URL}/api/v2/constants/buildings/`);
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      cSet('bldConst', data);
      applyBuildingConstants(data);
    }
  } catch (e) {
    console.warn('Building constants load failed:', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   ENCYCLOPEDIA LOAD  (production rates from live API, cached 6h)
───────────────────────────────────────────────────────────────────────────── */
function applyEncyclopedia(data) {
  for (const [k, v] of Object.entries(data)) {
    if (!v) continue;
    PROD[+k] = { n: v.n, pph: v.pph, i: v.i };
  }
}

async function loadEncyclopedia(force = false) {
  if (!force) {
    const cached = cGet('encyclopedia', ENCYC_TTL);
    if (cached) { applyEncyclopedia(cached); return; }
  }
  status('Syncing production data…', true);
  // 36–39 are confirmed non-existent; stop at 155 where 404s become continuous
  const SKIP = new Set([36, 37, 38, 39]);
  const kinds = Array.from({ length: 155 }, (_, i) => i + 1).filter(k => !SKIP.has(k));
  const results = await Promise.allSettled(
    kinds.map(k =>
      fetch(`${PROXY_URL}/api/v4/en/0/encyclopedia/resources/0/${k}/`)
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
    )
  );
  const data = {};
  for (let i = 0; i < kinds.length; i++) {
    const r = results[i].status === 'fulfilled' ? results[i].value : null;
    if (!r || !r.producedAnHour) continue;
    data[kinds[i]] = {
      n:   r.name,
      pph: r.producedAnHour,
      i:   (r.producedFrom || []).map(inp => ({
        k: inp.resource.db_letter,
        a: inp.amount,
      })),
    };
  }
  if (Object.keys(data).length > 0) {
    cSet('encyclopedia', data);
    applyEncyclopedia(data);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   TICKER LOAD
───────────────────────────────────────────────────────────────────────────── */
async function loadTicker(force = false) {
  status('Fetching live prices…', true);
  try {
    const data = await apiFetch('/api/v3/market-ticker/0/', 'ticker', force);
    ticker = Array.isArray(data) ? data : [];
    const age = cAge('ticker');
    tickerAge = age;
    clearErr();
    recalculate();
  } catch (err) {
    console.error('Ticker load error:', err);
    showErr(
      'Could not load market prices.',
      err?.status
        ? `HTTP ${err.status} — the proxy at ${PROXY_URL} may be waking up. Try refreshing in 30s.`
        : 'Network error — check your connection.'
    );
    status('Price fetch failed', false);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   OPTIONAL FINANCIAL SNAPSHOT
───────────────────────────────────────────────────────────────────────────── */
function showSessionModal(opts = {}) {
  const modal = document.getElementById('setupModal');
  const err   = document.getElementById('setupError');
  if (opts.error) {
    err.textContent = opts.error;
    err.style.display = 'block';
  } else {
    err.style.display = 'none';
  }
  modal.style.display = 'flex';
  document.getElementById('cookieInput').focus();
}
function hideSessionModal() {
  document.getElementById('setupModal').style.display = 'none';
}

document.getElementById('updateSessionBtn').addEventListener('click', () => {
  document.getElementById('cookieInput').value = getStoredCookie();
  showSessionModal();
});
document.getElementById('loadFinBtn').addEventListener('click', () => {
  document.getElementById('cookieInput').value = getStoredCookie();
  showSessionModal();
});
document.getElementById('saveSessionBtn').addEventListener('click', async () => {
  const val = document.getElementById('cookieInput').value.trim();
  if (!val) {
    document.getElementById('setupError').textContent = 'Paste your cookie string first.';
    document.getElementById('setupError').style.display = 'block';
    return;
  }
  saveStoredCookie(val);
  hideSessionModal();
  await loadFinancials(true);
});
document.getElementById('cookieInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('saveSessionBtn').click();
});

async function loadFinancials(force = false) {
  if (!getStoredCookie()) { showSessionModal(); return; }

  const content = document.getElementById('finContent');
  content.style.display = 'block';
  content.innerHTML = '<div style="padding:14px 16px;color:var(--muted);font-size:13px">Loading financial data…</div>';

  try {
    const [balance, income, cashflow] = await Promise.all([
      apiFetch('/api/v2/companies/me/balance-sheet/',    'balance',  force).catch(() => null),
      apiFetch('/api/v2/companies/me/income-statement/', 'income',   force).catch(() => null),
      apiFetch('/api/v2/companies/me/cashflow/recent/',  'cashflow', force).catch(() => null),
    ]);
    renderFinancials(balance, income, cashflow);
  } catch (err) {
    if (err?.type === 'auth') {
      clearStoredCookie();
      content.style.display = 'none';
      showSessionModal({ error: 'Session expired — paste a fresh cookie.' });
    } else {
      content.innerHTML = `<div class="error-box" style="margin:14px 16px">Could not load financial data. ${err?.status || 'Network error.'}</div>`;
    }
  }
}

function renderFinancials(bal, inc, cf) {
  const content = document.getElementById('finContent');
  const items   = [];

  if (bal) {
    items.push({ lbl: 'Cash',              val: fmtSC(bal.cash),                   cls: 'gold' });
    if (bal.cashReservedForOrders)
      items.push({ lbl: 'Reserved (Orders)', val: fmtSC(bal.cashReservedForOrders), cls: '' });
    if (bal.workInProcess)
      items.push({ lbl: 'Work in Process',  val: fmtSC(bal.workInProcess),          cls: '' });
    if (bal.accountsReceivable)
      items.push({ lbl: 'Accounts Rec.',    val: fmtSC(bal.accountsReceivable),     cls: 'pos' });
  }
  if (inc) {
    items.push({ lbl: 'Revenue (Period)',  val: fmtSC(inc.sales || 0),              cls: 'pos' });
    items.push({ lbl: 'COGS (Period)',     val: fmtSC(Math.abs(inc.cogs || 0)),     cls: 'neg' });
    const gp = (inc.sales || 0) + (inc.cogs || 0) + (inc.freightOut || 0);
    items.push({ lbl: 'Gross Profit',      val: fmtSC(gp),                          cls: gp >= 0 ? 'pos' : 'neg' });
  }

  let gridHtml = '';
  if (items.length) {
    gridHtml = `<div class="fin-grid">${items.map(i =>
      `<div class="fin-item"><div class="fin-lbl">${i.lbl}</div>
       <div class="fin-val ${i.cls}">${i.val}</div></div>`
    ).join('')}</div>`;
  }

  let txnHtml = '';
  if (cf?.data?.length) {
    const rows = cf.data.slice(0, 8).map(t => {
      const amt = t.amount != null ? t.amount : (t.change || 0);
      return `<div class="txn">
        <span>${esc(t.description || t.type || 'Transaction')}</span>
        <span class="txn-amt ${amt >= 0 ? 'pos' : 'neg'}">${amt >= 0 ? '+' : ''}${fmtSC(amt)}</span>
      </div>`;
    }).join('');
    txnHtml = `<div class="txn-wrap"><div class="txn-label">Recent Transactions</div>${rows}</div>`;
  }

  if (!gridHtml && !txnHtml) {
    content.innerHTML = '<div style="padding:14px 16px;color:var(--muted);font-size:13px">No financial data returned.</div>';
    return;
  }

  content.innerHTML = gridHtml + txnHtml;
}

/* ─────────────────────────────────────────────────────────────────────────────
   REFRESH BUTTON
───────────────────────────────────────────────────────────────────────────── */
document.getElementById('refreshBtn').addEventListener('click', () => {
  loadTicker(true);
});

/* ─────────────────────────────────────────────────────────────────────────────
   FORMAT HELPERS
───────────────────────────────────────────────────────────────────────────── */
function fmtN(n, dp = 1) {
  if (n == null || isNaN(n)) return '—';
  const a = Math.abs(n);
  if (a >= 1e6) return (n / 1e6).toFixed(dp) + 'M';
  if (a >= 1e3) return (n / 1e3).toFixed(dp) + 'k';
  return n.toFixed(dp);
}
function fmtSC(n) {
  if (n == null || isNaN(n)) return '—';
  const a = Math.abs(n);
  const s = n < 0 ? '-' : '';
  if (a >= 1e9) return s + '$' + (a / 1e9).toFixed(2) + 'B';
  if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(2) + 'M';
  if (a >= 1e3) return s + '$' + (a / 1e3).toFixed(1) + 'k';
  return s + '$' + a.toFixed(2);
}
function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function resImgPath(kind) {
  const name = PROD[kind]?.n || '';
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${BASE}/images/resources/${slug}.png`;
}
function iconHtml(kind) {
  const src = resImgPath(kind);
  return `<div class="ricon"><img src="${src}" loading="lazy" alt="" onerror="this.parentNode.style.display='none'"></div>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────────────────────────────── */
(async () => {
  populateBldTypeDropdown();
  document.getElementById('aoInput').value  = getAO();
  document.getElementById('psbInput').value = getPSB();
  document.getElementById('ssbInput').value = getSSB();
  renderBuildingList();
  status('Initializing…', true);
  await Promise.all([loadEncyclopedia(), loadBuildingConstants()]);
  loadTicker();
})();
