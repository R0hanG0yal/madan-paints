import { useMemo, Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Edges,
  RoundedBox,
  Sky,
  Html
} from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping, Vignette } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { Room3DLoadingProgress, StaticLoadingBar } from './LoadingProgressBar';
import {
  Baseboards, CrownMolding, Window, Door, PictureFrame,
  CeilingLight, FloorLamp, Rug, Curtains, Plant,
  createWallTexture, wallTexture, OutdoorScene
} from './room3d/shared';
import { LivingRoomFurniture } from './room3d/living-room';
import { BedroomFurniture } from './room3d/bedroom';
import { KitchenFurniture } from './room3d/kitchen';
import { BathroomFurniture } from './room3d/bathroom';
import { HomeOfficeFurniture } from './room3d/home-office';
import { KidsRoomFurniture } from './room3d/kids-room';
import { DiningRoomFurniture } from './room3d/dining-room';

const ROOM_CONFIGS = {
  'living-room': {
    wallSize: { w: 5, h: 2.8, d: 3.5 },
    label: 'Living Room'
  },
  'bedroom': {
    wallSize: { w: 4.5, h: 2.8, d: 3.5 },
    label: 'Bedroom'
  },
  'kitchen': {
    wallSize: { w: 4, h: 2.8, d: 3 },
    label: 'Kitchen'
  },
  'bathroom': {
    wallSize: { w: 3, h: 2.8, d: 2.5 },
    label: 'Bathroom'
  },
  'home-office': {
    wallSize: { w: 4, h: 2.8, d: 3 },
    label: 'Home Office'
  },
  'kids-room': {
    wallSize: { w: 4, h: 2.8, d: 3 },
    label: "Kids' Room"
  },
  'dining-room': {
    wallSize: { w: 4.5, h: 2.8, d: 3.5 },
    label: 'Dining Room'
  }
};

// ─── Crown Molding ───
// ─── Window with Frame and Glass (clear view through) ───
// ─── Door ───
// ─── Picture Frame ───
// ─── Ceiling Light with gentle pendulum swing ───
// ─── Floor Lamp ───
// ─── Rug (Dhurrie) ───
// ─── Curtains with gentle swaying animation ───
// ─── Deterministic Plant (no Math.random in render) ───
// ─── Living Room Furniture ───
// ─── Bedroom Furniture ───
// ─── Kitchen Furniture (completely overhauled for realistic Indian kitchen) ───
// ─── Bathroom Furniture ───
// ─── Procedural Plaster Wall Texture helper (no hooks, so it's safe at module level) ───
// ─── Loading progress bar for 3D scene initialization ───

