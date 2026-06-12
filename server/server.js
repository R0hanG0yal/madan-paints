import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load products
const productsPath = path.join(__dirname, 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

app.set('products', products);

console.log(`Loaded ${products.length} products`);

// TEST ROUTES
app.get('/', (req, res) => {
  res.json({
    message: 'Backend Running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    productsCount: products.length
  });
});

// PRODUCTS ROUTES
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});