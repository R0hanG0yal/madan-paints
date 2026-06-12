import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';

function getStatusBadgeText(status) {
  const map = {
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return map[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

export default function Orders() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const justPlacedOrderId = searchParams.get('orderId');
  const justPlacedName = searchParams.get('orderName');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const navigate = useNavigate();

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner-ring"></div><p>Loading orders...</p></div>;

  return (
    <div className="orders-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Back
      </button>
      {justPlacedOrderId && (
        <div className="order-success-banner">
          <div className="success-banner-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className="success-banner-text">
            <h2>Order Placed Successfully!</h2>
            <p>
              Your order <strong>{justPlacedOrderId}</strong>
              {justPlacedName && <> for <strong>{justPlacedName}</strong></>} has been placed.
              <Link to={`/orders/${justPlacedOrderId}/track`} className="track-link-success"> Track Order →</Link>
            </p>
          </div>
        </div>
      )}

      <div className="orders-header">
        <h1>My Orders</h1>
        <span className="orders-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#e0d5d0">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
          </svg>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/products" className="btn-shop-now">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-header-left">
                  <div className="order-id-group">
                    <span className="label">Order</span>
                    <span className="value">{order.id}</span>
                  </div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div className="order-header-right">
                  <span className={`order-status ${order.status}`}>{getStatusBadgeText(order.status)}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="order-item-color" style={{ backgroundColor: item.hexColor || '#800020' }} />
                    <div className="order-item-details">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-meta">
                        {item.selectedSize && <span>{item.selectedSize} · </span>}
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="order-item-more">+{order.items.length - 3} more item(s)</div>
                )}
              </div>

              <div className="order-footer">
                <div className="order-footer-left">
                  <span className="order-total-label">Total:</span>
                  <span className="order-total-value">₹{order.total.toLocaleString()}</span>
                  <span className="order-payment">{order.paymentMethod === 'Cash on Delivery' ? 'COD' : 'Online'}</span>
                </div>
                <div className="order-footer-right">
                  <Link to={`/orders/${order.id}/track`} className="btn-track-order">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    Track Order
                  </Link>
                  {order.status === 'confirmed' && (
                    <button className="btn-cancel-order-sm" onClick={() => handleCancel(order.id)}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