// ─── Home Office Furniture ───
// ─── Kids Room Furniture ───
// ─── Residential Neighborhood visible through the window (homes, not park) ───
// ─── House Exterior with 7 room windows (entrance view) ───
function HouseExterior({ wallColors, selectedRoom, onRoomEnter, onBack }) {
  const ROOM_SLOTS = [
    { id: 'living-room', label: 'Living Room', icon: '🛋️', x: -3.6, color: wallColors.back || '#E8E0D8' },
    { id: 'bedroom', label: 'Bedroom', icon: '🛏️', x: -2.1, color: wallColors.back || '#E8E0D8' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳', x: -0.6, color: wallColors.back || '#E8E0D8' },
    { id: 'bathroom', label: 'Bathroom', icon: '🛁', x: 0.9, color: wallColors.back || '#E8E0D8' },
    { id: 'home-office', label: 'Office', icon: '💼', x: 2.4, color: wallColors.back || '#E8E0D8' },
    { id: 'kids-room', label: "Kids'", icon: '🧸', x: 3.9, color: wallColors.back || '#E8E0D8' },
    { id: 'dining-room', label: 'Dining', icon: '🍽️', x: 5.4, color: wallColors.back || '#E8E0D8' }
  ];

  return (
    <group>
      {/* Minimal lighting for exterior */}
      <ambientLight intensity={0.6} color="#fff8f0" />
      <directionalLight position={[3, 5, 5]} intensity={0.8} color="#fff8e8" castShadow />

      {/* ── House Main Body ── */}
      <group position={[0.9, 0, 0]}>
        {/* Main wall */}
        <mesh position={[0, 1.5, -0.02]} receiveShadow castShadow>
          <boxGeometry args={[11, 3, 0.1]} />
          <meshPhysicalMaterial color="#f0e8dc" roughness={0.85} metalness={0} />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 3.1, 0.3]} rotation={[0, 0, 0]} castShadow>
          <coneGeometry args={[6.5, 1.2, 4]} />
          <meshPhysicalMaterial color="#8a3a3a" roughness={0.7} metalness={0} />
        </mesh>

        {/* Roof ridge */}
        <mesh position={[0, 3.6, 0.3]} castShadow>
          <boxGeometry args={[11.5, 0.08, 2.5]} />
          <meshPhysicalMaterial color="#7a2a2a" roughness={0.8} metalness={0} />
        </mesh>

        {/* Second floor strip */}
        <mesh position={[0, 2.5, -0.02]}>
          <boxGeometry args={[10.5, 0.06, 0.12]} />
          <meshPhysicalMaterial color="#e8ddd0" roughness={0.8} metalness={0} />
        </mesh>

        {/* ── Room Windows/Sections ── */}
        {ROOM_SLOTS.map((slot, i) => {
          const isSelected = selectedRoom === slot.id;
          // Alternate rows: first 4 on bottom, last 3 on top
          const row = i < 4 ? 0 : 1;
          const colIndex = i < 4 ? i : i - 4;
          const rowOffset = row === 0 ? 0.75 : 1.95;
          const colSpacing = 2.3;
          const startX = -3.45 + colIndex * colSpacing;

          return (
            <group key={slot.id}>
              {/* Window frame */}
              <mesh
                position={[startX, rowOffset, 0.03]}
                onClick={(e) => { e.stopPropagation(); onRoomEnter(slot.id); }}
              >
                <planeGeometry args={[1.5, 1.2]} />
                <meshPhysicalMaterial
                  color={isSelected ? '#ffcc88' : '#aaccee'}
                  emissive={isSelected ? '#ffcc88' : '#000'}
                  emissiveIntensity={isSelected ? 0.3 : 0}
                  transparent
                  opacity={0.6}
                  roughness={0.1}
                  metalness={0.1}
                />
              </mesh>
              {/* Window border */}
              <mesh position={[startX, rowOffset, 0.02]}>
                <planeGeometry args={[1.6, 1.3]} />
                <meshPhysicalMaterial
                  color={isSelected ? '#6b3a1a' : '#e8ddd0'}
                  transparent
                  opacity={0.8}
                  roughness={0.7}
                  metalness={0}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Window cross bars */}
              <mesh position={[startX, rowOffset, 0.035]}>
                <planeGeometry args={[0.02, 1.0]} />
                <meshBasicMaterial color="#ddd" transparent opacity={0.5} />
              </mesh>
              <mesh position={[startX, rowOffset, 0.035]}>
                <planeGeometry args={[1.3, 0.02]} />
                <meshBasicMaterial color="#ddd" transparent opacity={0.5} />
              </mesh>
              {/* Room label below window */}
              <Html position={[startX, rowOffset - 0.85, 0.1]} center>
                <div style={{
                  fontSize: '10px',
                  color: isSelected ? '#800020' : '#555',
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #800020' : 'none'
                }}>
                  {slot.icon} {slot.label}
                </div>
              </Html>
            </group>
          );
        })}

        {/* ── Front Door ── */}
        <group position={[0.9, 0, 0]}> {/* offset to center align with main wall */}
          <mesh position={[0, 0.7, 0.04]}>
            <planeGeometry args={[1.2, 1.6]} />
            <meshPhysicalMaterial color="#6b3a1a" roughness={0.8} metalness={0} side={THREE.DoubleSide} />
          </mesh>
          {/* Door frame */}
          <mesh position={[0, 0.7, 0.03]}>
            <planeGeometry args={[1.3, 1.7]} />
            <meshPhysicalMaterial
              color="#e8ddd0"
              transparent
              opacity={0.4}
              roughness={0.8}
              metalness={0}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Door handle */}
          <mesh position={[0.38, 0.7, 0.07]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Door step */}
          <mesh position={[0, -0.05, 0.06]}>
            <boxGeometry args={[1.4, 0.05, 0.15]} />
            <meshPhysicalMaterial color="#999" roughness={0.8} metalness={0.1} />
          </mesh>
          {/* Welcome sign */}
          <Html position={[0, 1.7, 0.1]} center>
            <div style={{
              fontSize: '9px',
              color: '#fff',
              background: '#800020',
              padding: '2px 10px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
              🏠 MADAN PAINTS HOME
            </div>
          </Html>
        </group>

        {/* ── House Number ── */}
        <Html position={[-4.8, 2.2, 0.1]} center>
          <div style={{
            fontSize: '11px',
            color: '#555',
            fontWeight: 700,
            fontStyle: 'italic',
            fontFamily: 'serif'
          }}>
            Click a room to enter
          </div>
        </Html>

      </group>





    </group>
  );
}

