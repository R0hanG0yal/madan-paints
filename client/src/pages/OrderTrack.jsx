import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

const STEPS = [
  { key: 'confirmed', label: 'Confirmed', icon: '✓' },
  { key: 'shipped', label: 'Shipped', icon: '📦' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🏠' }
];

function getActiveStep(status) {
  if (status === 'cancelled') return -1;
  const idx = STEPS.findIndex(s => s.key === status);
  return idx >= 0 ? idx : -1;
}

function getStepState(stepIdx, activeStep, status) {
  if (status === 'cancelled') {
    return stepIdx === 0 ? 'cancelled' : 'inactive';
  }
  if (stepIdx < activeStep) return 'completed';
  if (stepIdx === activeStep) return 'active';
  return 'inactive';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function OrderTrack() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data.order);
      setLastChecked(new Date().toLocaleTimeString());
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Order not found');
      } else {
        setError('Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Poll every 15 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="track-page">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <p>Loading tracking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-page">
        <div className="track-error">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#c62828">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h2>Order Not Found</h2>
          <p>{error}</p>
          <Link to="/orders" className="btn-back-to-orders">← Back to My Orders</Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const activeStep = getActiveStep(order.status);
  const statusHistory = (order.statusHistory || []).sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="track-page">
      <div className="track-breadcrumb">
        <Link to="/orders">My Orders</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Track Order</span>
      </div>

      <div className="track-header">
        <div>
          <h1>Track Order</h1>
          <p className="track-order-id">Order ID: <strong>{order.id}</strong></p>
        </div>
        {!isCancelled && activeStep < STEPS.length - 1 && (
          <div className="track-live-badge">
            <span className="live-dot"></span>
            Live
          </div>
        )}
      </div>

      {/* Progress Stepper */}
      <div className={`track-stepper ${isCancelled ? 'cancelled' : ''}`}>
        {STEPS.map((step, idx) => {
          const state = getStepState(idx, activeStep, order.status);
          const isLast = idx === STEPS.length - 1;
          return (
            <div key={step.key} className={`step-item ${state}`}>
              <div className="step-indicator-wrapper">
                <div className="step-indicator">
                  {state === 'completed' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  ) : state === 'cancelled' ? (
                    <span style={{ fontSize: '18px' }}>✕</span>
                  ) : (
                    <span className="step-icon">{step.icon}</span>
                  )}
                </div>
                {!isLast && <div className={`step-line ${state === 'completed' ? 'completed' : ''}`} />}
              </div>
              <div className="step-label">{step.label}</div>
              {statusHistory.find(h => h.status === step.key) && (
                <div className="step-time">
                  {formatDateShort(statusHistory.find(h => h.status === step.key).timestamp)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="cancelled-banner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#c62828">
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
          </svg>
          <div>
            <h3>Order Cancelled</h3>
            <p>This order was cancelled on {formatDate(statusHistory.find(h => h.status === 'cancelled')?.timestamp || order.createdAt)}</p>
          </div>
        </div>
      )}

      <div className="track-content">
        {/* Order Items */}
        <div className="track-card">
          <h3>Order Items</h3>
          <div className="track-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="track-item">
                <div className="track-item-color" style={{ backgroundColor: item.hexColor || '#800020' }} />
                <div className="track-item-info">
                  <p className="track-item-name">{item.name}</p>
                  <p className="track-item-meta">
                    {item.selectedSize && <span>Size: {item.selectedSize} </span>}
                    <span>Qty: {item.quantity}</span>
                  </p>
                </div>
                <div className="track-item-price">₹{item.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="track-total">
            <span>Total Amount</span>
            <span className="track-total-value">₹{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="track-card">
          <h3>Shipping Address</h3>
          {order.shippingAddress ? (
            <div className="track-address">
              <p className="address-name">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              {order.shippingAddress.city && (
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              )}
              {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
            </div>
          ) : (
            <p className="text-muted">Address details not available</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="track-card">
          <h3>Payment Information</h3>
          <div className="track-payment">
            <div className="payment-row">
              <span>Payment Method</span>
              <span className="payment-value">{order.paymentMethod || 'Cash on Delivery'}</span>
            </div>
            <div className="payment-row">
              <span>Order Date</span>
              <span className="payment-value">{formatDate(order.createdAt)}</span>
            </div>
            {order.status === 'delivered' && (
              <div className="payment-row">
                <span>Delivered On</span>
                <span className="payment-value">
                  {formatDate(statusHistory.find(h => h.status === 'delivered')?.timestamp || '')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="track-card">
          <h3>Status Timeline</h3>
          <div className="track-timeline">
            {isCancelled && !statusHistory.find(h => h.status === 'cancelled') && (
              <div className="timeline-item cancelled">
                <div className="timeline-dot cancelled-dot"></div>
                <div className="timeline-content">
                  <p className="timeline-title">Order Cancelled</p>
                  <p className="timeline-desc">The order was cancelled</p>
                  <p className="timeline-time">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            )}
            {statusHistory.length === 0 ? (
              <div className="timeline-item active">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p className="timeline-title">Order Placed</p>
                  <p className="timeline-desc">Your order has been placed and is being processed</p>
                  <p className="timeline-time">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            ) : (
              [...statusHistory].reverse().map((entry, idx) => (
                <div key={idx} className={`timeline-item ${entry.status === 'cancelled' ? 'cancelled' : ''}`}>
                  <div className={`timeline-dot ${entry.status === 'cancelled' ? 'cancelled-dot' : ''}`}></div>
                  <div className="timeline-content">
                    <p className="timeline-title">
                      {entry.status === 'confirmed' && 'Order Confirmed'}
                      {entry.status === 'shipped' && 'Order Shipped'}
                      {entry.status === 'out_for_delivery' && 'Out for Delivery'}
                      {entry.status === 'delivered' && 'Delivered'}
                      {entry.status === 'cancelled' && 'Order Cancelled'}
                    </p>
                    <p className="timeline-desc">{entry.note || `Status updated to ${entry.status}`}</p>
                    <p className="timeline-time">{formatDate(entry.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Live indicator */}
      {!isCancelled && (
        <div className="track-live-footer">
          <div className="live-indicator">
            <span className="live-dot"></span>
            Auto-refreshing every 15s
          </div>
          {lastChecked && <span className="last-checked">Last checked: {lastChecked}</span>}
          <button onClick={fetchOrder} className="btn-refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35A7.96 7.96 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Refresh Now
          </button>
        </div>
      )}

      <div className="track-actions">
        <Link to="/orders" className="btn-back-to-orders">← Back to My Orders</Link>
        {!isCancelled && order.status === 'confirmed' && (
          <button
            className="btn-cancel-order"
            onClick={async () => {
              if (window.confirm('Are you sure you want to cancel this order?')) {
                try {
                  await API.put(`/orders/${order.id}/cancel`);
                  fetchOrder();
                } catch (err) {
                  alert('Failed to cancel order');
                }
              }
            }}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
