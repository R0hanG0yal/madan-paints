import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'interior', label: 'Interior Paints' },
  { value: 'exterior', label: 'Exterior Paints' },
  { value: 'enamel', label: 'Enamel & Wood Finish' },
  { value: 'primers', label: 'Primers & Putty' }
];

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brands: [] });
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'popular';
  const brand = searchParams.get('brand') || '';
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 16, sort };
        if (category && category !== 'all') params.category = category;
        if (search) params.search = search;
        if (brand) params.brand = brand;
        if (colorCategory) params.colorCategory = colorCategory;

        const res = await API.get('/products', { params });
        setProducts(res.data.products);
        setFilters(res.data.filters);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort, brand, colorCategory, page]);

  return (
    <div className="products-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>
      <div className="products-header">
        <h1>{search ? `Results for "${search}"` : brand ? brand : colorCategory ? colorCategory : category !== 'all' ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}</h1>
        <button className="btn-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          Filters
        </button>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="filter-section">
            <h3>Categories</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`filter-option ${category === cat.value ? 'active' : ''}`}
                onClick={() => updateParams({ category: cat.value, page: '1' })}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filters.brands.length > 0 && (
            <div className="filter-section">
              <h3>Brands</h3>
              {brand && (
                <button className="filter-option active" onClick={() => updateParams({ brand: '', colorCategory: colorCategory || '', page: '1' })}>
                  ✕ Clear filter: {brand}
                </button>
              )}
              {filters.brands.slice(0, brand ? 20 : 15).map(b => (
                <button
                  key={b}
                  className={`filter-option ${brand === b ? 'active' : ''}`}
                  onClick={() => updateParams({ brand: brand === b ? '' : b, page: '1' })}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {filters.colorCategories && filters.colorCategories.length > 0 && (
            <div className="filter-section">
              <h3>Color Family</h3>
              {colorCategory && (
                <button className="filter-option active" onClick={() => updateParams({ colorCategory: '', page: '1' })}>
                  ✕ Clear: {colorCategory}
                </button>
              )}
              {filters.colorCategories.map(cc => (
                <button
                  key={cc}
                  className={`filter-option color-cat ${colorCategory === cc ? 'active' : ''}`}
                  onClick={() => updateParams({ colorCategory: colorCategory === cc ? '' : cc, page: '1' })}
                >
                  <span className={`color-cat-dot ${cc.toLowerCase().replace(/[^a-z]/g, '-').replace(/-+/g, '-')}`} />
                  {cc}
                </button>
              ))}
            </div>
          )}

          <div className="filter-section">
            <h3>Sort By</h3>
            {[
              { value: 'popular', label: 'Popular' },
              { value: 'price_low', label: 'Price: Low to High' },
              { value: 'price_high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Rating' }
            ].map(opt => (
              <button
                key={opt.value}
                className={`filter-option ${sort === opt.value ? 'active' : ''}`}
                onClick={() => updateParams({ sort: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="products-content">
          {loading ? (
            <div className="loading-spinner">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#ccc"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <h3>No products found</h3>
              <p>Try changing your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="products-count">{pagination.total} products found</div>
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
    </div>
  );
}
