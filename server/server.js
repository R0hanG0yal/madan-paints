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

// CORS config — must use explicit origin when withCredentials is true
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:4173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Load products
const productsPath = path.join(__dirname, 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

app.set('products', products);

console.log(`Loaded ${products.length} products`);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    productsCount: products.length
  });
});

// PRODUCTS ROUTES
app.use('/api/products', productRoutes);

// Serve static files from the React build in production
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  console.log('Serving static files from', clientDistPath);
  app.use(express.static(clientDistPath));

  // SPA fallback: serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.log('No client dist found — API only mode');
  app.get('/', (req, res) => {
    res.json({ message: 'Backend Running' });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});