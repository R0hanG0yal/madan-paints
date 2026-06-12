const fs = require('fs');
const path = require('path');

const existing = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const existingNames = new Set(existing.map(p => p.name));
let nextId = Math.max(...existing.map(p => parseInt(p.id)).filter(x => !isNaN(x))) + 1;

function genId() { return 'p' + (nextId++); }

const products = [];

// Color palettes for generating realistic color variants
const interiorColors = [
  { name: 'White', hex: '#FFFFFF' }, { name: 'Off White', hex: '#F5F0E8' },
  { name: 'Ivory', hex: '#FFFFF0' }, { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Pearl White', hex: '#F0EAD6' }, { name: 'Soft Peach', hex: '#FFDAB9' },
  { name: 'Warm Beige', hex: '#D4A574' }, { name: 'Sand', hex: '#C2B280' },
  { name: 'Champagne', hex: '#F7E7CE' }, { name: 'Misty Rose', hex: '#FFE4E1' },
  { name: 'Blush Pink', hex: '#FFB6C1' }, { name: 'Rose Petal', hex: '#E8B4B8' },
  { name: 'Dusty Rose', hex: '#DCAE96' }, { name: 'Terracotta', hex: '#CC4E2C' },
  { name: 'Brick Red', hex: '#CB4154' }, { name: 'Crimson', hex: '#DC143C' },
  { name: 'Wine Red', hex: '#722F37' }, { name: 'Burgundy', hex: '#800020' },
  { name: 'Coral', hex: '#FF7F50' }, { name: 'Peach', hex: '#FFCBA4' },
  { name: 'Sunset Orange', hex: '#FF4500' }, { name: 'Rust', hex: '#B7410E' },
  { name: 'Amber', hex: '#FFBF00' }, { name: 'Mustard', hex: '#FFDB58' },
  { name: 'Lemon', hex: '#FFF44F' }, { name: 'Canary Yellow', hex: '#FFEF00' },
  { name: 'Gold', hex: '#FFD700' }, { name: 'Honey', hex: '#EB9605' },
  { name: 'Olive Green', hex: '#808000' }, { name: 'Sage Green', hex: '#BCB88A' },
  { name: 'Mint Green', hex: '#98FF98' }, { name: 'Emerald', hex: '#50C878' },
  { name: 'Forest Green', hex: '#228B22' }, { name: 'Sea Green', hex: '#2E8B57' },
  { name: 'Teal', hex: '#008080' }, { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Sky Blue', hex: '#87CEEB' }, { name: 'Powder Blue', hex: '#B0E0E6' },
  { name: 'Baby Blue', hex: '#89CFF0' }, { name: 'Cornflower', hex: '#6495ED' },
  { name: 'Ocean Blue', hex: '#4F97A3' }, { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Navy Blue', hex: '#000080' }, { name: 'Midnight Blue', hex: '#191970' },
  { name: 'Lavender', hex: '#E6E6FA' }, { name: 'Lilac', hex: '#C8A2C8' },
  { name: 'Purple', hex: '#800080' }, { name: 'Plum', hex: '#8E4585' },
  { name: 'Grey', hex: '#808080' }, { name: 'Charcoal', hex: '#36454F' },
  { name: 'Silver', hex: '#C0C0C0' }, { name: 'Stone', hex: '#928E85' },
  { name: 'Taupe', hex: '#483C32' }, { name: 'Chocolate', hex: '#7B3F00' },
  { name: 'Coffee', hex: '#6F4E37' }, { name: 'Mocha', hex: '#967969' },
  { name: 'Slate', hex: '#708090' }, { name: 'Ash', hex: '#B2BEB5' },
  { name: 'Cloud White', hex: '#F0EDE5' }, { name: 'Eggshell', hex: '#F0EAD6' },
];

function randomRating() { return +(4 + Math.random() * 0.9).toFixed(1); }
function randomReviews() { return Math.floor(500 + Math.random() * 9500); }
function randomStock() { return Math.floor(50 + Math.random() * 400); }
function randomDiscount() { return +(0.2 + Math.random() * 0.25).toFixed(2); }

function addProduct(data) {
  if (existingNames.has(data.name)) return;
  existingNames.add(data.name);
  products.push(data);
}

// ==================== NEROLAC ====================

// --- Interior: Impression Kashmir High Sheen (Luxury) ---
const nerolacKashmirColors = interiorColors.filter((_, i) => i % 3 === 0);
nerolacKashmirColors.forEach((c, i) => {
  const base = 2299 + (i % 5) * 100;
  addProduct({
    id: genId(), name: `Nerolac Impressions Kashmir High Sheen - ${c.name}`,
    description: `Nerolac's luxury interior emulsion with Silver Ion technology. Kills 99% germs. High sheen finish with exceptional washability and stain resistance. Premium quality for living rooms and bedrooms.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.35),
    pricePerLiter: base, category: 'interior', subcategory: 'luxury',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Luxury Interior', finish: 'High Sheen',
    coverage: '110 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.6 },
      { size: '10L', price: base * 8.5 }
    ],
    features: ['Silver Ion Technology', 'Kills 99% Germs', 'High Sheen', 'Ultra Washable', 'Stain Resistant'],
    specifications: { 'Finish': 'High Sheen', 'Base': 'Water-based Acrylic', 'Coverage': '110 sq ft/L', 'Technology': 'Silver Ion Anti-bacterial' },
    stock: randomStock(), badge: 'Premium', colorCategory: c.name.includes('Blue') ? 'Blues' : c.name.includes('Green') ? 'Greens' : c.name.includes('Red') || c.name.includes('Pink') ? 'Reds & Oranges' : c.name.includes('Yellow') || c.name.includes('Gold') ? 'Yellows & Golds' : 'Whites & Off-Whites'
  });
});

// --- Interior: Impression Kashmir Matt (Luxury) ---
const nerolacKashmirMattColors = interiorColors.filter((_, i) => i % 4 === 1);
nerolacKashmirMattColors.forEach((c, i) => {
  const base = 1999 + (i % 4) * 150;
  addProduct({
    id: genId(), name: `Nerolac Impressions Kashmir Matt - ${c.name}`,
    description: `Premium matt finish luxury interior paint from Nerolac. Silver Ion technology for germ protection. Smooth, velvety finish with excellent hide and coverage.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.30),
    pricePerLiter: base, category: 'interior', subcategory: 'luxury',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Luxury Interior', finish: 'Matt',
    coverage: '115 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.6 },
      { size: '10L', price: base * 8.5 }
    ],
    features: ['Silver Ion Technology', 'Luxury Matt Finish', 'Anti-bacterial', 'Low Odor', 'Easy Application'],
    specifications: { 'Finish': 'Matt', 'Base': 'Water-based', 'Coverage': '115 sq ft/L' },
    stock: randomStock(), badge: null
  });
});

// --- Interior: Impression Ultra HD (Luxury) ---
const nerolacUltraHDColors = interiorColors.filter((_, i) => i % 5 === 2);
nerolacUltraHDColors.forEach((c, i) => {
  const base = 2199 + (i % 3) * 200;
  addProduct({
    id: genId(), name: `Nerolac Impressions Ultra HD - ${c.name}`,
    description: `Ultra high-definition color interior paint from Nerolac. Radiant, vivid colors with ultra-low VOC. Provides stunning depth and clarity of color with a luxurious finish.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.33),
    pricePerLiter: base, category: 'interior', subcategory: 'luxury',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Luxury Interior', finish: 'Satin',
    coverage: '105 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.2 }
    ],
    features: ['Ultra HD Color', 'Ultra-low VOC', 'Radiant Finish', 'Excellent Hide', 'Luxury Quality'],
    specifications: { 'Finish': 'Satin', 'Base': 'Water-based Acrylic', 'Coverage': '105 sq ft/L', 'VOC Content': '< 2 g/L' },
    stock: randomStock(), badge: 'Premium'
  });
});

// --- Interior: Beauty Gold Washable (Premium) ---
const nerolacBeautyGoldColors = interiorColors.filter((_, i) => i % 3 === 2);
nerolacBeautyGoldColors.forEach((c, i) => {
  const base = 1299 + (i % 5) * 100;
  addProduct({
    id: genId(), name: `Nerolac Beauty Gold Washable - ${c.name}`,
    description: `Premium washable interior emulsion from Nerolac. Soft sheen finish with high stain cleanability. Durable, long-lasting protection for high-traffic areas.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.28),
    pricePerLiter: base, category: 'interior', subcategory: 'emulsion',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Interior Emulsion', finish: 'Satin',
    coverage: '120 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.3 }
    ],
    features: ['Washable', 'Stain Resistant', 'Soft Sheen', 'Long Lasting', 'Nerolac Quality'],
    specifications: { 'Finish': 'Satin', 'Base': 'Water-based Acrylic', 'Coverage': '120 sq ft/L' },
    stock: randomStock(), badge: 'Best Seller'
  });
});

