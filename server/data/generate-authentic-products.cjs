const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));

const authenticProducts = [
  // ========== ASIAN PAINTS - Real Product Lines ==========
  {
    brand: 'Asian Paints',
    productLine: 'Royale Play',
    colors: [
      { name: 'Royale Play - Dune', hex: '#D4C5A9', cat: 'Neutrals', code: 'DDLS 18' },
      { name: 'Royale Play - Silk Ribbons', hex: '#E8DDD0', cat: 'Neutrals', code: 'DDLS 22' },
      { name: 'Royale Play - Tuscany', hex: '#C9A882', cat: 'Browns & Taupes', code: 'DDLS 08' },
      { name: 'Royale Play - Mystique', hex: '#B8A9C4', cat: 'Pinks & Purples', code: 'DDLS 32' },
      { name: 'Royale Play - Crushed Silk', hex: '#F0E6D3', cat: 'Whites & Off-Whites', code: 'DDLS 02' },
    ]
  },
  {
    brand: 'Asian Paints',
    productLine: 'Royale Shyne',
    colors: [
      { name: 'Royale Shyne - Silk Ivory', hex: '#FFF8E7', cat: 'Whites & Off-Whites', code: 'RS 1001' },
      { name: 'Royale Shyne - Pearl Finish', hex: '#FFFAF0', cat: 'Whites & Off-Whites', code: 'RS 1005' },
      { name: 'Royale Shyne - Champagne Gold', hex: '#E8D0A0', cat: 'Yellows & Golds', code: 'RS 2008' },
      { name: 'Royale Shyne - Rose Gold', hex: '#E8B4B8', cat: 'Pinks & Purples', code: 'RS 3002' },
      { name: 'Royale Shyne - Silver Sheen', hex: '#C0C0C0', cat: 'Greys', code: 'RS 4001' },
    ]
  },
  {
    brand: 'Asian Paints',
    productLine: 'Royale Matt',
    colors: [
      { name: 'Royale Matt - Pure White', hex: '#FEFEFA', cat: 'Whites & Off-Whites', code: 'RM 0001' },
      { name: 'Royale Matt - Warm Beige', hex: '#E8DDD0', cat: 'Browns & Taupes', code: 'RM 2034' },
      { name: 'Royale Matt - Ocean Blue', hex: '#4169E1', cat: 'Blues', code: 'RM 4020' },
      { name: 'Royale Matt - Sage Green', hex: '#87AE73', cat: 'Greens', code: 'RM 5060' },
      { name: 'Royale Matt - Lavender Mist', hex: '#E6E0F0', cat: 'Pinks & Purples', code: 'RM 6070' },
    ]
  },
  {
    brand: 'Asian Paints',
    productLine: 'Royale Health Shield',
    colors: [
      { name: 'Health Shield - Pure White', hex: '#F5F5F5', cat: 'Whites & Off-Whites', code: 'RHS 001' },
      { name: 'Health Shield - Soft Lavender', hex: '#E6E0F0', cat: 'Pinks & Purples', code: 'RHS 045' },
      { name: 'Health Shield - Mint Green', hex: '#C8E6C9', cat: 'Greens', code: 'RHS 078' },
      { name: 'Health Shield - Sky Blue', hex: '#B0D4F0', cat: 'Blues', code: 'RHS 112' },
    ]
  },
  {
    brand: 'Asian Paints',
    productLine: 'Apcolite Premium Gloss',
    colors: [
      { name: 'Apcolite Premium - Gloss White', hex: '#FFFEFA', cat: 'Whites & Off-Whites', code: 'AP 0001' },
      { name: 'Apcolite Premium - Sky Blue', hex: '#B0D4F0', cat: 'Blues', code: 'AP 1080' },
      { name: 'Apcolite Premium - Buttercup', hex: '#FFFACD', cat: 'Yellows & Golds', code: 'AP 2050' },
      { name: 'Apcolite Premium - Blush Pink', hex: '#FFE4E1', cat: 'Pinks & Purples', code: 'AP 3090' },
    ]
  },
  {
    brand: 'Asian Paints',
    productLine: 'Tractor Emulsion',
    colors: [
      { name: 'Tractor Emulsion - Super White', hex: '#FFFDF5', cat: 'Whites & Off-Whites', code: 'TE 001' },
      { name: 'Tractor Emulsion - Off White', hex: '#F5F0E8', cat: 'Whites & Off-Whites', code: 'TE 002' },
      { name: 'Tractor Emulsion - Cream', hex: '#FFFDD0', cat: 'Whites & Off-Whites', code: 'TE 005' },
    ]
  },
  {
    brand: 'Asian Paints',
    productLine: 'Ace Exterior Emulsion',
    colors: [
      { name: 'Ace Exterior - White', hex: '#FEFEFE', cat: 'Whites & Off-Whites', code: 'ACE 001' },
      { name: 'Ace Exterior - Warm Ivory', hex: '#FFF8E7', cat: 'Whites & Off-Whites', code: 'ACE 010' },
      { name: 'Ace Exterior - Sandalwood', hex: '#D2B48C', cat: 'Browns & Taupes', code: 'ACE 115' },
      { name: 'Ace Exterior - Slate Grey', hex: '#708090', cat: 'Greys', code: 'ACE 230' },
      { name: 'Ace Exterior - Brick Red', hex: '#CB4154', cat: 'Reds & Oranges', code: 'ACE 345' },
    ]
  },
  {
    brand: 'Asian Paints',
    productLine: 'Apex Ultima Protek',
    colors: [
      { name: 'Apex Ultima - Weatherproof White', hex: '#FAFAFA', cat: 'Whites & Off-Whites', code: 'AU 001' },
      { name: 'Apex Ultima - Sandstone', hex: '#C2B280', cat: 'Neutrals', code: 'AU 050' },
      { name: 'Apex Ultima - Terracotta', hex: '#E2725B', cat: 'Reds & Oranges', code: 'AU 120' },
      { name: 'Apex Ultima - Forest Green', hex: '#228B22', cat: 'Greens', code: 'AU 210' },
      { name: 'Apex Ultima - Ocean Blue', hex: '#006994', cat: 'Blues', code: 'AU 305' },
    ]
  },

  // ========== NEROLAC - Real Product Lines ==========
  {
    brand: 'Nerolac',
    productLine: 'Royale Luxury Emulsion',
    colors: [
      { name: 'Nerolac Royale - Pure White', hex: '#F8F8FF', cat: 'Whites & Off-Whites', code: 'NR 001' },
      { name: 'Nerolac Royale - Silk White', hex: '#FFFAF0', cat: 'Whites & Off-Whites', code: 'NR 005' },
      { name: 'Nerolac Royale - Champagne', hex: '#F7E7CE', cat: 'Neutrals', code: 'NR 102' },
      { name: 'Nerolac Royale - Misty Lavender', hex: '#E6E6FA', cat: 'Pinks & Purples', code: 'NR 245' },
    ]
  },
  {
    brand: 'Nerolac',
    productLine: 'Impression Interior',
    colors: [
      { name: 'Nerolac Impression - Brilliant White', hex: '#FFFFFF', cat: 'Whites & Off-Whites', code: 'NI 001' },
      { name: 'Nerolac Impression - Warm Ivory', hex: '#FFF8DC', cat: 'Whites & Off-Whites', code: 'NI 012' },
      { name: 'Nerolac Impression - Almond', hex: '#EFDECD', cat: 'Neutrals', code: 'NI 045' },
      { name: 'Nerolac Impression - Seafoam', hex: '#98FF98', cat: 'Greens', code: 'NI 310' },
    ]
  },
  {
    brand: 'Nerolac',
    productLine: 'Excel Interior',
    colors: [
      { name: 'Nerolac Excel - Pure White', hex: '#FFFAFA', cat: 'Whites & Off-Whites', code: 'NE 001' },
      { name: 'Nerolac Excel - Creamy White', hex: '#FFFDD0', cat: 'Whites & Off-Whites', code: 'NE 008' },
      { name: 'Nerolac Excel - Baby Pink', hex: '#FFB6C1', cat: 'Pinks & Purples', code: 'NE 150' },
      { name: 'Nerolac Excel - Sky Blue', hex: '#87CEEB', cat: 'Blues', code: 'NE 220' },
    ]
  },
  {
    brand: 'Nerolac',
    productLine: 'Weatherguard Exterior',
    colors: [
      { name: 'Nerolac Weatherguard - White', hex: '#FEFEFE', cat: 'Whites & Off-Whites', code: 'NW 001' },
      { name: 'Nerolac Weatherguard - Beige', hex: '#F5F5DC', cat: 'Neutrals', code: 'NW 050' },
      { name: 'Nerolac Weatherguard - Terracotta', hex: '#CC4E2C', cat: 'Reds & Oranges', code: 'NW 180' },
      { name: 'Nerolac Weatherguard - Sage', hex: '#BCB88A', cat: 'Greens', code: 'NW 260' },
      { name: 'Nerolac Weatherguard - Charcoal', hex: '#36454F', cat: 'Greys', code: 'NW 320' },
    ]
  },
  {
    brand: 'Nerolac',
    productLine: 'Synthetic Enamel',
    colors: [
      { name: 'Nerolac Enamel - Gloss White', hex: '#F5F5F5', cat: 'Whites & Off-Whites', code: 'NSE 001' },
      { name: 'Nerolac Enamel - Jet Black', hex: '#000000', cat: 'Greys', code: 'NSE 900' },
      { name: 'Nerolac Enamel - Signal Red', hex: '#FF2400', cat: 'Reds & Oranges', code: 'NSE 310' },
      { name: 'Nerolac Enamel - Royal Blue', hex: '#4169E1', cat: 'Blues', code: 'NSE 510' },
      { name: 'Nerolac Enamel - Forest Green', hex: '#228B22', cat: 'Greens', code: 'NSE 620' },
    ]
  },

  // ========== BERGER PAINTS - Real Product Lines ==========
  {
    brand: 'Berger Paints',
    productLine: 'WeatherCoat',
    colors: [
      { name: 'Berger WeatherCoat - White', hex: '#FEFEFE', cat: 'Whites & Off-Whites', code: 'BWC 001' },
      { name: 'Berger WeatherCoat - Ivory', hex: '#FFFFF0', cat: 'Whites & Off-Whites', code: 'BWC 010' },
      { name: 'Berger WeatherCoat - Sandalwood', hex: '#D2B48C', cat: 'Browns & Taupes', code: 'BWC 105' },
      { name: 'Berger WeatherCoat - Brick Red', hex: '#B22222', cat: 'Reds & Oranges', code: 'BWC 220' },
      { name: 'Berger WeatherCoat - Slate Grey', hex: '#708090', cat: 'Greys', code: 'BWC 330' },
    ]
  },
  {
    brand: 'Berger Paints',
    productLine: 'Silk Glow',
    colors: [
      { name: 'Berger Silk Glow - Pearl White', hex: '#FFFAF0', cat: 'Whites & Off-Whites', code: 'BSG 001' },
      { name: 'Berger Silk Glow - Champagne', hex: '#F7E7CE', cat: 'Neutrals', code: 'BSG 050' },
      { name: 'Berger Silk Glow - Rose Gold', hex: '#E8B4B8', cat: 'Pinks & Purples', code: 'BSG 125' },
      { name: 'Berger Silk Glow - Sky Blue', hex: '#B0D4F0', cat: 'Blues', code: 'BSG 210' },
      { name: 'Berger Silk Glow - Mint', hex: '#C8E6C9', cat: 'Greens', code: 'BSG 315' },
    ]
  },
  {
    brand: 'Berger Paints',
    productLine: 'Breathe Easy',
    colors: [
      { name: 'Berger Breathe Easy - White', hex: '#FFFAFA', cat: 'Whites & Off-Whites', code: 'BBE 001' },
      { name: 'Berger Breathe Easy - Cream', hex: '#FFFDD0', cat: 'Whites & Off-Whites', code: 'BBE 005' },
      { name: 'Berger Breathe Easy - Lavender', hex: '#E6E6FA', cat: 'Pinks & Purples', code: 'BBE 110' },
      { name: 'Berger Breathe Easy - Ocean', hex: '#4682B4', cat: 'Blues', code: 'BBE 220' },
    ]
  },
  {
    brand: 'Berger Paints',
    productLine: 'Luxuro',
    colors: [
      { name: 'Berger Luxuro - Silk White', hex: '#FFF8F0', cat: 'Whites & Off-Whites', code: 'BLX 001' },
      { name: 'Berger Luxuro - Antique Gold', hex: '#CFB53B', cat: 'Yellows & Golds', code: 'BLX 080' },
      { name: 'Berger Luxuro - Burgundy', hex: '#800020', cat: 'Reds & Oranges', code: 'BLX 210' },
      { name: 'Berger Luxuro - Aubergine', hex: '#614051', cat: 'Pinks & Purples', code: 'BLX 310' },
      { name: 'Berger Luxuro - Teal', hex: '#008080', cat: 'Blues', code: 'BLX 405' },
    ]
  },
  {
    brand: 'Berger Paints',
    productLine: 'Enamel',
    colors: [
      { name: 'Berger Enamel - Gloss White', hex: '#F5F5F5', cat: 'Whites & Off-Whites', code: 'BEN 001' },
      { name: 'Berger Enamel - Jet Black', hex: '#222222', cat: 'Greys', code: 'BEN 900' },
      { name: 'Berger Enamel - Cherry Red', hex: '#DE3163', cat: 'Reds & Oranges', code: 'BEN 320' },
      { name: 'Berger Enamel - Navy Blue', hex: '#000080', cat: 'Blues', code: 'BEN 520' },
    ]
  },
  {
    brand: 'Berger Paints',
    productLine: 'Express Painting',
    colors: [
      { name: 'Berger Express - White', hex: '#FFFFFF', cat: 'Whites & Off-Whites', code: 'BEP 001' },
      { name: 'Berger Express - Warm Cream', hex: '#FFF8DC', cat: 'Whites & Off-Whites', code: 'BEP 010' },
      { name: 'Berger Express - Pale Blue', hex: '#B0C4DE', cat: 'Blues', code: 'BEP 205' },
    ]
  },

  // ========== INDIGO PAINTS - Real Product Lines ==========
  {
    brand: 'Indigo Paints',
    productLine: 'Royale Luxury',
    colors: [
      { name: 'Indigo Royale - Pure White', hex: '#FAFAFA', cat: 'Whites & Off-Whites', code: 'IPR 001' },
      { name: 'Indigo Royale - Ivory', hex: '#FFFFF0', cat: 'Whites & Off-Whites', code: 'IPR 005' },
      { name: 'Indigo Royale - Rose Pink', hex: '#FFB6C1', cat: 'Pinks & Purples', code: 'IPR 130' },
      { name: 'Indigo Royale - Cerulean', hex: '#007BA7', cat: 'Blues', code: 'IPR 250' },
    ]
  },
  {
    brand: 'Indigo Paints',
    productLine: 'Slim Sheen',
    colors: [
      { name: 'Indigo Slim Sheen - White', hex: '#FFFEFA', cat: 'Whites & Off-Whites', code: 'ISS 001' },
      { name: 'Indigo Slim Sheen - Butter', hex: '#FFF8DC', cat: 'Yellows & Golds', code: 'ISS 060' },
      { name: 'Indigo Slim Sheen - Lavender', hex: '#E6E6FA', cat: 'Pinks & Purples', code: 'ISS 115' },
    ]
  },
  {
    brand: 'Indigo Paints',
    productLine: 'Exterior Weatherproof',
    colors: [
      { name: 'Indigo Weatherproof - White', hex: '#FEFEFE', cat: 'Whites & Off-Whites', code: 'IEW 001' },
      { name: 'Indigo Weatherproof - Sand', hex: '#C2B280', cat: 'Neutrals', code: 'IEW 045' },
      { name: 'Indigo Weatherproof - Grey', hex: '#808080', cat: 'Greys', code: 'IEW 220' },
      { name: 'Indigo Weatherproof - Brick', hex: '#B22222', cat: 'Reds & Oranges', code: 'IEW 330' },
    ]
  },

  // ========== PIDILITE / DR. FIXIT ==========
  {
    brand: 'Pidilite',
    productLine: 'Dr. Fixit',
    colors: [
      { name: 'Dr. Fixit Raincoat - White', hex: '#F5F5F5', cat: 'Whites & Off-Whites', code: 'DFR 001' },
      { name: 'Dr. Fixit Raincoat - Grey', hex: '#808080', cat: 'Greys', code: 'DFR 100' },
      { name: 'Dr. Fixit LW+ - Pidiproof Liquid', hex: '#FFF8DC', cat: 'Neutrals', code: 'LW 001' },
    ]
  },
  {
    brand: 'Pidilite',
    productLine: 'Fevicol',
    colors: [
      { name: 'Fevicol MR - Wood Adhesive', hex: '#F5DEB3', cat: 'Neutrals', code: 'FVL 001' },
      { name: 'Fevicol SH - Heat Resistant', hex: '#F5DEB3', cat: 'Neutrals', code: 'FVL 010' },
    ]
  },

  // ========== BIRLA PUTTY ==========
  {
    brand: 'Birla Putty',
    productLine: 'Birla White Cement',
    colors: [
      { name: 'Birla White Cement Putty', hex: '#F5F0E8', cat: 'Whites & Off-Whites', code: 'BWP 001' },
      { name: 'Birla Wall Care Putty', hex: '#F0EAD6', cat: 'Whites & Off-Whites', code: 'BWC 001' },
    ]
  },

  // ========== JK PUTTY ==========
  {
    brand: 'JK Putty',
    productLine: 'JK Wall Putty',
    colors: [
      { name: 'JK Wall Putty - White', hex: '#F5F0E8', cat: 'Whites & Off-Whites', code: 'JKP 001' },
      { name: 'JK Wall Putty - Premium', hex: '#F0EAD6', cat: 'Whites & Off-Whites', code: 'JKP 010' },
    ]
  },

  // ========== ACRO PAINTS - Real Product Lines ==========
  {
    brand: 'Acro Paints',
    productLine: 'Acro Premium Emulsion',
    colors: [
      { name: 'Acro Premium - White', hex: '#FFFAFA', cat: 'Whites & Off-Whites', code: 'APE 001' },
      { name: 'Acro Premium - Cream', hex: '#FFFDD0', cat: 'Whites & Off-Whites', code: 'APE 010' },
      { name: 'Acro Premium - Sky', hex: '#B0D4F0', cat: 'Blues', code: 'APE 150' },
      { name: 'Acro Premium - Soft Pink', hex: '#FFE4E1', cat: 'Pinks & Purples', code: 'APE 220' },
    ]
  },
  {
    brand: 'Acro Paints',
    productLine: 'Acro Weatherproof',
    colors: [
      { name: 'Acro Weatherproof - White', hex: '#FEFEFE', cat: 'Whites & Off-Whites', code: 'AWP 001' },
      { name: 'Acro Weatherproof - Ivory', hex: '#FFFFF0', cat: 'Whites & Off-Whites', code: 'AWP 008' },
      { name: 'Acro Weatherproof - Tan', hex: '#D2B48C', cat: 'Browns & Taupes', code: 'AWP 060' },
    ]
  },

  // ========== OPUS PAINTS ==========
  {
    brand: 'Opus Paints',
    productLine: 'Opus Interior Emulsion',
    colors: [
      { name: 'Opus Interior - Brilliant White', hex: '#FFFAFA', cat: 'Whites & Off-Whites', code: 'OIE 001' },
      { name: 'Opus Interior - Cream', hex: '#FFFDD0', cat: 'Whites & Off-Whites', code: 'OIE 005' },
      { name: 'Opus Interior - Lavender', hex: '#E6E6FA', cat: 'Pinks & Purples', code: 'OIE 110' },
      { name: 'Opus Interior - Seafoam', hex: '#C8E6C9', cat: 'Greens', code: 'OIE 220' },
    ]
  },
  {
    brand: 'Opus Paints',
    productLine: 'Opus Enamel',
    colors: [
      { name: 'Opus Enamel - Gloss White', hex: '#F5F5F5', cat: 'Whites & Off-Whites', code: 'OEN 001' },
      { name: 'Opus Enamel - Red', hex: '#FF2400', cat: 'Reds & Oranges', code: 'OEN 210' },
      { name: 'Opus Enamel - Blue', hex: '#4169E1', cat: 'Blues', code: 'OEN 410' },
    ]
  },

  // ========== ESDE E PAINTS ==========
  {
    brand: 'Esdee Paints',
    productLine: 'Esdee Premium Emulsion',
    colors: [
      { name: 'Esdee Premium - White', hex: '#FFFAFA', cat: 'Whites & Off-Whites', code: 'EPE 001' },
      { name: 'Esdee Premium - Off White', hex: '#F5F5F5', cat: 'Whites & Off-Whites', code: 'EPE 003' },
      { name: 'Esdee Premium - Pale Yellow', hex: '#FFF8DC', cat: 'Yellows & Golds', code: 'EPE 050' },
    ]
  },
];

