import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [festiveMode, setFestiveMode] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone!')) return;
    if (!window.confirm('All your data will be permanently removed. Continue?')) return;
    setDeleting(true);
    try {
      await API.delete('/auth/me');
      logout();
      navigate('/');
    } catch (err) {
      setMessage('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="settings-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>
      <h1>⚙️ Settings</h1>
      {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

      {/* Preferences */}
      <div className="settings-card">
        <h2>App Preferences</h2>
        <p>Customize your experience on Madan Paints</p>
        <div className="settings-row">
          <div className="settings-label">
            <span>🎉 Festive Mode</span>
            <span>Show festive decorations and animations</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={festiveMode} onChange={() => setFestiveMode(!festiveMode)} />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="settings-row">
          <div className="settings-label">
            <span>🔔 Push Notifications</span>
            <span>Get notified about order updates and offers</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="settings-row">
          <div className="settings-label">
            <span>📧 Email Updates</span>
            <span>Receive promotional emails and newsletters</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={emailUpdates} onChange={() => setEmailUpdates(!emailUpdates)} />
            <span className="toggle-slider" />
          </label>
        </div>
        <div className="settings-row">
          <div className="settings-label">
            <span>📱 SMS Alerts</span>
            <span>Get SMS alerts for delivery updates</span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={smsAlerts} onChange={() => setSmsAlerts(!smsAlerts)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Account */}
      <div className="settings-card">
        <h2>Account</h2>
        <p>Manage your account information</p>
        <div className="settings-row">
          <div className="settings-label">
            <span>👤 Profile</span>
            <span>Update your name, email, and address</span>
          </div>
          <Link to="/profile" className="btn-login" style={{ padding: '6px 16px', fontSize: '12px' }}>Edit</Link>
        </div>
        <div className="settings-row">
          <div className="settings-label">
            <span>📦 My Orders</span>
            <span>View order history and tracking</span>
          </div>
          <Link to="/orders" className="btn-login" style={{ padding: '6px 16px', fontSize: '12px' }}>View</Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-card settings-danger">
        <h2>⚠️ Danger Zone</h2>
        <p>Irreversible actions — proceed with caution</p>
        <div className="settings-row">
          <div className="settings-label">
            <span>🗑️ Delete Account</span>
            <span>Permanently delete your account and all data</span>
          </div>
          <button className="btn-danger-outline" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
