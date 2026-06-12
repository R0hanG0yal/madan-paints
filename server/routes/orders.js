import { Router } from 'express';
import crypto from 'crypto';
import { authenticateToken } from '../middleware/auth.js';
import { getCartItems, clearCart, createOrder, getOrdersByUser, getOrderById, updateOrderStatus } from '../data/db.js';

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

// Place order
router.post('/', (req, res) => {
  try {
    const products = req.app.get('products');
    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const cartItems = getCartItems(req.user.id);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cartItems.map(ci => {
      const product = products.find(p => p.id === ci.productId);
      return {
        productId: ci.productId,
        name: product.name,
        price: product.price,
        quantity: ci.quantity,
        hexColor: product.hexColor,
        selectedSize: ci.selectedSize || null,
        image: product.image,
        brand: product.brand
      };
    });

    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'ORD' + crypto.randomUUID().slice(0, 8).toUpperCase();

    const now = new Date().toISOString();
    const order = {
      id: orderId,
      userId: req.user.id,
      items: orderItems,
      total,
      status: 'confirmed',
      shippingAddress,
      paymentMethod,
      createdAt: now,
      statusHistory: [
        { status: 'confirmed', timestamp: now, note: 'Order placed successfully' }
      ]
    };

    createOrder(order);
    clearCart(req.user.id);

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/', (req, res) => {
  try {
    const orders = getOrdersByUser(req.user.id);
    res.json({ orders });
  } catch (err) {
    console.error('Orders get error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', (req, res) => {
  try {
    const order = getOrderById(req.params.id, req.user.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    console.error('Order detail error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', (req, res) => {
  try {
    const order = getOrderById(req.params.id, req.user.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Order cannot be cancelled in its current state' });
    }
    updateOrderStatus(req.params.id, 'cancelled', 'Cancelled by customer');
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    console.error('Order cancel error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
