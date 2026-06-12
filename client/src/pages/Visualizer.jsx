import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../api';
import { StaticLoadingBar } from '../components/LoadingProgressBar';

const Room3D = lazy(() => import('../components/Room3D'));

const ROOM_WALLS = [
  { id: 'back', label: 'Back Wall' },
  { id: 'left', label: 'Left Wall' },
  { id: 'right', label: 'Right Wall' },
  { id: 'floor', label: 'Floor' },
  { id: 'ceiling', label: 'Ceiling' }
];

const PRESET_COLORS = [
  { name: 'Crimson Red', hex: '#DC143C' }, { name: 'Deep Ocean', hex: '#1E90FF' },
  { name: 'Forest Green', hex: '#228B22' }, { name: 'Sunset Gold', hex: '#FFD700' },
  { name: 'Burgundy', hex: '#800020' }, { name: 'Pearl White', hex: '#F5F5F5' },
  { name: 'Flame Orange', hex: '#FF4500' }, { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Charcoal', hex: '#36454F' }, { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Warm Beige', hex: '#D4A574' }, { name: 'Teal', hex: '#008080' },
  { name: 'Terracotta', hex: '#8B4513' }, { name: 'Slate Gray', hex: '#708090' },
  { name: 'Dusty Rose', hex: '#C08080' }, { name: 'Soft Sage', hex: '#BCB88A' }
];

const DEFAULT_WALL_COLORS = {
  back: '#E8E0D8', left: '#D4C5B8', right: '#C8BBA8', floor: '#A0917E', ceiling: '#F0EBE5'
};

// ── Color utilities ──
function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  r = parseInt(hex[1] + hex[2], 16) / 255;
  g = parseInt(hex[3] + hex[4], 16) / 255;
  b = parseInt(hex[5] + hex[6], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function HSLToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function getComplementary(hex) {
  const { h, s, l } = hexToHSL(hex);
  return HSLToHex((h + 180) % 360, s, l);
}

function getAnalogous(hex) {
  const { h, s, l } = hexToHSL(hex);
  return [
    HSLToHex((h + 330) % 360, s, l),
    HSLToHex((h + 30) % 360, s, l)
  ];
}

function getTriadic(hex) {
  const { h, s, l } = hexToHSL(hex);
  return [
    HSLToHex((h + 120) % 360, s, l),
    HSLToHex((h + 240) % 360, s, l)
  ];
}

function getSplitComplementary(hex) {
  const { h, s, l } = hexToHSL(hex);
  return [
    HSLToHex((h + 150) % 360, s, l),
    HSLToHex((h + 210) % 360, s, l)
  ];
}

// ── Room presets (icons and labels only - 3D rendering handles the rest) ──
const ROOM_PRESETS = {
  'living-room': { label: 'Living Room', icon: '🛋️' },
  'bedroom': { label: 'Bedroom', icon: '🛏️' },
  'kitchen': { label: 'Kitchen', icon: '🍳' },
  'bathroom': { label: 'Bathroom', icon: '🛁' },
  'home-office': { label: 'Home Office', icon: '💼' },
  'kids-room': { label: "Kids' Room", icon: '🧸' },
  'dining-room': { label: 'Dining Room', icon: '🍽️' }
};

export default function Visualizer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wallColors, setWallColors] = useState(DEFAULT_WALL_COLORS);
  const [selectedWall, setSelectedWall] = useState('back');
  const [paintProducts, setPaintProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customColor, setCustomColor] = useState('#800020');
  const [recentColors, setRecentColors] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [currentPreset, setCurrentPreset] = useState('living-room');
  const [savedRooms, setSavedRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);
  const [searchCode, setSearchCode] = useState('');

  // Filter products by Asian Paints code
  const filteredByCode = searchCode.trim()
    ? paintProducts.filter(p =>
        p.asianColorCode &&
        p.asianColorCode.toLowerCase().includes(searchCode.trim().toLowerCase())
      )
    : [];

  // Load saved rooms from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('madanPaintsSavedRooms');
      if (raw) setSavedRooms(JSON.parse(raw));
    } catch {}
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products?limit=30');
        const paints = res.data.products.filter(p => p.hexColor).slice(0, 16);
        setPaintProducts(paints);
      } catch (err) {
        console.error('Error fetching paint products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  }, []);

  const handleWallClick = (wallId) => setSelectedWall(wallId);

  const handleColorSelect = (hex) => {
    setWallColors(prev => ({ ...prev, [selectedWall]: hex }));
    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== hex);
      return [hex, ...filtered].slice(0, 8);
    });
    setCustomColor(hex);
  };

  const handleCustomColorChange = (e) => {
    const hex = e.target.value;
    setCustomColor(hex);
    handleColorSelect(hex);
  };

  const resetRoom = () => {
    setWallColors(DEFAULT_WALL_COLORS);
    setSelectedWall('back');
    setRecentColors([]);
  };

  const applyToAll = (hex) => {
    setWallColors({
      back: hex,
      left: adjustColor(hex, -15),
      right: adjustColor(hex, -30),
      floor: adjustColor(hex, -45),
      ceiling: adjustColor(hex, 10)
    });
  };

  const loadPreset = (presetId) => {
    setCurrentPreset(presetId);
    resetRoom();
  };

  // ── Save / Share ──
  const saveRoom = () => {
    const name = roomName.trim() || `Room ${savedRooms.length + 1}`;
    const data = { name, colors: wallColors, preset: currentPreset, savedAt: new Date().toISOString() };
    const updated = [...savedRooms, data];
    setSavedRooms(updated);
    localStorage.setItem('madanPaintsSavedRooms', JSON.stringify(updated));
    setRoomName('');
    setShowSaveDialog(false);
    showToast(`✅ "${name}" saved!`);
  };

  const loadSavedRoom = (room) => {
    setWallColors(room.colors);
    setCurrentPreset(room.preset || 'living-room');
    showToast(`✅ Loaded "${room.name}"`);
  };

  const deleteSavedRoom = (idx) => {
    const updated = savedRooms.filter((_, i) => i !== idx);
    setSavedRooms(updated);
    localStorage.setItem('madanPaintsSavedRooms', JSON.stringify(updated));
    showToast('🗑️ Room deleted');
  };

  const shareRoom = () => {
    const data = JSON.stringify({ colors: wallColors, preset: currentPreset });
    const encoded = btoa(encodeURIComponent(data));
    const url = `${window.location.origin}${window.location.pathname}?room=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowShareDialog(false);
      showToast('✅ Share link copied!');
    }).catch(() => {
      setShowShareDialog(false);
      showToast('✅ Link: ' + url.slice(0, 50) + '...');
    });
  };

  // Check for shared room in URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('room');
      if (encoded) {
        const data = JSON.parse(decodeURIComponent(atob(encoded)));
        if (data.colors) setWallColors(data.colors);
        if (data.preset) setCurrentPreset(data.preset);
      }
    } catch {}
  }, []);

  // Keyboard shortcuts 1-7 to switch rooms instantly
  useEffect(() => {
    const roomKeys = Object.keys(ROOM_PRESETS);
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs or using browser shortcuts
      const tag = e.target.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7) {
        const roomId = roomKeys[num - 1];
        if (roomId) {
          e.preventDefault();
          setCurrentPreset(roomId);
          resetRoom();
          showToast(`⌨️ ${ROOM_PRESETS[roomId].icon} ${ROOM_PRESETS[roomId].label}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  // Color suggestions
  const currentColor = wallColors[selectedWall];
  const complementary = getComplementary(currentColor);
  const analogous = getAnalogous(currentColor);
  const triadic = getTriadic(currentColor);
  const splitComp = getSplitComplementary(currentColor);

  // ── Shop This Color ──
  const matchedProduct = paintProducts.find(p => p.hexColor.toLowerCase() === currentColor.toLowerCase());
  const fallbackProducts = matchedProduct ? [] : paintProducts.slice(0, 4);

  const handleShopColor = async (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(product.id);
    try {
      await addToCart(product.id);
      showToast(`🛒 "${product.name.split(' - ')[0]}" added to cart!`);
    } catch (err) {
      showToast('❌ Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const presetRoom = ROOM_PRESETS[currentPreset] || ROOM_PRESETS['living-room'];

  return (
    <div className="visualizer-page">
      {toastMessage && <div className="visualizer-toast">{toastMessage}</div>}

      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <div className="visualizer-breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span>Room Visualizer</span>
      </div>

      <div className="visualizer-hero">
        <h1>🎨 Virtual Room Painter</h1>
        <p>Click any wall, choose a color — preview your room in stunning 3D</p>
      </div>

      {/* Room Presets */}
      <div className="room-presets-bar">
        {Object.entries(ROOM_PRESETS).map(([id, preset]) => (
          <button
            key={id}
            className={`preset-btn ${currentPreset === id ? 'active' : ''}`}
            onClick={() => loadPreset(id)}
          >
            <span className="preset-icon">{preset.icon}</span>
            <span className="preset-label">{preset.label}</span>
          </button>
        ))}
      </div>

      <div className="visualizer-layout">
        {/* Room Scene - 3D Only */}
        <div className="visualizer-scene">
          <div className="scene-header">
            <h2>{presetRoom.icon} {presetRoom.label}</h2>
            <div className="scene-actions">
              <button className="btn-save-room" onClick={() => setShowSaveDialog(true)} title="Save room">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
                Save
              </button>
              <button className="btn-share-room" onClick={() => setShowShareDialog(true)} title="Share room">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              <button className="btn-reset-room" onClick={resetRoom}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.96 7.96 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                Reset
              </button>
            </div>
          </div>
          <div className="room-container">
            <div className="room-scene-3d-container">
              <Suspense fallback={<StaticLoadingBar />}>
                <Room3D
                  wallColors={wallColors}
                  selectedWall={selectedWall}
                  onWallClick={handleWallClick}
                  currentPreset={currentPreset}
                />
              </Suspense>
              <div className="room-3d-hint">Drag to orbit · Scroll to zoom</div>
            </div>

            <div className="wall-labels">
              {ROOM_WALLS.map(wall => (
                <button key={wall.id} className={`wall-label-btn ${selectedWall === wall.id ? 'active' : ''}`}
                  onClick={() => handleWallClick(wall.id)}>
                  <span className="wall-dot" style={{ backgroundColor: wallColors[wall.id] }} />
                  {wall.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Palette + Suggestions */}
        <div className="visualizer-palette">
          <div className="palette-header">
            <h2>🎯 Color Palette</h2>
            <div className="selected-wall-badge">
              Painting: <strong>{ROOM_WALLS.find(w => w.id === selectedWall)?.label}</strong>
            </div>
          </div>

          {/* Paint Products */}
          <div className="palette-section">
            <h3>Our Paint Colors</h3>
            <div className="palette-grid">
              {loading ? <div className="palette-loading">Loading…</div>
                : paintProducts.map(product => (
                  <button key={product.id}
                    className={`palette-swatch ${wallColors[selectedWall] === product.hexColor ? 'active' : ''}`}
                    style={{ backgroundColor: product.hexColor }}
                    onClick={() => handleColorSelect(product.hexColor)} title={`${product.name} - ${product.hexColor}`}>
                    <span className="swatch-tooltip"><span className="swatch-name">{product.name}</span><span className="swatch-hex">{product.hexColor}</span></span>
                    <span className="swatch-check">✓</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Preset Colors */}
          <div className="palette-section">
            <h3>Presets</h3>
            <div className="palette-grid small">
              {PRESET_COLORS.map(color => (
                <button key={color.hex}
                  className={`palette-swatch small ${wallColors[selectedWall] === color.hex ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorSelect(color.hex)} title={`${color.name} - ${color.hex}`}>
                  <span className="swatch-tooltip"><span className="swatch-name">{color.name}</span><span className="swatch-hex">{color.hex}</span></span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="palette-section">
            <div className="custom-color-header">
              <h3>Custom</h3>
              <button className="btn-show-picker" onClick={() => setShowPicker(!showPicker)}>
                {showPicker ? 'Hide' : 'Pick'}
              </button>
            </div>
            <div className="custom-color-area">
              <div className="custom-color-preview" style={{ backgroundColor: customColor }} />
              <div className="custom-color-input">
                <label>Hex</label>
                <input type="text" value={customColor}
                  onChange={(e) => { const v = e.target.value; setCustomColor(v); if (/^#[0-9A-Fa-f]{6}$/.test(v)) handleColorSelect(v); }}
                  placeholder="#HEX" />
              </div>
            </div>
            {showPicker && (
              <div className="picker-wrapper">
                <input type="color" value={customColor} onChange={handleCustomColorChange} className="native-color-picker" />
              </div>
            )}
          </div>

          {/* Search by Asian Paints Code */}
          <div className="palette-section">
            <h3>Search by Asian Code</h3>
            <div className="asian-code-search">
              <input
                type="text"
                className="asian-code-input"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="e.g. RS 1001, DDLS 18…"
              />
              {searchCode.trim() && filteredByCode.length === 0 && (
                <div className="asian-code-no-match">No matching code found</div>
              )}
              {filteredByCode.length > 0 && (
                <div className="asian-code-results">
                  {filteredByCode.slice(0, 6).map(product => (
                    <button
                      key={product.id}
                      className={`asian-code-result ${wallColors[selectedWall] === product.hexColor ? 'active' : ''}`}
                      onClick={() => {
                        handleColorSelect(product.hexColor);
                        setSearchCode(product.asianColorCode);
                        showToast(`✅ ${product.asianColorCode} — ${product.name.split(' - ')[0]} applied`);
                      }}
                    >
                      <span className="asian-code-swatch" style={{ backgroundColor: product.hexColor }} />
                      <span className="asian-code-detail">
                        <span className="asian-code-tag">{product.asianColorCode}</span>
                        <span className="asian-code-name">{product.name.split(' - ')[0]}</span>
                      </span>
                      <span className="asian-code-hex">{product.hexColor}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="palette-section">
              <h3>Recent</h3>
              <div className="recent-colors">
                {recentColors.map((hex, idx) => (
                  <button key={idx}
                    className={`palette-swatch small ${wallColors[selectedWall] === hex ? 'active' : ''}`}
                    style={{ backgroundColor: hex }} onClick={() => handleColorSelect(hex)} title={hex} />
                ))}
              </div>
            </div>
          )}

          {/* Color Suggestions */}
          <div className="palette-section">
            <button className="btn-toggle-suggestions" onClick={() => setShowSuggestions(!showSuggestions)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Color Harmony Suggestions {showSuggestions ? '▲' : '▼'}
            </button>
            {showSuggestions && (
              <div className="suggestions-content">
                <div className="suggestion-group">
                  <h4>Complementary <span className="scheme-desc">(opposite)</span></h4>
                  <div className="suggestion-row">
                    <button className="palette-swatch suggestion-swatch" style={{ backgroundColor: currentColor }}
                      onClick={() => handleColorSelect(currentColor)} title={currentColor} />
                    <button className="palette-swatch suggestion-swatch" style={{ backgroundColor: complementary }}
                      onClick={() => handleColorSelect(complementary)} title={complementary} />
                  </div>
                </div>
                <div className="suggestion-group">
                  <h4>Analogous <span className="scheme-desc">(neighbors)</span></h4>
                  <div className="suggestion-row three">
                    {analogous.map((hex, i) => (
                      <button key={i} className="palette-swatch suggestion-swatch" style={{ backgroundColor: hex }}
                        onClick={() => handleColorSelect(hex)} title={hex} />
                    ))}
                  </div>
                </div>
                <div className="suggestion-group">
                  <h4>Triadic <span className="scheme-desc">(triangle)</span></h4>
                  <div className="suggestion-row three">
                    {triadic.map((hex, i) => (
                      <button key={i} className="palette-swatch suggestion-swatch" style={{ backgroundColor: hex }}
                        onClick={() => handleColorSelect(hex)} title={hex} />
                    ))}
                  </div>
                </div>
                <div className="suggestion-group">
                  <h4>Split Complementary</h4>
                  <div className="suggestion-row three">
                    {splitComp.map((hex, i) => (
                      <button key={i} className="palette-swatch suggestion-swatch" style={{ backgroundColor: hex }}
                        onClick={() => handleColorSelect(hex)} title={hex} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Apply to All */}
          <div className="palette-section apply-to-all-section">
            <h3>Actions</h3>
            <button className="btn-apply-all" onClick={() => applyToAll(wallColors[selectedWall])}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>
              Apply "{ROOM_WALLS.find(w => w.id === selectedWall)?.label}" to All
            </button>
            <div className="color-summary">
              <h4>Current Colors</h4>
              {ROOM_WALLS.map(wall => (
                <div key={wall.id} className="color-summary-row">
                  <span className="color-summary-name">{wall.label}</span>
                  <div className="color-summary-swatch" style={{ backgroundColor: wallColors[wall.id] }} />
                  <span className="color-summary-hex">{wallColors[wall.id]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Shop This Color ── */}
          <div className="palette-section shop-color-section">
            <h3>🛒 Shop This Color</h3>
            <div className="shop-color-card">
              <div className="shop-color-preview">
                <div className="shop-color-swatch" style={{ backgroundColor: currentColor }} />
                <div className="shop-color-meta">
                  <span className="shop-color-hex">{currentColor}</span>
                  {matchedProduct ? (
                    <span className="shop-color-match">✓ Exact match</span>
                  ) : (
                    <span className="shop-color-match no-match">No exact match</span>
                  )}
                </div>
              </div>
              {matchedProduct ? (
                <div className="shop-product-info">
                  <div className="shop-product-name" title={matchedProduct.name}>
                    {matchedProduct.name.length > 50
                      ? matchedProduct.name.slice(0, 50) + '…'
                      : matchedProduct.name}
                  </div>
                  {matchedProduct.availableSizes && (
                    <div className="shop-sizes">
                      {matchedProduct.availableSizes.slice(0, 3).map(s => (
                        <span key={s.size} className="shop-size-tag">{s.size} — ₹{s.price.toLocaleString()}</span>
                      ))}
                    </div>
                  )}
                  <button
                    className={`btn-shop-color ${addingToCart === matchedProduct.id ? 'adding' : ''}`}
                    onClick={() => handleShopColor(matchedProduct)}
                    disabled={addingToCart === matchedProduct.id}
                  >
                    {addingToCart === matchedProduct.id ? (
                      <><span className="spinner" /> Adding…</>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14.75l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25z"/>
                        </svg>
                        Add to Cart — ₹{matchedProduct.price.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="shop-similar">
                  <p className="shop-similar-label">Similar colors from our catalog:</p>
                  {fallbackProducts.map(p => (
                    <button
                      key={p.id}
                      className={`shop-similar-item ${addingToCart === p.id ? 'adding' : ''}`}
                      onClick={() => handleShopColor(p)}
                      disabled={addingToCart === p.id}
                    >
                      <span className="shop-sim-swatch" style={{ backgroundColor: p.hexColor }} />
                      <span className="shop-sim-name">{p.name.split(' - ')[0]}</span>
                      <span className="shop-sim-price">₹{p.price.toLocaleString()}</span>
                      {addingToCart === p.id ? (
                        <span className="shop-sim-add"><span className="spinner" /></span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shop-sim-add">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                      )}
                    </button>
                  ))}
                  <Link to="/products" className="shop-browse-all">Browse all paints →</Link>
                </div>
              )}
            </div>
          </div>

          {/* Saved Rooms */}
          {savedRooms.length > 0 && (
            <div className="palette-section saved-rooms-section">
              <h3>💾 Saved Rooms ({savedRooms.length})</h3>
              <div className="saved-rooms-list">
                {savedRooms.map((room, idx) => (
                  <div key={idx} className="saved-room-item">
                    <div className="saved-room-colors">
                      {Object.values(room.colors).slice(0, 3).map((c, i) => (
                        <div key={i} className="saved-color-dot" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="saved-room-name">{room.name}</span>
                    <div className="saved-room-actions">
                      <button className="btn-load-room" onClick={() => loadSavedRoom(room)} title="Load">↻</button>
                      <button className="btn-delete-room" onClick={() => deleteSavedRoom(idx)} title="Delete">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="visualizer-modal-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="visualizer-modal" onClick={e => e.stopPropagation()}>
            <h3>💾 Save This Room</h3>
            <p>Give your room a name so you can come back to it later.</p>
            <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)}
              placeholder="e.g. Living Room - Burgundy Theme" className="modal-input" autoFocus />
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setShowSaveDialog(false)}>Cancel</button>
              <button className="modal-btn-confirm" onClick={saveRoom}>Save Room</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="visualizer-modal-overlay" onClick={() => setShowShareDialog(false)}>
          <div className="visualizer-modal" onClick={e => e.stopPropagation()}>
            <h3>🔗 Share This Room</h3>
            <p>Share a link to this exact room color configuration.</p>
            <div className="share-preview">
              {ROOM_WALLS.slice(0, 3).map(wall => (
                <div key={wall.id} className="share-color-strip" style={{ backgroundColor: wallColors[wall.id] }}>
                  <span>{wall.label}: {wallColors[wall.id]}</span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setShowShareDialog(false)}>Cancel</button>
              <button className="modal-btn-confirm" onClick={shareRoom}>Copy Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
