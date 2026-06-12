import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CeilingLight, Rug } from './shared';

export function KidsRoomFurniture() {
  return (
    <group>
      {/* ── Smaller Bed ── */}
      <group position={[0, 0, 0.7]} castShadow>
        <mesh position={[0, 0.16, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 0.16, 1.2]} />
          <meshPhysicalMaterial color="#5a8a5a" roughness={0.8} metalness={0} />
        </mesh>
        <mesh position={[0, 0.28, 0]} castShadow>
          <RoundedBox args={[1.2, 0.1, 1.1]} radius={0.03} smoothness={4}>
            <meshPhysicalMaterial color="#ffe" roughness={0.95} metalness={0} />
          </RoundedBox>
        </mesh>
        <mesh position={[-0.35, 0.36, -0.4]} castShadow>
          <RoundedBox args={[0.3, 0.06, 0.25]} radius={0.03} smoothness={4}>
            <meshPhysicalMaterial color="#ffdd00" roughness={0.9} metalness={0} />
          </RoundedBox>
        </mesh>
        <mesh position={[0.35, 0.36, -0.4]} castShadow>
          <RoundedBox args={[0.3, 0.06, 0.25]} radius={0.03} smoothness={4}>
            <meshPhysicalMaterial color="#ff6644" roughness={0.9} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Stuffed toy */}
        <mesh position={[0.4, 0.34, 0.4]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshPhysicalMaterial color="#c08060" roughness={0.9} metalness={0} />
        </mesh>
        <mesh position={[0.38, 0.38, 0.4]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshPhysicalMaterial color="#333" />
        </mesh>
        <mesh position={[0.42, 0.38, 0.4]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshPhysicalMaterial color="#333" />
        </mesh>
      </group>

      {/* ── Toy Box ── */}
      <group position={[1.4, 0, 0.5]} castShadow>
        <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 0.3, 0.35]} />
          <meshPhysicalMaterial color="#4488cc" roughness={0.7} metalness={0} />
        </mesh>
        {/* Lid */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.42, 0.03, 0.37]} />
          <meshPhysicalMaterial color="#5599dd" roughness={0.6} metalness={0} />
        </mesh>
        {/* Star decal */}
        <mesh position={[0, 0.15, 0.16]}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshPhysicalMaterial color="#ffdd00" roughness={0.8} metalness={0} />
        </mesh>
      </group>

      {/* ── Small Desk ── */}
      <group position={[-1.0, 0, 0.2]} castShadow>
        <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.6, 0.03, 0.4]} />
          <meshPhysicalMaterial color="#6b3a1a" roughness={0.6} metalness={0} />
        </mesh>
        {[[-0.27, 0.14, -0.17], [0.27, 0.14, -0.17], [-0.27, 0.14, 0.17], [0.27, 0.14, 0.17]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.012, 0.015, 0.28]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        {/* Crayons */}
        {[[-0.15, 0.33, 0.05], [-0.08, 0.33, 0.05], [-0.01, 0.33, 0.05], [0.06, 0.33, 0.05]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <cylinderGeometry args={[0.006, 0.008, 0.04]} />
            <meshPhysicalMaterial color={['#c04040', '#40c040', '#4040c0', '#ffdd00'][i]} roughness={0.6} metalness={0} />
          </mesh>
        ))}
      </group>

      {/* ── Small Chair ── */}
      <group position={[-1.0, 0, -0.3]} castShadow>
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.25, 0.03, 0.25]} />
          <meshPhysicalMaterial color="#6b3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {[[-0.1, 0.08, -0.1], [0.1, 0.08, -0.1], [-0.1, 0.08, 0.1], [0.1, 0.08, 0.1]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.008, 0.01, 0.16]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        <mesh position={[0, 0.3, -0.1]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.02]} />
          <meshPhysicalMaterial color="#6b3a1a" roughness={0.7} metalness={0} />
        </mesh>
      </group>

      {/* ── Wall Decals (Stars) ── */}
      {[[-1.2, 1.5, -1.45], [-0.5, 1.8, -1.45], [0.8, 1.9, -1.45], [1.4, 1.4, -1.45]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[0, 0, i * 0.8]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshPhysicalMaterial color="#ffdd00" emissive="#ffdd00" emissiveIntensity={0.2} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Ceiling Light ── */}
      <CeilingLight position={[0, 2.68, 0]} />

      {/* ── Rug ── */}
      <Rug position={[0, 0.002, 0.3]} colors={['#4080c0', '#2060a0', '#ffdd00']} size={[1.2, 1.0]} />
    </group>
  );
}