// --- Interior: Beauty Gold Washable Plus (Premium with 7yr warranty) ---
const nerolacGoldPlusColors = interiorColors.filter((_, i) => i % 6 === 0);
nerolacGoldPlusColors.forEach((c, i) => {
  const base = 1599 + (i % 3) * 150;
  addProduct({
    id: genId(), name: `Nerolac Beauty Gold Washable Plus - ${c.name}`,
    description: `Dual-feature premium interior paint with antibacterial and high washability. Comes with 7-year performance warranty. Ideal for homes with children and pets.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.30),
    pricePerLiter: base, category: 'interior', subcategory: 'emulsion',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Interior Emulsion', finish: 'Satin',
    coverage: '120 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.3 }
    ],
    features: ['7 Year Warranty', 'Antibacterial', 'Ultra Washable', 'Stain Proof', 'Premium Quality'],
    specifications: { 'Finish': 'Satin', 'Base': 'Water-based', 'Coverage': '120 sq ft/L', 'Warranty': '7 Years' },
    stock: randomStock(), badge: 'Premium'
  });
});

// --- Interior: Beauty Sheen (Economy) ---
const nerolacSheenColors = interiorColors.filter((_, i) => i % 4 === 3);
nerolacSheenColors.forEach((c, i) => {
  const base = 699 + (i % 4) * 80;
  addProduct({
    id: genId(), name: `Nerolac Beauty Sheen - ${c.name}`,
    description: `Economy-range interior paint from Nerolac with a radiant sheen finish. Great balance of affordability and quality for everyday home painting.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.25),
    pricePerLiter: base, category: 'interior', subcategory: 'emulsion',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Interior Emulsion', finish: 'Sheen',
    coverage: '130 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.2 }
    ],
    features: ['Radiant Sheen', 'Economy Price', 'Good Coverage', 'Easy Application', 'Nerolac Quality'],
    specifications: { 'Finish': 'Sheen', 'Base': 'Water-based', 'Coverage': '130 sq ft/L' },
    stock: randomStock(), badge: 'Value Pick'
  });
});

