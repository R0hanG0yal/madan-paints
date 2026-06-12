import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  interior: '🎨',
  exterior: '🏠',
  enamel: '✨',
  primers: '🛡️'
};

export default function CategoryCard({ category, count }) {
  const icon = CATEGORY_ICONS[category] || '🎨';
  const names = {
    interior: 'Interior Paints',
    exterior: 'Exterior Paints',
    enamel: 'Enamel & Wood Finish',
    primers: 'Primers & Putty'
  };

  return (
    <Link to={`/products?category=${category}`} className="category-card">
      <div className="category-icon">{icon}</div>
      <div className="category-info">
        <span className="category-name">{names[category] || category}</span>
        <span className="category-count">{count} products</span>
      </div>
    </Link>
  );
}
