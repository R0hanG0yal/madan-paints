import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';

const PAINT_TYPES = [
  { id: 'interior-emulsion', label: 'Interior Emulsion', coverage: 120, unit: 'sq ft/L', avgPrice: 849, desc: 'Standard interior walls & ceilings' },
  { id: 'interior-luxury', label: 'Luxury Interior', coverage: 110, unit: 'sq ft/L', avgPrice: 1199, desc: 'Premium interiors, deep colors' },
  { id: 'exterior-weatherproof', label: 'Exterior Weatherproof', coverage: 90, unit: 'sq ft/L', avgPrice: 1299, desc: 'Exterior walls, weather resistant' },
  { id: 'enamel-gloss', label: 'Enamel Gloss', coverage: 100, unit: 'sq ft/L', avgPrice: 1299, desc: 'Doors, windows, trims, metal' },
  { id: 'ceiling-flat', label: 'Ceiling Flat', coverage: 140, unit: 'sq ft/L', avgPrice: 599, desc: 'Ceilings only' },
  { id: 'textured', label: 'Textured Finish', coverage: 50, unit: 'sq ft/L', avgPrice: 1899, desc: 'Textured/patterned walls' }
];

const DOOR_AREA = 20; // sq ft - standard door
const WINDOW_AREA = 12; // sq ft - standard window

function calculatePaint(length, width, height, paintType, doors, windows, coats) {
  const totalWallArea = 2 * (length + width) * height;
  const ceilingArea = length * width;
  const doorDeduction = doors * DOOR_AREA;
  const windowDeduction = windows * WINDOW_AREA;
  const paintableArea = totalWallArea + ceilingArea - doorDeduction - windowDeduction;
  const coveragePerLiter = paintType.coverage;
  const rawLiters = (paintableArea * coats) / coveragePerLiter;
  const litersNeeded = Math.ceil(rawLiters * 10) / 10;

  // Best size combination
  const sizes = [
    { size: '10L', liters: 10, price: Math.round(paintType.avgPrice * 8.5) },
    { size: '4L', liters: 4, price: Math.round(paintType.avgPrice * 3.7) },
    { size: '1L', liters: 1, price: paintType.avgPrice }
  ];

  let remaining = litersNeeded;
  const breakdown = [];
  for (const s of sizes) {
    if (remaining <= 0) break;
    const qty = Math.floor(remaining / s.liters);
    if (qty > 0) {
      breakdown.push({ ...s, qty });
      remaining -= qty * s.liters;
    }
  }
  if (remaining > 0) {
    const smallest = sizes[sizes.length - 1];
    breakdown.push({ ...smallest, qty: 1 });
    remaining = 0;
  }

  const totalCost = breakdown.reduce((sum, b) => sum + b.qty * b.price, 0);
  const exactLiters = breakdown.reduce((sum, b) => sum + b.qty * b.liters, 0);

  return {
    totalWallArea: Math.round(totalWallArea),
    ceilingArea: Math.round(ceilingArea),
    doorDeduction: Math.round(doorDeduction),
    windowDeduction: Math.round(windowDeduction),
    paintableArea: Math.round(paintableArea),
    rawLiters: Math.round(rawLiters * 10) / 10,
    litersNeeded,
    breakdown,
    exactLiters,
    totalCost
  };
}

