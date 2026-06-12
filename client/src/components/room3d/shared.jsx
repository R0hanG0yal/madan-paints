import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Sky } from '@react-three/drei';
import * as THREE from 'three';

// ─── Baseboards (Skirting) ───
export function Baseboards({ w, d, color = '#e8dcc8' }) {
  const height = 0.1;
  const depth = 0.04;
  return (
    <group>
      {/* Front */}
      <mesh position={[0, height / 2, d / 2]} receiveShadow>
        <boxGeometry args={[w, height, depth]} />
        <meshPhysicalMaterial color={color} roughness={0.8} metalness={0} />
      </mesh>
      {/* Back */}
      <mesh position={[0, height / 2, -d / 2]} receiveShadow>
        <boxGeometry args={[w, height, depth]} />
        <meshPhysicalMaterial color={color} roughness={0.8} metalness={0} />
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[depth, height, d]} />
        <meshPhysicalMaterial color={color} roughness={0.8} metalness={0} />
      </mesh>
      {/* Right */}
      <mesh position={[w / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[depth, height, d]} />
        <meshPhysicalMaterial color={color} roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}


export function CrownMolding({ w, d, color = '#f0ebe5' }) {
  const height = 0.06;
  const depth = 0.06;
  return (
    <group>
      <mesh position={[0, 2.8 - height / 2, d / 2 - depth / 2]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[w, height, depth]} />
        <meshPhysicalMaterial color={color} roughness={0.6} metalness={0} />
      </mesh>
      <mesh position={[0, 2.8 - height / 2, -d / 2 + depth / 2]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[w, height, depth]} />
        <meshPhysicalMaterial color={color} roughness={0.6} metalness={0} />
      </mesh>
      <mesh position={[-w / 2 + depth / 2, 2.8 - height / 2, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[depth, height, d]} />
        <meshPhysicalMaterial color={color} roughness={0.6} metalness={0} />
      </mesh>
      <mesh position={[w / 2 - depth / 2, 2.8 - height / 2, 0]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[depth, height, d]} />
        <meshPhysicalMaterial color={color} roughness={0.6} metalness={0} />
      </mesh>
    </group>
  );
}


export function Window({ position, rotation = [0, 0, 0], width = 1.2, height = 1.6 }) {
  const frameColor = '#f0ebe0';
  const frameThickness = 0.04;
  return (
    <group position={position} rotation={rotation}>
      {/* Glass pane - nearly clear with subtle reflection */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[width - 0.08, height - 0.08]} />
        <meshPhysicalMaterial
          color="#b8dce8"
          transparent
          opacity={0.12}
          roughness={0.02}
          metalness={0.05}
          envMapIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, frameThickness, 0.06]} />
        <meshPhysicalMaterial color={frameColor} roughness={0.7} metalness={0} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[frameThickness, height, 0.06]} />
        <meshPhysicalMaterial color={frameColor} roughness={0.7} metalness={0} />
      </mesh>

      {/* Window sill */}
      <mesh position={[0, -height / 2 - 0.02, 0.04]}>
        <boxGeometry args={[width + 0.12, 0.03, 0.1]} />
        <meshPhysicalMaterial color="#e8ddd0" roughness={0.8} metalness={0} />
      </mesh>

      {/* Cross bars */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.02, height - 0.15, 0.02]} />
        <meshPhysicalMaterial color={frameColor} roughness={0.6} metalness={0} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[width - 0.15, 0.02, 0.02]} />
        <meshPhysicalMaterial color={frameColor} roughness={0.6} metalness={0} />
      </mesh>

      {/* Soft daylight coming through window */}
      <pointLight position={[0, 0, 0.3]} intensity={0.6} color="#fff8f0" distance={2} />
    </group>
  );
}


export function Door({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Door frame */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.8, 2.0, 0.06]} />
        <meshPhysicalMaterial color="#6b3a1a" roughness={0.7} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      {/* Door panels */}
      <mesh position={[0, 0.5, 0.015]}>
        <boxGeometry args={[0.65, 0.45, 0.02]} />
        <meshPhysicalMaterial color="#5a2d0e" roughness={0.8} metalness={0} />
      </mesh>
      <mesh position={[0, 1.1, 0.015]}>
        <boxGeometry args={[0.65, 0.45, 0.02]} />
        <meshPhysicalMaterial color="#5a2d0e" roughness={0.8} metalness={0} />
      </mesh>
      <mesh position={[0, 1.7, 0.015]}>
        <boxGeometry args={[0.65, 0.35, 0.02]} />
        <meshPhysicalMaterial color="#5a2d0e" roughness={0.8} metalness={0} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.32, 1.0, 0.035]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.84, 2.06, 0.1]} />
        <meshPhysicalMaterial color="#e8ddd0" roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}


