import { Router } from 'express';

const router = Router();

// Get all products with filtering
router.get('/', (req, res) => {
  try {
    const products = req.app.get('products');
    let { category, search, minPrice, maxPrice, brand, sort, page = 1, limit = 20 } = req.query;
    
    let filtered = [...products];

    // Category filter
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    // Brand filter
    if (brand) {
      const brands = brand.split(',').map(b => b.trim().toLowerCase());
      filtered = filtered.filter(p => brands.includes(p.brand.toLowerCase()));
    }

    // Color Category filter
    if (req.query.colorCategory) {
      const cc = req.query.colorCategory;
      filtered = filtered.filter(p => p.colorCategory && p.colorCategory.toLowerCase() === cc.toLowerCase());
    }

    // Sort
    if (sort) {
      switch (sort) {
        case 'price_low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        default:
          break;
      }
    }

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / Number(limit));
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedProducts = filtered.slice(startIndex, startIndex + Number(limit));

    // Get unique brands and color categories for filters
    const brands = [...new Set(filtered.map(p => p.brand))].sort();
    const colorCategories = [...new Set(filtered.map(p => p.colorCategory).filter(Boolean))].sort();

    res.json({
      products: paginatedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      },
      filters: {
        brands,
        colorCategories
      }
    });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', (req, res) => {
  try {
    const products = req.app.get('products');
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get related products (same category, excluding current)
    const related = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 6);

    res.json({ product, related });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories with product counts
router.get('/meta/categories', (req, res) => {
  try {
    const products = req.app.get('products');
    const categories = {};
    
    products.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = { name: p.category, count: 0 };
      }
      categories[p.category].count++;
    });

    res.json({ categories: Object.values(categories) });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all unique brands with product counts
router.get('/meta/brands', (req, res) => {
  try {
    const products = req.app.get('products');
    const brands = {};
    
    products.forEach(p => {
      if (!brands[p.brand]) {
        brands[p.brand] = { name: p.brand, count: 0 };
      }
      brands[p.brand].count++;
    });

    res.json({ brands: Object.values(brands) });
  } catch (err) {
    console.error('Brands error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
