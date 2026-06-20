import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, 'products.json');

const customProducts = [
  {
    id: "mp-matte-sagemist",
    name: "Essential Matte Collection - Sage Mist",
    description: "Madan Paints Essential Matte Collection in 'Sage Mist'. Sophisticated flat finish with rich coverage and elegant green tones. Specially formulated for living rooms and bedrooms.",
    hexColor: "#8fa696",
    price: 7100,
    originalPrice: 8500,
    pricePerLiter: 1875,
    category: "interior",
    subcategory: "emulsion",
    brand: "Madan Paints",
    rating: 4.9,
    reviewCount: 4850,
    paintType: "Matte Interior",
    finish: "Matte",
    coverage: "120 sq ft/L",
    dryingTime: "2 hours",
    availableSizes: [
      { size: "1 Gallon", price: 7100 },
      { size: "4 Gallons", price: 25500 }
    ],
    features: [
      "Sophisticated flat finish",
      "Washable matte texture",
      "Low VOC & eco-friendly",
      "Premium sage mist color"
    ],
    specifications: {
      "Finish": "Matte",
      "Base": "Water-based Acrylic",
      "Coverage": "120 sq ft/L",
      "Drying Time": "2 hours",
      "Color Category": "Greens"
    },
    stock: 500,
    badge: "Best Seller",
    colorCategory: "Greens"
  },
  {
    id: "mp-matte-ochregold",
    name: "Essential Matte Collection - Ochre Gold",
    description: "Madan Paints Essential Matte Collection in 'Ochre Gold'. Warm, elegant flat finish with a touch of sunshine. Brings a premium, cozy, and luxurious feel to any space.",
    hexColor: "#c2973b",
    price: 7100,
    originalPrice: 8500,
    pricePerLiter: 1875,
    category: "interior",
    subcategory: "emulsion",
    brand: "Madan Paints",
    rating: 4.8,
    reviewCount: 3120,
    paintType: "Matte Interior",
    finish: "Matte",
    coverage: "120 sq ft/L",
    dryingTime: "2 hours",
    availableSizes: [
      { size: "1 Gallon", price: 7100 },
      { size: "4 Gallons", price: 25500 }
    ],
    features: [
      "Sophisticated flat finish",
      "Washable matte texture",
      "Low VOC & eco-friendly",
      "Ochre gold accent"
    ],
    specifications: {
      "Finish": "Matte",
      "Base": "Water-based Acrylic",
      "Coverage": "120 sq ft/L",
      "Drying Time": "2 hours",
      "Color Category": "Yellows & Golds"
    },
    stock: 350,
    badge: "Featured",
    colorCategory: "Yellows & Golds"
  },
  {
    id: "mp-satin-plumblush",
    name: "Satin Velvet Collection - Plum Blush",
    description: "Madan Paints Satin Velvet Collection in 'Plum Blush'. Durable, elegant sheen with a rich and deep plum-rose tone. Extremely easy to clean and highly stain-resistant.",
    hexColor: "#8f5c6b",
    price: 7900,
    originalPrice: 9500,
    pricePerLiter: 2085,
    category: "interior",
    subcategory: "emulsion",
    brand: "Madan Paints",
    rating: 4.9,
    reviewCount: 3820,
    paintType: "Satin Interior",
    finish: "Satin",
    coverage: "115 sq ft/L",
    dryingTime: "3 hours",
    availableSizes: [
      { size: "1 Gallon", price: 7900 },
      { size: "4 Gallons", price: 28400 }
    ],
    features: [
      "Durable, elegant sheen",
      "Rich velvet look",
      "High scrub resistance",
      "Stain-repellent technology"
    ],
    specifications: {
      "Finish": "Satin",
      "Base": "Water-based Acrylic",
      "Coverage": "115 sq ft/L",
      "Drying Time": "3 hours",
      "Color Category": "Pinks & Purples"
    },
    stock: 420,
    badge: "Best Seller",
    colorCategory: "Pinks & Purples"
  },
  {
    id: "mp-gloss-midnightblue",
    name: "Gloss Collection - Midnight Blue",
    description: "Madan Paints Gloss Collection in 'Midnight Blue'. High-shine statement color with stunning depth and glossiness. Perfect for metal surfaces, wood, or feature accent walls.",
    hexColor: "#1a2f4c",
    price: 8700,
    originalPrice: 10500,
    pricePerLiter: 2300,
    category: "interior",
    subcategory: "luxury",
    brand: "Madan Paints",
    rating: 5.0,
    reviewCount: 2940,
    paintType: "Gloss Interior",
    finish: "Gloss",
    coverage: "110 sq ft/L",
    dryingTime: "4 hours",
    availableSizes: [
      { size: "1 Gallon", price: 8700 },
      { size: "4 Gallons", price: 31300 }
    ],
    features: [
      "High-shine statement colors",
      "Mirror-like gloss finish",
      "Ultra-durable enamel coat",
      "Scratch-resistant"
    ],
    specifications: {
      "Finish": "Gloss",
      "Base": "Solvent-based Enamel",
      "Coverage": "110 sq ft/L",
      "Drying Time": "4 hours",
      "Color Category": "Blues"
    },
    stock: 280,
    badge: "New",
    colorCategory: "Blues"
  }
];

if (fs.existsSync(productsPath)) {
  try {
    const raw = fs.readFileSync(productsPath, 'utf-8');
    let products = JSON.parse(raw);
    const originalCount = products.length;

    // Filter out any existing products with Madan Paints brand or these IDs
    const customIds = customProducts.map(p => p.id);
    products = products.filter(p => p.brand !== "Madan Paints" && !customIds.includes(p.id));

    // Prepend the new custom products
    products.unshift(...customProducts);

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`Successfully seeded ${customProducts.length} Madan Paints products!`);
    console.log(`Total products in database: ${products.length} (Original was: ${originalCount})`);
  } catch (err) {
    console.error('Error parsing or writing products.json:', err.message);
  }
} else {
  console.error(`products.json not found at ${productsPath}`);
}
