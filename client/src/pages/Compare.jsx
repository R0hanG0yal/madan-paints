import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const COMPARE_ROWS = [
  { key: 'swatch', label: 'Color' },
  { key: 'brand', label: 'Brand' },
  { key: 'category', label: 'Category', fn: (p) => p.category?.charAt(0).toUpperCase() + p.category?.slice(1) },
  { key: 'price', label: 'Price (1L)' },
  { key: 'sizes', label: 'Available Sizes' },
  { key: 'paintType', label: 'Paint Type' },
  { key: 'finish', label: 'Finish' },
  { key: 'coverage', label: 'Coverage' },
  { key: 'dryingTime', label: 'Drying Time' },
  { key: 'rating', label: 'Rating' },
  { key: 'colorCategory', label: 'Color Family' },
  { key: 'asianColorCode', label: 'Asian Code', fn: (p) => p.asianColorCode || '—' },
  { key: 'features', label: 'Highlights' },
  { key: 'specifications', label: 'Specifications' }
];

export default function Compare() {
  const { compareList, compareCount, clearCompare, removeFromCompare } = useCompare();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    if (!user) { navigate('/login'); return; }
    try { await addToCart(product.id); } catch (err) { console.error(err); }
  };

  if (compareCount === 0) {
    return (
      <div className="compare-page">
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#ccc">
            <path d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l3-3-3-3h5v2zm4 0h5l-3 3 3 3h-5v-2zm-4-6v2H5v-2h5zm10-4h-5V6l-3 3 3 3V8h5v2z"/>
          </svg>
          <h3>No products to compare</h3>
          <p>Add 2–3 products from the catalog to compare them side by side.</p>
          <Link to="/products" className="btn-shop-now" style={{ display: 'inline-block', marginTop: '16px' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const products = compareList;

  return (
    <div className="compare-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>
      <div className="compare-breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span>Compare Products</span>
      </div>

      <div className="compare-header">
        <h1>📊 Compare Products</h1>
        <button className="compare-clear-btn" onClick={clearCompare}>Clear All</button>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="compare-label-col">Specification</th>
              {products.map(p => (
                <th key={p.id} className="compare-product-col">
                  <button className="compare-remove-top" onClick={() => removeFromCompare(p.id)} title="Remove">✕</button>
                  <div className="compare-swatch-large" style={{ backgroundColor: p.hexColor || '#888' }} />
                  <div className="compare-product-name">{p.name}</div>
                  <button className="btn-add-cart-compare" onClick={() => handleAddToCart(p)}>
                    Add to Cart
                  </button>
                </th>
              ))}
              {/* Fill remaining slots */}
              {Array.from({ length: 3 - products.length }).map((_, i) => (
                <th key={`empty-${i}`} className="compare-product-col compare-empty-col">
                  <div className="compare-empty-slot">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#ccc">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <p>Add a product to compare</p>
                    <Link to="/products" className="compare-browse-link">Browse →</Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map(row => (
              <tr key={row.key}>
                <td className="compare-label-col">{row.label}</td>
                {products.map(p => (
                  <td key={p.id} className="compare-value-col">
                    <RenderCell product={p} rowKey={row.key} fn={row.fn} />
                  </td>
                ))}
                {Array.from({ length: 3 - products.length }).map((_, i) => (
                  <td key={`empty-${i}`} className="compare-value-col compare-empty-val">—</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RenderCell({ product, rowKey, fn }) {
  const val = fn ? fn(product) : product[rowKey];

  switch (rowKey) {
    case 'swatch':
      return (
        <div className="compare-cell-swatch">
          <div className="compare-swatch-sm" style={{ backgroundColor: product.hexColor || '#888' }} />
          <span className="compare-hex">{product.hexColor}</span>
        </div>
      );

    case 'price':
      return <span className="compare-price">₹{product.price.toLocaleString()}</span>;

    case 'sizes':
      return product.availableSizes ? (
        <div className="compare-sizes">
          {product.availableSizes.map(s => (
            <span key={s.size} className="compare-size-tag">{s.size}</span>
          ))}
        </div>
      ) : <span className="compare-na">—</span>;

    case 'rating':
      return (
        <span className="compare-rating">
          <span className="rating-star">★</span> {product.rating}
          <span className="compare-reviews"> ({product.reviewCount.toLocaleString()})</span>
        </span>
      );

    case 'features':
      return (
        <ul className="compare-features-list">
          {product.features?.slice(0, 4).map((f, i) => (
            <li key={i}>{f}</li>
          ))}
          {product.features?.length > 4 && (
            <li className="compare-more">+{product.features.length - 4} more</li>
          )}
        </ul>
      );

    case 'specifications':
      return product.specifications ? (
        <div className="compare-specs">
          {Object.entries(product.specifications).slice(0, 5).map(([k, v]) => (
            <div key={k} className="compare-spec-row">
              <span className="compare-spec-key">{k}</span>
              <span className="compare-spec-val">{v}</span>
            </div>
          ))}
        </div>
      ) : <span className="compare-na">—</span>;

    default:
      return val || <span className="compare-na">—</span>;
  }
}