// --- Interior: Beauty Smooth (Budget) ---
const nerolacSmoothColors = interiorColors.filter((_, i) => i % 7 === 1);
nerolacSmoothColors.forEach((c, i) => {
  const base = 499 + (i % 3) * 60;
  addProduct({
    id: genId(), name: `Nerolac Beauty Smooth - ${c.name}`,
    description: `Budget-friendly smooth finish interior paint from Nerolac. Rich smooth finish with excellent coverage. Perfect for rental homes and budget projects.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.22),
    pricePerLiter: base, category: 'interior', subcategory: 'emulsion',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Interior Emulsion', finish: 'Smooth Matte',
    coverage: '135 sq ft/L', dryingTime: '1.5 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.4 },
      { size: '10L', price: base * 8 }
    ],
    features: ['Smooth Finish', 'Budget Price', 'Good Coverage', 'Quick Drying', 'Nerolac Trusted'],
    specifications: { 'Finish': 'Smooth Matte', 'Base': 'Water-based', 'Coverage': '135 sq ft/L' },
    stock: randomStock(), badge: 'Budget Buy'
  });
});

// --- Exterior: Excel Everlast 20 (Luxury) ---
const nerolacEverlastColors = ['White', 'Off White', 'Cream', 'Ivory', 'Warm Beige', 'Sand', 'Light Grey', 'Pebble Grey', 'Stone', 'Taupe'].map(nm => interiorColors.find(c => c.name === nm)).filter(Boolean);
nerolacEverlastColors.forEach((c, i) => {
  const base = 3299 + (i % 3) * 200;
  addProduct({
    id: genId(), name: `Nerolac Excel Everlast 20 - ${c.name}`,
    description: `Nerolac's top-tier luxury exterior paint with 20-year performance warranty. Advanced polyurethane-silicon hybrid technology. Anti-carbonation properties for ultimate building protection.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.30),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Exterior Weatherproof', finish: 'Satin',
    coverage: '75 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.2 }
    ],
    features: ['20 Year Warranty', 'PU-Silicon Technology', 'Anti-carbonation', 'Weatherproof', 'Crack Resistant'],
    specifications: { 'Finish': 'Satin', 'Base': 'PU-Silicon Hybrid', 'Coverage': '75 sq ft/L', 'Warranty': '20 Years' },
    stock: randomStock(), badge: 'Premium'
  });
});

