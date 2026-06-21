import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get('/cart');
      setItems(res.data.items || []);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error('Cart fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error('Please login first');
    await API.post('/cart/add', { productId, quantity });
    await fetchCart();
  };

  const updateQuantity = async (itemId, quantity) => {
    await API.put(`/cart/update/${itemId}`, { quantity });
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await API.delete(`/cart/remove/${itemId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await API.delete('/cart/clear');
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, loading, itemCount, total, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
