import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const SERVER_URL = API.defaults.baseURL.replace('/api', '');

const PAINT_COLORS = [
  { name: 'Crimson', hex: '#DC143C' }, { name: 'Navy', hex: '#191970' },
  { name: 'Forest Green', hex: '#228B22' }, { name: 'Burgundy', hex: '#800020' },
  { name: 'Sky Blue', hex: '#87CEEB' }, { name: 'Sunset Orange', hex: '#FF4500' },
  { name: 'Teal', hex: '#008080' }, { name: 'Charcoal', hex: '#36454F' },
  { name: 'Slate Gray', hex: '#708090' }, { name: 'Warm Beige', hex: '#D4A574' },
  { name: 'Terracotta', hex: '#CC4E2C' }, { name: 'Buttercream', hex: '#F5DEB3' },
  { name: 'Lavender', hex: '#E6E6FA' }, { name: 'Soft Pink', hex: '#FFB6C1' },
  { name: 'Sage Green', hex: '#BCB88A' }, { name: 'Pearl White', hex: '#FFFAF0' }
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', hexColor: '#DC143C', price: 899,
    originalPrice: 1199, category: 'interior', subcategory: 'emulsion',
    paintType: 'Interior Emulsion', finish: 'Matte', coverage: '120 sq ft/L',
    dryingTime: '2 hours', stock: 100, badge: '',
    features: '', specifications: '{}', image: null
  });
  const [uploading, setUploading] = useState(false);
  const [productImage, setProductImage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products?limit=100');
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await API.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProductImage(res.data.url);
      setForm({...form, image: res.data.url});
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const openNewForm = () => {
    setEditingProduct(null);
    setProductImage('');
    setForm({
      name: '', description: '', hexColor: '#DC143C', price: 899,
      originalPrice: 1199, category: 'interior', subcategory: 'emulsion',
      paintType: 'Interior Emulsion', finish: 'Matte', coverage: '120 sq ft/L',
      dryingTime: '2 hours', stock: 100, badge: '',
      features: '', specifications: '{}', image: null
    });
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setProductImage(product.image || '');
    setForm({
      name: product.name, description: product.description,
      hexColor: product.hexColor || '#888', price: product.price,
      originalPrice: product.originalPrice, category: product.category,
      subcategory: product.subcategory || '',
      paintType: product.paintType || '', finish: product.finish || '',
      coverage: product.coverage || '', dryingTime: product.dryingTime || '',
      stock: product.stock, badge: product.badge || '',
      features: product.features?.join(', ') || '',
      specifications: JSON.stringify(product.specifications || {}, null, 2),
      image: product.image || null
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse specifications safely
    let specifications = {};
    try {
      specifications = JSON.parse(form.specifications || '{}');
    } catch (parseErr) {
      alert('Invalid JSON in Specifications field. Please check your formatting.');
      return;
    }

    const productData = {
      ...form,
      image: productImage || null,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      specifications,
      availableSizes: [
        { size: '1L', price: form.price },
        { size: '4L', price: Math.round(form.price * 3.7) },
        { size: '10L', price: Math.round(form.price * 8.7) }
      ]
    };

    try {
      if (editingProduct) {
        await API.put(`/admin/products/${editingProduct.id}`, productData);
      } else {
        await API.post('/admin/products', productData);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/admin/products/${productId}`);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <div className="loading-spinner">Loading products...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Product Management</h1>
        <Link to="/admin" className="btn-back">← Back to Dashboard</Link>
      </div>

      <div className="admin-actions-bar">
        <button className="btn-add-product" onClick={openNewForm}>+ Add New Product</button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field flex-2">
                  <label>Product Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="enamel">Enamel</option>
                    <option value="primers">Primers</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field flex-2">
                  <label>Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field flex-2">
                  <label>Product Image</label>
                  <div className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files[0]) uploadImage(e.target.files[0]);
                      }}
                    />
                    <label htmlFor="image-upload" className="image-upload-label">
                      {uploading ? (
                        <span className="uploading-text">Uploading...</span>
                      ) : productImage ? (
                        <div className="upload-preview">
                          <img src={`${SERVER_URL}${productImage}`} alt="Product" className="upload-thumb" />
                          <span>Click to change</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <span>Click to upload product image (jpg, png)</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Color</label>
                  <div className="color-picker-wrapper">
                    <input type="color" value={form.hexColor} onChange={e => setForm({...form, hexColor: e.target.value})} />
                    <span className="color-hex-label">{form.hexColor}</span>
                  </div>
                  <div className="color-presets">
                    {PAINT_COLORS.map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        className={`color-preset-btn ${form.hexColor === c.hex ? 'active' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        onClick={() => setForm({...form, hexColor: c.hex})}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row three-cols">
                <div className="form-field">
                  <label>Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} required />
                </div>
                <div className="form-field">
                  <label>Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({...form, originalPrice: Number(e.target.value)})} required />
                </div>
                <div className="form-field">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} required />
                </div>
              </div>

              <div className="form-row three-cols">
                <div className="form-field">
                  <label>Paint Type</label>
                  <input value={form.paintType} onChange={e => setForm({...form, paintType: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Finish</label>
                  <select value={form.finish} onChange={e => setForm({...form, finish: e.target.value})}>
                    <option value="Matte">Matte</option>
                    <option value="Eggshell">Eggshell</option>
                    <option value="Satin">Satin</option>
                    <option value="Gloss">Gloss</option>
                    <option value="High Gloss">High Gloss</option>
                    <option value="Silk">Silk</option>
                    <option value="Velvet">Velvet</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Coverage</label>
                  <input value={form.coverage} onChange={e => setForm({...form, coverage: e.target.value})} />
                </div>
              </div>

              <div className="form-row three-cols">
                <div className="form-field">
                  <label>Drying Time</label>
                  <input value={form.dryingTime} onChange={e => setForm({...form, dryingTime: e.target.value})} />
                </div>
                <div className="form-field">
                  <label>Badge (optional)</label>
                  <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} placeholder="e.g. Best Seller" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field flex-2">
                  <label>Features (comma-separated)</label>
                  <input value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="Washable, Low VOC, Eco-friendly" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field flex-2">
                  <label>Specifications (JSON)</label>
                  <textarea value={form.specifications} onChange={e => setForm({...form, specifications: e.target.value})} rows={4} />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel-form" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-save-form">{editingProduct ? 'Update Product' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Color</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={7} className="empty-cell">No products found</td></tr>
            ) : products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="admin-color-swatch" style={{ backgroundColor: product.hexColor || '#888' }} title={product.hexColor} />
                </td>
                <td className="product-name-cell">{product.name}</td>
                <td>{product.category}</td>
                <td>{product.paintType || '-'}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="admin-actions-cell">
                    <button className="btn-edit-product" onClick={() => openEditForm(product)}>Edit</button>
                    <button className="btn-delete-product" onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
