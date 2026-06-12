import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { items, total, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderNote, setOrderNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);

  const totalDiscount = items.reduce((s, i) => s + ((i.product.originalPrice - i.product.price) * i.quantity), 0);
  const deliveryCharge = total > 500 ? 0 : 49;
  const finalTotal = total + deliveryCharge;

  const saveAddress = async () => {
    try {
      await API.put('/auth/me', { phone, address: `${address}, ${city}, ${state} - ${pincode}` });
      setAddressSaved(true);
      setSuccess('Address saved to profile!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Failed to save address:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address || !city || !state || !pincode) {
      setError('Please fill in all address fields');
      return;
    }
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }
    const shippingAddress = `${address}, ${city}, ${state} - ${pincode}`;
    const pm = paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (UPI/Card)';
    setPlacing(true);
    setError('');
    try {
      await saveAddress();
      const res = await API.post('/orders', { shippingAddress, paymentMethod: pm, orderNote });
      await fetchCart();
      navigate(`/orders?orderId=${res.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#d4c5c0"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <h3>Your cart is empty</h3>
          <p>Add some products before checkout</p>
          <Link to="/products" className="btn-shop-now">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Progress Steps */}
      <div className="checkout-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">{step > 1 ? '✓' : '1'}</div>
          <span className="step-label">Address</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">{step > 2 ? '✓' : '2'}</div>
          <span className="step-label">Payment</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-label">Review</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          {/* Step 1: Delivery Address */}
          {step === 1 && (
            <div className="checkout-step-content">
              <div className="checkout-section">
                <h3>Delivery Address</h3>
                <div className="address-card">
                  {user?.name && <p className="address-name">{user.name}</p>}
                  <textarea
                    placeholder="Street address, apartment, building"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="checkout-input"
                  />
                  <div className="address-row">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="checkout-input"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="checkout-input"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      className="checkout-input"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="checkout-input"
                  />
                </div>
              </div>
              <div className="checkout-section">
                <h3>Order Note (Optional)</h3>
                <textarea
                  placeholder="Special instructions for delivery..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={2}
                  className="checkout-input"
                />
              </div>
              {success && <div className="message success">{success}</div>}
              {error && <div className="error-msg">{error}</div>}
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(2)}>
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="checkout-step-content">
              <div className="checkout-section">
                <h3>Select Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} readOnly />
                    <div className="payment-option-content">
                      <span className="payment-option-icon">💵</span>
                      <div>
                        <span className="payment-option-title">Cash on Delivery</span>
                        <span className="payment-option-desc">Pay when you receive your order</span>
                      </div>
                    </div>
                  </label>
                  <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('online')}>
                    <input type="radio" name="payment" checked={paymentMethod === 'online'} readOnly />
                    <div className="payment-option-content">
                      <span className="payment-option-icon">💳</span>
                      <div>
                        <span className="payment-option-title">Online Payment</span>
                        <span className="payment-option-desc">UPI, Credit/Debit Card, Net Banking</span>
                      </div>
                    </div>
                  </label>
                </div>
                {paymentMethod === 'online' && (
                  <div className="online-payment-info">
                    <p>💡 Online payment will be processed securely. You will be redirected to a payment gateway after placing the order.</p>
                  </div>
                )}
              </div>
              {error && <div className="error-msg">{error}</div>}
              <div className="step-actions">
                <button className="btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="btn-secondary" onClick={() => setStep(3)}>
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review Order */}
          {step === 3 && (
            <div className="checkout-step-content">
              <div className="checkout-section">
                <h3>Review Your Order</h3>
                <div className="review-block">
                  <div className="review-header">
                    <span>Delivery To</span>
                    <button className="btn-edit" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p className="review-text">{user?.name} - {address}, {city}, {state} - {pincode}</p>
                  <p className="review-text">Phone: {phone}</p>
                </div>
                <div className="review-block">
                  <div className="review-header">
                    <span>Payment Method</span>
                    <button className="btn-edit" onClick={() => setStep(2)}>Edit</button>
                  </div>
                  <p className="review-text">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>
                <div className="review-block">
                  <div className="review-header">
                    <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  </div>
                  {items.slice(0, 3).map(item => (
                    <div key={item.id} className="review-item">
                      <span>{item.product.name.slice(0, 35)}... × {item.quantity}</span>
                      <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  {items.length > 3 && <p className="review-more">+{items.length - 3} more items</p>}
                </div>
              </div>
              {error && <div className="error-msg">{error}</div>}
              <div className="step-actions">
                <button className="btn-outline" onClick={() => setStep(2)}>Back</button>
                <button className="btn-secondary" onClick={() => setStep(4)}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm & Place */}
          {step === 4 && (
            <div className="checkout-step-content place-order-step">
              <div className="confirm-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#800020" strokeWidth="1.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3>Ready to Place Your Order</h3>
              <p className="confirm-subtitle">Please verify all details before placing</p>
              <div className="confirm-details">
                <div className="confirm-row">
                  <span className="confirm-label">Items</span>
                  <span className="confirm-value">{items.length} items</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Payment</span>
                  <span className="confirm-value">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Delivery</span>
                  <span className="confirm-value">{deliveryCharge === 0 ? 'Free' : `₹49`}</span>
                </div>
                <div className="confirm-row total-row">
                  <span className="confirm-label">Total Amount</span>
                  <span className="confirm-total">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              {error && <div className="error-msg">{error}</div>}
              <div className="step-actions">
                <button className="btn-outline" onClick={() => setStep(3)}>Back</button>
                <button
                  className="btn-place-order"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <span className="placing-animation">
                      <span className="spinner" /> Placing Order...
                    </span>
                  ) : (
                    `Place Order · ₹${finalTotal.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="checkout-item">
                <div className="checkout-item-placeholder">{item.product.name.split(' ').slice(0, 2).join(' ')}</div>
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.product.name.slice(0, 35)}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                  <p className="checkout-item-price">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-₹{totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Delivery</span>
              <span className={deliveryCharge === 0 ? 'free' : ''}>
                {deliveryCharge === 0 ? 'FREE' : `₹49`}
              </span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{finalTotal.toLocaleString()}</span>
            </div>
          </div>
          {totalDiscount > 0 && (
            <p className="savings-text">You're saving ₹{totalDiscount.toLocaleString()}! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}
