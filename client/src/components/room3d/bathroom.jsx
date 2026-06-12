import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CeilingLight } from './shared';

export function BathroomFurniture() {
  return (
    <group>
      {/* ── Sink / Washbasin ── */}
      <group position={[0.3, 0.3, -1.2]} castShadow>
        {/* Cabinet */}
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.45, 0.4, 0.35]} />
          <meshPhysicalMaterial color="#e8dcc8" roughness={0.8} metalness={0} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.48, 0.03, 0.38]} />
          <meshPhysicalMaterial color="#ddd" roughness={0.4} metalness={0} />
        </mesh>
        {/* Basin */}
        <mesh position={[0, 0.43, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.03]} />
          <meshPhysicalMaterial color="#fff" roughness={0.1} metalness={0} />
        </mesh>
        {/* Tap */}
        <mesh position={[0, 0.48, 0.08]}>
          <cylinderGeometry args={[0.008, 0.01, 0.06]} rotation={[0.4, 0, 0]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.48, 0.02]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Mirror */}
        <mesh position={[0, 0.65, -0.16]}>
          <planeGeometry args={[0.3, 0.35]} />
          <meshPhysicalMaterial
            color="#aaddff"
            transparent
            opacity={0.3}
            roughness={0.02}
            metalness={0.9}
          />
        </mesh>
        {/* Soap dispenser */}
        <mesh position={[0.15, 0.46, -0.05]}>
          <cylinderGeometry args={[0.02, 0.025, 0.06]} />
          <meshPhysicalMaterial color="#ffaa88" roughness={0.4} metalness={0} />
        </mesh>
      </group>

      {/* ── Bucket & Mug ── */}
      <group position={[-0.6, 0, 0.4]} castShadow>
        {/* Bucket */}
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.24]} />
          <meshPhysicalMaterial
            color="#66aadd"
            transparent
            opacity={0.5}
            roughness={0.2}
            metalness={0}
          />
        </mesh>
        {/* Bucket rim */}
        <mesh position={[0, 0.24, 0]}>
          <torusGeometry args={[0.18, 0.012, 6, 16]} />
          <meshPhysicalMaterial color="#5599cc" transparent opacity={0.6} roughness={0.3} metalness={0} />
        </mesh>
        {/* Mug */}
        <mesh position={[0.25, 0.06, 0.15]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.12]} />
          <meshPhysicalMaterial color="#ff6666" roughness={0.5} metalness={0} />
        </mesh>
        {/* Mug handle */}
        <mesh position={[0.3, 0.12, 0.15]}>
          <torusGeometry args={[0.025, 0.005, 4, 8]} rotation={[0, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#ff6666" roughness={0.5} metalness={0} />
        </mesh>
      </group>

      {/* ── Toilet ── */}
      <group position={[-1.0, 0, -0.5]} castShadow>
        {/* Tank */}
        <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.25, 0.4, 0.18]} />
          <meshPhysicalMaterial color="#f0f0f0" roughness={0.3} metalness={0} />
        </mesh>
        {/* Bowl */}
        <mesh position={[0, 0.1, 0.3]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshPhysicalMaterial color="#f0f0f0" roughness={0.3} metalness={0} />
        </mesh>
        {/* Seat */}
        <mesh position={[0, 0.15, 0.3]}>
          <torusGeometry args={[0.08, 0.015, 6, 12]} />
          <meshPhysicalMaterial color="#eee" roughness={0.4} metalness={0} />
        </mesh>
        {/* Flush button */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.02, 0.022, 0.01]} />
          <meshPhysicalMaterial color="#888" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>

      {/* ── Towel rack ── */}
      <group position={[-1.2, 0.6, -1.35]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.3]} rotation={[0, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#888" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Towel */}
        <mesh position={[0.12, -0.04, 0]}>
          <planeGeometry args={[0.04, 0.2]} />
          <meshPhysicalMaterial color="#aaddff" roughness={0.9} metalness={0} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── Tiles on floor - subtle grid pattern ── */}
      {/* ── Small shelf ── */}
      <group position={[1.0, 0.4, -1.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.1]} />
          <meshPhysicalMaterial color="#e8dcc8" roughness={0.7} metalness={0} />
        </mesh>
        {/* Toiletries */}
        <mesh position={[-0.05, 0.04, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.06]} />
          <meshPhysicalMaterial color="#4488ff" roughness={0.4} metalness={0} />
        </mesh>
        <mesh position={[0.06, 0.04, 0]}>
          <cylinderGeometry args={[0.012, 0.015, 0.04]} />
          <meshPhysicalMaterial color="#ffaa44" roughness={0.4} metalness={0} />
        </mesh>
      </group>

      {/* ── Bathroom exhaust / ventilation window ── */}
      <mesh position={[0.5, 0.8, -1.42]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshPhysicalMaterial color="#b8dce8" transparent opacity={0.3} roughness={0.1} metalness={0} />
      </mesh>

      {/* ── Ceiling Light ── */}
      <CeilingLight position={[0, 2.68, 0]} />

      {/* ── Bathroom mat ── */}
      <mesh position={[0.3, 0.003, 0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.5, 0.35]} />
        <meshPhysicalMaterial color="#c08080" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}