export function PictureFrame({ position, rotation = [0, 0, 0], color = '#8B4513', imageColor = '#6a8a9a', size = 0.5 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <RoundedBox args={[size, size * 1.25, 0.04]} radius={0.015} smoothness={4}>
        <meshPhysicalMaterial color={color} roughness={0.5} metalness={0.2} />
      </RoundedBox>
      {/* Image */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[size * 0.85, size * 1.25 * 0.85]} />
        <meshPhysicalMaterial color={imageColor} roughness={0.3} metalness={0} />
      </mesh>
      {/* Glass reflection */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[size * 0.88, size * 1.25 * 0.88]} />
        <meshPhysicalMaterial color="#fff" transparent opacity={0.05} roughness={0} metalness={0.1} />
      </mesh>
    </group>
  );
}


export function CeilingLight({ position = [0, 2.7, 0] }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle pendulum: slight rotation on X and Z axes, synced
    groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.015;
    groupRef.current.rotation.z = Math.sin(t * 0.4 + 1.2) * 0.012;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Wire */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3]} />
        <meshPhysicalMaterial color="#666" roughness={0.8} metalness={0.2} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.02]} />
        <meshPhysicalMaterial color="#444" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshPhysicalMaterial
          color="#ffe082"
          emissive="#ffe082"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0}
        />
      </mesh>
      {/* Light glow */}
      <pointLight position={[0, -0.02, 0]} intensity={1.5} color="#ffe082" distance={4} decay={1} />
      {/* Lamp shade */}
      <mesh position={[0, -0.03, 0]}>
        <coneGeometry args={[0.12, 0.08, 16]} />
        <meshPhysicalMaterial
          color="#f5f0eb"
          transparent
          opacity={0.6}
          roughness={0.9}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bloom emissive helper */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshPhysicalMaterial color="#ffe082" emissive="#ffe082" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}


export function FloorLamp({ position = [-1.5, 0, -0.8] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.04]} />
        <meshPhysicalMaterial color="#444" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.02, 1.3]} />
        <meshPhysicalMaterial color="#555" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <coneGeometry args={[0.15, 0.12, 16]} />
        <meshPhysicalMaterial color="#f5f0eb" roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      {/* Light */}
      <pointLight position={[0, 1.3, 0]} intensity={0.6} color="#fff" distance={2.5} decay={1} />
    </group>
  );
}


export function Rug({ position = [0, 0.002, 0.2], colors = ['#c04040', '#800020', '#d4a574'], size = [1.8, 1.2] }) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Background
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, 256, 256);

    // Border
    ctx.fillStyle = colors[1];
    ctx.fillRect(0, 0, 256, 12);
    ctx.fillRect(0, 244, 256, 12);
    ctx.fillRect(0, 0, 12, 256);
    ctx.fillRect(244, 0, 12, 256);

    // Pattern - diamonds
    ctx.fillStyle = colors[2];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const cx = 16 + x * 28;
        const cy = 16 + y * 28;
        if ((x + y) % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(cx, cy - 8);
          ctx.lineTo(cx + 6, cy);
          ctx.lineTo(cx, cy + 8);
          ctx.lineTo(cx - 6, cy);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // Fringe edges
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = colors[1];
      ctx.fillRect(2 + Math.random() * 8, Math.random() * 256, 2, 4);
      ctx.fillRect(246 - Math.random() * 8, Math.random() * 256, 2, 4);
    }

    const texture = new THREE.CanvasTexture(c);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [colors]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshPhysicalMaterial map={canvas} roughness={0.9} metalness={0} />
    </mesh>
  );
}