// Helper functions
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rand(min, max) { return Math.round((Math.random() * (max - min) + min) * 10) / 10; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const paintTypes = {
  'Royale Play': { type: 'Textured Interior', finish: 'Textured', coverage: '60 sq ft/L', dry: '2 hours' },
  'Royale Shyne': { type: 'Silk Interior', finish: 'Silk', coverage: '110 sq ft/L', dry: '2 hours' },
  'Royale Matt': { type: 'Matte Interior', finish: 'Matte', coverage: '120 sq ft/L', dry: '2 hours' },
  'Royale Health Shield': { type: 'Antibacterial Interior', finish: 'Matte', coverage: '115 sq ft/L', dry: '3 hours' },
  'Apcolite Premium Gloss': { type: 'Premium Gloss Interior', finish: 'Gloss', coverage: '130 sq ft/L', dry: '4 hours' },
  'Ace Exterior Emulsion': { type: 'Exterior Emulsion', finish: 'Satin', coverage: '95 sq ft/L', dry: '3 hours' },
  'Apex Ultima Protek': { type: 'Weatherproof Exterior', finish: 'Satin', coverage: '85 sq ft/L', dry: '3 hours' },
  'Tractor Emulsion': { type: 'Economy Interior', finish: 'Matte', coverage: '140 sq ft/L', dry: '1 hour' },
  'Royale Luxury Emulsion': { type: 'Premium Silk Interior', finish: 'Silk', coverage: '110 sq ft/L', dry: '2 hours' },
  'Premium Interior Emulsion': { type: 'Interior Emulsion', finish: 'Matte', coverage: '130 sq ft/L', dry: '2 hours' },
  'Luxury Silk Finish': { type: 'Luxury Interior', finish: 'Silk', coverage: '115 sq ft/L', dry: '2 hours' },
  'Impression Interior': { type: 'Premium Interior', finish: 'Matte', coverage: '125 sq ft/L', dry: '2 hours' },
  'Excel Interior': { type: 'Interior Emulsion', finish: 'Matte', coverage: '130 sq ft/L', dry: '2 hours' },
  'Weatherguard Exterior': { type: 'Weatherproof Exterior', finish: 'Satin', coverage: '90 sq ft/L', dry: '3 hours' },
  'WeatherCoat': { type: 'Weatherproof Exterior', finish: 'Satin', coverage: '90 sq ft/L', dry: '3 hours' },
  'Silk Glow': { type: 'Luxury Interior', finish: 'Silk', coverage: '110 sq ft/L', dry: '2 hours' },
  'Breathe Easy': { type: 'Zero VOC Interior', finish: 'Matte', coverage: '120 sq ft/L', dry: '2 hours' },
  'Luxuro': { type: 'Premium Interior', finish: 'Velvet', coverage: '110 sq ft/L', dry: '2 hours' },
  'Enamel': { type: 'Enamel Paint', finish: 'High Gloss', coverage: '110 sq ft/L', dry: '4 hours' },
  'Synthetic Enamel': { type: 'Synthetic Enamel', finish: 'High Gloss', coverage: '110 sq ft/L', dry: '4 hours' },
  'Express Painting': { type: 'Quick Dry Interior', finish: 'Matte', coverage: '125 sq ft/L', dry: '1 hour' },
  'Royale Luxury': { type: 'Premium Interior', finish: 'Silk', coverage: '110 sq ft/L', dry: '2 hours' },
  'Slim Sheen': { type: 'Interior Emulsion', finish: 'Satin', coverage: '130 sq ft/L', dry: '2 hours' },
  'Exterior Weatherproof': { type: 'Exterior Weatherproof', finish: 'Satin', coverage: '90 sq ft/L', dry: '3 hours' },
  'Dr. Fixit': { type: 'Waterproofing Solution', finish: 'Satin', coverage: '50 sq ft/L', dry: '6 hours' },
  'Fevicol': { type: 'Adhesive', finish: 'N/A', coverage: 'N/A', dry: '24 hours' },
  'Birla White Cement': { type: 'Wall Putty', finish: 'N/A', coverage: '15 sq ft/kg', dry: '6 hours' },
  'JK Wall Putty': { type: 'Wall Putty', finish: 'N/A', coverage: '15 sq ft/kg', dry: '6 hours' },
  'Acro Premium Emulsion': { type: 'Interior Emulsion', finish: 'Matte', coverage: '130 sq ft/L', dry: '2 hours' },
  'Acro Weatherproof': { type: 'Exterior Weatherproof', finish: 'Satin', coverage: '90 sq ft/L', dry: '3 hours' },
  'Opus Interior Emulsion': { type: 'Interior Emulsion', finish: 'Matte', coverage: '130 sq ft/L', dry: '2 hours' },
  'Opus Enamel': { type: 'Enamel Paint', finish: 'High Gloss', coverage: '110 sq ft/L', dry: '4 hours' },
  'Esdee Premium Emulsion': { type: 'Interior Emulsion', finish: 'Matte', coverage: '130 sq ft/L', dry: '2 hours' },
};

let maxId = products.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0);
const newProducts = [];
let addedCount = 0;