// --- Exterior: Excel Top Guard (Premium) ---
const nerolacTopGuardColors = ['White', 'Off White', 'Cream', 'Light Grey', 'Warm Beige'].map(nm => interiorColors.find(c => c.name === nm)).filter(Boolean);
nerolacTopGuardColors.forEach((c, i) => {
  const base = 2199 + (i % 3) * 150;
  addProduct({
    id: genId(), name: `Nerolac Excel Top Guard - ${c.name}`,
    description: `High-performance exterior paint with 20x rain protection and 12-year warranty. High film thickness provides superior weather resistance.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.32),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Exterior Weatherproof', finish: 'Satin',
    coverage: '80 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.2 }
    ],
    features: ['20x Rain Protection', '12 Year Warranty', 'High Film Thickness', 'Weatherproof', 'Durable'],
    specifications: { 'Finish': 'Satin', 'Base': 'Acrylic', 'Coverage': '80 sq ft/L', 'Warranty': '12 Years' },
    stock: randomStock(), badge: null
  });
});

// --- Exterior: Excel Total (Premium) ---
const nerolacExcelTotalColors = interiorColors.filter((_, i) => i % 6 === 2);
nerolacExcelTotalColors.forEach((c, i) => {
  const base = 1799 + (i % 4) * 120;
  addProduct({
    id: genId(), name: `Nerolac Excel Total - ${c.name}`,
    description: `High-performance exterior emulsion with siloxane polymer technology. Long-lasting finish with excellent weather resistance and color retention.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.28),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Exterior Weatherproof', finish: 'Satin',
    coverage: '85 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.2 }
    ],
    features: ['Siloxane Technology', 'Color Retention', 'Weatherproof', 'Long Lasting', 'Nerolac Quality'],
    specifications: { 'Finish': 'Satin', 'Base': 'Siloxane Acrylic', 'Coverage': '85 sq ft/L' },
    stock: randomStock(), badge: null
  });
});

