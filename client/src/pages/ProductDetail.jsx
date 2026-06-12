import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.product);
        setRelated(res.data.related);
        if (res.data.product?.availableSizes?.length > 0) {
          setSelectedSize(res.data.product.availableSizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id);
      setAddedToCart(true);
      addToast(`${product.name.length > 45 ? product.name.slice(0, 45) + '...' : product.name} added to cart!`, {
        type: 'cart',
        duration: 3000
      });
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-spinner">Loading product...</div>;
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const hexColor = product.hexColor || '#888';
  const displayPrice = selectedSize ? selectedSize.price : product.price;
  const currentPrice = displayPrice;
  const currentOriginal = selectedSize ? Math.round(displayPrice * (product.originalPrice / product.price)) : product.originalPrice;

  return (
    <div className="product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to={`/products?category=${product.category}`}>{product.category}</Link> / <span>{product.name.slice(0, 50)}</span>
      </div>

      <div className="product-detail-layout">
        {/* Left - Color Swatch */}
        <div className="product-detail-image">
          <div className="main-image-placeholder" style={{ background: '#faf3f0' }}>
            <div className="paint-preview-large">
              <div className="paint-color-large" style={{ backgroundColor: hexColor }} />
              <span className="paint-hex-label">{hexColor}</span>
            </div>
            {product.badge && <span className="product-badge-large">{product.badge}</span>}
          </div>
        </div>

        {/* Right - Info */}
        <div className="product-detail-info">
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-brand">Brand: <strong>{product.brand}</strong></div>
          <div className="detail-rating">
            <span className="rating-badge-large">{product.rating} ★</span>
            <span className="review-count">{product.reviewCount.toLocaleString()} Ratings & Reviews</span>
          </div>

          <div className="detail-price-section">
            <div className="detail-pricing">
              <span className="detail-price">₹{currentPrice.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="detail-original-price">₹{currentOriginal.toLocaleString()}</span>
                  <span className="detail-discount">{discount}% off</span>
                </>
              )}
            </div>
            {selectedSize && <p className="tax-text">Price for: <strong>{selectedSize.size}</strong> — inclusive of all taxes</p>}
          </div>

          {/* Size Selection */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="size-selector">
              <h4>Select Size</h4>
              <div className="size-options">
                {product.availableSizes.map(s => (
                  <button
                    key={s.size}
                    className={`size-option ${selectedSize?.size === s.size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    <span className="size-label">{s.size}</span>
                    <span className="size-price">₹{s.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="detail-actions">
            <button className={`btn-add-cart-large ${addedToCart ? 'btn-added' : ''}`} onClick={handleAddToCart}>
              {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>

          {/* Paint Info Tags */}
          <div className="paint-meta-tags">
            <div className="paint-meta-tag">
              <span className="meta-label">Type</span>
              <span className="meta-value">{product.paintType}</span>
            </div>
            <div className="paint-meta-tag">
              <span className="meta-label">Finish</span>
              <span className="meta-value">{product.finish}</span>
            </div>
            <div className="paint-meta-tag">
              <span className="meta-label">Coverage</span>
              <span className="meta-value">{product.coverage}</span>
            </div>
            <div className="paint-meta-tag">
              <span className="meta-label">Drying</span>
              <span className="meta-value">{product.dryingTime}</span>
            </div>
            {product.asianColorCode && (
              <div className="paint-meta-tag code-highlight">
                <span className="meta-label">Asian Code</span>
                <span className="meta-value code">{product.asianColorCode}</span>
              </div>
            )}
            {product.colorCategory && (
              <div className="paint-meta-tag">
                <span className="meta-label">Color Family</span>
                <span className="meta-value">{product.colorCategory}</span>
              </div>
            )}
          </div>

          <div className="detail-offers">
            <h4>Available offers</h4>
            <ul>
              <li><span className="offer-tag">Bank Offer</span> 10% instant discount on HDFC Bank Credit Card</li>
              <li><span className="offer-tag">Bulk Discount</span> Get 5% off on orders above ₹10,000</li>
              <li><span className="offer-tag">Free Delivery</span> on orders above ₹499</li>
            </ul>
          </div>

          <div className="detail-specs">
            <h4>Specifications</h4>
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td className="spec-key">{key}</td>
                    <td className="spec-value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="detail-features">
            <h4>Highlights</h4>
            <ul>
              {product.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <p className="detail-description">{product.description}</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section related-section">
          <h2>Related Colors</h2>
          <div className="products-grid">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
