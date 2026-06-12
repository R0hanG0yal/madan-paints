import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

export default function CompareBar() {
  const { compareList, compareCount, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareCount === 0) return null;

  return (
    <div className="compare-bar">
      <div className="compare-bar-inner">
        <div className="compare-bar-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l3-3-3-3h5v2zm4 0h5l-3 3 3 3h-5v-2zm-4-6v2H5v-2h5zm10-4h-5V6l-3 3 3 3V8h5v2z"/>
          </svg>
          Compare ({compareCount}/3)
        </div>
        <div className="compare-bar-items">
          {compareList.map(p => (
            <div key={p.id} className="compare-bar-item">
              <span className="compare-bar-swatch" style={{ backgroundColor: p.hexColor || '#888' }} />
              <span className="compare-bar-name">{p.name.split(' - ')[0]}</span>
              <button className="compare-bar-remove" onClick={() => removeFromCompare(p.id)} title="Remove">
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="compare-bar-actions">
          <button className="compare-bar-clear" onClick={clearCompare}>Clear All</button>
          <button className="compare-bar-go" onClick={() => navigate('/compare')}>
            Compare →
          </button>
        </div>
      </div>
    </div>
  );
}