// --- Exterior: Suraksha Sheen (Budget) ---
const nerolacSurakshaColors = interiorColors.filter((_, i) => i % 5 === 0);
nerolacSurakshaColors.forEach((c, i) => {
  const base = 599 + (i % 4) * 70;
  addProduct({
    id: genId(), name: `Nerolac Suraksha Sheen - ${c.name}`,
    description: `Budget-friendly exterior plastic paint from Nerolac. Provides a durable sheen finish with basic weather protection. Ideal for residential buildings.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.22),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Exterior Weatherproof', finish: 'Sheen',
    coverage: '90 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8 }
    ],
    features: ['Economy Price', 'Sheen Finish', 'Weather Resistant', 'Good Coverage', 'Nerolac Quality'],
    specifications: { 'Finish': 'Sheen', 'Base': 'Acrylic', 'Coverage': '90 sq ft/L' },
    stock: randomStock(), badge: 'Value Pick'
  });
});

// --- Exterior: Suraksha Plus (Economy) ---
const nerolacSurakshaPlusColors = interiorColors.filter((_, i) => i % 8 === 4);
nerolacSurakshaPlusColors.forEach((c, i) => {
  const base = 799 + (i % 3) * 100;
  addProduct({
    id: genId(), name: `Nerolac Suraksha Plus - ${c.name}`,
    description: `Nerolac's economy exterior paint with Colour Lock+ technology. Superior color retention for dry to moderately humid conditions.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.25),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Nerolac', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Nerolac Exterior Weatherproof', finish: 'Matte',
    coverage: '90 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8 }
    ],
    features: ['Colour Lock+ Technology', 'Color Retention', 'Economy Price', 'Weather Resistant', 'Durable'],
    specifications: { 'Finish': 'Matte', 'Base': 'Acrylic', 'Coverage': '90 sq ft/L' },
    stock: randomStock(), badge: null
  });
});

// ==================== BERGER ====================

// --- Interior: Silk GlamArt (Luxury) ---
const bergerSilkColors = interiorColors.filter((_, i) => i % 3 === 0);
bergerSilkColors.forEach((c, i) => {
  const base = 2099 + (i % 5) * 120;
  addProduct({
    id: genId(), name: `Berger Silk GlamArt - ${c.name}`,
    description: `Berger's luxury silk finish interior emulsion. Rich velvety finish with superior durability and stain resistance. Premium quality for discerning homeowners.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.33),
    pricePerLiter: base, category: 'interior', subcategory: 'luxury',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Luxury Interior', finish: 'Silk',
    coverage: '110 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.6 },
      { size: '10L', price: base * 8.5 }
    ],
    features: ['Silk GlamArt', 'Luxury Finish', 'Stain Resistant', 'Superior Durability', 'Berger Premium'],
    specifications: { 'Finish': 'Silk', 'Base': 'Water-based Acrylic', 'Coverage': '110 sq ft/L' },
    stock: randomStock(), badge: 'Premium'
  });
});

// --- Interior: Silk Luxury Emulsion (Luxury) ---
const bergerSilkLuxuryColors = interiorColors.filter((_, i) => i % 4 === 1);
bergerSilkLuxuryColors.forEach((c, i) => {
  const base = 1899 + (i % 4) * 150;
  addProduct({
    id: genId(), name: `Berger Silk Luxury Emulsion - ${c.name}`,
    description: `High-end luxury emulsion from Berger with a rich silk finish. Exceptional color depth and washability. Perfect for premium living spaces.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.30),
    pricePerLiter: base, category: 'interior', subcategory: 'luxury',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Luxury Interior', finish: 'Silk',
    coverage: '110 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.6 },
      { size: '10L', price: base * 8.5 }
    ],
    features: ['Luxury Silk Finish', 'Rich Color Depth', 'Ultra Washable', 'Low VOC', 'Berger Quality'],
    specifications: { 'Finish': 'Silk', 'Base': 'Water-based Acrylic', 'Coverage': '110 sq ft/L' },
    stock: randomStock(), badge: null
  });
});

