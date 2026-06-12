import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleCompare, inCompare, compareCount, compareMax } = useCompare();
  const { addToast } = useToast();
  const [flyAnimation, setFlyAnimation] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id);
      setFlyAnimation(true);
      setTimeout(() => setFlyAnimation(false), 800);
      addToast(`${product.name.length > 45 ? product.name.slice(0, 45) + '...' : product.name} added to cart!`, {
        type: 'cart',
        duration: 3000
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleCompare(product);
    if (!added && !inCompare(product.id) && compareCount >= compareMax) {
      // Max reached — silent
    }
  };

  const hexColor = product.hexColor || '#888';
  const paintType = product.paintType || 'Paint';
  const finish = product.finish || '';
  const isCompared = inCompare(product.id);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image" style={{ background: '#faf3f0' }}>
        {/* Compare Checkbox */}
        <div className="product-card-compare" onClick={handleToggleCompare}>
          <div className={`compare-checkbox ${isCompared ? 'checked' : ''}`}>
            {isCompared && <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
          </div>
          <span className="compare-checkbox-label">Compare</span>
        </div>
        {/* Color Swatch */}
        <div className="paint-swatch-container">
          <div className={`paint-swatch ${flyAnimation ? 'swatch-fly' : ''}`} style={{ backgroundColor: hexColor }}>
            <div className="paint-swatch-overlay">
              <span className="paint-swatch-hex">{hexColor}</span>
              {product.asianColorCode && (
                <span className="paint-swatch-code">{product.asianColorCode}</span>
              )}
            </div>
          </div>
          <div className="paint-swatch-info">
            <span className="paint-type">{paintType}</span>
            {product.asianColorCode && (
              <span className="paint-finish code">Code: {product.asianColorCode}</span>
            )}
            {finish && !product.asianColorCode && <span className="paint-finish">{finish}</span>}
          </div>
        </div>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {discount > 0 && <span className="product-discount">-{discount}%</span>}
      </div>
      <div className="product-card-info">
        <h3 className="product-name">{product.name.length > 40 ? product.name.slice(0, 40) + '...' : product.name}</h3>
        <div className="product-rating">
          <span className="rating-badge">{product.rating} ★</span>
          <span className="review-count">({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="product-pricing">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="product-original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        {product.availableSizes && (
          <div className="paint-sizes">
            {product.availableSizes.map(s => (
              <span key={s.size} className="paint-size-tag">{s.size}</span>
            ))}
          </div>
        )}
        <button className={`btn-add-cart ${flyAnimation ? 'btn-added' : ''}`} onClick={handleAddToCart}>
          {flyAnimation ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
