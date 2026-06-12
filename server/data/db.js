import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'store.json');

const DEFAULT_DATA = {
  users: [],
  cartItems: [],
  orders: []
};

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading DB, resetting:', err.message);
  }
  return { ...DEFAULT_DATA, users: [], cartItems: [], orders: [] };
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function findUserByEmail(email) {
  const data = load();
  return data.users.find(u => u.email === email) || null;
}

function findUserById(id) {
  const data = load();
  return data.users.find(u => u.id === id) || null;
}

function createUser(user) {
  const data = load();
  data.users.push(user);
  save(data);
  return user;
}

function updateUser(id, updates) {
  const data = load();
  const idx = data.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  data.users[idx] = { ...data.users[idx], ...updates };
  save(data);
  return data.users[idx];
}

function getCartItems(userId) {
  const data = load();
  return data.cartItems.filter(ci => ci.userId === userId);
}

function addToCart(userId, productId, quantity = 1) {
  const data = load();
  const existing = data.cartItems.find(ci => ci.userId === userId && ci.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    data.cartItems.push({ id: Date.now(), userId, productId, quantity });
  }
  save(data);
}

function updateCartItem(itemId, userId, quantity) {
  const data = load();
  const item = data.cartItems.find(ci => ci.id === itemId && ci.userId === userId);
  if (item) {
    item.quantity = quantity;
    save(data);
    return true;
  }
  return false;
}

function removeCartItem(itemId, userId) {
  const data = load();
  const idx = data.cartItems.findIndex(ci => ci.id === itemId && ci.userId === userId);
  if (idx !== -1) {
    data.cartItems.splice(idx, 1);
    save(data);
    return true;
  }
  return false;
}

function clearCart(userId) {
  const data = load();
  data.cartItems = data.cartItems.filter(ci => ci.userId !== userId);
  save(data);
}

function createOrder(order) {
  const data = load();
  data.orders.push(order);
  save(data);
  return order;
}

function getOrdersByUser(userId) {
  const data = load();
  return data.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getOrderById(orderId, userId) {
  const data = load();
  return data.orders.find(o => o.id === orderId && o.userId === userId) || null;
}

function updateOrderStatus(orderId, status, note) {
  const data = load();
  const order = data.orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Order ${status}`
    });
    save(data);
    return true;
  }
  return false;
}

export {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus
};
