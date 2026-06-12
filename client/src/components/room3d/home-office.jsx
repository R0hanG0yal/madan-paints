import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CeilingLight, Plant, Rug } from './shared';

export function HomeOfficeFurniture() {
  return (
    <group>
      {/* ── Desk ── */}
      <group position={[0, 0, 0.3]} castShadow>
        <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.4, 0.03, 0.6]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Legs */}
        {[[-0.65, 0.18, -0.25], [0.65, 0.18, -0.25], [-0.65, 0.18, 0.25], [0.65, 0.18, 0.25]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.015, 0.02, 0.36]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        {/* Monitor */}
        <mesh position={[0, 0.55, -0.22]} castShadow>
          <boxGeometry args={[0.5, 0.35, 0.02]} />
          <meshPhysicalMaterial color="#1a1a2e" roughness={0.2} metalness={0} />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 0.55, -0.215]}>
          <planeGeometry args={[0.46, 0.31]} />
          <meshPhysicalMaterial color="#4466aa" emissive="#4466aa" emissiveIntensity={0.2} transparent opacity={0.6} />
        </mesh>
        {/* Monitor stand */}
        <mesh position={[0, 0.38, -0.22]} castShadow>
          <boxGeometry args={[0.08, 0.02, 0.04]} />
          <meshPhysicalMaterial color="#333" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Keyboard */}
        <mesh position={[0, 0.43, 0.05]}>
          <boxGeometry args={[0.3, 0.015, 0.1]} />
          <meshPhysicalMaterial color="#333" roughness={0.4} metalness={0} />
        </mesh>
        {/* Mouse */}
        <mesh position={[0.25, 0.43, 0.08]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshPhysicalMaterial color="#444" roughness={0.3} metalness={0} />
        </mesh>
        {/* Desk lamp */}
        <mesh position={[-0.4, 0.45, -0.15]} castShadow>
          <cylinderGeometry args={[0.015, 0.02, 0.1]} />
          <meshPhysicalMaterial color="#888" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[-0.4, 0.5, -0.1]} rotation={[0.5, 0, 0]} castShadow>
          <coneGeometry args={[0.04, 0.05, 8]} />
          <meshPhysicalMaterial color="#ddd" roughness={0.7} metalness={0} />
        </mesh>
      </group>

      {/* ── Office Chair ── */}
      <group position={[0, 0, -0.45]} castShadow>
        {/* Base */}
        <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.04]} />
          <meshPhysicalMaterial color="#555" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Pole */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.02, 0.36]} />
          <meshPhysicalMaterial color="#666" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Seat */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <RoundedBox args={[0.4, 0.04, 0.4]} radius={0.02} smoothness={4}>
            <meshPhysicalMaterial color="#333" roughness={0.8} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.6, -0.18]} castShadow>
          <RoundedBox args={[0.38, 0.25, 0.03]} radius={0.02} smoothness={4}>
            <meshPhysicalMaterial color="#444" roughness={0.8} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.22, 0.42, -0.05]}>
          <RoundedBox args={[0.02, 0.02, 0.2]} radius={0.005} smoothness={4}>
            <meshPhysicalMaterial color="#555" roughness={0.5} metalness={0.3} />
          </RoundedBox>
        </mesh>
        <mesh position={[0.22, 0.42, -0.05]}>
          <RoundedBox args={[0.02, 0.02, 0.2]} radius={0.005} smoothness={4}>
            <meshPhysicalMaterial color="#555" roughness={0.5} metalness={0.3} />
          </RoundedBox>
        </mesh>
        {/* Wheels */}
        {[[-0.12, 0, -0.12], [0.12, 0, -0.12], [-0.12, 0, 0.12], [0.12, 0, 0.12], [0, 0, -0.16]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshPhysicalMaterial color="#333" roughness={0.2} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* ── Bookshelf ── */}
      <group position={[-1.8, 0.1, 0]} castShadow>
        <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.12, 1.4, 0.8]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {/* Shelves */}
        {[0.2, 0.55, 0.9, 1.25].map((y, i) => (
          <mesh key={i} position={[0.06, y, 0]} castShadow>
            <boxGeometry args={[0.06, 0.02, 0.75]} />
            <meshPhysicalMaterial color="#6b4a2a" roughness={0.6} metalness={0} />
          </mesh>
        ))}
        {/* Books */}
        {[[0.06, 0.38, -0.15], [0.06, 0.38, 0.1], [0.06, 0.73, -0.2], [0.06, 0.73, 0.05], [0.06, 1.08, -0.1]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <boxGeometry args={[0.03, 0.15 + (i * 0.02), 0.06 + (i * 0.01)]} />
            <meshPhysicalMaterial color={['#446', '#800020', '#2a5a2a', '#d4a574', '#335'][i]} roughness={0.7} metalness={0} />
          </mesh>
        ))}
      </group>

      {/* ── Notice Board ── */}
      <mesh position={[0.6, 1.1, -1.48]}>
        <planeGeometry args={[0.35, 0.35]} />
        <meshPhysicalMaterial color="#c8a060" roughness={0.8} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      {/* Pins */}
      {[[0.6, 1.15, -1.47], [0.55, 1.05, -1.47], [0.65, 1.05, -1.47]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.005, 6, 6]} />
          <meshPhysicalMaterial color={['#c04040', '#4040c0', '#40a040'][i]} />
        </mesh>
      ))}

      {/* ── Ceiling Light ── */}
      <CeilingLight position={[0, 2.68, 0]} />

      {/* ── Plant ── */}
      <Plant position={[1.6, 0, 1.0]} scale={0.7} />

      {/* ── Rug ── */}
      <Rug position={[0, 0.002, -0.1]} colors={['#4a5a6a', '#3a4a5a', '#8a9aaa']} size={[1.2, 1.0]} />
    </group>
  );
}


