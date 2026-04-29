'use strict';

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────────────────────────── */
const PROXY_URL  = 'https://osrs-bingo-bot.containers.snapdeploy.dev';
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

// maxLvl + wages sourced from /api/v2/constants/buildings/ (overrides at runtime)
// costUnits sourced from cooperinc.xyz construction tool — drives getUpgradeCost()
const BLDS = [
  {k:'E', n:'Power Plant',                   w:414,   c:'production', maxLvl:15, costUnits:15, o:[1]},
  {k:'W', n:'Water Reservoir',               w:345,   c:'production', maxLvl:15, costUnits:6,  o:[2]},
  {k:'P', n:'Farm',                          w:103.5, c:'production', maxLvl:15, costUnits:2,  o:[3,4,5,6,40,66,72,106,118,120,136]},
  {k:'F', n:'Ranch',                         w:138,   c:'production', maxLvl:6,  costUnits:3,  o:[9,46,115,116,117]},
  {k:'M', n:'Mine',                          w:276,   c:'production', maxLvl:15, costUnits:7,  o:[14,15,68,42],    hasAbundance:true},
  {k:'O', n:'Oil Rig',                       w:517.5, c:'production', maxLvl:15, costUnits:20, o:[10,74],           hasAbundance:true},
  {k:'Q', n:'Quarry',                        w:276,   c:'production', maxLvl:15, costUnits:7,  o:[44,104,105],      hasAbundance:true},
  {k:'S', n:'Shipping Depot',                w:310.5, c:'production', maxLvl:6,  costUnits:15, o:[13]},
  {k:'Y', n:'Factory',                       w:414,   c:'production', maxLvl:15, costUnits:14, o:[16,17,18,69,43,45,76,67]},
  {k:'R', n:'Refinery',                      w:483,   c:'production', maxLvl:6,  costUnits:20, o:[11,12,19,75,83]},
  {k:'L', n:'Electronics Factory',           w:379.5, c:'production', maxLvl:15, costUnits:24, o:[20,21,22,23,24,25,26,27,28,114,47,79]},
  {k:'T', n:'Fashion Factory',               w:138,   c:'production', maxLvl:6,  costUnits:4,  o:[41,60,61,62,63,64,65,70,71]},
  {k:'1', n:'Car Factory',                   w:448.5, c:'production', maxLvl:5,  costUnits:27, o:[49,50,51,53,54,55,56,57,112]},
  {k:'D', n:'Propulsion Factory',            w:621,   c:'production', maxLvl:15, costUnits:30, o:[48,52,85,86,88,89]},
  {k:'7', n:'Aerospace Factory',             w:586.5, c:'production', maxLvl:15, costUnits:31, o:[77,78,84,87,90,92,93]},
  {k:'8', n:'Aerospace Electronics',         w:724.5, c:'production', maxLvl:15, costUnits:41, o:[80,81,82,98,99]},
  {k:'9', n:'Vertical Integration Facility', w:759,   c:'production', maxLvl:15, costUnits:33, o:[91,94]},
  {k:'0', n:'Hangar',                        w:759,   c:'production', maxLvl:15, costUnits:29, o:[95,96,97]},
  {k:'o', n:'Concrete Plant',                w:379.5, c:'production', maxLvl:15, costUnits:17, o:[101,102,103]},
  {k:'x', n:'Construction Factory',          w:483,   c:'production', maxLvl:15, costUnits:21, o:[107,108,109,110]},
  {k:'g', n:'General Contractor',            w:345,   c:'production', maxLvl:15, costUnits:14, o:[111]},
  {k:'e', n:'Slaughterhouse',                w:414,   c:'production', maxLvl:15, costUnits:6,  o:[7,8]},
  {k:'i', n:'Mill',                          w:379.5, c:'production', maxLvl:15, costUnits:8,  o:[119,133,139]},
  {k:'j', n:'Bakery',                        w:448.5, c:'production', maxLvl:15, costUnits:11, o:[137,121,123]},
  {k:'m', n:'Catering',                      w:655.5, c:'production', maxLvl:15, costUnits:30, o:[138,129,130,131,142,132,143]},
  {k:'k', n:'Food Processing Plant',         w:379.5, c:'production', maxLvl:15, costUnits:25, o:[141,128,134,122,135,127,140]},
  {k:'6', n:'Beverage Factory',              w:241.5, c:'production', maxLvl:15, costUnits:4,  o:[73,124,125,126]},
  {k:'p', n:'Plant Research Center',         w:448.5, c:'research',   maxLvl:1,  costUnits:30, o:[29]},
  {k:'h', n:'Physics Laboratory',            w:586.5, c:'research',   maxLvl:3,  costUnits:48, o:[30,31,32]},
  {k:'b', n:'Breeding Laboratory',           w:414,   c:'research',   maxLvl:3,  costUnits:28, o:[33]},
  {k:'c', n:'Chemistry Laboratory',          w:414,   c:'research',   maxLvl:3,  costUnits:28, o:[34,113]},
  {k:'a', n:'Automotive R&D',                w:552,   c:'research',   maxLvl:3,  costUnits:40, o:[58]},
  {k:'f', n:'Fashion & Design',              w:448.5, c:'research',   maxLvl:3,  costUnits:21, o:[59]},
  {k:'s', n:'Software R&D',                  w:448.5, c:'research',   maxLvl:3,  costUnits:19, o:[35]},
  {k:'l', n:'Launch Pad',                    w:724.5, c:'research',   maxLvl:3,  costUnits:36, o:[100]},
  {k:'q', n:'Kitchen',                       w:517.5, c:'research',   maxLvl:3,  costUnits:24, o:[145]},
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
  if (res.status === 401 || res.status === 403) {
    console.warn(`[apiFetch] AUTH FAILED ${res.status} — ${path}`);
    throw { type: 'auth', status: res.status, path };
  }
  if (!res.ok) {
    console.warn(`[apiFetch] HTTP ${res.status} — ${path}`);
    throw { type: 'http', status: res.status, path };
  }
  const data = await res.json();
  cSet(cacheKey, data);
  return data;
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────────────────────────── */
let ticker    = [];
let tickerAge = null;

// Warehouse / inventory data — populated from /api/v3/resources/{company_id}/
// kindId → total units in stock (aggregated across all quality/batch entries)
let warehouseStock = {};
let companyId = null;

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
  s: { col: 'netMV',   dir: 'desc' },
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
      const rp = calcRetailProfit(e.bk, e.pk, lvl, 1); // per-building rate
      if (rp) {
        rateStr = `<span style="color:var(--muted)">${fmtN(rp.unitsDay, 1)}/day</span>
                   <div style="font-size:10px;color:var(--muted);margin-top:1px">
                     ${fmtSC(rp.price)}/unit sell · ${fmtSC(rp.cogsCpu)}/unit cost · sat ${rp.sat.toFixed(2)}
                   </div>`;
      } else {
        rateStr = `<span style="color:var(--muted);font-size:11px">— open Opportunities → Retail to load</span>`;
      }
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
      if (isRetail) {
        const rp = calcRetailProfit(e.bk, e.pk, lvl, e.qty);
        if (!rp) return `<span style="color:var(--muted);font-size:11px">— open Opportunities → Retail</span>`;
        const c    = rp.profDay >= 0 ? 'var(--green)' : 'var(--red)';
        const cogs = rp.selfSupplied
          ? `<span style="color:var(--green);font-size:10px" title="Cost of goods from your own production (${fmtSC(rp.cogsCpu)}/unit)">&#10003; own stock</span>`
          : `<span style="color:var(--amber);font-size:10px" title="Cost of goods at market price (${fmtSC(rp.cogsCpu)}/unit) — build a producer to reduce costs">buy at market</span>`;
        return `<div><span style="color:${c};font-weight:600">${rp.profDay>=0?'+':''}${fmtSC(rp.profDay)}/day</span>
                <div style="margin-top:2px">${cogs}</div></div>`;
      }
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
          const upgCost = getUpgradeCost(bld, lvl, mkt2) || null;
          const payback = upgCost && gain > 0 ? Math.ceil(upgCost / gain) : null;
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

/* ─────────────────────────────────────────────────────────────────────────────
   UPGRADE / BUILD COST HELPERS

   Formula confirmed via cooperinc.xyz construction tool (cross-checked Farm
   and Ranch). All buildings share the same material multipliers keyed off
   their Construction Unit count (costUnits from the buildings API):
     Reinforced Concrete (101) = 4  × costUnits
     Bricks              (102) = 55 × costUnits
     Planks              (108) = 16 × costUnits
     Construction Units  (111) = 1  × costUnits
   Upgrade from level N → N+1 costs N × the base amounts above.
───────────────────────────────────────────────────────────────────────────── */
function hasBuildMaterials(bld) {
  return (bld.costUnits || 0) > 0;
}

// Retail profit using live cooperinc.xyz demand data.
// Returns null if retail data hasn't loaded yet.
// Cost of goods: uses the player's own production cost per unit if they produce the
// product in their buildings, otherwise falls back to buying at market price.
function calcRetailProfit(bk, pk, lvl, qty) {
  if (!_retailData) return null;
  const coopId = RETAIL_BLD_MAP[bk];
  if (!coopId) return null;
  const phase   = _retailData.economyPhase;
  const weather = _retailData.weatherMultiplier || 1;
  const bldInfo = _retailData.buildingData?.[coopId];
  const adj     = bldInfo?.retailAdjustment ?? 1;
  const pd      = _retailData.productPhaseData?.[pk]?.['0']?.[phase];
  if (!pd) return null;
  const sat     = _retailData.marketData?.[pk]?.['0']?.saturation || 1;
  const unitsHr = pd.W * sat * weather * RETAIL_FORMULA_K * adj;
  const mkt     = buildMarketMap();
  const price   = mkt[+pk] || 0;
  const l = lvl || 1, q = qty || 1;
  const unitsDay = unitsHr * l * q * 24;
  const revDay   = unitsDay * price;
  const wagDay   = (BLDS.find(b => b.k === bk)?.w || 0) * l * q * 24 * (1 + getAO() / 100);

  // Cost of goods: if the player produces this resource themselves, use their
  // production cost. Otherwise they must buy it at market price.
  const cpuOwn  = calcCostPerUnit(+pk, mkt);  // null if player doesn't produce it
  const cogsCpu = cpuOwn !== null ? cpuOwn : price;
  const cogsDay = unitsDay * cogsCpu;
  const selfSupplied = cpuOwn !== null;

  const profDay = revDay - wagDay - cogsDay;

  return { unitsHr, unitsDay, revDay, wagDay, cogsDay, cogsCpu, profDay, price, sat, selfSupplied };
}

// Theoretical production cost per unit for resource kindId at a hypothetical
// level-1 building — used for the "what if you self-supplied?" column even when
// the player doesn't own the relevant building.
function theoreticalCostPerUnit(kindId, mkt) {
  const prod = PROD[+kindId];
  if (!prod || prod.pph <= 0) return null;
  const bld = BLDS.find(b => b.o.includes(+kindId) && b.c === 'production');
  if (!bld) return null;
  const ab     = bld.hasAbundance ? 0.6 : 1.0;
  const pphEff = prod.pph * ab;
  if (pphEff <= 0) return null;
  const wageCPU = bld.w / pphEff;
  const matCPU  = prod.i.reduce((s, i) => s + i.a * (mkt[+i.k] || 0), 0);
  return wageCPU + matCPU;
}

// Cost to upgrade a building from `fromLvl` to `fromLvl + 1`.
function getUpgradeCost(bld, fromLvl, mkt) {
  const cu = bld.costUnits || 0;
  if (!cu || fromLvl < 1) return 0;
  const baseCost =
    4  * cu * (mkt[101] || 0) +   // Reinforced Concrete
    55 * cu * (mkt[102] || 0) +   // Bricks
    16 * cu * (mkt[108] || 0) +   // Planks
         cu * (mkt[111] || 0);    // Construction Units
  return fromLvl * baseCost;
}

function recalculate() {
  if (!ticker.length) return;
  calculate();
  renderSurplus();
  renderDeficit();
  updateSummary();
  // Opportunities panel is rendered on demand (via the modal button) — not auto-shown here.
  if (Object.keys(warehouseStock).length) updateWarehouseDisplay(document.getElementById('whSearch')?.value || '');
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
      const grossMV     = net * price;
      const costPerUnit = calcCostPerUnit(kind, marketMap2);
      const netMV       = costPerUnit != null ? net * (price - costPerUnit) : grossMV;
      surRows.push({ kind, name, produced: p, consumed: c, net, price, mv: grossMV, netMV, hasNetCost: costPerUnit != null });
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

// Returns the weighted-average production cost per unit for a given resource,
// computed from the player's own buildings.  Returns null if no buildings
// produce this resource (gross price should be used as fallback).
function calcCostPerUnit(kindId, mkt) {
  const psb = 1 + getPSB() / 100;
  const ao  = getAO();
  let totalUnits = 0;
  let totalCost  = 0;

  for (const e of playerBuildings) {
    if (e.pk !== kindId) continue;
    const bld  = BLDS.find(b => b.k === e.bk);
    const prod = PROD[+e.pk];
    if (!bld || !prod || bld.c === 'retail') continue;
    const lvl      = e.lvl || 1;
    const qty      = e.qty || 1;
    const ab       = getAbundance(e);
    const pphEff   = prod.pph * lvl * psb * ab;
    const unitsDay = pphEff * 24 * qty;
    if (unitsDay <= 0) continue;
    const matCPU = prod.i.reduce((s, i) => s + i.a * (mkt[+i.k] || 0), 0);
    const wagDay = bld.w * lvl * 24 * qty * (1 + ao / 100);
    const matDay = pphEff * 24 * matCPU * qty;
    totalUnits += unitsDay;
    totalCost  += wagDay + matDay;
  }

  return totalUnits > 0 ? totalCost / totalUnits : null;
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

  const hasStock = Object.keys(warehouseStock).length > 0;
  document.getElementById('surStockTh').style.display = hasStock ? '' : 'none';

  document.getElementById('surTbody').innerHTML = surRows.map(r => `
    <tr>
      <td><div class="res">${iconHtml(r.kind)}${esc(r.name)}</div></td>
      <td class="num">${fmtN(r.produced)}</td>
      <td class="num">${fmtN(r.consumed)}</td>
      <td class="num" style="color:var(--green)">+${fmtN(r.net)}</td>
      <td class="num" style="color:var(--gold)">${fmtSC(r.netMV)}${!r.hasNetCost ? ' <span style="color:var(--muted);font-size:10px" title="No buildings producing this — showing gross market value">(gross)</span>' : ''}</td>
      ${hasStock ? stockCell(r.kind, r.net) : ''}
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

  const hasStock = Object.keys(warehouseStock).length > 0;
  document.getElementById('defStockTh').style.display = hasStock ? '' : 'none';
  const defCols = hasStock ? 8 : 7;

  document.getElementById('defTbody').innerHTML = defRows.map((r, i) => {
    const chipHtml = r.mvb ? (() => {
      const m = r.mvb;
      if (r.rec === 'buy') {
        return `<span class="chip chip-buy">Buy &mdash; save ${fmtSC(m.saving)}/day</span>`;
      }
      // Compute surplus net value: full building profit minus the deficit-only saving.
      // bldProfitDay already accounts for all production (deficit portion + surplus),
      // so the difference is approximately what the surplus earns after costs.
      const surplusVal = m.bldProfitDay !== null ? m.bldProfitDay - m.saving : null;
      let label = `Make &mdash; saves ${fmtSC(m.saving)}/day on deficit`;
      if (surplusVal !== null && surplusVal > 100) {
        label += ` &middot; <span style="color:var(--green)">+${fmtSC(surplusVal)}/day surplus</span>`;
      }
      return `<span class="chip chip-make">${label}</span>`;
    })() : `<span style="color:var(--muted);font-size:11px">—</span>`;
    // For deficit: show stock and how many days of cover remain
    const stockHtml = hasStock ? stockCell(r.kind, Math.abs(r.net)) : '';

    return `
    <tr class="def-row" data-idx="${i}" style="cursor:pointer">
      <td><span class="tog" id="tog${i}">&#9658;</span></td>
      <td><div class="res">${iconHtml(r.kind)}${esc(r.name)}</div></td>
      <td class="num">${r.produced > 0.001 ? fmtN(r.produced) : '—'}</td>
      <td class="num">${fmtN(r.consumed)}</td>
      <td class="num" style="color:var(--amber)">${fmtN(r.net)}</td>
      ${stockHtml}
      <td class="num">${fmtSC(r.buyCost)}/day</td>
      <td>${chipHtml}</td>
    </tr>
    <tr class="detail-tr hide" id="det${i}">
      <td colspan="${defCols}">${mvbDetail(r)}</td>
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
   OPPORTUNITIES MODAL
───────────────────────────────────────────────────────────────────────────── */
let oppMTab    = 'build';
let oppMLevel  = 1;
let oppMOwned  = false;
let oppMSearch = '';

function openOppModal() {
  document.getElementById('oppModal').style.display = 'flex';
  renderOppModal();
}
function closeOppModal() {
  document.getElementById('oppModal').style.display = 'none';
}
function renderOppModal() {
  if (oppMTab === 'build')   renderOppBuild();
  else if (oppMTab === 'upgrade') renderOppUpgrade();
  else if (oppMTab === 'retail') {
    if (!_retailData) fetchRetailData(_retailRealm);
    else              renderOppRetail();
  }
}

function renderOppBuild() {
  const mkt    = buildMarketMap();
  const psb    = 1 + getPSB() / 100;
  const lvl    = oppMLevel;
  const search = oppMSearch.toLowerCase();

  // Build a quick-lookup of current deficits (resource kind → row)
  const defMap = {};
  for (const r of defRows) defMap[r.kind] = r;

  const rows = [];
  for (const bld of BLDS) {
    if (bld.c !== 'production') continue;
    for (const pk of bld.o) {
      const prod = PROD[pk];
      if (!prod) continue;
      const ab      = bld.hasAbundance ? 0.6 : 1.0;
      const pphEff  = prod.pph * lvl * psb * ab;
      const matCPU  = prod.i.reduce((s, i) => s + i.a * (mkt[+i.k] || 0), 0);
      const revDay  = pphEff * 24 * (mkt[+pk] || 0);
      const wagDay  = bld.w * lvl * 24 * (1 + getAO() / 100);
      const profDay = revDay - pphEff * 24 * matCPU - wagDay;
      const owned         = playerBuildings.some(e => e.bk === bld.k && e.pk === pk);
      const missingInputs = prod.i.some(inp => !mkt[+inp.k]);
      // Build cost = 1 × base cost (same formula as upgrading from L1 → L2)
      const buildCost = getUpgradeCost(bld, 1, mkt);
      const payback   = buildCost > 0 && profDay > 0 ? Math.ceil(buildCost / profDay) : null;
      rows.push({ bldName: bld.n, bk: bld.k, pk, prodName: prod.n, profDay, owned,
                  missingInputs, hasAbundance: bld.hasAbundance,
                  def: defMap[pk] || null, buildCost, payback });
    }
  }

  let filtered = rows;
  if (oppMOwned) filtered = filtered.filter(r => r.owned);
  if (search)    filtered = filtered.filter(r =>
    r.bldName.toLowerCase().includes(search) || r.prodName.toLowerCase().includes(search));
  filtered.sort((a, b) => b.profDay - a.profDay);

  document.getElementById('oppMBuildTbody').innerHTML = filtered.map((r, i) => {
    const pc   = r.profDay >= 0 ? 'var(--green)' : 'var(--red)';
    const warn = r.missingInputs
      ? ' <span style="color:var(--amber)" title="One or more input prices are $0">⚠</span>' : '';
    const abund = r.hasAbundance
      ? ' <span style="color:var(--amber);font-size:10px" title="Calculated at 60% mean abundance">60% abund.</span>' : '';
    const owned = r.owned
      ? ' <span class="badge" style="color:var(--green);border-color:var(--green)">owned</span>' : '';

    const defCell = r.def
      ? `<span style="color:var(--amber);font-size:12px">&#10003; ${esc(r.def.name)}&nbsp;&mdash;&nbsp;saves ${fmtSC(r.def.buyCost)}/day</span>`
      : `<span style="color:var(--muted)">—</span>`;

    const costCell = r.buildCost > 0
      ? fmtSC(r.buildCost)
      : `<span style="color:var(--muted)">—</span>`;

    const payCell = r.payback != null
      ? `<span style="color:${r.payback<=30?'var(--green)':r.payback<=90?'var(--amber)':'var(--red)'}">${r.payback}d</span>`
      : `<span style="color:var(--muted)">—</span>`;

    return `
    <tr class="opp-row" data-bk="${r.bk}" data-pk="${r.pk}" style="cursor:pointer">
      <td><span class="tog" id="omtog${i}">&#9658;</span></td>
      <td>${esc(r.bldName)}${owned}</td>
      <td><div class="res">${iconHtml(r.pk)}${esc(r.prodName)}</div></td>
      <td class="num" style="color:${pc};font-weight:600">${r.profDay>=0?'+':''}${fmtSC(r.profDay)}/day${warn}${abund}</td>
      <td>${defCell}</td>
      <td class="num" style="color:var(--muted);font-size:12px">${costCell}</td>
      <td class="num">${payCell}</td>
    </tr>
    <tr class="detail-tr hide" id="omdet${i}"><td colspan="7"></td></tr>`;
  }).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">No results</td></tr>`;
}

function renderOppUpgrade() {
  const mkt = buildMarketMap();
  const tbody = document.getElementById('oppMUpgTbody');
  const note  = document.getElementById('oppMUpgNote');

  if (!playerBuildings.length) {
    note.textContent = '';
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">No buildings added yet — import your buildings first.</td></tr>`;
    return;
  }

  const rows = [];
  for (const e of playerBuildings) {
    const bld = BLDS.find(b => b.k === e.bk);
    if (!bld || bld.c !== 'production') continue;
    const lv = e.lvl || 1;
    if (lv >= (bld.maxLvl || 15)) continue;
    const ab   = getAbundance(e);
    const curr = calcBuildingProfit(e.bk, e.pk, lv,     1, ab);
    const next = calcBuildingProfit(e.bk, e.pk, lv + 1, 1, ab);
    if (!curr || !next) continue;
    const gain    = next.profitDay - curr.profitDay;
    const upgCost = getUpgradeCost(bld, lv, mkt);
    const payback = upgCost > 0 && gain > 0 ? Math.ceil(upgCost / gain) : null;
    rows.push({ bldName: bld.n, pk: e.pk, lv, gain, upgCost, payback, qty: e.qty || 1 });
  }

  note.textContent = '';

  rows.sort((a, b) => {
    if (a.payback != null && b.payback != null) return a.payback - b.payback;
    if (a.payback != null) return -1;
    if (b.payback != null) return  1;
    return b.gain - a.gain;
  });

  tbody.innerHTML = rows.map(r => {
    const gc = r.gain >= 0 ? 'var(--green)' : 'var(--red)';
    const qty = r.qty > 1
      ? ` <span style="color:var(--muted);font-size:10px">×${r.qty} = ${fmtSC(r.gain*r.qty)}/day</span>` : '';
    const costCell = r.upgCost > 0
      ? fmtSC(r.upgCost)
      : `<span style="color:var(--muted)">—</span>`;
    const payCell = r.payback != null
      ? `<span style="color:${r.payback<=30?'var(--green)':r.payback<=90?'var(--amber)':'var(--red)'}">
           ${r.payback}d
         </span>`
      : `<span style="color:var(--muted)">—</span>`;
    return `<tr>
      <td>${esc(r.bldName)}</td>
      <td><div class="res">${iconHtml(r.pk)}${esc(PROD[r.pk]?.n||'')}</div></td>
      <td class="num" style="color:var(--muted)">Lvl ${r.lv} &rarr; ${r.lv+1}</td>
      <td class="num" style="color:${gc};font-weight:600">${r.gain>=0?'+':''}${fmtSC(r.gain)}/day${qty}</td>
      <td class="num" style="color:var(--muted);font-size:12px">${costCell}</td>
      <td class="num">${payCell}</td>
    </tr>`;
  }).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px">All owned buildings are at max level.</td></tr>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   RETAIL TAB
   Formula verified empirically (Farm/Sausages/Eggs data points):
     units/hr/level = W × saturation × weatherMultiplier × 1.15
   where W, saturation, weatherMultiplier come from cooperinc.xyz/api/initial-data
   (public API, CORS: * — no proxy needed).
───────────────────────────────────────────────────────────────────────────── */
let _retailData   = null;   // cached API response
let _retailRealm  = 'r1';   // 'r1' = Magnates, 'r2' = Entrepreneurs
const RETAIL_FORMULA_K = 1.15;  // empirical constant from formula derivation

// Map our BLDS retail letter keys → cooperinc buildingID keys (both from SimCompanies db_letter)
const RETAIL_BLD_MAP = { G:'G', N:'N', C:'H', U:'C', V:'2', B:'B' };

async function fetchRetailData(realm) {
  document.getElementById('oppRetailStatus').textContent = 'Loading retail data…';
  try {
    const r = await fetch(`https://cooperinc.xyz/api/initial-data?realm=${realm}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    _retailData  = await r.json();
    _retailRealm = realm;
    document.getElementById('oppRetailStatus').textContent = '';
    const phase = _retailData.economyPhase || '';
    const w     = _retailData.weatherMultiplier ? ` · Weather ×${_retailData.weatherMultiplier.toFixed(2)}` : '';
    document.getElementById('oppRetailMeta').textContent = `${phase} economy${w} · live data`;
  } catch (e) {
    document.getElementById('oppRetailStatus').textContent = `Failed to load: ${e.message}`;
    _retailData = null;
  }
  renderOppRetail();
  // Refresh the building list too — retail buildings now have live profit data
  renderBuildingList();
}

function renderOppRetail() {
  const tbody = document.getElementById('oppMRetailTbody');
  if (!_retailData) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px">
      Retail data not loaded — select a realm above.</td></tr>`;
    return;
  }

  const mkt      = buildMarketMap();
  const phase    = _retailData.economyPhase;
  const weather  = _retailData.weatherMultiplier || 1;
  const buildings = _retailData.buildings  || {};
  const phaseData = _retailData.productPhaseData || {};
  const mktData   = _retailData.marketData || {};
  const bldData   = _retailData.buildingData || {};

  const rows = [];

  for (const bld of BLDS) {
    if (bld.c !== 'retail') continue;
    const coopId = RETAIL_BLD_MAP[bld.k];
    if (!coopId) continue;
    const coopBld = buildings[coopId];
    if (!coopBld) continue;

    const wageDay  = (bldData[coopId]?.baseWage || bld.w) * 24;
    const adj      = bldData[coopId]?.retailAdjustment ?? 1;
    const products = coopBld.products || [];

    // Find best product ranked by self-supply net profit (best realistic scenario)
    let bestProduct = null, bestProfit = -Infinity;

    for (const pid of products) {
      const pd = phaseData[pid]?.['0']?.[phase];
      if (!pd) continue;
      const sat      = mktData[pid]?.['0']?.saturation || 1;
      const unitsHr  = pd.W * sat * weather * RETAIL_FORMULA_K * adj;
      const price    = mkt[pid] || 0;
      if (!price) continue;
      const unitsDay = unitsHr * 24;
      const grossDay = unitsDay * price;

      // Market scenario: buy goods at market price
      const mktNetDay = grossDay - wageDay - unitsDay * price;

      // Self-supply scenario: use own production cost if available,
      // otherwise compute theoretical L1 cost so the column always shows
      const cpuOwn     = calcCostPerUnit(+pid, mkt);
      const cpuTheory  = theoreticalCostPerUnit(+pid, mkt);
      const selfCpu    = cpuOwn ?? cpuTheory;
      const selfNetDay = selfCpu != null ? grossDay - wageDay - unitsDay * selfCpu : null;
      const selfSupplied = cpuOwn !== null;  // actually producing it right now

      // Current net = what the player actually experiences today
      const currentNetDay = selfSupplied && selfNetDay != null ? selfNetDay : mktNetDay;

      // Rank by self-supply net (best achievable)
      const rankVal = selfNetDay ?? mktNetDay;
      if (rankVal > bestProfit) {
        bestProfit = rankVal;
        bestProduct = { pid, name: PROD[pid]?.n || `#${pid}`,
                        unitsHr, unitsDay, grossDay, wageDay,
                        mktNetDay, selfNetDay, selfCpu, selfSupplied, currentNetDay,
                        sat, price };
      }
    }

    rows.push({ bld, wageDay, bestProduct });
  }

  rows.sort((a, b) => {
    const aVal = a.bestProduct ? (a.bestProduct.selfNetDay ?? a.bestProduct.mktNetDay) : -Infinity;
    const bVal = b.bestProduct ? (b.bestProduct.selfNetDay ?? b.bestProduct.mktNetDay) : -Infinity;
    return bVal - aVal;
  });

  const fmtNet = (val, isCurrent) => {
    if (val == null) return `<span style="color:var(--muted)">—</span>`;
    const c = val >= 0 ? 'var(--green)' : 'var(--red)';
    const bold = isCurrent ? 'font-weight:700' : 'font-weight:400;opacity:0.75';
    const marker = isCurrent ? ' &#9664;' : '';
    return `<span style="color:${c};${bold}">${val>=0?'+':''}${fmtSC(val)}/day${marker}</span>`;
  };

  tbody.innerHTML = rows.map((r, i) => {
    const bp = r.bestProduct;
    if (!bp) return `<tr>
      <td></td><td>${esc(r.bld.n)}</td>
      <td colspan="6" style="color:var(--muted);font-size:12px">No live price data for products in this building</td>
    </tr>`;

    const supplyBadge = bp.selfSupplied
      ? `<span style="color:var(--green);font-size:10px">&#10003; own production</span>`
      : `<span style="color:var(--amber);font-size:10px">buying at market</span>`;

    return `
    <tr class="retail-row" style="cursor:default">
      <td><span class="tog" id="mrtog${i}">&#9658;</span></td>
      <td><strong>${esc(r.bld.n)}</strong></td>
      <td><div class="res">${iconHtml(bp.pid)}${esc(bp.name)}
        <span style="color:var(--muted);font-size:10px;margin-left:4px">sat ${bp.sat.toFixed(2)}</span>
        <div style="margin-top:2px">${supplyBadge}</div>
      </div></td>
      <td class="num" style="color:var(--muted)">${fmtN(bp.unitsHr, 1)}/hr</td>
      <td class="num" style="color:var(--muted)">${fmtSC(bp.grossDay)}/day</td>
      <td class="num">${fmtNet(bp.mktNetDay,  !bp.selfSupplied)}</td>
      <td class="num">${fmtNet(bp.selfNetDay,  bp.selfSupplied)}</td>
      <td class="num">${fmtNet(bp.currentNetDay, true)}</td>
    </tr>
    <tr class="detail-tr hide" id="mrdet${i}"><td colspan="8"></td></tr>`;
  }).join('') || `<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:24px">No retail buildings found.</td></tr>`;
}

// ── Opportunities modal events ────────────────────────────────────────────
document.getElementById('oppModalBtn').addEventListener('click', openOppModal);
document.getElementById('oppModalClose').addEventListener('click', closeOppModal);
document.getElementById('oppModal').addEventListener('click', e => {
  if (e.target === document.getElementById('oppModal')) closeOppModal();
});

// Expandable detail rows in the Build tab
document.getElementById('oppMBuildTbody').addEventListener('click', e => {
  const row = e.target.closest('.opp-row');
  if (!row) return;
  // Find the index from the toggle button id
  const tog = row.querySelector('.tog');
  if (!tog) return;
  const idx = tog.id.replace('omtog', '');
  const det = document.getElementById('omdet' + idx);
  if (!det) return;
  const bk  = row.dataset.bk;
  const pk  = parseInt(row.dataset.pk);
  const bld = BLDS.find(b => b.k === bk);
  const ab  = bld?.hasAbundance ? 0.6 : 1.0;
  if (!det.classList.contains('hide')) {
    det.classList.add('hide');
    tog.classList.remove('open');
  } else {
    det.querySelector('td').innerHTML = buildProfitDetail(bk, pk, oppMLevel, 1, ab);
    det.classList.remove('hide');
    tog.classList.add('open');
  }
});
document.querySelectorAll('[data-opp-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    oppMTab = btn.dataset.oppTab;
    document.querySelectorAll('.opp-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('opp-pane-build').style.display   = oppMTab === 'build'   ? '' : 'none';
    document.getElementById('opp-pane-upgrade').style.display = oppMTab === 'upgrade' ? '' : 'none';
    document.getElementById('opp-pane-retail').style.display  = oppMTab === 'retail'  ? '' : 'none';
    renderOppModal();
  });
});
document.getElementById('oppMLevel').addEventListener('input', e => {
  oppMLevel = Math.max(1, parseInt(e.target.value) || 1);
  renderOppBuild();
});
document.getElementById('oppMSearch').addEventListener('input', e => {
  oppMSearch = e.target.value;
  renderOppBuild();
});
document.getElementById('oppMOwnedBtn').addEventListener('click', () => {
  oppMOwned = !oppMOwned;
  document.getElementById('oppMOwnedBtn').classList.toggle('active', oppMOwned);
  renderOppBuild();
});
document.getElementById('oppMRealm').addEventListener('change', e => {
  _retailData = null; // invalidate cache when realm changes
  fetchRetailData(e.target.value);
});

/* ─────────────────────────────────────────────────────────────────────────────
   RENDER — BUILDING PROFITABILITY
───────────────────────────────────────────────────────────────────────────── */
function renderOpportunities() {
  // This function now only renders the legacy inline card (kept for internal use).
  // The primary UI is the Opportunities modal — see renderOppBuild / renderOppUpgrade.
  const card = document.getElementById('oppCard');
  card.style.display = 'none'; return; // suppress the inline card — use the modal instead
  if (!ticker.length) { card.style.display = 'none'; return; } // eslint-disable-line

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
/* ─────────────────────────────────────────────────────────────────────────────
   WAREHOUSE SEARCH
───────────────────────────────────────────────────────────────────────────── */
document.getElementById('whSearch').addEventListener('input', e => {
  updateWarehouseDisplay(e.target.value);
});

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

  // Best upgrade: sort by payback period (upgrade cost ÷ daily gain).
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
      const gain    = next.profitDay - curr.profitDay;
      const mktNow  = buildMarketMap();
      const upgCost = getUpgradeCost(bld2, lv, mktNow) || null;
      const upgCU   = bld2.costUnits != null ? bld2.costUnits * lv : null;
      const payback = upgCost && gain > 0 ? upgCost / gain : null;
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
    const letter = b.db_letter != null ? String(b.db_letter)
                 : b.dbLetter  != null ? String(b.dbLetter)
                 : null;
    if (!letter) continue;
    const bld = BLDS.find(x => x.k === letter);
    if (!bld) continue;
    if (Array.isArray(b.levelImages) && b.levelImages.length > 0) bld.maxLvl = b.levelImages.length;
    if (b.wages != null && +b.wages > 0) bld.w = +b.wages;
    // costUnits drives the full upgrade cost formula — see getUpgradeCost()
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
   SERVER WAKE-UP
   SnapDeploy containers sleep when idle and take ~30s to cold-start.
   This pings /ping repeatedly and shows a live countdown so the user knows
   what's happening.  Resolves as soon as the server responds (or times out).
───────────────────────────────────────────────────────────────────────────── */
// Cached promise — both the boot path and the cookie-sync path can call
// wakeServer() and they all wait on the same underlying operation.
let _wakePromise = null;
function wakeServer() {
  if (!_wakePromise) _wakePromise = _wakeServerImpl();
  return _wakePromise;
}
async function _wakeServerImpl() {
  const MAX_MS  = 90_000;  // give up after 90s
  const RETRY   = 2_000;   // re-ping every 2s
  const TIMEOUT = 5_000;   // abort each individual attempt after 5s
  const start   = Date.now();

  // Wake the container with a hidden iframe.
  // fetch(), no-cors fetch, and image probes all fail to wake SnapDeploy because
  // their cold-start proxy only triggers container boot on real browser navigation
  // requests (Accept: text/html, proper Referer, no cross-origin fetch headers).
  // An iframe IS a real browser navigation — it looks identical to the user typing
  // the URL into a new tab, which is the one thing that reliably wakes the container.
  const _wakeFrame = document.createElement('iframe');
  _wakeFrame.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
  _wakeFrame.src = `${PROXY_URL}/healthz?_wake=${Date.now()}`;
  document.body.appendChild(_wakeFrame);
  // Clean up the iframe after 15s — by then the container is either awake or won't be.
  setTimeout(() => _wakeFrame.remove(), 15_000);

  while (true) {
    try {
      const ctrl = new AbortController();
      const t    = setTimeout(() => ctrl.abort(), TIMEOUT);
      const res  = await fetch(`${PROXY_URL}/healthz`, { signal: ctrl.signal });
      clearTimeout(t);
      // Only trust a real { ok: true } JSON reply from our Express server.
      // SnapDeploy's sleep-proxy can return 200 OK with an HTML splash page
      // before Express has started — checking the JSON body avoids a false positive.
      if (res.ok) {
        try { const j = await res.json(); if (j?.ok) return; } catch {}
      }
    } catch { /* CORS error or network error — container still waking */ }

    const elapsed = Math.round((Date.now() - start) / 1000);
    if (Date.now() - start >= MAX_MS) {
      status('Server is not responding — try refreshing in a moment.', false);
      return;
    }
    status(`Server waking up… ${elapsed}s (usually ~60s on first load)`, true);
    await new Promise(r => setTimeout(r, RETRY));
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
document.getElementById('modalCloseBtn').addEventListener('click', hideSessionModal);
document.getElementById('saveSessionBtn').addEventListener('click', async () => {
  const val = document.getElementById('cookieInput').value.trim();
  if (!val) {
    document.getElementById('setupError').textContent = 'Paste your cookie string first.';
    document.getElementById('setupError').style.display = 'block';
    return;
  }
  saveStoredCookie(val);
  hideSessionModal();
  // Load financials + pull company profile (auto-sets AO/speed inputs, non-destructive).
  // Building import is intentionally kept manual via the "Import from Game" button.
  await Promise.all([
    loadFinancials(true),
    syncCompanyProfile(),
  ]);
});
document.getElementById('cookieInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('saveSessionBtn').click();
});

async function loadFinancials(force = false) {
  if (!getStoredCookie()) { showSessionModal(); return; }

  const content = document.getElementById('finContent');
  content.style.display = 'block';
  content.innerHTML = '<div style="padding:14px 16px;color:var(--muted);font-size:13px">Loading financial data…</div>';

  // Track whether any request came back as unauthorised
  let authFailed = false;
  const catchErr = (label) => (err) => {
    console.warn(`[loadFinancials] ${label}:`, err);
    if (err?.type === 'auth') authFailed = true;
    return null;
  };

  try {
    const [balance, income, cashflow] = await Promise.all([
      apiFetch('/api/v2/companies/me/balance-sheet/',    'balance',  force).catch(catchErr('balance-sheet')),
      apiFetch('/api/v2/companies/me/income-statement/', 'income',   force).catch(catchErr('income-statement')),
      apiFetch('/api/v2/companies/me/cashflow/recent/',  'cashflow', force).catch(catchErr('cashflow')),
    ]);

    if (authFailed) {
      clearStoredCookie();
      content.style.display = 'none';
      showSessionModal({ error: 'Session rejected — the cookie may have expired. Paste a fresh one.' });
      return;
    }

    renderFinancials(balance, income, cashflow);
  } catch (err) {
    console.error('[loadFinancials] unexpected error:', err);
    content.innerHTML = `<div class="error-box" style="margin:14px 16px">Could not load financial data — ${err?.status ? 'HTTP ' + err.status : 'network error'}. Check the browser console for details.</div>`;
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
   SYNC COMPANY PROFILE (auto-set AO + PSB from game account)
───────────────────────────────────────────────────────────────────────────── */
async function syncCompanyProfile() {
  try {
    // /api/v3/companies/auth-data/ is the master bootstrap — returns authCompany with adminOverhead.
    // Fall back to the direct /companies/me/ profile endpoint if auth-data fails.
    let company = null;

    const cookie = getStoredCookie();
    console.log('[profile sync] cookie present:', !!cookie, '— length:', cookie.length, '— starts with:', cookie.slice(0, 60));

    const authData = await apiFetch('/api/v3/companies/auth-data/', 'me_authdata', true)
      .catch(err => { console.warn('[profile sync] auth-data error:', err); return null; });
    console.log('[profile sync] auth-data result:', authData);

    if (authData) {
      company = authData.authCompany ?? authData;
      console.log('[profile sync] using auth-data company:', company);
    } else {
      const profile = await apiFetch('/api/v2/companies/me/', 'me_profile', true)
        .catch(err => { console.warn('[profile sync] /me/ error:', err); return null; });
      company = profile;
      console.log('[profile sync] /me/ fallback result:', profile);
    }

    if (!company) { console.warn('[syncCompanyProfile] no company data returned'); return; }

    // Log all keys so we can see the exact field names if something is missing
    console.log('[profile sync] company keys:', Object.keys(company));

    // Store company ID — needed for the warehouse endpoint.
    // Try every known variant; the API docs say "id" but camelCase variants exist too.
    const cId = company.id ?? company.companyId ?? company.company_id ?? company.db_id ?? null;
    console.log('[profile sync] resolved company id:', cId);
    if (cId) {
      companyId = +cId;
      loadWarehouse(companyId); // fire-and-forget; re-renders when ready
    } else {
      // Last resort: hit the direct profile endpoint which is documented to return `id`
      console.warn('[profile sync] no id in authCompany — trying /api/v2/companies/me/ for id');
      apiFetch('/api/v2/companies/me/', 'me_profile', true)
        .then(p => {
          const fallbackId = p?.id ?? p?.companyId ?? null;
          console.log('[profile sync] fallback id:', fallbackId);
          if (fallbackId) { companyId = +fallbackId; loadWarehouse(companyId); }
        })
        .catch(err => console.warn('[profile sync] fallback /me/ failed:', err));
    }

    // Admin overhead (confirmed field: adminOverhead per API docs)
    const ao = company.adminOverhead ?? company.admin_overhead ?? null;
    if (ao != null && !isNaN(+ao) && +ao >= 0) {
      document.getElementById('aoInput').value = +ao;
      document.getElementById('aoInput').dispatchEvent(new Event('input'));
    }

    // Production / sales speed bonuses — not in the documented fields but try common names
    const psb = company.productionSpeedBonus ?? company.production_speed_bonus
              ?? company.productionBonus     ?? company.production_bonus
              ?? null;
    if (psb != null && !isNaN(+psb) && +psb >= 0) {
      document.getElementById('psbInput').value = +psb;
      document.getElementById('psbInput').dispatchEvent(new Event('input'));
    }

    const ssb = company.salesSpeedBonus ?? company.sales_speed_bonus
              ?? company.salesBonus     ?? company.sales_bonus
              ?? null;
    if (ssb != null && !isNaN(+ssb) && +ssb >= 0) {
      document.getElementById('ssbInput').value = +ssb;
      document.getElementById('ssbInput').dispatchEvent(new Event('input'));
    }
  } catch (err) {
    console.warn('[syncCompanyProfile] failed:', err);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   WAREHOUSE / INVENTORY
───────────────────────────────────────────────────────────────────────────── */
async function loadWarehouse(cId) {
  if (!cId) return;
  try {
    const data = await apiFetch(`/api/v3/resources/${cId}/`, 'warehouse', true);
    console.log('[loadWarehouse] raw response:', data);
    if (!Array.isArray(data)) return;

    // Aggregate total stock per resource kind across all batches/quality tiers
    warehouseStock = {};
    for (const item of data) {
      const k = +(item.kind ?? item.resource_kind ?? item.resourceKind ?? 0);
      if (!k) continue;
      warehouseStock[k] = (warehouseStock[k] || 0) + +(item.amount ?? item.quantity ?? 0);
    }

    // Re-render tables and display to pick up stock columns
    if (surRows.length) renderSurplus();
    if (defRows.length) renderDeficit();
    updateWarehouseDisplay();

    // Show stock column headers now that we have data
    const hasStock = Object.keys(warehouseStock).length > 0;
    document.getElementById('surStockTh').style.display = hasStock ? '' : 'none';
    document.getElementById('defStockTh').style.display = hasStock ? '' : 'none';

  } catch (err) {
    console.warn('[loadWarehouse] failed:', err);
  }
}

function stockCell(kindId, netPerDay) {
  const amt = warehouseStock[kindId];
  if (!amt) return '<td class="num" style="color:var(--muted)">—</td>';
  const days = netPerDay > 0 ? (amt / netPerDay) : null;
  const daysStr = days != null ? ` <span style="color:var(--muted);font-size:10px">(${days.toFixed(1)}d)</span>` : '';
  return `<td class="num">${fmtN(amt)}${daysStr}</td>`;
}

function updateWarehouseDisplay(filter = '') {
  const card   = document.getElementById('whCard');
  const tbody  = document.getElementById('whTbody');
  const badge  = document.getElementById('whCount');
  const valEl  = document.getElementById('whValue');
  if (!card || !tbody) return;

  const mkt = buildMarketMap();

  // Build a net-flow lookup from surRows / defRows for days-of-cover
  const flowMap = {}; // kind → net units/day (+surplus, -deficit)
  for (const r of surRows) flowMap[r.kind] = +(flowMap[r.kind] || 0) + r.net;
  for (const r of defRows) flowMap[r.kind] = +(flowMap[r.kind] || 0) + r.net; // net is negative for deficits

  const lc = filter.toLowerCase();
  const rows = Object.entries(warehouseStock)
    .filter(([k, amt]) => amt > 0 && PROD[+k])
    .map(([k, amt]) => {
      const kind  = +k;
      const price = mkt[kind] || 0;
      const value = amt * price;
      const name  = PROD[kind].n;
      const flow  = flowMap[kind] ?? null;   // null = no buildings using this resource
      const days  = flow != null && flow !== 0 ? amt / Math.abs(flow) : null;
      return { kind, name, amt, price, value, flow, days };
    })
    .filter(r => !lc || r.name.toLowerCase().includes(lc))
    .sort((a, b) => b.value - a.value);

  const totalValue = rows.reduce((s, r) => s + r.value, 0);

  badge.textContent = rows.length;
  valEl.textContent = `Est. value ${fmtSC(totalValue)}`;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="color:var(--muted);padding:14px 12px;font-size:12px">${filter ? 'No matching resources.' : 'Warehouse is empty.'}</td></tr>`;
    card.style.display = 'block';
    return;
  }

  tbody.innerHTML = rows.map(r => {
    // Daily flow cell
    let flowHtml = '<td class="num" style="color:var(--muted)">—</td>';
    if (r.flow != null) {
      const sign = r.flow >= 0 ? '+' : '';
      const cls  = r.flow >= 0 ? 'var(--green)' : 'var(--amber)';
      flowHtml = `<td class="num" style="color:${cls}">${sign}${fmtN(r.flow)}/day</td>`;
    }

    // Days-of-cover cell
    let coverHtml = '<td class="num" style="color:var(--muted)">—</td>';
    if (r.days != null) {
      let cls = 'cover-pos';
      if (r.flow < 0 && r.days < 1)  cls = 'cover-warn';   // less than 1 day — red
      else if (r.flow < 0 && r.days < 3) cls = 'cover-neg'; // less than 3 days — amber
      const label = r.flow >= 0 ? `${r.days.toFixed(1)}d buffer` : `${r.days.toFixed(1)}d left`;
      coverHtml = `<td class="num ${cls}">${label}</td>`;
    }

    return `<tr>
      <td><div class="res">${iconHtml(r.kind)}${esc(r.name)}</div></td>
      <td class="num">${fmtN(r.amt)}</td>
      <td class="num" style="color:var(--muted)">${r.price ? fmtSC(r.price) : '—'}</td>
      <td class="num" style="color:var(--gold)">${r.value ? fmtSC(r.value) : '—'}</td>
      ${flowHtml}
      ${coverHtml}
    </tr>`;
  }).join('');

  card.style.display = 'block';
}

/* ─────────────────────────────────────────────────────────────────────────────
   SYNC BUILDINGS FROM GAME
───────────────────────────────────────────────────────────────────────────── */
// Reverse-map a building name (from the API) to a BLDS kind letter.
// The API returns the human-readable name, e.g. "Mine", "Power Plant".
function bldKindFromName(name) {
  if (!name) return null;
  const n = String(name).trim().toLowerCase();
  // Exact match first
  const exact = BLDS.find(b => b.n.toLowerCase() === n);
  if (exact) return exact.k;
  // Partial match as fallback (e.g. "Car Factory" vs "car factory (speed)")
  const partial = BLDS.find(b => n.includes(b.n.toLowerCase()) || b.n.toLowerCase().includes(n));
  return partial ? partial.k : null;
}

async function syncBuildingsFromGame() {
  if (!getStoredCookie()) { showSessionModal(); return; }

  const btn  = document.getElementById('syncBldBtn');
  const orig = btn ? btn.textContent : '';
  if (btn) { btn.textContent = 'Syncing…'; btn.disabled = true; }

  try {
    const data = await apiFetch('/api/v2/companies/me/buildings/', 'me_buildings', true);
    console.log('[syncBuildingsFromGame] raw response:', data);

    if (!Array.isArray(data)) throw new Error('Unexpected response format (not an array)');

    const newBuildings = [];
    const skippedNames = []; // building names we couldn't resolve product for

    for (const b of data) {
      // API docs confirm: name (building type name), size (level).
      // Product kind is NOT a documented field — try every possible variant anyway.
      const lvl = +(b.size ?? b.level ?? 1);
      if (lvl < 1) continue;

      // Resolve building kind: try direct fields first, then name reverse-lookup
      let bk = String(b.kind ?? b.db_letter ?? b.dbLetter ?? '');
      if (!bk || !BLDS.find(x => x.k === bk)) bk = bldKindFromName(b.name) ?? '';
      if (!bk) {
        console.log('[sync] unrecognised building:', b);
        skippedNames.push(b.name ?? '(unknown)');
        continue;
      }

      const bldDef = BLDS.find(x => x.k === bk);
      if (!bldDef) { skippedNames.push(b.name ?? bk); continue; }

      // Try every known/undocumented field for product kind
      let pk = +(
        b.producing_kind  ?? b.producingKind  ??
        b.production_kind ?? b.productionKind ??
        b.producing       ?? b.product_kind   ??
        b.productKind     ??
        b.busy?.kind      ?? b.busy?.resource_kind ??
        b.busy?.sales_order?.kind ?? b.busy?.salesOrder?.kind ??
        0
      );

      // Single-product buildings: auto-fill (Power Plant, Water Reservoir, etc.)
      if (!pk && bldDef.o.length === 1) pk = bldDef.o[0];

      if (!pk || !PROD[pk]) {
        const label = `${b.name ?? bldDef.n} Lvl ${lvl}`;
        console.log(`[sync] skipped "${label}" — API returned no product kind. Fields:`, Object.keys(b));
        skippedNames.push(label);
        continue;
      }

      const existing = newBuildings.find(e => e.bk === bk && e.pk === pk && (e.lvl || 1) === lvl);
      if (existing) {
        existing.qty++;
      } else {
        const entry = { bk, pk, qty: 1, lvl };
        if (bldDef.c === 'retail') entry.targetRate = (bldDef.rpph || 0) * lvl * 24;
        if (bldDef.hasAbundance)   entry.abundance  = 0.6;
        newBuildings.push(entry);
      }
    }

    // Build a human-readable summary for the user
    if (data.length === 0) {
      alert('No buildings found in your game account.');
      return;
    }

    if (newBuildings.length === 0) {
      // Got buildings but none had a resolvable product
      const skipList = skippedNames.slice(0, 10).join('\n  • ');
      alert(
        `Found ${data.length} building(s) but couldn't determine what they produce.\n\n` +
        `Buildings found:\n  • ${skipList}${skippedNames.length > 10 ? `\n  … and ${skippedNames.length - 10} more` : ''}\n\n` +
        `These are likely multi-product buildings (Farm, Mine, Factory, etc.).\n` +
        `The SimCompanies API doesn't return the chosen product for each building.\n\n` +
        `Please add them manually using the form above — choose the building, then select which product it's set to make.\n\n` +
        `(Tip: open F12 → Console and look for "[syncBuildingsFromGame] raw response" to see all API fields — ` +
        `if you spot a product field not listed here, let the developer know.)`
      );
      return;
    }

    // Some could be imported, some couldn't
    let confirmMsg = playerBuildings.length > 0
      ? `Replace your ${playerBuildings.length} existing building(s) with ${newBuildings.length} imported from game?`
      : `Import ${newBuildings.length} building(s) from game?`;

    if (skippedNames.length > 0) {
      const skipList = skippedNames.slice(0, 8).join(', ');
      confirmMsg += `\n\n⚠ ${skippedNames.length} building(s) could not be auto-imported (multi-product — add manually):\n${skipList}${skippedNames.length > 8 ? ', …' : ''}`;
    }
    if (!confirm(confirmMsg)) return;

    playerBuildings = newBuildings;
    savePlayerBuildings(playerBuildings);
    renderBuildingList();
    recalculate();

    const skipSuffix = skippedNames.length > 0 ? ` · ${skippedNames.length} skipped (multi-product — add manually)` : '';
    status(`Imported ${newBuildings.length} building(s) from game.${skipSuffix}`, false);

  } catch (err) {
    if (err?.type === 'auth') {
      clearStoredCookie();
      showSessionModal({ error: 'Session expired — paste a fresh cookie.' });
    } else {
      const detail = err?.status ? `HTTP ${err.status}` : (err?.message || 'network error');
      status(`Import failed: ${detail} — check the browser console (F12) for details.`, false);
      console.error('[syncBuildingsFromGame]', err);
    }
  } finally {
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}

document.getElementById('syncBldBtn').addEventListener('click', syncBuildingsFromGame);

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
   BROWSER EXTENSION CONNECTOR
   The companion extension (extension/ folder) posts SC_AUTO_COOKIE on page load,
   passing the full SimCompanies cookie string directly — no manual copying needed.
───────────────────────────────────────────────────────────────────────────── */
window.addEventListener('message', (event) => {
  if (event.source !== window || event.data?.type !== 'SC_AUTO_COOKIE') return;
  const { cookie, error } = event.data;

  if (!cookie) {
    // Extension is installed but user isn't logged into SimCompanies
    if (error) console.warn('[SC Connector]', error);
    return;
  }

  const isNew = cookie !== getStoredCookie();
  saveStoredCookie(cookie);

  if (isNew) {
    status('Session synced via extension — loading account data…', true);
    // Wait for the server to be fully awake before firing API calls.
    // wakeServer() returns the same cached promise as the boot path, so if
    // the server is already up this resolves immediately.
    wakeServer().then(() => Promise.all([loadFinancials(true), syncCompanyProfile()]));
  } else {
    // Cookie hasn't changed — still trigger a sync if we don't have warehouse data yet
    if (!Object.keys(warehouseStock).length) wakeServer().then(() => syncCompanyProfile());
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────────────────────────────── */
(async () => {
  populateBldTypeDropdown();
  document.getElementById('aoInput').value  = getAO();
  document.getElementById('psbInput').value = getPSB();
  document.getElementById('ssbInput').value = getSSB();
  renderBuildingList();
  status('Connecting to server…', true);
  await wakeServer();
  await Promise.all([loadEncyclopedia(), loadBuildingConstants()]);
  loadTicker();
  // If the user already has a stored cookie, auto-load account data on every page load
  // (financials, company profile / AO sync, and warehouse inventory)
  if (getStoredCookie()) {
    loadFinancials();
    syncCompanyProfile(); // also triggers loadWarehouse internally
  }
})();
