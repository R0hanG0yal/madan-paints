import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(null);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (loading) return <div className="loading-spinner">Loading cart...</div>;

  return (
    <div className="cart-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>
      <h1>My Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="#f0f0f0"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <h2>Your cart is empty!</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <Link to="/products" className="btn-shop-now">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <div className="cart-item-placeholder">{item.product.name.split(' ').slice(0, 2).join(' ')}</div>
                </div>
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p className="cart-item-brand">{item.product.brand}</p>
                  <div className="cart-item-pricing">
                    <span className="cart-item-price">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                    <span className="cart-item-original">₹{(item.product.originalPrice * item.quantity).toLocaleString()}</span>
                    <span className="cart-item-discount">{Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}% off</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            setRemoving(item.id);
                            removeItem(item.id);
                          } else {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => { setRemoving(item.id); removeItem(item.id); }}
                      disabled={removing === item.id}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Price Details</h3>
            <div className="summary-row">
              <span>Total Items</span>
              <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="summary-row">
              <span>Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-₹{items.reduce((s, i) => s + ((i.product.originalPrice - i.product.price) * i.quantity), 0).toLocaleString()}</span>
            </div>
            <div className="summary-row delivery">
              <span>Delivery</span>
              <span className="free">Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <p className="savings-text">You will save ₹{items.reduce((s, i) => s + ((i.product.originalPrice - i.product.price) * i.quantity), 0).toLocaleString()} on this order</p>
            <button className="btn-checkout" onClick={handleCheckout}>Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
}
