import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getCartItems, addToCart, updateCartItem, removeCartItem, clearCart } from '../data/db.js';

const router = Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', (req, res) => {
  try {
    const products = req.app.get('products');
    const cartItems = getCartItems(req.user.id);

    const items = cartItems.map(ci => {
      const product = products.find(p => p.id === ci.productId);
      return product ? {
        id: ci.id,
        productId: ci.productId,
        quantity: ci.quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          brand: product.brand,
          stock: product.stock
        }
      } : null;
    }).filter(Boolean);

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalOriginal = items.reduce((sum, item) => sum + (item.product.originalPrice * item.quantity), 0);

    res.json({ items, total, totalOriginal, itemCount: items.length });
  } catch (err) {
    console.error('Cart get error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to cart
router.post('/add', (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const products = req.app.get('products');
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    addToCart(req.user.id, productId, quantity);
    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/update/:itemId', (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const result = updateCartItem(Number(req.params.itemId), req.user.id, quantity);
    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Cart updated' });
  } catch (err) {
    console.error('Cart update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from cart
router.delete('/remove/:itemId', (req, res) => {
  try {
    const result = removeCartItem(Number(req.params.itemId), req.user.id);
    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    console.error('Cart remove error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', (req, res) => {
  try {
    clearCart(req.user.id);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Cart clear error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
