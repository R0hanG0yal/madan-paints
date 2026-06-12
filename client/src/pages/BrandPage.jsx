import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import { BrandHeroBanner } from '../components/BrandLogoCard';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'interior', label: 'Interior Paints' },
  { value: 'exterior', label: 'Exterior Paints' },
  { value: 'enamel', label: 'Enamel & Wood Finish' },
  { value: 'primers', label: 'Primers & Putty' }
];

export default function BrandPage() {
  const { brandName } = useParams();
  const decodedBrand = decodeURIComponent(brandName);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brands: [], colorCategories: [] });
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [brandInfo, setBrandInfo] = useState(null);

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'popular';
  const colorCategory = searchParams.get('colorCategory') || '';
  const page = searchParams.get('page') || '1';

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'popular') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Fetch brand info (product count) and products
  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      try {
        const [brandsRes, productsRes] = await Promise.all([
          API.get('/products/meta/brands'),
          API.get('/products', {
            params: {
              brand: decodedBrand,
              page,
              limit: 16,
              sort,
              ...(category !== 'all' && { category }),
              ...(colorCategory && { colorCategory }),
            }
          })
        ]);

        const brand = brandsRes.data.brands.find(
          b => b.name.toLowerCase() === decodedBrand.toLowerCase()
        );
        setBrandInfo(brand || { name: decodedBrand, count: 0 });

        setProducts(productsRes.data.products);
        setFilters(productsRes.data.filters);
        setPagination(productsRes.data.pagination);
      } catch (err) {
        console.error('Error fetching brand data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandData();
  }, [decodedBrand, category, sort, colorCategory, page]);

  const productCount = brandInfo?.count || 0;

  return (
    <div className="brand-page">
      {/* Breadcrumb */}
      <div className="brand-breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to="/products">Products</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{decodedBrand}</span>
      </div>

      {/* Brand Hero */}
      <BrandHeroBanner
        brandName={decodedBrand}
        productCount={productCount}
        description={`Explore the full range of ${decodedBrand} premium paints and coatings. Find the perfect shade for your home.`}
      />

      {/* Filters Bar */}
      <div className="brand-filters-bar">
        <div className="brand-filters-row">
          {/* Category filter */}
          <div className="brand-filter-group">
            <label className="brand-filter-label">Category</label>
            <select
              className="brand-filter-select"
              value={category}
              onChange={(e) => updateParams({ category: e.target.value, page: '1' })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Color Family filter */}
          {filters.colorCategories && filters.colorCategories.length > 0 && (
            <div className="brand-filter-group">
              <label className="brand-filter-label">Color Family</label>
              <select
                className="brand-filter-select"
                value={colorCategory}
                onChange={(e) => updateParams({ colorCategory: e.target.value, page: '1' })}
              >
                <option value="">All Colors</option>
                {filters.colorCategories.map(cc => (
                  <option key={cc} value={cc}>{cc}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort */}
          <div className="brand-filter-group">
            <label className="brand-filter-label">Sort By</label>
            <select
              className="brand-filter-select"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              <option value="popular">Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* Clear filters */}
          {(category !== 'all' || colorCategory) && (
            <button
              className="brand-filter-clear"
              onClick={() => updateParams({ category: 'all', colorCategory: '', page: '1' })}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        <div className="brand-view-options">
          <div className="brand-products-count">{pagination.total} products found</div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="brand-products-section">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-ring" />
            <p>Loading {decodedBrand} products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="#ccc">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3>No products found</h3>
            <p>Try changing your search or filter criteria for {decodedBrand}</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => updateParams({ page: String(pagination.page - 1) })}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pNum => (
                  <button
                    key={pNum}
                    className={`page-num ${pagination.page === pNum ? 'active' : ''}`}
                    onClick={() => updateParams({ page: String(pNum) })}
                  >
                    {pNum}
                  </button>
                ))}
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => updateParams({ page: String(pagination.page + 1) })}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
