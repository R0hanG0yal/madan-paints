import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import BrandLogoCard, { getBrandStyle } from '../components/BrandLogoCard';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [asianPaintsProducts, setAsianPaintsProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [brandColors, setBrandColors] = useState({});
  const [loading, setLoading] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredCollections = [
    {
      title: 'Essential Matte Collection',
      subtitle: 'Sophisticated flat finish.',
      price: '₹7,100 / Gallon',
      image: '/essential_matte.png',
      tag: 'ESSENTIAL MATTE',
      link: '/products?brand=Madan+Paints&finish=Matte'
    },
    {
      title: 'Satin Velvet Collection',
      subtitle: 'Durable, elegant sheen.',
      price: '₹7,900 / Gallon',
      image: '/satin_velvet.png',
      tag: 'SATIN VELVET',
      link: '/products?brand=Madan+Paints&finish=Satin'
    },
    {
      title: 'Gloss Collection',
      subtitle: 'High-shine statement colors.',
      price: '₹8,700 / Gallon',
      image: '/gloss_collection.png',
      tag: 'GLOSS COLLECTION',
      link: '/products?brand=Madan+Paints&finish=Gloss'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, asianRes, brandsRes] = await Promise.all([
          API.get('/products?limit=200'),
          API.get('/products/meta/categories'),
          API.get('/products?limit=12&brand=Asian+Paints'),
          API.get('/products/meta/brands')
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data.categories);
        setAsianPaintsProducts(asianRes.data.products);
        setAllBrands(brandsRes.data.brands);

        // Extract up to 4 unique hex colors per brand for swatch previews
        const colorMap = {};
        const allProds = prodRes.data.products;
        for (const p of allProds) {
          if (!p.hexColor || !p.brand) continue;
          if (!colorMap[p.brand]) colorMap[p.brand] = [];
          if (colorMap[p.brand].length < 4 && !colorMap[p.brand].includes(p.hexColor)) {
            colorMap[p.brand].push(p.hexColor);
          }
        }
        setBrandColors(colorMap);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Trending: Asian Paints & premium putty brands
  const trendingProducts = products.filter(p =>
    (p.brand === 'Asian Paints' || p.brand === 'Birla Putty' || p.brand === 'JK Putty' || p.brand === 'Madan Paints')
  ).slice(0, 8);

  // "More Products You May Like": All branded paints & putty
  const moreProducts = products.filter(p => p.brand).slice(0, 12);

  // Deals: big discount products
  const dealProducts = products.filter(p =>
    (p.originalPrice - p.price) > 500
  ).slice(0, 4);

  // Featured brand for hero spotlight (top brand by count, excluding Asian Paints)
  const heroFeaturedBrand = allBrands
    .filter(b => b.name !== 'Asian Paints' && b.name !== 'Madan Paints')
    .sort((a, b) => b.count - a.count)[0];
  const heroBrandStyle = heroFeaturedBrand ? getBrandStyle(heroFeaturedBrand.name) : null;

  return (
    <div className="home-page">
      {/* Premium Hero Banner */}
      <section className="hero-banner-premium">
        <div className="hero-banner-inner" style={{ backgroundImage: "url('/hero_room.png')" }}>
          <div className="hero-overlay-content">
            <span className="hero-subtitle">CURATED COLORS. LUXURY FINISHES.</span>
            <h1 className="hero-title">Transform Your Home with Madan Paints</h1>
            <Link to="/products" className="btn-hero-collection">SHOP THE COLLECTION</Link>
          </div>
        </div>
      </section>

      {/* Search & Featured Collections */}
      <section id="collections" className="featured-collections-section">
        <div className="collections-controls">
          <form className="collections-search" onSubmit={handleSearch}>
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <h2 className="collections-main-title">FEATURED COLLECTIONS</h2>
          
          <div className="collections-palette">
            <span className="palette-dot dot-teal" title="Teal Swatch"></span>
            <span className="palette-dot dot-ochre" title="Ochre Swatch"></span>
            <span className="palette-dot dot-blue" title="Blue Swatch"></span>
          </div>
        </div>

        <div className="collections-grid">
          {featuredCollections.map((col, idx) => (
            <div key={idx} className="collection-card-premium">
              <div className="collection-tag">{col.tag}</div>
              <div className="collection-image-wrapper">
                <img src={col.image} alt={col.title} className="collection-image" />
              </div>
              <div className="collection-card-info">
                <h3 className="collection-title">{col.title}</h3>
                <p className="collection-subtitle">{col.subtitle}</p>
                <div className="collection-price">{col.price}</div>
                <Link to={col.link} className="btn-collection-explore">EXPLORE</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Brands — All Brands with Logo Cards */}
      <section className="section featured-brands-section">
        <div className="section-header">
          <h2>Featured Brands <span className="brand-section-tag">{allBrands.length} Brands</span></h2>
          <Link to="/products" className="view-all">Shop All Brands →</Link>
        </div>
        <div className="featured-brands-grid">
          {allBrands.map(b => (
            <BrandLogoCard
              key={b.name}
              brandName={b.name}
              productCount={b.count}
              swatchColors={brandColors[b.name] || []}
              onClick={() => window.location.href = `/brand/${encodeURIComponent(b.name)}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/products" className="view-all">View All</Link>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <CategoryCard key={cat.name} category={cat.name} count={cat.count} />
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      {dealProducts.length > 0 && (
        <section className="section deals-section">
          <div className="section-header">
            <h2>Deals of the Day</h2>
            <Link to="/products?sort=discount" className="view-all">View All</Link>
          </div>
          <div className="deals-banner-inline">
            <span className="deals-badge">Up to 40% OFF</span>
            <span>Limited time deals on top brands</span>
          </div>
          <div className="products-grid">
            {dealProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Trending: Asian Paints & Putty only */}
      {trendingProducts.length > 0 && (
        <section className="section trending-section">
          <div className="section-header">
            <h2>Trending Now</h2>
            <Link to="/products?brand=Asian+Paints" className="view-all">View All →</Link>
          </div>
          <div className="products-grid">
            {trendingProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Asian Paints Collection */}
      {asianPaintsProducts.length > 0 && (
        <section className="section brand-section asian-paints-section">
          <div className="section-header">
            <h2>Asian Paints Collection <span className="brand-section-tag">1000+ Shades</span></h2>
            <Link to="/brand/Asian%20Paints" className="view-all">View All Asian Paints →</Link>
          </div>
          <div className="products-grid">
            {asianPaintsProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="section banner-ad">
        <div className="banner-content" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}>
          <div className="banner-text">
            <h2>Professional Grade Paints</h2>
            <p>From primers to premium finishes - Everything for your dream home at factory prices</p>
            <Link to="/products" className="btn-banner">Explore Paints</Link>
          </div>
        </div>
      </section>

      {/* More Products You May Like: Branded paints & putty only */}
      <section className="section">
        <div className="section-header">
          <h2>More Products You May Like</h2>
          <Link to="/products" className="view-all">View All</Link>
        </div>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="products-grid">
            {moreProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Service Features */}
      <section className="services-bar">
        <div className="service-item">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
          <span>Free Delivery</span>
        </div>
        <div className="service-item">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" /></svg>
          <span>100% Secure</span>
        </div>
        <div className="service-item">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" /></svg>
          <span>Easy Returns</span>
        </div>
        <div className="service-item">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
          <span>Genuine Products</span>
        </div>
      </section>
    </div>
  );
}
