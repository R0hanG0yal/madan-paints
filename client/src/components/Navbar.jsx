import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="Madan Paints" className="logo-img" />
          </Link>

          <div className="navbar-links">
            <Link to="/products" className="nav-link">SHOP</Link>
            <a href="/#collections" className="nav-link" onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                const el = document.getElementById('collections');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}>COLLECTIONS</a>
            <Link to="/visualizer" className="nav-link">VISULISER</Link>
            <Link to="/calculator" className="nav-link">CALCULATOR</Link>
            <a href="/#about" className="nav-link">ABOUT</a>
          </div>

          <div className="navbar-actions">
            <Link to="/cart" className="cart-link">
              CART ({itemCount})
            </Link>

            {user ? (
              <div className="user-menu" onClick={() => setShowUserMenu(!showUserMenu)} onMouseLeave={() => setShowUserMenu(false)}>
                <button className="user-icon-btn" title="User Menu">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">Hi, {user.name}!</div>
                    <Link to="/orders" className="dropdown-item" onClick={() => setShowUserMenu(false)}>My Orders</Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setShowUserMenu(false)}>Admin Panel</Link>
                    )}
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>My Profile</Link>
                    <button className="dropdown-item logout" onClick={() => { logout(); setShowUserMenu(false); navigate('/'); }}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="user-icon-btn" title="Login">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </nav>
  );
}
