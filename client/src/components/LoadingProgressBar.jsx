import { Html, useProgress } from '@react-three/drei';

export function Room3DLoadingProgress() {
  const { progress, active, item } = useProgress();

  if (!active) return null;

  const barWidth = Math.min(Math.max(progress, 5), 100);

  return (
    <Html center style={{ pointerEvents: 'none' }}>
      <div
        style={{
          width: 280,
          textAlign: 'center',
          background: 'rgba(250,243,240,0.92)',
          padding: '28px 32px 24px',
          borderRadius: 14,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#5a2d0e',
            marginBottom: 4,
          }}
        >
          🎨 Loading Room
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#9a7a82',
            marginBottom: 16,
          }}
        >
          Setting up 3D scene{item ? `: ${item.split('/').pop()}` : '…'}
        </div>

        {/* Progress bar track */}
        <div
          style={{
            width: '100%',
            height: 6,
            background: '#f0e8e0',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Progress bar fill */}
          <div
            style={{
              width: `${barWidth}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #9b1b30, #c04060)',
              borderRadius: 3,
              transition: 'width 0.3s ease',
              position: 'relative',
            }}
          >
            {/* Shimmer effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                animation: 'loadingShimmer 1.2s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Percentage */}
        <div
          style={{
            fontSize: 12,
            color: '#6b4a52',
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}

/**
 * Inline fallback for when useProgress isn't available
 * (used outside Canvas for the lazy-loaded Suspense)
 */
export function StaticLoadingBar() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(250,243,240,0.85)',
        borderRadius: 8,
      }}
    >
      <div style={{ width: 280, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#5a2d0e',
            marginBottom: 4,
          }}
        >
          🎨 Loading Room
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#9a7a82',
            marginBottom: 16,
          }}
        >
          Preparing 3D scene…
        </div>

        {/* Indeterminate animated bar */}
        <div
          style={{
            width: '100%',
            height: 6,
            background: '#f0e8e0',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '35%',
              height: '100%',
              background: 'linear-gradient(90deg, #9b1b30, #c04060)',
              borderRadius: 3,
              position: 'relative',
              animation: 'loadingIndeterminate 1.4s ease-in-out infinite',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                animation: 'loadingShimmer 0.8s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            color: '#6b4a52',
            marginTop: 8,
          }}
        >
          Loading…
        </div>
      </div>
    </div>
  );
}