// --- Interior: Easy Clean (Premium) ---
const bergerEasyCleanColors = interiorColors.filter((_, i) => i % 3 === 2);
bergerEasyCleanColors.forEach((c, i) => {
  const base = 1399 + (i % 5) * 100;
  addProduct({
    id: genId(), name: `Berger Easy Clean - ${c.name}`,
    description: `Berger's premium washable interior emulsion. Excellent maintenance and antimicrobial properties. Ideal for families with children. Long-lasting beautiful walls.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.28),
    pricePerLiter: base, category: 'interior', subcategory: 'emulsion',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Interior Emulsion', finish: 'Satin',
    coverage: '120 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.3 }
    ],
    features: ['Easy Clean', 'Antimicrobial', 'Washable', 'Long Lasting', 'Berger Quality'],
    specifications: { 'Finish': 'Satin', 'Base': 'Water-based Acrylic', 'Coverage': '120 sq ft/L' },
    stock: randomStock(), badge: 'Best Seller'
  });
});

// --- Interior: Rangoli Total Care (Premium) ---
const bergerRangoliColors = interiorColors.filter((_, i) => i % 5 === 3);
bergerRangoliColors.forEach((c, i) => {
  const base = 1199 + (i % 4) * 100;
  addProduct({
    id: genId(), name: `Berger Rangoli Total Care - ${c.name}`,
    description: `Premium interior emulsion with total care protection. Antibacterial, washable, and durable. Perfect balance of quality and value for modern homes.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.28),
    pricePerLiter: base, category: 'interior', subcategory: 'emulsion',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Interior Emulsion', finish: 'Satin',
    coverage: '125 sq ft/L', dryingTime: '2 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.3 }
    ],
    features: ['Total Care', 'Antibacterial', 'Washable', 'Durable', 'Value for Money'],
    specifications: { 'Finish': 'Satin', 'Base': 'Water-based', 'Coverage': '125 sq ft/L' },
    stock: randomStock(), badge: null
  });
});

// --- Interior: Bison Acrylic Emulsion (Budget) ---
const bergerBisonColors = interiorColors.filter((_, i) => i % 4 === 3);
bergerBisonColors.forEach((c, i) => {
  const base = 499 + (i % 4) * 70;
  addProduct({
    id: genId(), name: `Berger Bison Acrylic Emulsion - ${c.name}`,
    description: `Berger's entry-level acrylic emulsion. Cost-effective interior paint with decent finish for low-traffic areas. Trusted Berger quality at budget price.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.22),
    pricePerLiter: base, category: 'interior', subcategory: 'emulsion',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Interior Emulsion', finish: 'Matte',
    coverage: '140 sq ft/L', dryingTime: '1.5 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.4 },
      { size: '10L', price: base * 8 }
    ],
    features: ['Budget Price', 'Good Coverage', 'Quick Drying', 'Easy Application', 'Berger Trusted'],
    specifications: { 'Finish': 'Matte', 'Base': 'Acrylic', 'Coverage': '140 sq ft/L' },
    stock: randomStock(), badge: 'Budget Buy'
  });
});

// --- Interior: Bison Distemper (Budget) ---
const bergerDistemperColors = interiorColors.filter((_, i) => i % 9 === 0);
bergerDistemperColors.forEach((c, i) => {
  const base = 299 + (i % 3) * 50;
  addProduct({
    id: genId(), name: `Berger Bison Distemper - ${c.name}`,
    description: `Economy distemper from Berger for basic interior wall coating. Ideal for rental properties and budget renovations. Quick and easy application.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.20),
    pricePerLiter: base, category: 'interior', subcategory: 'emulsion',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Interior Distemper', finish: 'Flat',
    coverage: '150 sq ft/L', dryingTime: '1 hour',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.3 },
      { size: '10L', price: base * 7.8 }
    ],
    features: ['Economy Price', 'Quick Dry', 'Easy Apply', 'Good Coverage', 'Berger Quality'],
    specifications: { 'Finish': 'Flat', 'Base': 'Water-based', 'Coverage': '150 sq ft/L' },
    stock: randomStock(), badge: 'Budget Buy'
  });
});

