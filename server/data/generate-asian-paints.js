// Script to generate 1000+ Asian Paints color shades
const fs = require('fs');
const path = require('path');

// Asian Paints product lines with their properties
const productLines = [
  {
    prefix: 'Royale Atmos',
    codePrefix: 'RA',
    category: 'interior',
    subcategory: 'luxury',
    paintType: 'Luxury Interior',
    finish: 'Silk',
    basePrice: 2200,
    originalMultiplier: 1.4,
    coverage: '110 sq ft/L',
    dryingTime: '2 hours',
    features: ['Anti-VOC', 'Silk Finish', 'Premium Quality', 'Color Lock Technology', 'Odorless'],
    specifications: { 'Finish': 'Silk', 'Base': 'Water-based Acrylic', 'Coverage': '110 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '4 hours', 'VOC Content': '< 1 g/L' }
  },
  {
    prefix: 'Royale Play',
    codePrefix: 'RP',
    category: 'interior',
    subcategory: 'texture',
    paintType: 'Textured Interior',
    finish: 'Textured',
    basePrice: 2500,
    originalMultiplier: 1.45,
    coverage: '60 sq ft/L',
    dryingTime: '2 hours',
    features: ['Asian Paints Quality', 'Designer Collection', 'Superior Finish', 'Durable', 'Texture Effect'],
    specifications: { 'Finish': 'Textured', 'Base': 'Water-based Acrylic', 'Coverage': '60 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '6 hours', 'Application': 'Trowel/Roller' }
  },
  {
    prefix: 'Royale Shyne',
    codePrefix: 'RS',
    category: 'interior',
    subcategory: 'luxury',
    paintType: 'Silk Interior',
    finish: 'Silk',
    basePrice: 1900,
    originalMultiplier: 1.4,
    coverage: '110 sq ft/L',
    dryingTime: '2 hours',
    features: ['Asian Paints Quality', 'Trusted Brand', 'Superior Finish', 'Durable', 'High Sheen'],
    specifications: { 'Finish': 'Silk', 'Base': 'Water-based Acrylic', 'Coverage': '110 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '4 hours', 'Sheen Level': 'High' }
  },
  {
    prefix: 'Royale Matt',
    codePrefix: 'RM',
    category: 'interior',
    subcategory: 'emulsion',
    paintType: 'Matte Interior',
    finish: 'Matte',
    basePrice: 1500,
    originalMultiplier: 1.38,
    coverage: '120 sq ft/L',
    dryingTime: '2 hours',
    features: ['Asian Paints Quality', 'Trusted Brand', 'Superior Finish', 'Durable', 'Low Sheen'],
    specifications: { 'Finish': 'Matte', 'Base': 'Water-based Acrylic', 'Coverage': '120 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '4 hours', 'Sheen Level': 'Low' }
  },
  {
    prefix: 'Royale Health Shield',
    codePrefix: 'RHS',
    category: 'interior',
    subcategory: 'emulsion',
    paintType: 'Health Shield Interior',
    finish: 'Matte',
    basePrice: 1900,
    originalMultiplier: 1.42,
    coverage: '115 sq ft/L',
    dryingTime: '3 hours',
    features: ['Anti-Bacterial', 'Anti-Viral', 'Health Shield', 'Low VOC', 'Durable'],
    specifications: { 'Finish': 'Matte', 'Base': 'Water-based Acrylic', 'Coverage': '115 sq ft/L', 'Drying Time': '3 hours', 'Recoat Time': '5 hours', 'Health Rating': '99.9% Antibacterial' }
  },
  {
    prefix: 'Apcolite Premium',
    codePrefix: 'AP',
    category: 'interior',
    subcategory: 'emulsion',
    paintType: 'Premium Interior',
    finish: 'Matte',
    basePrice: 800,
    originalMultiplier: 1.4,
    coverage: '130 sq ft/L',
    dryingTime: '4 hours',
    features: ['Asian Paints Quality', 'Trusted Brand', 'Superior Finish', 'Durable', 'Value for Money'],
    specifications: { 'Finish': 'Matte', 'Base': 'Water-based Acrylic', 'Coverage': '130 sq ft/L', 'Drying Time': '4 hours', 'Recoat Time': '6 hours', 'VOC Content': '< 5 g/L' }
  },
  {
    prefix: 'Apcolite Gold',
    codePrefix: 'AG',
    category: 'interior',
    subcategory: 'emulsion',
    paintType: 'Gold Interior',
    finish: 'Eggshell',
    basePrice: 650,
    originalMultiplier: 1.35,
    coverage: '135 sq ft/L',
    dryingTime: '2 hours',
    features: ['Asian Paints Quality', 'Budget Friendly', 'Good Coverage', 'Washable', 'Durable'],
    specifications: { 'Finish': 'Eggshell', 'Base': 'Water-based', 'Coverage': '135 sq ft/L', 'Drying Time': '2 hours', 'Recoat Time': '4 hours', 'VOC Content': '< 10 g/L' }
  },
  {
    prefix: 'Tractor Emulsion',
    codePrefix: 'TE',
    category: 'interior',
    subcategory: 'emulsion',
    paintType: 'Budget Interior',
    finish: 'Matte',
    basePrice: 500,
    originalMultiplier: 1.32,
    coverage: '140 sq ft/L',
    dryingTime: '1 hour',
    features: ['Asian Paints Quality', 'Budget Friendly', 'Quick Drying', 'Good Coverage', 'Economy'],
    specifications: { 'Finish': 'Matte', 'Base': 'Water-based', 'Coverage': '140 sq ft/L', 'Drying Time': '1 hour', 'Recoat Time': '2 hours', 'VOC Content': '< 15 g/L' }
  },
  {
    prefix: 'Tractor Shyne',
    codePrefix: 'TS',
    category: 'interior',
    subcategory: 'emulsion',
    paintType: 'Budget Interior',
    finish: 'Satin',
    basePrice: 550,
    originalMultiplier: 1.33,
    coverage: '135 sq ft/L',
    dryingTime: '1.5 hours',
    features: ['Asian Paints Quality', 'Budget Friendly', 'Shiny Finish', 'Washable', 'Economy'],
    specifications: { 'Finish': 'Satin', 'Base': 'Water-based', 'Coverage': '135 sq ft/L', 'Drying Time': '1.5 hours', 'Recoat Time': '3 hours', 'VOC Content': '< 15 g/L' }
  },
  {
    prefix: 'Apex Ultima',
    codePrefix: 'AU',
    category: 'exterior',
    subcategory: 'weatherproof',
    paintType: 'Premium Exterior',
    finish: 'Satin',
    basePrice: 2800,
    originalMultiplier: 1.45,
    coverage: '85 sq ft/L',
    dryingTime: '3 hours',
    features: ['UV Resistant', 'Waterproof', 'Algae Resistant', 'Crack Bridging', '10 Year Durability'],
    specifications: { 'Finish': 'Satin', 'Base': 'Pure Acrylic', 'Coverage': '85 sq ft/L', 'Drying Time': '3 hours', 'Recoat Time': '6 hours', 'Weather Resistance': '10 years' }
  },
  {
    prefix: 'Apex',
    codePrefix: 'AX',
    category: 'exterior',
    subcategory: 'weatherproof',
    paintType: 'Exterior',
    finish: 'Satin',
    basePrice: 1400,
    originalMultiplier: 1.38,
    coverage: '90 sq ft/L',
    dryingTime: '3 hours',
    features: ['UV Resistant', 'Waterproof', 'Algae Resistant', 'Weather Resistant', '5 Year Durability'],
    specifications: { 'Finish': 'Satin', 'Base': 'Acrylic Copolymer', 'Coverage': '90 sq ft/L', 'Drying Time': '3 hours', 'Recoat Time': '6 hours', 'Weather Resistance': '5 years' }
  },
  {
    prefix: 'Ace',
    codePrefix: 'AC',
    category: 'exterior',
    subcategory: 'weatherproof',
    paintType: 'Value Exterior',
    finish: 'Matte',
    basePrice: 900,
    originalMultiplier: 1.35,
    coverage: '95 sq ft/L',
    dryingTime: '3 hours',
    features: ['UV Resistant', 'Waterproof', 'Budget Friendly', 'Weather Resistant', 'Good Coverage'],
    specifications: { 'Finish': 'Matte', 'Base': 'Acrylic Copolymer', 'Coverage': '95 sq ft/L', 'Drying Time': '3 hours', 'Recoat Time': '6 hours', 'Weather Resistance': '3 years' }
  },
  {
    prefix: 'SmartCare Primer',
    codePrefix: 'SC',
    category: 'primers',
    subcategory: 'all-purpose',
    paintType: 'All-Purpose Primer',
    finish: 'Flat',
    basePrice: 450,
    originalMultiplier: 1.3,
    coverage: '150 sq ft/L',
    dryingTime: '1 hour',
    features: ['Stain Blocking', 'Excellent Adhesion', 'Interior & Exterior', 'Quick Drying', 'Sandable'],
    specifications: { 'Finish': 'Flat', 'Base': 'Water-based', 'Coverage': '150 sq ft/L', 'Drying Time': '1 hour', 'Recoat Time': '2 hours', 'Use': 'Interior & Exterior' }
  },
  {
    prefix: 'Apex Primer',
    codePrefix: 'APR',
    category: 'primers',
    subcategory: 'exterior',
    paintType: 'Exterior Primer',
    finish: 'Flat',
    basePrice: 550,
    originalMultiplier: 1.32,
    coverage: '140 sq ft/L',
    dryingTime: '1.5 hours',
    features: ['Exterior Use', 'Stain Blocking', 'Alkali Resistant', 'Quick Drying', 'Strong Adhesion'],
    specifications: { 'Finish': 'Flat', 'Base': 'Water-based', 'Coverage': '140 sq ft/L', 'Drying Time': '1.5 hours', 'Recoat Time': '3 hours', 'Use': 'Exterior' }
  }
];

// Color names organized by category
const colorNames = {
  'Whites & Off-Whites': [
    'Pure White', 'Snow White', 'Ivory', 'Pearl White', 'Cloud White', 'Cream',
    'Eggshell', 'Linen', 'Chiffon', 'Bisque', 'Alabaster', 'Porcelain',
    'Cotton', 'Milk', 'Vanilla', 'Lace', 'Honeydew', 'Seashell',
    'Floral White', 'Old Lace', 'Mint Cream', 'Azure', 'Ghost White', 'White Smoke',
    'Snow', 'Ivory Cream', 'Antique White', 'Lavender Blush', 'Misty Rose', 'Light Cyan',
    'Pale Turquoise', 'Powder Blue', 'Light Blue', 'Light Steel Blue', 'Light Gray',
    'Gainsboro', 'Silver', 'Platinum', 'Ghost', 'White Linen', 'Pristine',
    'Angel White', 'Frost', 'Crystal', 'Moonstone', 'Opal', 'Topaz',
    'Diamond', 'Pearl', 'Cloud', 'Dawn', 'Morning Mist', 'Fresh Snow'
  ],
  'Reds & Oranges': [
    'Crimson Red', 'Ruby Red', 'Scarlet', 'Cherry Blossom', 'Brick Red', 'Rose Red',
    'Tomato', 'Coral Red', 'Sunset Orange', 'Mango Tango', 'Terracotta', 'Rust',
    'Burnt Sienna', 'Vermilion', 'Poppy Red', 'Candy Apple', 'Fire Engine', 'Cardinal',
    'Maroon', 'Wine Red', 'Burgundy', 'Mahogany', 'Raspberry', 'Blood Orange',
    'Tangerine', 'Amber', 'Peach', 'Apricot', 'Salmon', 'Flamingo',
    'Blush', 'Coral', 'Papaya', 'Melon', 'Nectarine', 'Persimmon',
    'Cayenne', 'Paprika', 'Cinnamon', 'Copper', 'Bronze', 'Sienna',
    'Copper Penny', 'Burnt Orange', 'Pumpkin', 'Carrot', 'Tiger Lily', 'Geranium',
    'Cerise', 'Magenta Rose', 'Ruby', 'Garnet', 'Crimson', 'Scarlet Blaze'
  ],
  'Blues': [
    'Sky Blue', 'Ocean Blue', 'Navy Blue', 'Royal Blue', 'Cobalt Blue', 'Azure Blue',
    'Cerulean', 'Cyan', 'Turquoise', 'Teal', 'Aqua', 'Cerulean Blue',
    'Midnight Blue', 'Steel Blue', 'Slate Blue', 'Powder Blue', 'Baby Blue', 'Ice Blue',
    'Denim', 'Indigo', 'Sapphire', 'Cobalt', 'Prussian Blue', 'French Blue',
    'Wedgewood', 'Periwinkle', 'Cornflower', 'Dodger Blue', 'Royal', 'Electric Blue',
    'Deep Sky', 'Light Sky', 'Day Sky', 'Winter Sky', 'Morning Sky', 'Clear Sky',
    'Storm Blue', 'Rain Blue', 'Cloud Blue', 'Glacier', 'Arctic', 'Fjord',
    'Lagoon', 'Marine', 'Nautical', 'Pacific', 'Atlantic', 'Mediterranean',
    'Pacific Blue', 'Ocean Deep', 'Sea Wave', 'Blue Lagoon', 'Cerulean Sky', 'Crystal Blue'
  ],
  'Greens': [
    'Forest Green', 'Emerald Green', 'Sage Green', 'Olive Green', 'Mint Green', 'Lime Green',
    'Sea Green', 'Pine Green', 'Moss Green', 'Jade Green', 'Kelly Green', 'Spring Green',
    'Chartreuse', 'Peridot', 'Fern Green', 'Hunter Green', 'Olive Drab', 'Dark Green',
    'Shamrock', 'Clover', 'Basil', 'Thyme', 'Spearmint', 'Eucalyptus',
    'Jungle', 'Rainforest', 'Meadow', 'Garden', 'Leaf', 'Herb',
    'Pistachio', 'Avocado', 'Kiwi', 'Matcha', 'Mint', 'Celery',
    'Fern', 'Lichen', 'Moss', 'Seaweed', 'Kelp', 'Algae',
    'Pine', 'Cedar', 'Bamboo', 'Willow', 'Ivy', 'Vine',
    'Green Tea', 'Cucumber', 'Lime Zest', 'Grass', 'Lawn', 'Emerald'
  ],
  'Yellows & Golds': [
    'Golden Yellow', 'Sunshine Yellow', 'Buttercream', 'Lemon Yellow', 'Canary Yellow', 'Amber Gold',
    'Honey', 'Mustard', 'Saffron', 'Marigold', 'Dandelion', 'Canary',
    'Primrose', 'Jonquil', 'Ochre', 'Saffron', 'Turmeric', 'Curry',
    'Butter', 'Cream', 'Champagne', 'Gold', 'Bronze', 'Copper',
    'Brass', 'Antique Gold', 'Old Gold', 'Metallic Gold', 'Rose Gold', 'Platinum',
    'Sunflower', 'Daisy', 'Buttercup', 'Corn', 'Wheat', 'Straw',
    'Flax', 'Linen Gold', 'Parchment', 'Manila', 'Canary Bright', 'Lemon Peel',
    'Banana', 'Mango', 'Pineapple', 'Papaya', 'Melon Yellow', 'Apricot Gold',
    'Pale Gold', 'Rich Gold', 'Deep Gold', 'Warm Gold', 'Cool Gold', 'Bright Gold'
  ],
  'Pinks & Purples': [
    'Soft Pink', 'Hot Pink', 'Lavender', 'Mauve', 'Orchid', 'Plum',
    'Fuchsia', 'Magenta', 'Rose', 'Blush Pink', 'Dusty Rose', 'Carnation',
    'Peony', 'Flamingo Pink', 'Salmon Pink', 'Coral Pink', 'Peach Pink', 'Bubblegum',
    'Lilac', 'Wisteria', 'Amethyst', 'Violet', 'Royal Purple', 'Deep Purple',
    'Grape', 'Eggplant', 'Aubergine', 'Mulberry', 'Berry', 'Wine',
    'Cerise', 'Pomegranate', 'Raspberry', 'Strawberry', 'Cherry', 'Rhubarb',
    'Heather', 'Thistle', 'Periwinkle', 'Iris', 'Heliotrope', 'Byzantium',
    'Byzantine', 'Mystic', 'Twilight', 'Dusk', 'Aurora', 'Sunset Pink',
    'Candy Pink', 'Shell Pink', 'Powder Pink', 'Pale Pink', 'Rose Quartz', 'Pink Opal'
  ],
  'Greys': [
    'Slate Gray', 'Charcoal', 'Ash Gray', 'Silver Gray', 'Dove Gray', 'Pewter',
    'Storm Gray', 'Graphite', 'Flannel', 'Granite', 'Steel', 'Iron',
    'Smoke', 'Fog', 'Mist', 'Cloud Gray', 'Dove', 'Stone',
    'Slate', 'Battleship', 'Dim Gray', 'Dark Gray', 'Medium Gray', 'Light Gray',
    'Gainsboro', 'Platinum', 'Silver', 'Mercury', 'Nickel', 'Zinc',
    'Gunmetal', 'Onyx', 'Obsidian', 'Basalt', 'Travertine', 'Marble',
    'Cement', 'Concrete', 'Asphalt', 'Tarmac', 'Slate Dark', 'Slate Light',
    'Cool Gray', 'Warm Gray', 'Neutral Gray', 'Classic Gray', 'Modern Gray', 'Urban Gray',
    'Urban Taupe', 'Metropolitan', 'City Gray', 'Nimbus', 'Pebble', 'Shale'
  ],
  'Browns & Taupes': [
    'Warm Beige', 'Chocolate Brown', 'Mocha', 'Caramel', 'Sand', 'Khaki',
    'Tan', 'Russet', 'Sienna', 'Umber', 'Walnut', 'Mahogany',
    'Chestnut', 'Cinnamon', 'Cocoa', 'Coffee', 'Espresso', 'Truffle',
    'Fawn', 'Tan', 'Nougat', 'Praline', 'Hazelnut', 'Almond',
    'Pecan', 'Toffee', 'Butterscotch', 'Maple', 'Amber', 'Copper',
    'Bronze', 'Sepia', 'Raw Umber', 'Burnt Umber', 'Burnt Sienna', 'Raw Sienna',
    'Taupe', 'Greige', 'Stone', 'Sandstone', 'Limestone', 'Clay',
    'Terracotta', 'Adobe', 'Pueblo', 'Sedona', 'Canyon', 'Desert',
    'Sahara', 'Sandy Brown', 'Peru', 'Chocolate', 'Maroon Brown', 'Dark Brown'
  ],
  'Neutrals': [
    'Neutral Beige', 'Warm Neutral', 'Cool Neutral', 'Greige', 'Stone', 'Sandstone',
    'Limestone', 'Parchment', 'Manila', 'Khaki', 'Driftwood', 'Weathered Wood',
    'Bleached Wood', 'Raw Wood', 'Whitewash', 'Pickled Wood', 'Natural', 'Organic',
    'Earth', 'Clay', 'Loam', 'Silt', 'Peat', 'Topsoil',
    'Sand Dollar', 'Dune', 'Beach', 'Shore', 'Coast', 'Drift',
    'River Rock', 'Pebble', 'Gravel', 'Slate', 'Flagstone', 'Cobblestone',
    'Birch', 'Pine Light', 'Cedar Light', 'Ash Light', 'Maple Light', 'Oak Light',
    'Bamboo Light', 'Willow Light', 'Walnut Light', 'Teak Light', 'Rosewood Light', 'Ebony Light',
    'Linen Natural', 'Cotton Natural', 'Silk Natural', 'Wool Natural', 'Hemp Natural', 'Jute Natural'
  ]
};

// Generate hex colors for each category
function generateHex(category, index) {
  const colorRanges = {
    'Whites & Off-Whites': { h: [30, 60], s: [5, 20], l: [90, 98] },
    'Reds & Oranges': { h: [0, 40], s: [50, 90], l: [35, 65] },
    'Blues': { h: [190, 240], s: [40, 80], l: [35, 70] },
    'Greens': { h: [80, 160], s: [30, 70], l: [30, 60] },
    'Yellows & Golds': { h: [40, 60], s: [50, 90], l: [50, 80] },
    'Pinks & Purples': { h: [280, 340], s: [40, 80], l: [40, 70] },
    'Greys': { h: [200, 220], s: [5, 20], l: [40, 75] },
    'Browns & Taupes': { h: [20, 40], s: [30, 60], l: [35, 65] },
    'Neutrals': { h: [30, 50], s: [10, 30], l: [70, 85] }
  };
  
  const range = colorRanges[category] || colorRanges['Neutrals'];
  const h = range.h[0] + ((index * 7 + 13) % (range.h[1] - range.h[0]));
  const s = range.s[0] + ((index * 11 + 7) % (range.s[1] - range.s[0]));
  const l = range.l[0] + ((index * 17 + 3) % (range.l[1] - range.l[0]));
  
  // Convert HSL to Hex
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };
  
  return hslToHex(h, s, l);
}

// Price varies by product line and color
function calculatePrice(basePrice, colorIndex) {
  const variation = (colorIndex % 5) * 50;
  return basePrice + variation;
}

// Generate products
const products = [];
let idCounter = 200; // Start after existing products

const categories = Object.keys(colorNames);

productLines.forEach(line => {
  let colorIndex = 0;
  
  categories.forEach(category => {
    const names = colorNames[category];
    
    names.forEach((colorName, idx) => {
      if (colorIndex >= 18) return; // Limit per product line per category to keep total manageable
      
      const code = `${line.codePrefix}-${String(colorIndex + 1).padStart(3, '0')}`;
      const price = calculatePrice(line.basePrice, colorIndex);
      const originalPrice = Math.round(price * line.originalMultiplier);
      
      const product = {
        id: `ap_${idCounter++}`,
        name: `Asian Paints ${line.prefix} - ${colorName}`,
        description: `Premium ${line.paintType.toLowerCase()} from Asian Paints. Color Code: ${code}. Part of the trusted Asian Paints range. ${colorName} shade for perfect wall coverage.`,
        hexColor: generateHex(category, colorIndex),
        price: price,
        originalPrice: originalPrice,
        pricePerLiter: price,
        category: line.category,
        subcategory: line.subcategory,
        brand: 'Asian Paints',
        rating: Math.round((4.0 + (colorIndex % 10) * 0.1) * 10) / 10,
        reviewCount: 500 + Math.floor(Math.random() * 5000),
        paintType: line.paintType,
        finish: line.finish,
        coverage: line.coverage,
        dryingTime: line.dryingTime,
        availableSizes: [
          { size: '1L', price: price },
          { size: '4L', price: price * 3.6 },
          { size: '10L', price: price * 8.5 }
        ],
        features: [...line.features, `Color Code: ${code}`],
        specifications: { ...line.specifications, 'Asian Paints Code': code, 'Color Category': category },
        stock: 100 + Math.floor(Math.random() * 400),
        badge: colorIndex % 20 === 0 ? 'Best Seller' : colorIndex % 15 === 0 ? 'Trending' : null,
        asianColorCode: code,
        colorCategory: category
      };
      
      products.push(product);
      colorIndex++;
    });
  });
});

console.log(`Generated ${products.length} Asian Paints products`);

// Write to file
const outputPath = path.join(__dirname, 'asian-paints-catalog.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Written to ${outputPath}`);
