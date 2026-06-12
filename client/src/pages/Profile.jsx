import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');
  }, [user, navigate]);

  const handleSave = async () => {
    try {
      const res = await API.put('/auth/me', { name, phone, address });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card">
        {message && <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}
        <div className="profile-field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="profile-field">
          <label>Email</label>
          <input value={user?.email || ''} disabled className="disabled-input" />
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="profile-field">
          <label>Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
        </div>
        <button className="btn-save" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}