export default function PaintCalculator() {
  const navigate = useNavigate();
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('10');
  const [height, setHeight] = useState('10');
  const [paintTypeId, setPaintTypeId] = useState('interior-emulsion');
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('1');
  const [coats, setCoats] = useState('2');
  const [result, setResult] = useState(null);
  const [calculated, setCalculated] = useState(false);

  const paintType = PAINT_TYPES.find(p => p.id === paintTypeId) || PAINT_TYPES[0];

  const handleCalculate = (e) => {
    e.preventDefault();
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const d = parseInt(doors) || 0;
    const win = parseInt(windows) || 0;
    const c = parseInt(coats) || 1;

    if (l <= 0 || w <= 0 || h <= 0) return;

    const res = calculatePaint(l, w, h, paintType, d, win, c);
    setResult(res);
    setCalculated(true);
  };

  const handleShopClick = () => {
    const cat = paintTypeId.split('-')[0];
    navigate(`/products?category=${cat}`);
  };

  return ( <>
    <Helmet><title>Paint Calculator - Madan Paints</title></Helmet>
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>
      <div className="calculator-breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span>Paint Calculator</span>
      </div>

      <div className="calculator-page">
        {/* Input Form */}
        <div className="calculator-form-card">
          <h2>Room Dimensions</h2>
          <form onSubmit={handleCalculate}>
            <div className="calc-form-grid">
              <div className="calc-field">
                <label>Length (ft)</label>
                <input type="number" step="0.5" min="1" value={length}
                  onChange={e => setLength(e.target.value)} required />
              </div>
              <div className="calc-field">
                <label>Width (ft)</label>
                <input type="number" step="0.5" min="1" value={width}
                  onChange={e => setWidth(e.target.value)} required />
              </div>
              <div className="calc-field">
                <label>Height (ft)</label>
                <input type="number" step="0.5" min="1" value={height}
                  onChange={e => setHeight(e.target.value)} required />
              </div>
            </div>

            <h3 className="calc-subheading">Paint Type</h3>
            <div className="calc-paint-types">
              {PAINT_TYPES.map(pt => (
                <button key={pt.id} type="button"
                  className={`calc-paint-btn ${paintTypeId === pt.id ? 'active' : ''}`}
                  onClick={() => setPaintTypeId(pt.id)}
                >
                  <span className="calc-paint-name">{pt.label}</span>
                  <span className="calc-paint-coverage">{pt.coverage} {pt.unit}</span>
                </button>
              ))}
            </div>

            <div className="calc-form-grid three-col">
              <div className="calc-field">
                <label>Doors</label>
                <input type="number" min="0" max="10" value={doors}
                  onChange={e => setDoors(e.target.value)} />
              </div>
              <div className="calc-field">
                <label>Windows</label>
                <input type="number" min="0" max="10" value={windows}
                  onChange={e => setWindows(e.target.value)} />
              </div>
              <div className="calc-field">
                <label>Coats</label>
                <select value={coats} onChange={e => setCoats(e.target.value)}>
                  <option value="1">1 coat (touch-up)</option>
                  <option value="2">2 coats (standard)</option>
                  <option value="3">3 coats (dark→light)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-calculate">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
              Calculate
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="calculator-results">
          {!calculated ? (
            <div className="calc-placeholder">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#e0d5d0">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
              <h3>Enter your room details</h3>
              <p>Fill in the dimensions and click Calculate to see how much paint you need</p>
            </div>
          ) : result ? (
            <div className="calc-results-content">
              {/* Main Result */}
              <div className="calc-result-hero">
                <div className="calc-result-number">
                  <span className="calc-big-number">{result.litersNeeded}</span>
                  <span className="calc-big-unit">Liters</span>
                </div>
                <div className="calc-result-cost">
                  <span className="calc-cost-label">Estimated Cost</span>
                  <span className="calc-cost-value">₹{result.totalCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Size Recommendation */}
              <div className="calc-section">
                <h3>Recommended Size(s)</h3>
                <div className="calc-size-breakdown">
                  {result.breakdown.map((b, i) => (
                    <div key={i} className="calc-size-item">
                      <span className="calc-size-qty">{b.qty}×</span>
                      <span className="calc-size-name">{b.size}</span>
                      <span className="calc-size-total">₹{(b.qty * b.price).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="calc-size-total-row">
                    <span>Total Paint</span>
                    <span className="calc-total-liters">{result.exactLiters} L</span>
                    <span className="calc-total-price">₹{result.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Area Breakdown */}
              <div className="calc-section">
                <h3>Area Breakdown</h3>
                <div className="calc-area-grid">
                  <div className="calc-area-item">
                    <span className="calc-area-label">Wall Area</span>
                    <span className="calc-area-value">{result.totalWallArea.toLocaleString()} sq ft</span>
                  </div>
                  <div className="calc-area-item">
                    <span className="calc-area-label">Ceiling Area</span>
                    <span className="calc-area-value">{result.ceilingArea.toLocaleString()} sq ft</span>
                  </div>
                  <div className="calc-area-item negative">
                    <span className="calc-area-label">Doors ({doors})</span>
                    <span className="calc-area-value">-{result.doorDeduction} sq ft</span>
                  </div>
                  <div className="calc-area-item negative">
                    <span className="calc-area-label">Windows ({windows})</span>
                    <span className="calc-area-value">-{result.windowDeduction} sq ft</span>
                  </div>
                  <div className="calc-area-item total">
                    <span className="calc-area-label">Paintable Area</span>
                    <span className="calc-area-value">{result.paintableArea.toLocaleString()} sq ft</span>
                  </div>
                  <div className="calc-area-item total">
                    <span className="calc-area-label">Paint Needed ({coats} coats)</span>
                    <span className="calc-area-value">{result.rawLiters} L</span>
                  </div>
                </div>
              </div>

              {/* Paint Info */}
              <div className="calc-section">
                <h3>Paint Details</h3>
                <div className="calc-paint-detail">
                  <div className="calc-detail-row">
                    <span>Type</span>
                    <span className="calc-detail-value">{paintType.label}</span>
                  </div>
                  <div className="calc-detail-row">
                    <span>Coverage</span>
                    <span className="calc-detail-value">{paintType.coverage} {paintType.unit}</span>
                  </div>
                  <div className="calc-detail-row">
                    <span>Avg. 1L Price</span>
                    <span className="calc-detail-value">₹{paintType.avgPrice}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="calc-actions">
                <button className="btn-calc-shop" onClick={handleShopClick}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/></svg>
                  Shop {paintType.label}
                </button>
                <button className="btn-calc-recalc" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Recalculate
                </button>
              </div>

              {/* Tips */}
              <div className="calc-tips">
                <h1>Calculator</h1>
                <ul>
                  <li>Always buy <strong>10-15% extra</strong> paint for touch-ups and future repairs</li>
                  <li>Use <strong>primer</strong> for better coverage — reduces paint needed by up to 20%</li>
                  <li>Dark-to-light color changes may need <strong>3 coats</strong> instead of 2</li>
                  <li>Rough/textured walls may require <strong>20% more</strong> paint than smooth walls</li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
  </> );
}
