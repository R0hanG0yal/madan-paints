// Script to generate additional Asian Paints product lines
const fs = require('fs');
const path = require('path');

const existingProducts = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const existingIds = new Set(existingProducts.map(p => p.id));
const existingNames = new Set(existingProducts.map(p => p.name));

let nextId = Math.max(...existingProducts.map(p => parseInt(p.id) || 0)) + 1;
function genId() { return String(nextId++); }

// Additional Asian Paints product lines
const moreLines = [
  {
    prefix: 'Apex',
    codePrefix: 'AP',
    category: 'exterior',
    subcategory: 'standard',
    paintType: 'Exterior Emulsion',
    finish: 'Matte',
    basePrice: 899,
    originalMultiplier: 1.3,
    coverage: '90 sq ft/L',
    dryingTime: '2-3 hours',
    features: ['Weather Resistant', 'UV Protection', 'Algae Resistant', 'Anti-Crack', 'Asian Paints Quality'],
    specifications: { 'Finish': 'Matte', 'Base': 'Water-based Acrylic', 'Coverage': '90 sq ft/L', 'Drying Time': '2-3 hours', 'Recoat Time': '6 hours', 'Weather Resistance': 'Excellent' }
  },
  {
    prefix: 'Apex Ultima',
    codePrefix: 'AU',
    category: 'exterior',
    subcategory: 'premium',
    paintType: 'Premium Exterior',
    finish: 'Smooth Matte',
    basePrice: 1599,
    originalMultiplier: 1.4,
    coverage: '95 sq ft/L',
    dryingTime: '2 hours',
    features: ['Crack Bridging', 'Anti-Algae', 'UV Shield', '10 Year Warranty', 'Low VOC'],
    specifications: { 'Finish': 'Smooth Matte', 'Base': 'Water-based Acrylic', 'Coverage': '95 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '4 hours', 'Warranty': '10 Years' }
  },
  {
    prefix: 'Apex WeatherProof',
    codePrefix: 'AW',
    category: 'exterior',
    subcategory: 'weatherproof',
    paintType: 'Weatherproof Exterior',
    finish: 'Silky Matt',
    basePrice: 1299,
    originalMultiplier: 1.35,
    coverage: '85 sq ft/L',
    dryingTime: '2 hours',
    features: ['Water Repellent', 'Anti-Fungal', 'Silky Finish', 'Crack Free', 'Long Lasting'],
    specifications: { 'Finish': 'Silky Matt', 'Base': 'Water-based Acrylic', 'Coverage': '85 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '4 hours', 'Water Resistance': 'Superior' }
  },
  {
    prefix: 'Tractor Emulsion',
    codePrefix: 'TE',
    category: 'interior',
    subcategory: 'economy',
    paintType: 'Economy Interior',
    finish: 'Flat',
    basePrice: 349,
    originalMultiplier: 1.25,
    coverage: '130 sq ft/L',
    dryingTime: '2-3 hours',
    features: ['Budget Friendly', 'Good Coverage', 'Easy Application', 'Quick Drying', 'Asian Paints Trust'],
    specifications: { 'Finish': 'Flat', 'Base': 'Water-based', 'Coverage': '130 sq ft/L', 'Drying Time': '2-3 hours', 'Recoat Time': '6 hours', 'Shelf Life': '3 Years' }
  },
  {
    prefix: 'Apcolite',
    codePrefix: 'AC',
    category: 'interior',
    subcategory: 'standard',
    paintType: 'Standard Interior',
    finish: 'Matt',
    basePrice: 699,
    originalMultiplier: 1.3,
    coverage: '110 sq ft/L',
    dryingTime: '2 hours',
    features: ['Smooth Finish', 'Low Odor', 'Anti-Bacterial', 'Washable', 'Asian Paints Quality'],
    specifications: { 'Finish': 'Matt', 'Base': 'Water-based Acrylic', 'Coverage': '110 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '4 hours', 'Washability': 'Good' }
  },
  {
    prefix: 'Apcolite Premium',
    codePrefix: 'ACP',
    category: 'interior',
    subcategory: 'premium',
    paintType: 'Premium Interior',
    finish: 'Silk',
    basePrice: 1199,
    originalMultiplier: 1.35,
    coverage: '105 sq ft/L',
    dryingTime: '2 hours',
    features: ['Silk Finish', 'Anti-VOC', 'Stain Resistant', 'Premium Quality', 'Long Lasting'],
    specifications: { 'Finish': 'Silk', 'Base': 'Water-based Acrylic', 'Coverage': '105 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '4 hours', 'VOC': '< 5 g/L' }
  },
  {
    prefix: 'SmartCare',
    codePrefix: 'SC',
    category: 'primers',
    subcategory: 'primer',
    paintType: 'Interior Primer',
    finish: 'Primer',
    basePrice: 449,
    originalMultiplier: 1.25,
    coverage: '100 sq ft/L',
    dryingTime: '4 hours',
    features: ['Seals Surface', 'Better Coverage', 'Stain Block', 'Asian Paints Quality', 'Easy Sanding'],
    specifications: { 'Finish': 'Flat', 'Base': 'Water-based', 'Coverage': '100 sq ft/L', 'Drying Time': '4 hours', 'Recoat Time': '8 hours', 'Purpose': 'Surface Preparation' }
  },
  {
    prefix: 'Bison',
    codePrefix: 'BN',
    category: 'primers',
    subcategory: 'putty',
    paintType: 'Wall Putty',
    finish: 'Smooth',
    basePrice: 549,
    originalMultiplier: 1.2,
    coverage: '25 sq ft/kg',
    dryingTime: '24 hours',
    features: ['Smooth Surface', 'Fills Cracks', 'Strong Bond', 'Water Resistant', 'Easy Application'],
    specifications: { 'Finish': 'Smooth', 'Base': 'White Cement', 'Coverage': '25 sq ft/kg', 'Drying Time': '24 hours', 'Application': 'Trowel', 'Shelf Life': '6 Months' }
  },
  {
    prefix: 'Woodtec',
    codePrefix: 'WT',
    category: 'enamel',
    subcategory: 'wood',
    paintType: 'Wood Finish',
    finish: 'Gloss',
    basePrice: 899,
    originalMultiplier: 1.35,
    coverage: '100 sq ft/L',
    dryingTime: '6-8 hours',
    features: ['Wood Protection', 'UV Resistant', 'Anti-Termite', 'Glossy Finish', 'Long Lasting'],
    specifications: { 'Finish': 'Gloss', 'Base': 'Alkyd Resin', 'Coverage': '100 sq ft/L', 'Drying Time': '6-8 hours', 'Recoat Time': '16 hours', 'Application': 'Brush/Spray' }
  },
  {
    prefix: 'Apex Fresco',
    codePrefix: 'AF',
    category: 'exterior',
    subcategory: 'textured',
    paintType: 'Textured Exterior',
    finish: 'Textured',
    basePrice: 1899,
    originalMultiplier: 1.4,
    coverage: '40 sq ft/L',
    dryingTime: '24 hours',
    features: ['Stone Texture', 'Weather Proof', 'Crack Free', 'Decorative', 'Premium Look'],
    specifications: { 'Finish': 'Textured', 'Base': 'Water-based Acrylic', 'Coverage': '40 sq ft/L', 'Drying Time': '24 hours', 'Application': 'Trowel', 'Texture': 'Stone Finish' }
  }
];

// Color palettes for each product line
const colorSets = [
  // Warm whites & creams
  ['#FFF8F0', '#FFF5E6', '#FFEFDB', '#FFE8CC', '#FFE0B2', '#F5E6D0', '#EDE0D0', '#E8D5C0',
   '#FFF0E0', '#FFEEDD', '#FFE6CC', '#FFD9B3', '#F0E0CC', '#E8D0B8', '#DEC8A8', '#D4BC9C'],
  // Cool whites & greys
  ['#F5F5F5', '#ECECEC', '#E8E8E8', '#E0E0E0', '#D8D8D8', '#D0D0D0', '#C8C8C8', '#B8B8B8',
   '#F0F0F0', '#E6E6E6', '#DCDCDC', '#D4D4D4', '#CCCCCC', '#C0C0C0', '#B4B4B4', '#A8A8A8'],
  // Pastels
  ['#FFE4E1', '#FFE0CC', '#FFF3CD', '#E8F5E9', '#E3F2FD', '#F3E5F5', '#FCE4EC', '#FFF9C4',
   '#FFECB3', '#DCEDC8', '#B2EBF2', '#D1C4E9', '#F8BBD0', '#FFCCBC', '#C8E6C9', '#B3E5FC'],
  // Earth tones
  ['#D7CCC8', '#BCAAA4', '#A1887F', '#8D6E63', '#795548', '#6D4C41', '#5D4037', '#4E342E',
   '#C4B5A8', '#B0A090', '#9C8C7C', '#887868', '#746458', '#605048', '#504040', '#403030'],
  // Blues
  ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1565C0',
   '#DCE8F5', '#C4D8EE', '#ACCAE7', '#94BCE0', '#7CAED9', '#64A0D2', '#4C92CB', '#3484C4'],
  // Greens
  ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C',
   '#D5EED8', '#BDDEC0', '#A5CEA8', '#8DBE90', '#75AE78', '#5D9E60', '#458E48', '#2D7E30'],
  // Reds & pinks
  ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F',
   '#FFE0E0', '#FFCCCC', '#FFB8B8', '#FFA4A4', '#FF9090', '#FF7C7C', '#FF6868', '#FF5454'],
  // Yellows & golds
  ['#FFFDE7', '#FFF9C4', '#FFF176', '#FFEE58', '#FFEB3B', '#FDD835', '#FBC02D', '#F9A825',
   '#FFF8D0', '#FFF0B8', '#FFE8A0', '#FFE088', '#FFD870', '#FFD058', '#FFC840', '#FFC028'],
  // Warm naturals (for exterior paints)
  ['#E8E0D8', '#DED4C8', '#D4C8B8', '#CABCB0', '#C0B0A0', '#B6A494', '#AC9888', '#A28C7C',
   '#F0E8E0', '#E6DCD0', '#DCD0C4', '#D2C4B8', '#C8B8AC', '#BEAC9C', '#B4A090', '#AA9484'],
  // Deep rich tones
  ['#3E2723', '#4E342E', '#5D4037', '#6D4C41', '#795548', '#8D6E63', '#A1887F', '#BCAAA4',
   '#2C1810', '#3C2820', '#4C3830', '#5C4840', '#6C5850', '#7C6860', '#8C7870', '#9C8880']
];

// Color family names
const colorFamilies = ['Whites & Off-Whites', 'Neutrals', 'Browns & Taupes', 'Blues', 'Greens',
  'Reds & Oranges', 'Yellows & Golds', 'Pinks & Purples', 'Greys', 'Earth Tones'];

// Shade names per color family
const shadeNames = {
  'Whites & Off-Whites': ['Cotton White', 'Cloud White', 'Pearl White', 'Ivory Lace', 'Snow Flake', 'Morning Dew', 'Linen White', 'Cream Silk',
    'Angel White', 'Soft White', 'Antique White', 'Honey Dew', 'Vanilla Ice', 'Pale Whisper', 'Whisper White', 'Feather White'],
  'Neutrals': ['Warm Stone', 'Sand Dollar', 'Misty Taupe', 'Classic Beige', 'Almond Shell', 'Pebble Grey', 'Cashmere', 'Mocha Cream',
    'Warm Sand', 'Pale Mushroom', 'Silver Sand', 'Fossil Stone', 'Cozy Beige', 'Sandstone', 'Driftwood', 'Mushroom'],
  'Browns & Taupes': ['Chestnut Brown', 'Cocoa Bean', 'Espresso', 'Walnut Wood', 'Mocha Java', 'Cinnamon Stick', 'Terra Cotta', 'Rustic Brown',
    'Coffee Cream', 'Hazelnut', 'Toffee', 'Caramel', 'Bronze', 'Copper Trail', 'Umber', 'Sienna'],
  'Blues': ['Ocean Breeze', 'Sky Blue', 'Midnight Blue', 'Cerulean', 'Steel Blue', 'Powder Blue', 'Royal Blue', 'Navy Blue',
    'Ice Blue', 'Baby Blue', 'Cornflower', 'Sapphire', 'Cobalt', 'Denim', 'Storm Blue', 'Azure'],
  'Greens': ['Leaf Green', 'Forest Dew', 'Sage Green', 'Mint Fresh', 'Emerald', 'Olive Branch', 'Moss Green', 'Pine Forest',
    'Spring Green', 'Sea Foam', 'Jade', 'Lime Wash', 'Bamboo', 'Fern', 'Cactus', 'Verdant'],
  'Reds & Oranges': ['Ruby Red', 'Cherry Blossom', 'Poppy', 'Crimson', 'Brick Red', 'Burnt Orange', 'Rust', 'Terracotta',
    'Coral Reef', 'Salmon Pink', 'Ember', 'Mango', 'Peach', 'Apricot', 'Flame', 'Sunset'],
  'Yellows & Golds': ['Sunflower', 'Lemon Zest', 'Golden Honey', 'Buttercup', 'Canary', 'Amber', 'Marigold', 'Saffron',
    'Pale Gold', 'Daffodil', 'Mustard', 'Ochre', 'Turmeric', 'Champagne', 'Pineapple', 'Citrus'],
  'Pinks & Purples': ['Rose Petal', 'Lavender', 'Orchid', 'Fuchsia', 'Mauve', 'Plum', 'Lilac', 'Blush Pink',
    'Peony', 'Berry', 'Amethyst', 'Wisteria', 'Carnation', 'Magnolia', 'Heather', 'Violet'],
  'Greys': ['Charcoal', 'Silver Mist', 'Slate Grey', 'Iron Grey', 'Pewter', 'Ash Grey', 'Smoke', 'Graphite',
    'Dove Grey', 'Fog', 'Storm', 'Nickel', 'Platinum', 'Flint', 'Shale', 'Basalt'],
  'Earth Tones': ['Rustic Red', 'Burnt Sienna', 'Clay Pot', 'Adobe', 'Sandstone', 'Desert Rose', 'Canyon', 'Red Earth',
    'Terracotta Clay', 'Ochre Earth', 'Volcanic Stone', 'Sediment', 'Copper Earth', 'Bronze Earth', 'Iron Oxide', 'Raw Umber']
};

const generated = [];

for (const line of moreLines) {
  const colors = colorSets[Math.floor(Math.random() * colorSets.length)];
  const familyNames = Object.keys(shadeNames);
  
  let colorIndex = 0;
  for (let i = 0; i < 4; i++) {
    const family = familyNames[i % familyNames.length];
    const shades = shadeNames[family];
    
    for (let j = 0; j < 8 && colorIndex < colors.length; j++, colorIndex++) {
      const hex = colors[colorIndex];
      const shadeName = shades[(colorIndex + i * 3) % shades.length];
      const codeNum = String(colorIndex + 1).padStart(4, '0');
      const code = `${line.codePrefix} ${codeNum}`;
      const name = `${line.prefix} - ${shadeName}`;
      
      // Skip duplicates
      if (existingNames.has(name)) continue;
      
      const price = line.basePrice + (colorIndex * 15);
      const originalPrice = Math.round(price * line.originalMultiplier);
      const rating = (3.8 + Math.random() * 1.2).toFixed(1);
      const reviewCount = Math.floor(100 + Math.random() * 2000);
      
      // Determine color category
      let colorCategory = 'Neutrals';
      if (family === 'Whites & Off-Whites') colorCategory = 'Whites & Off-Whites';
      else if (family === 'Blues') colorCategory = 'Blues';
      else if (family === 'Greens') colorCategory = 'Greens';
      else if (family === 'Reds & Oranges') colorCategory = 'Reds & Oranges';
      else if (family === 'Yellows & Golds') colorCategory = 'Yellows & Golds';
      else if (family === 'Pinks & Purples') colorCategory = 'Pinks & Purples';
      else if (family === 'Greys') colorCategory = 'Greys';
      else if (family === 'Browns & Taupes' || family === 'Earth Tones') colorCategory = 'Browns & Taupes';
      
      generated.push({
        id: genId(),
        name,
        brand: 'Asian Paints',
        category: line.category,
        subcategory: line.subcategory,
        hexColor: hex,
        price,
        originalPrice,
        paintType: line.paintType,
        finish: line.finish,
        coverage: line.coverage,
        dryingTime: line.dryingTime,
        rating: parseFloat(rating),
        reviewCount,
        colorCategory,
        asianColorCode: code,
        features: line.features,
        specifications: line.specifications,
        description: `${line.prefix} ${shadeName} is a premium quality ${line.paintType.toLowerCase()} from Asian Paints. ${line.finish} finish with ${line.coverage} coverage. Perfect for ${line.category} applications.`,
        availableSizes: [
          { size: '1L', price: price },
          { size: '4L', price: Math.round(price * 3.7) },
          { size: '10L', price: Math.round(price * 8.5) },
          { size: '20L', price: Math.round(price * 16) }
        ],
        badge: line.subcategory === 'premium' ? 'Premium' : line.subcategory === 'economy' ? 'Value' : null
      });
    }
  }
}

console.log(`Generated ${generated.length} additional Asian Paints products`);

// Merge with existing
const allProducts = [...existingProducts, ...generated];
fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(allProducts, null, 2));
console.log(`Total products now: ${allProducts.length}`);

// Show brand counts
const brands = {};
allProducts.forEach(p => { brands[p.brand] = (brands[p.brand] || 0) + 1; });
console.log('\nBrand counts:');
Object.entries(brands).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
  console.log(`  ${brand}: ${count}`);
});
