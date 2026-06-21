import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import https from 'https';

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
app.use(cookieParser());

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

// AUTH ROUTES
app.use('/api/auth', authRoutes);

// PRODUCTS ROUTES
app.use('/api/products', productRoutes);

// CART ROUTES
app.use('/api/cart', cartRoutes);

// ORDER ROUTES
app.use('/api/orders', orderRoutes);

// ADMIN ROUTES
app.use('/api/admin', adminRoutes);

// UPLOAD ROUTES
app.use('/api/upload', uploadRoutes);

// Catch all undefined API routes and return 404 JSON
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Self-ping to prevent Render from sleeping
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
setInterval(() => {
  const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  if (url) {
    https.get(`${url}/api/health`).on('error', (err) => {
      console.error('Self-ping failed:', err.message);
    });
  }
}, PING_INTERVAL);

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