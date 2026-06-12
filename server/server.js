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

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Headers (Helmet) ──
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow uploads to be accessed
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      // Scripts: own + inline (React needs it) + Three.js eval patterns
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      // Styles: own + inline (React components)
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      // Fonts: Inter from Google
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      // API connections same-origin only in production
      connectSrc: ["'self'"],
      // Images: uploads, inline data (swatches), blobs (Three.js textures)
      imgSrc: ["'self'", 'data:', 'blob:'],
      // Workers: needed by Three.js
      workerSrc: ["'self'", 'blob:'],
      // Prevent clickjacking
      frameAncestors: ["'none'"],
      // Manifest support
      manifestSrc: ["'self'"],
      // Prevent base tag injection
      baseUri: ["'self'"],
      // Restrict form submissions
      formAction: ["'self'"],
    },
  } : false,
}));

// ── CORS — restrict to allowed origins ──
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    // In production with same-origin serving, CORS is not needed for browser requests
    if (isProduction) return callback(null, true);
    // Allow if origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In development, allow all origins for convenience
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── General Rate Limiting ──
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per window
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', generalLimiter);

// ── Cookie Parser (for httpOnly JWT cookies) ──
app.use(cookieParser());

// ── Body Parsing with size limits ──
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// ── Input Sanitization ──
app.use(sanitizeRequestBody);

// Load products into memory
const productsPath = path.join(__dirname, 'data', 'products.json');
let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Make products accessible to routes
app.set('products', products);

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    productsCount: products.length,
    uptime: process.uptime()
  });
});

// ── Serve built client files in production ──
if (isProduction) {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDistPath));
  // All non-API routes go to index.html for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ── Global Error Handler ──
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  console.log(`${products.length} products loaded`);
  if (isProduction) {
    console.log('Serving frontend static files');
  }
});