// ─── Animated Camera Controller (handles entrance animation) ───
function EntranceCamera({ phase, targetRoom = 'living-room', onEnterComplete }) {
  const controlsRef = useRef();
  const progressRef = useRef({ startTime: 0, startPos: [0, 2.5, 8], endPos: [4.5, 3.5, 6] });
  const animationDoneRef = useRef(false);
  const prevPhaseRef = useRef('exterior');

  const ROOM_CAM_POSITIONS = {
    'living-room': [0.8, 1.8, 1.5],
    'bedroom': [0.8, 1.8, 1.5],
    'kitchen': [0.6, 1.8, 1.3],
    'bathroom': [0.4, 1.6, 1.1],
    'home-office': [0.6, 1.8, 1.3],
    'kids-room': [0.6, 1.6, 1.3],
    'dining-room': [0.8, 1.8, 1.5]
  };

  useFrame((state) => {
    if (!controlsRef.current) return;
    const camera = state.camera;

    // Track phase transitions for ref reset
      if (prevPhaseRef.current !== phase) {
        prevPhaseRef.current = phase;
        if (phase === 'entering') {
          const now = state.clock.elapsedTime;
          const roomPos = ROOM_CAM_POSITIONS[targetRoom] || [0.8, 1.8, 1.5];
          progressRef.current = {
            startTime: now,
            startPos: [0.9, 2.0, 4.5],
            endPos: roomPos,
          };
          animationDoneRef.current = false;
        }
      }

    if (phase === 'exterior') {
      // Free orbit around the house
      controlsRef.current.target.set(0.9, 1.5, 0);
      controlsRef.current.update();
    } else if (phase === 'entering') {
      const now = state.clock.elapsedTime;

      const elapsed = now - progressRef.current.startTime;
      const duration = 0.5; // Fast entrance
      let t = Math.min(elapsed / duration, 1);
      // Smooth ease-in-out
      t = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const sx = progressRef.current.startPos[0];
      const sy = progressRef.current.startPos[1];
      const sz = progressRef.current.startPos[2];
      const ex = progressRef.current.endPos[0];
      const ey = progressRef.current.endPos[1];
      const ez = progressRef.current.endPos[2];

      camera.position.set(
        sx + (ex - sx) * t,
        sy + (ey - sy) * t,
        sz + (ez - sz) * t
      );
      controlsRef.current.target.set(0, 1.3, 0);
      controlsRef.current.update();

      if (t >= 1 && !animationDoneRef.current) {
        animationDoneRef.current = true;
        if (onEnterComplete) onEnterComplete();
      }
    } else {
      // Normal orbit inside room
      controlsRef.current.target.set(0, 1.3, 0);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={phase !== 'entering'}
      enableZoom={phase !== 'entering'}
      enableRotate={phase !== 'entering'}
      minDistance={2}
      maxDistance={12}
      target={phase === 'exterior' ? [0.9, 1.5, 0] : [0, 1.3, 0]}
      dampingFactor={0.08}
      enableDamping={true}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
      panSpeed={0.5}
    />
  );
}

// ─── Dining Room Furniture ───
// ─── Main Room Component ───
function Room({ wallColors, selectedWall, onWallClick, currentPreset }) {
  const config = ROOM_CONFIGS[currentPreset] || ROOM_CONFIGS['living-room'];
  const { w, h, d } = config.wallSize;

  const walls = useMemo(() => [
    { id: 'back', label: 'Back Wall', position: [0, h / 2, -d / 2], size: [w, h], rotation: [0, 0, 0] },
    { id: 'left', label: 'Left Wall', position: [-w / 2, h / 2, 0], size: [d, h], rotation: [0, Math.PI / 2, 0] },
    { id: 'right', label: 'Right Wall', position: [w / 2, h / 2, 0], size: [d, h], rotation: [0, -Math.PI / 2, 0] },
    { id: 'floor', label: 'Floor', position: [0, 0, 0], size: [w, d], rotation: [-Math.PI / 2, 0, 0] },
    { id: 'ceiling', label: 'Ceiling', position: [0, h, 0], size: [w, d], rotation: [Math.PI / 2, 0, 0] }
  ], [w, h, d]);

  const adjustColor = (hex, amount) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const getWallColor = (id, base) => {
    switch (id) {
      case 'back': return base;
      case 'left': return adjustColor(base, -20);
      case 'right': return adjustColor(base, -35);
      case 'floor': return adjustColor(base, -50);
      case 'ceiling': return adjustColor(base, 5);
      default: return base;
    }
  };

  const WINDOW_WIDTH = 1.2;
  const WINDOW_HEIGHT = 1.6;
  const WINDOW_CENTER_Y = 1.4;

  // Back wall panels that create a window opening
  const backWallPanels = useMemo(() => {
    const topH = h - (WINDOW_CENTER_Y + WINDOW_HEIGHT / 2);
    const bottomH = WINDOW_CENTER_Y - WINDOW_HEIGHT / 2;
    const sideW = (w - WINDOW_WIDTH) / 2;
    return [
      // Top panel
      { id: 'back-top', position: [0, h - topH / 2, -d / 2], size: [w, topH] },
      // Bottom panel
      { id: 'back-bottom', position: [0, bottomH / 2, -d / 2], size: [w, bottomH] },
      // Left panel
      { id: 'back-left', position: [-(w / 2) + sideW / 2, WINDOW_CENTER_Y, -d / 2], size: [sideW, WINDOW_HEIGHT] },
      // Right panel
      { id: 'back-right', position: [w / 2 - sideW / 2, WINDOW_CENTER_Y, -d / 2], size: [sideW, WINDOW_HEIGHT] }
    ];
  }, [w, h, d]);

  return (
    <group>
      {/* ── Main lighting ── */}
      <ambientLight intensity={0.3} color="#fff8f0" />
      <hemisphereLight
        args={["#ffffff", "#444444", 0.6]}
        position={[0, 5, 0]}
      />

      {/* Key light - warm, from window direction */}
      <directionalLight
        position={[0, 5, 4]}
        intensity={1.2}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={10}
        shadow-camera-near={0.1}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.001}
      />

      {/* Fill light */}
      <directionalLight
        position={[-3, 3, -2]}
        intensity={0.4}
        color="#d4e8ff"
      />

      {/* Rim light */}
      <directionalLight
        position={[3, 4, -3]}
        intensity={0.3}
        color="#fff"
      />

      {/* Warm accent light */}
      <pointLight position={[0, 2.5, 0]} intensity={0.2} color="#ffe082" distance={5} />

      {/* ── Back wall with window opening (4 panels) ── */}
      {backWallPanels.map((panel) => {
        const color = getWallColor('back', wallColors.back || '#E8E0D8');
        const isSelected = selectedWall === 'back';

        return (
          <mesh
            key={panel.id}
            position={panel.position}
            rotation={[0, 0, 0]}
            onClick={(e) => { e.stopPropagation(); onWallClick('back'); }}
            receiveShadow
          >
            <planeGeometry args={panel.size} />
            <meshPhysicalMaterial
              color={color}
              map={wallTexture}
              roughness={0.85}
              metalness={0}
              side={THREE.DoubleSide}
              emissive={isSelected ? color : '#000000'}
              emissiveIntensity={isSelected ? 0.12 : 0}
            />
            {isSelected && <Edges color="#800020" lineWidth={2} />}
          </mesh>
        );
      })}

      {/* ── Other walls (left, right, floor, ceiling) ── */}
      {walls.filter(w => w.id !== 'back').map((wall) => {
        const color = getWallColor(wall.id, wallColors[wall.id] || '#E8E0D8');
        const isSelected = selectedWall === wall.id;
        const isFloor = wall.id === 'floor';
        const isCeiling = wall.id === 'ceiling';

        return (
          <mesh
            key={wall.id}
            position={wall.position}
            rotation={wall.rotation}
            onClick={(e) => { e.stopPropagation(); onWallClick(wall.id); }}
            receiveShadow
            castShadow={!isCeiling}
          >
            <planeGeometry args={wall.size} />
            {isFloor ? (
              <meshPhysicalMaterial
                color={color}
                roughness={0.6}
                metalness={0}
                side={THREE.DoubleSide}
              />
            ) : isCeiling ? (
              <meshPhysicalMaterial
                color={color}
                roughness={0.9}
                metalness={0}
                side={THREE.DoubleSide}
              />
            ) : (
              <meshPhysicalMaterial
                color={color}
                map={wallTexture}
                roughness={0.85}
                metalness={0}
                side={THREE.DoubleSide}
                emissive={isSelected ? color : '#000000'}
                emissiveIntensity={isSelected ? 0.12 : 0}
              />
            )}
            {isSelected && <Edges color="#800020" lineWidth={2} />}
          </mesh>
        );
      })}

      {/* ── Architectural Details ── */}
      <Baseboards w={w} d={d} color={adjustColor(wallColors.back || '#E8E0D8', -20)} />
      <CrownMolding w={w} d={d} color={adjustColor(wallColors.back || '#E8E0D8', 10)} />

      {/* ── Outdoor scene visible through the window ── */}
      <OutdoorScene depth={d} />

      {/* ── Window ── */}
      <Window position={[0, 1.4, -d / 2 + 0.02]} width={1.2} height={1.6} />

      {/* ── Door ── */}
      <Door position={[w / 2 - 0.42, 0, 0.6]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ── Room-specific furniture ── */}
      {currentPreset === 'living-room' && <LivingRoomFurniture />}
      {currentPreset === 'bedroom' && <BedroomFurniture />}
      {currentPreset === 'kitchen' && <KitchenFurniture />}
      {currentPreset === 'bathroom' && <BathroomFurniture />}
      {currentPreset === 'home-office' && <HomeOfficeFurniture />}
      {currentPreset === 'kids-room' && <KidsRoomFurniture />}
      {currentPreset === 'dining-room' && <DiningRoomFurniture />}


    </group>
  );
}

// ─── Post-processing effects ───
function PostProcessing() {
  return (
    <EffectComposer>
      {/* Subtle bloom for emissive materials (light bulbs) */}
      <Bloom
        blendFunction={BlendFunction.ADD}
        intensity={0.6}
        luminanceThreshold={1.5}
        luminanceSmoothing={0.1}
        mipmapBlur
      />

      {/* Tone mapping for better color reproduction */}
      <ToneMapping
        mode={ToneMappingMode.ACES_FILMIC}
        exposure={0.9}
      />
      {/* Subtle vignette for cinematic feel */}
      <Vignette
        offset={0.3}
        darkness={0.3}
        eskil={false}
      />
    </EffectComposer>
  );
}

// ─── Main Exported Component (with House Entrance) ───
export default function Room3D({ wallColors, selectedWall, onWallClick, currentPreset = 'living-room' }) {
  const [phase, setPhase] = useState('exterior'); // 'exterior' | 'entering' | 'room'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activePreset, setActivePreset] = useState(currentPreset);
  const initialPreset = useRef(currentPreset);

  // When visualizer preset bar changes, skip exterior and go directly to that room
  // Compare to initial preset value to handle both normal mount and StrictMode double-invoke safely
  useEffect(() => {
    if (currentPreset === initialPreset.current) {
      return;
    }
    setPhase('room');
    setSelectedRoom(currentPreset);
    setActivePreset(currentPreset);
  }, [currentPreset]);

  const handleRoomEnter = useCallback((roomId) => {
    setSelectedRoom(roomId);
    setPhase('entering');
  }, []);

  const handleEnterComplete = useCallback(() => {
    setPhase('room');
    setActivePreset(selectedRoom);
  }, [selectedRoom]);

  const handleBackToExterior = useCallback(() => {
    setPhase('exterior');
    setSelectedRoom(null);
    setActivePreset(currentPreset);
  }, [currentPreset]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '8px', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0.9, 2.5, 7], fov: 45, near: 0.1, far: 20 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace,
          shadows: true
        }}
        style={{ width: '100%', height: '420px' }}
        shadows
      >
      <Suspense fallback={<StaticLoadingBar />}>
        {/* Real-time progress tracker inside Canvas so useProgress works */}
        <Room3DLoadingProgress />


          {phase === 'exterior' && (
            <HouseExterior
              wallColors={wallColors}
              selectedRoom={selectedRoom}
              onRoomEnter={handleRoomEnter}
              onBack={handleBackToExterior}
            />
          )}

          {(phase === 'entering' || phase === 'room') && (
            <Room
              wallColors={wallColors}
              selectedWall={selectedWall}
              onWallClick={onWallClick}
              currentPreset={selectedRoom || activePreset}
            />
          )}

          <EntranceCamera
            phase={phase}
            targetRoom={selectedRoom || activePreset}
            onEnterComplete={handleEnterComplete}
          />
          <PostProcessing />
        </Suspense>
      </Canvas>

      {/* Back button overlay when inside a room */}
      {phase === 'room' && (
        <button
          onClick={handleBackToExterior}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(155,27,48,0.85)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backdropFilter: 'blur(4px)'
          }}
        >
          ← Exit Room
        </button>
      )}

      {/* Hint text */}
      {phase === 'exterior' && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '11px',
            color: '#666',
            background: 'rgba(255,255,255,0.8)',
            padding: '3px 10px',
            borderRadius: '10px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          🏠 Click a room window to enter · Drag to orbit
        </div>
      )}
      {phase === 'room' && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '11px',
            color: '#666',
            background: 'rgba(255,255,255,0.8)',
            padding: '3px 10px',
            borderRadius: '10px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
        >
          Drag to orbit · Scroll to zoom · Exit Room to browse all rooms
        </div>
      )}
    </div>
  );
}