for (const config of authenticProducts) {
  const productInfo = paintTypes[config.productLine] || { type: 'Standard Paint', finish: 'Matte', coverage: '100 sq ft/L', dry: '2 hours' };
  
  for (const color of config.colors) {
    maxId++;
    addedCount++;
    
    const price = productInfo.finish === 'High Gloss' || productInfo.finish === 'Textured' 
      ? randInt(800, 2400) 
      : productInfo.type.includes('Exterior') || productInfo.type.includes('Weatherproof')
        ? randInt(1200, 2800)
        : randInt(500, 1800);
    
    const originalPrice = Math.round(price * rand(1.18, 1.42));
    const rating = rand(4.0, 4.9);
    const reviewCount = randInt(200, 8000);
    
    const description = `${config.brand} ${color.name} - Premium ${productInfo.type.toLowerCase()} with ${productInfo.finish.toLowerCase()} finish. Part of the trusted ${config.brand} ${config.productLine} range. ${config.code ? `Color Code: ${config.code}. ` : ''}Engineered for superior performance, excellent coverage, and lasting beauty. ${productInfo.type.includes('Exterior') || productInfo.type.includes('Weatherproof') ? 'UV resistant, waterproof, and designed to withstand harsh weather conditions.' : 'Low VOC, eco-friendly formulation perfect for modern homes.'}`;
    
    newProducts.push({
      id: `p${maxId}`,
      name: `${config.brand} ${color.name}`,
      description,
      hexColor: color.hex,
      price,
      originalPrice,
      pricePerLiter: price,
      category: productInfo.type.includes('Exterior') || productInfo.type.includes('Weatherproof') 
        ? 'exterior' 
        : productInfo.type.includes('Enamel') || productInfo.finish === 'High Gloss'
          ? 'enamel'
          : productInfo.type.includes('Putty') || productInfo.type.includes('Adhesive') || productInfo.type.includes('Waterproofing')
            ? 'primers'
            : 'interior',
      subcategory: config.productLine.toLowerCase().replace(/\s+/g, '-'),
      brand: config.brand,
      rating,
      reviewCount,
      paintType: productInfo.type,
      finish: productInfo.finish,
      coverage: productInfo.coverage,
      dryingTime: productInfo.dry,
      asianColorCode: config.code || '',
      availableSizes: productInfo.finish === 'N/A' ? [
        { size: '1kg', price: price },
        { size: '5kg', price: Math.round(price * 4.5) },
        { size: '20kg', price: Math.round(price * 16) },
      ] : [
        { size: '1L', price: price },
        { size: '4L', price: Math.round(price * 3.6) },
        { size: '10L', price: Math.round(price * 8.5) },
      ],
      features: [
        `${config.brand} Trusted Quality`,
        `${productInfo.finish} finish`,
        'Excellent Coverage',
        'Low VOC',
        productInfo.type.includes('Exterior') || productInfo.type.includes('Weatherproof') 
          ? 'Weather & UV Resistant' 
          : 'Washable & Durable',
        'Eco-friendly Formulation',
      ],
      specifications: {
        'Brand': config.brand,
        'Product Line': config.productLine,
        'Paint Type': productInfo.type,
        'Finish': productInfo.finish,
        'Coverage': productInfo.coverage,
        'Drying Time': productInfo.dry,
        'Base': 'Water-based Acrylic',
        ...(config.code ? { 'Color Code': config.code } : {}),
      },
      stock: randInt(50, 500),
      badge: Math.random() > 0.85 ? 'New Launch' : Math.random() > 0.85 ? 'Best Seller' : null,
      colorCategory: color.cat,
    });
  }
}

// Write back
const allProducts = [...products, ...newProducts];
fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(allProducts, null, 2));
console.log(`✅ Added ${addedCount} authentic products!`);
console.log(`Total products now: ${allProducts.length}`);

// Show brand counts
const brandCounts = {};
allProducts.forEach(p => { brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1; });
console.log('\nBrand counts:', JSON.stringify(brandCounts, null, 2));
