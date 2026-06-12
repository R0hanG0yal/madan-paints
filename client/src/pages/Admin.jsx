import { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import AdminProducts from './AdminProducts';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders);
      } catch (err) { 
        console.error('Admin fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce4e4' }}>👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalUsers || 0}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalOrders || 0}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>💰</div>
          <div className="stat-info">
            <span className="stat-value">₹{(stats?.totalRevenue || 0).toLocaleString()}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.pendingOrders || 0}</span>
            <span className="stat-label">Pending Orders</span>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recent Orders</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="empty-cell">No orders yet</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id-cell">{order.id}</td>
                  <td>{order.userName}</td>
                  <td>₹{order.total.toLocaleString()}</td>                    <td><span className={`order-status ${order.status}`}>{order.status === 'out_for_delivery' ? 'Out for Delivery' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-quick-links">
        <Link to="/admin/products" className="quick-link">
          <span>🎨</span>
          <span>Manage Products</span>
        </Link>
        <Link to="/admin/orders" className="quick-link">
          <span>📦</span>
          <span>Manage Orders</span>
        </Link>
        <Link to="/admin/users" className="quick-link">
          <span>👥</span>
          <span>View Users</span>
        </Link>
      </div>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const res = await API.get('/admin/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  if (loading) return <div className="loading-spinner">Loading orders...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Orders Management</h1>
        <Link to="/admin" className="btn-back">← Back to Dashboard</Link>
      </div>

      <div className="filter-tabs">
        {['all', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={8} className="empty-cell">No orders found</td></tr>
            ) : filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id-cell">{order.id}</td>
                <td>{order.userName}</td>
                <td>{order.items?.length || 0}</td>
                <td>₹{order.total.toLocaleString()}</td>
                <td>{order.paymentMethod}</td>                    <td><span className={`order-status ${order.status}`}>{order.status === 'out_for_delivery' ? 'Out for Delivery' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/admin/users');
        setUsers(res.data.users);
      } catch (err) {
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="loading-spinner">Loading users...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Users Management</h1>
        <Link to="/admin" className="btn-back">← Back to Dashboard</Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} className="empty-cell">No users found</td></tr>
            ) : users.map(user => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.orderCount}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        setIsAdmin(true);
      } catch (err) {
        setIsAdmin(false);
        navigate('/');
      } finally {
        setChecking(false);
      }
    };
    if (user) checkAdmin();
    else { navigate('/login'); }
  }, [user, navigate]);

  if (checking) return <div className="loading-spinner">Checking access...</div>;
  if (!isAdmin) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-link">Products</Link>
          <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
          <Link to="/admin/users" className="admin-nav-link">Users</Link>
        </nav>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Routes>
      </main>
    </div>
  );
}