export function Curtains({ width = 3.6, height = 2.4, color = '#d4c5b0' }) {
  const leftRef = useRef();
  const rightRef = useRef();

  useFrame((state) => {
    if (!leftRef.current || !rightRef.current) return;
    const t = state.clock.elapsedTime;
    // Sway in opposite directions with slight offset for natural feel
    const leftSway = Math.sin(t * 0.5) * 0.025;
    const rightSway = Math.sin(t * 0.5 + 1.8) * 0.025;
    leftRef.current.position.z = -1.7 + leftSway;
    leftRef.current.rotation.y = Math.sin(t * 0.4 + 0.5) * 0.02;
    rightRef.current.position.z = -1.7 + rightSway;
    rightRef.current.rotation.y = Math.sin(t * 0.4 + 2.3) * 0.02;
  });

  return (
    <group position={[0, height / 2, -1.7]}>
      {/* Curtain rod (static) */}
      <mesh position={[0, height / 2 + 0.05, 0]}>
        <cylinderGeometry args={[0.015, 0.015, width * 0.7, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#888" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Left curtain - animated group */}
      <group ref={leftRef} position={[-width / 4, 0, 0]}>
        <mesh>
          <planeGeometry args={[width / 2.5, height]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.9}
            metalness={0}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
      {/* Right curtain - animated group */}
      <group ref={rightRef} position={[width / 4, 0, 0]}>
        <mesh>
          <planeGeometry args={[width / 2.5, height]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.9}
            metalness={0}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    </group>
  );
}


const LEAF_ANGLES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
const LEAF_POSITIONS = LEAF_ANGLES.map((angle, i) => ({
  x: Math.cos(angle) * 0.08,
  y: 0.25 + (i * 0.0125),
  z: Math.sin(angle) * 0.08,
  rotX: 0.3 + (i * 0.0375),
  radius: 0.04 + (i * 0.00375)
}));
const TALL_LEAVES = [0.2, 1.8, 3.2].map((angle, i) => ({
  x: Math.cos(angle) * 0.06,
  z: Math.sin(angle) * 0.06
}));

export function Plant({ position = [1.4, 0, 1.0], scale = 0.8 }) {
  return (
    <group position={position} scale={scale}>
      {/* Pot */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.2]} />
        <meshPhysicalMaterial color="#8B4513" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Pot rim */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <torusGeometry args={[0.1, 0.015, 8, 16]} />
        <meshPhysicalMaterial color="#7a3a10" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.02]} />
        <meshPhysicalMaterial color="#3a2a1a" roughness={1} metalness={0} />
      </mesh>
      {/* Leaves - deterministic positions */}
      {LEAF_POSITIONS.map((leaf, i) => (
        <mesh
          key={i}
          position={[leaf.x, leaf.y, leaf.z]}
          rotation={[leaf.rotX, LEAF_ANGLES[i], 0]}
          castShadow
        >
          <sphereGeometry args={[leaf.radius, 6, 6]} />
          <meshPhysicalMaterial color="#2d5a27" roughness={0.8} metalness={0} />
        </mesh>
      ))}
      {/* Taller leaves */}
      {TALL_LEAVES.map((leaf, i) => (
        <mesh
          key={`tall-${i}`}
          position={[leaf.x, 0.35, leaf.z]}
          rotation={[0.5, [0.2, 1.8, 3.2][i], 0.2]}
          castShadow
        >
          <coneGeometry args={[0.03, 0.12, 6]} />
          <meshPhysicalMaterial color="#3a7a33" roughness={0.8} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}


export function createWallTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#f5f0eb';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const alpha = 0.015 + Math.random() * 0.03;
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, 1 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 256;
    ctx.strokeStyle = `rgba(0,0,0,${0.003 + Math.random() * 0.008})`;
    ctx.lineWidth = 2 + Math.random() * 4;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

export const wallTexture = createWallTexture();


export function OutdoorScene({ depth = 3.5 }) {
  const skyRef = useRef();

  // Animate clouds slowly drifting
  useFrame((state) => {
    if (!skyRef.current) return;
    skyRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.5;
  });

  return (
    <group position={[0, 0, -depth / 2 - 0.5]}>
      {/* ── Procedural Sky with sun ── */}
      <group ref={skyRef}>
        <Sky
          distance={30}
          sunPosition={[5, 8, -10]}
          inclination={0.6}
          azimuth={0.25}
          turbidity={2}
          rayleigh={0.5}
          mieCoefficient={0.005}
          mieDirectionalG={0.7}
        />
      </group>

      {/* ── Sun disk ── */}
      <mesh position={[8, 10, -8]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial color="#fffbe8" />
      </mesh>

      {/* ── Neighborhood ground (light pavement / grass mix) ── */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshPhysicalMaterial
          color="#8a9a7a"
          roughness={0.95}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Road ── */}
      <mesh position={[0, -0.09, -3.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 2.0]} />
        <meshPhysicalMaterial color="#555" roughness={0.95} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* ── House 1 (left) ── */}
      <group position={[-2.2, 0, -1.5]}>
        {/* Main body */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.6, 1.2]} />
          <meshPhysicalMaterial color="#e8c8a0" roughness={0.8} metalness={0} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 1.7, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[1.2, 0.7, 4]} />
          <meshPhysicalMaterial color="#c04040" roughness={0.7} metalness={0} />
        </mesh>
        {/* Windows */}
        {[[-0.35, 0.8, 0.61], [0.35, 0.8, 0.61]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <planeGeometry args={[0.25, 0.3]} />
            <meshPhysicalMaterial color="#aaccee" emissive="#4466aa" emissiveIntensity={0.1} roughness={0.1} metalness={0.2} />
          </mesh>
        ))}
        {/* Door */}
        <mesh position={[0, 0.35, 0.61]}>
          <planeGeometry args={[0.3, 0.5]} />
          <meshPhysicalMaterial color="#6b3a1a" roughness={0.8} metalness={0} />
        </mesh>
        {/* Chimney */}
        <mesh position={[0.5, 1.4, 0]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.15]} />
          <meshPhysicalMaterial color="#8a6a5a" roughness={0.8} metalness={0} />
        </mesh>
      </group>

      {/* ── House 2 (right) ── */}
      <group position={[2.8, 0, -2.0]}>
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 1.4, 1.0]} />
          <meshPhysicalMaterial color="#c8b898" roughness={0.8} metalness={0} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 1.5, 0]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[1.1, 0.6, 4]} />
          <meshPhysicalMaterial color="#5a6a7a" roughness={0.7} metalness={0} />
        </mesh>
        {/* Windows */}
        {[[-0.25, 0.7, 0.51], [0.25, 0.7, 0.51], [-0.25, 0.25, 0.51], [0.25, 0.25, 0.51]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <planeGeometry args={[0.18, 0.2]} />
            <meshPhysicalMaterial color="#ddeeff" emissive="#4466aa" emissiveIntensity={0.08} roughness={0.1} metalness={0.2} />
          </mesh>
        ))}
        {/* Door */}
        <mesh position={[0, 0.3, 0.51]}>
          <planeGeometry args={[0.25, 0.45]} />
          <meshPhysicalMaterial color="#5a2d0e" roughness={0.8} metalness={0} />
        </mesh>
      </group>

      {/* ── House 3 (far background, larger) ── */}
      <group position={[-0.5, 0, -4.5]} scale={0.7}>
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.2, 1.0]} />
          <meshPhysicalMaterial color="#e0d0c0" roughness={0.8} metalness={0} />
        </mesh>
        {/* Flat roof with railing */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.9, 0.08, 1.1]} />
          <meshPhysicalMaterial color="#888" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Many windows */}
        {[[-0.5, 0.6, 0.51], [0.5, 0.6, 0.51], [-0.5, 0.2, 0.51], [0.5, 0.2, 0.51], [0, 0.6, 0.51]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <planeGeometry args={[0.15, 0.18]} />
            <meshPhysicalMaterial color="#ffeedd" emissive="#ffcc88" emissiveIntensity={0.05} roughness={0.1} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ── A few trees (small, residential) ── */}
      <group position={[-3.8, 0, -2.5]} scale={0.5}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.0]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.9} metalness={0} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshPhysicalMaterial color="#4a8a43" roughness={0.9} metalness={0} />
        </mesh>
      </group>

      <group position={[4.2, 0, -1.5]} scale={0.4}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.0]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.9} metalness={0} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshPhysicalMaterial color="#3a7a33" roughness={0.9} metalness={0} />
        </mesh>
      </group>

      {/* ── Clouds ── */}
      {[[-1, 4, -2], [2, 4.5, -3], [-3, 3.8, -4], [3.5, 4.2, -1]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.3 + i * 0.05, 8, 8]} />
            <meshPhysicalMaterial color="#fff" transparent opacity={0.4} roughness={0.8} metalness={0} />
          </mesh>
          <mesh position={[0.25, -0.05, 0]}>
            <sphereGeometry args={[0.2 + i * 0.03, 8, 8]} />
            <meshPhysicalMaterial color="#fff" transparent opacity={0.35} roughness={0.8} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* ── Light from sun hitting the room ── */}
      <directionalLight
        position={[8, 12, -5]}
        intensity={0.4}
        color="#fff8e8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </group>
  );
}