// --- Exterior: WeatherCoat Long Life (Luxury) ---
const bergerLongLifeColors = ['White', 'Off White', 'Cream', 'Ivory', 'Light Grey', 'Stone', 'Warm Beige'].map(nm => interiorColors.find(c => c.name === nm)).filter(Boolean);
bergerLongLifeColors.forEach((c, i) => {
  const base = 2899 + (i % 3) * 200;
  addProduct({
    id: genId(), name: `Berger WeatherCoat Long Life - ${c.name}`,
    description: `Berger's ultimate luxury exterior paint. Superior weather protection with anti-fading technology and crack bridging. Longest lasting Berger exterior solution.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.32),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Exterior Weatherproof', finish: 'Satin',
    coverage: '75 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.2 }
    ],
    features: ['Long Life', 'Anti-Fading', 'Crack Bridging', 'Weatherproof', 'Berger Premium'],
    specifications: { 'Finish': 'Satin', 'Base': 'Pure Acrylic', 'Coverage': '75 sq ft/L', 'Warranty': '15 Years' },
    stock: randomStock(), badge: 'Premium'
  });
});

// --- Exterior: WeatherCoat Anti Dustt (Premium) ---
const bergerAntiDustColors = interiorColors.filter((_, i) => i % 6 === 3);
bergerAntiDustColors.forEach((c, i) => {
  const base = 1999 + (i % 3) * 150;
  addProduct({
    id: genId(), name: `Berger WeatherCoat Anti Dustt - ${c.name}`,
    description: `Specialized exterior paint with dust-resistant technology. Keeps building facades clean and beautiful for longer. Anti-dirt pickup formulation.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.30),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Exterior Weatherproof', finish: 'Satin',
    coverage: '80 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.2 }
    ],
    features: ['Anti Dust Technology', 'Dirt Resistant', 'Long Lasting', 'Weatherproof', 'Berger Quality'],
    specifications: { 'Finish': 'Satin', 'Base': 'Acrylic', 'Coverage': '80 sq ft/L' },
    stock: randomStock(), badge: null
  });
});

// --- Exterior: WeatherCoat Smooth (Premium) ---
const bergerSmoothColors = interiorColors.filter((_, i) => i % 7 === 2);
bergerSmoothColors.forEach((c, i) => {
  const base = 1499 + (i % 4) * 120;
  addProduct({
    id: genId(), name: `Berger WeatherCoat Smooth - ${c.name}`,
    description: `Smooth-finish exterior paint from Berger with good rain and UV protection. Long-lasting aesthetic appeal for residential and commercial buildings.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.28),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Exterior Weatherproof', finish: 'Smooth',
    coverage: '85 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8.2 }
    ],
    features: ['Smooth Finish', 'Rain Protection', 'UV Resistant', 'Long Lasting', 'Berger Quality'],
    specifications: { 'Finish': 'Smooth', 'Base': 'Acrylic', 'Coverage': '85 sq ft/L' },
    stock: randomStock(), badge: null
  });
});

// --- Exterior: Walmasta (Budget) ---
const bergerWalmastaColors = interiorColors.filter((_, i) => i % 5 === 1);
bergerWalmastaColors.forEach((c, i) => {
  const base = 599 + (i % 4) * 70;
  addProduct({
    id: genId(), name: `Berger Walmasta - ${c.name}`,
    description: `Berger's standard budget exterior wall coating. Basic weather protection at an affordable price. Ideal for large surface areas and maintenance painting.`,
    hexColor: c.hex, price: base, originalPrice: Math.floor(base * 1.22),
    pricePerLiter: base, category: 'exterior', subcategory: 'weatherproof',
    brand: 'Berger Paints', rating: randomRating(), reviewCount: randomReviews(),
    paintType: 'Berger Exterior Weatherproof', finish: 'Matte',
    coverage: '90 sq ft/L', dryingTime: '3 hours',
    availableSizes: [
      { size: '1L', price: base },
      { size: '4L', price: base * 3.5 },
      { size: '10L', price: base * 8 }
    ],
    features: ['Budget Price', 'Weather Protection', 'Good Coverage', 'Easy Application', 'Berger Trusted'],
    specifications: { 'Finish': 'Matte', 'Base': 'Acrylic', 'Coverage': '90 sq ft/L' },
    stock: randomStock(), badge: 'Value Pick'
  });
});

// Merge with existing
const merged = [...existing, ...products];
fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(merged, null, 2));

const brands = {};
merged.forEach(x => { brands[x.brand] = (brands[x.brand] || 0) + 1; });
console.log(`Added ${products.length} new Nerolac + Berger products`);
console.log(`Total products: ${merged.length}`);
console.log(JSON.stringify(brands, null, 2));
