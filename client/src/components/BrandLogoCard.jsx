export const BRAND_STYLES = {
  'Asian Paints': { gradient: 'linear-gradient(135deg, #E53935, #B71C1C)', logo: 'Asian', logoStrong: 'Paints', tagline: 'Har Ghar Kuch Kehta Hai' },

  'Nerolac': { gradient: 'linear-gradient(135deg, #1565C0, #0D47A1)', logo: 'NEROLAC', logoStrong: '', tagline: 'Rang Aur Safai Dono' },
  'Berger Paints': { gradient: 'linear-gradient(135deg, #2E7D32, #1B5E20)', logo: 'BERGER', logoStrong: '', tagline: 'Beauty Inspired By You' },
  'Indigo Paints': { gradient: 'linear-gradient(135deg, #6A1B9A, #4A148C)', logo: 'INDIGO', logoStrong: '', tagline: 'Paint The World' },
  'Pidilite': { gradient: 'linear-gradient(135deg, #F57F17, #E65100)', logo: 'Pidilite', logoStrong: '', tagline: 'Fevicol Bonding' },
  'Birla Putty': { gradient: 'linear-gradient(135deg, #37474F, #263238)', logo: 'BIRLA', logoStrong: '', tagline: 'Build Strong' },
  'JK Putty': { gradient: 'linear-gradient(135deg, #283593, #1A237E)', logo: 'JK PUTTY', logoStrong: '', tagline: 'Stronger Walls' },

  'Acro Paints': { gradient: 'linear-gradient(135deg, #00838F, #004D40)', logo: 'ACRO', logoStrong: '', tagline: 'Quality Coating' },
  'Opus Paints': { gradient: 'linear-gradient(135deg, #5D4037, #4E342E)', logo: 'OPUS', logoStrong: '', tagline: 'Premium Finish' },
  'Esdee Paints': { gradient: 'linear-gradient(135deg, #2E7D32, #004D40)', logo: 'ESDEE', logoStrong: '', tagline: 'Trusted Quality' },
  'Dulux': { gradient: 'linear-gradient(135deg, #E91E63, #880E4F)', logo: 'DULUX', logoStrong: '', tagline: "Let's Colour" },
  'JSW Paints': { gradient: 'linear-gradient(135deg, #0D47A1, #01579B)', logo: 'JSW', logoStrong: 'Paints', tagline: 'Eco-Friendly' },

};

export function getBrandStyle(brandName) {
  if (BRAND_STYLES[brandName]) return BRAND_STYLES[brandName];
  let hash = 0;
  for (let i = 0; i < brandName.length; i++) {
    hash = brandName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return {
    gradient: `linear-gradient(135deg, hsl(${h}, 70%, 40%), hsl(${(h + 40) % 360}, 65%, 25%))`,
    logo: brandName.toUpperCase(),
    logoStrong: '',
    tagline: 'Premium Paints'
  };
}

export default function BrandLogoCard({ brandName, productCount, onClick, size, swatchColors }) {
  const style = getBrandStyle(brandName);
  const colors = swatchColors || [];
  return (
    <div
      className={`brand-logo-card ${size === 'large' ? 'brand-logo-card-large' : ''} ${colors.length > 0 ? 'has-swatches' : ''}`}
      onClick={onClick}
      style={{ background: style.gradient }}
    >
      <div className="brand-logo-card-inner">
        <div className="brand-logo-text">
          {style.logo}
          {style.logoStrong && <strong> {style.logoStrong}</strong>}
        </div>
        <div className="brand-logo-tagline">{style.tagline}</div>
        <div className="brand-logo-count">{productCount} Products</div>
        {colors.length > 0 && (
          <div className="brand-swatch-strip">
            {colors.map((hex, i) => (
              <span
                key={i}
                className="brand-swatch-dot"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BrandHeroBanner({ brandName, productCount, description }) {
  const style = getBrandStyle(brandName);
  return (
    <div className="brand-hero-banner" style={{ background: style.gradient }}>
      <div className="brand-hero-content">
        <div className="brand-hero-logo-area">
          <div className="brand-hero-logo">
            {style.logo}
            {style.logoStrong && <strong> {style.logoStrong}</strong>}
          </div>
          <div className="brand-hero-tagline">{style.tagline}</div>
        </div>
        <div className="brand-hero-info">
          <h1 className="brand-hero-name">{brandName}</h1>
          <p className="brand-hero-desc">{description || `Explore the full range of ${brandName} premium paints and coatings.`}</p>
          <div className="brand-hero-stats">
            <div className="brand-hero-stat">
              <span className="brand-hero-stat-value">{productCount}</span>
              <span className="brand-hero-stat-label">Products</span>
            </div>
            <div className="brand-hero-stat">
              <span className="brand-hero-stat-value">100%</span>
              <span className="brand-hero-stat-label">Genuine</span>
            </div>
            <div className="brand-hero-stat">
              <span className="brand-hero-stat-value">Free</span>
              <span className="brand-hero-stat-label">Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
