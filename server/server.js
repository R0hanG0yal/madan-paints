javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import { sanitizeRequestBody, errorHandler } from './middleware/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
  })
);

// CORS
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  'http://localhost:5173,http://localhost:3000,https://madanpaints.onrender.com'
).split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes('onrender.com')
      ) {
        return callback(null, true);
      }

      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate Limiter
const generalLimiter = rateLimit({
  windowMs:
    parseInt(process.env.RATE_LIMIT_WINDOW_MS) ||
    15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', generalLimiter);

app.use(cookieParser());

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use(sanitizeRequestBody);

// Products
const productsPath = path.join(
  __dirname,
  'data',
  'products.json'
);

const products = JSON.parse(
  fs.readFileSync(productsPath, 'utf-8')
);

app.set('products', products);

// Uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    productsCount: products.length,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Madan Paints API Running',
    status: 'OK'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Error Handler
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  console.log(`${products.length} products loaded`);
});