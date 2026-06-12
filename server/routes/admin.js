import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { findUserById, getOrderById, updateOrderStatus } from '../data/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

function loadStore() {
  const storePath = path.join(__dirname, '..', 'data', 'store.json');
  return JSON.parse(fs.readFileSync(storePath, 'utf-8'));
}

function loadProducts() {
  const prodPath = path.join(__dirname, '..', 'data', 'products.json');
  return JSON.parse(fs.readFileSync(prodPath, 'utf-8'));
}

function saveProducts(products) {
  const prodPath = path.join(__dirname, '..', 'data', 'products.json');
  fs.writeFileSync(prodPath, JSON.stringify(products, null, 2));
}

// Admin auth middleware
function requireAdmin(req, res, next) {
  const user = findUserById(req.user.id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard', (req, res) => {
  try {
    const store = loadStore();
    const totalUsers = store.users.length;
    const totalOrders = store.orders.length;
    const totalRevenue = store.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = store.orders.filter(o => o.status === 'confirmed').length;
    const recentOrders = store.orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(o => ({ ...o, userName: store.users.find(u => u.id === o.userId)?.name || 'Unknown' }));
    const ordersByStatus = {
      confirmed: store.orders.filter(o => o.status === 'confirmed').length,
      cancelled: store.orders.filter(o => o.status === 'cancelled').length,
      shipped: store.orders.filter(o => o.status === 'shipped').length,
      delivered: store.orders.filter(o => o.status === 'delivered').length
    };

    res.json({ stats: { totalUsers, totalOrders, totalRevenue, pendingOrders }, recentOrders, ordersByStatus });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// All orders
router.get('/orders', (req, res) => {
  try {
    const store = loadStore();
    const orders = store.orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(order => {
        const user = store.users.find(u => u.id === order.userId);
        return { ...order, userName: user?.name || 'Unknown' };
      });
    res.json({ orders });
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    updateOrderStatus(req.params.id, status);
    res.json({ message: `Order status updated to ${status}` });
  } catch (err) {
    console.error('Admin update order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====== Product CRUD ======

// Create product
router.post('/products', (req, res) => {
  try {
    const products = loadProducts();
    const product = {
      id: crypto.randomUUID().slice(0, 6),
      ...req.body,
      availableSizes: req.body.availableSizes || [
        { size: '1L', price: req.body.price },
        { size: '4L', price: Math.round(req.body.price * 3.7) },
        { size: '10L', price: Math.round(req.body.price * 8.7) }
      ],
      badge: req.body.badge || null,
      rating: 0,
      reviewCount: 0
    };
    products.push(product);
    saveProducts(products);
    // Sync in-memory products for storefront
    req.app.set('products', loadProducts());
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.error('Admin create product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/products/:id', (req, res) => {
  try {
    const products = loadProducts();
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found' });
    products[idx] = { ...products[idx], ...req.body, id: req.params.id };
    saveProducts(products);
    // Sync in-memory products for storefront
    req.app.set('products', loadProducts());
    res.json({ message: 'Product updated', product: products[idx] });
  } catch (err) {
    console.error('Admin update product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', (req, res) => {
  try {
    const products = loadProducts();
    const filtered = products.filter(p => p.id !== req.params.id);
    if (filtered.length === products.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    saveProducts(filtered);
    // Sync in-memory products for storefront
    req.app.set('products', loadProducts());
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Admin delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// All users
router.get('/users', (req, res) => {
  try {
    const store = loadStore();
    const users = store.users.map(u => ({
      id: u.id, name: u.name, email: u.email, phone: u.phone || '',
      createdAt: u.createdAt,
      orderCount: store.orders.filter(o => o.userId === u.id).length
    }));
    res.json({ users });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
