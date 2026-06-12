import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CeilingLight, PictureFrame, Plant, Rug } from './shared';

export function DiningRoomFurniture() {
  return (
    <group>
      {/* ── Dining Table ── */}
      <group position={[0, 0, 0.2]} castShadow>
        <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.6, 0.04, 0.9]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Legs */}
        {[[-0.75, 0.18, -0.4], [0.75, 0.18, -0.4], [-0.75, 0.18, 0.4], [0.75, 0.18, 0.4]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.02, 0.025, 0.36]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        {/* Centerpiece - fruit bowl */}
        <mesh position={[0, 0.44, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#d4a574" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Fruits */}
        {[[-0.03, 0.47, 0.02], [0.03, 0.46, -0.02], [0, 0.48, -0.03], [-0.02, 0.46, 0.04]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshPhysicalMaterial color={['#ff6644', '#44aa44', '#ffdd00', '#ff4466'][i]} roughness={0.6} metalness={0} />
          </mesh>
        ))}
      </group>

      {/* ── Chairs ── */}
      {/* Chair 1 - top */}
      <group position={[0, 0, -0.65]} castShadow>
        <mesh position={[0, 0.22, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.35, 0.03, 0.35]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {[[-0.15, 0.1, -0.15], [0.15, 0.1, -0.15], [-0.15, 0.1, 0.15], [0.15, 0.1, 0.15]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.01, 0.012, 0.2]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        <mesh position={[0, 0.38, -0.15]} castShadow>
          <RoundedBox args={[0.34, 0.2, 0.02]} radius={0.01} smoothness={4}>
            <meshPhysicalMaterial color="#6b4a2a" roughness={0.7} metalness={0} />
          </RoundedBox>
        </mesh>
      </group>

      {/* Chair 2 - bottom */}
      <group position={[0, 0, 1.05]} rotation={[0, Math.PI, 0]} castShadow>
        <mesh position={[0, 0.22, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.35, 0.03, 0.35]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {[[-0.15, 0.1, -0.15], [0.15, 0.1, -0.15], [-0.15, 0.1, 0.15], [0.15, 0.1, 0.15]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.01, 0.012, 0.2]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        <mesh position={[0, 0.38, -0.15]} castShadow>
          <RoundedBox args={[0.34, 0.2, 0.02]} radius={0.01} smoothness={4}>
            <meshPhysicalMaterial color="#6b4a2a" roughness={0.7} metalness={0} />
          </RoundedBox>
        </mesh>
      </group>

      {/* Chair 3 - left */}
      <group position={[-0.95, 0, 0.2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <mesh position={[0, 0.22, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.35, 0.03, 0.35]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {[[-0.15, 0.1, -0.15], [0.15, 0.1, -0.15], [-0.15, 0.1, 0.15], [0.15, 0.1, 0.15]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.01, 0.012, 0.2]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        <mesh position={[0, 0.38, -0.15]} castShadow>
          <RoundedBox args={[0.34, 0.2, 0.02]} radius={0.01} smoothness={4}>
            <meshPhysicalMaterial color="#6b4a2a" roughness={0.7} metalness={0} />
          </RoundedBox>
        </mesh>
      </group>

      {/* Chair 4 - right */}
      <group position={[0.95, 0, 0.2]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <mesh position={[0, 0.22, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.35, 0.03, 0.35]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {[[-0.15, 0.1, -0.15], [0.15, 0.1, -0.15], [-0.15, 0.1, 0.15], [0.15, 0.1, 0.15]].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.01, 0.012, 0.2]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        <mesh position={[0, 0.38, -0.15]} castShadow>
          <RoundedBox args={[0.34, 0.2, 0.02]} radius={0.01} smoothness={4}>
            <meshPhysicalMaterial color="#6b4a2a" roughness={0.7} metalness={0} />
          </RoundedBox>
        </mesh>
      </group>

      {/* ── Sideboard ── */}
      <group position={[1.8, 0, -0.8]} castShadow>
        <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.15, 0.7, 1.0]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {/* Cabinet doors */}
        <mesh position={[0.06, 0.25, -0.25]}>
          <boxGeometry args={[0.02, 0.25, 0.2]} />
          <meshPhysicalMaterial color="#6b4a2a" roughness={0.6} metalness={0} />
        </mesh>
        <mesh position={[0.06, 0.25, 0.25]}>
          <boxGeometry args={[0.02, 0.25, 0.2]} />
          <meshPhysicalMaterial color="#6b4a2a" roughness={0.6} metalness={0} />
        </mesh>
        {/* Handles */}
        <mesh position={[0.06, 0.25, -0.15]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.06, 0.25, 0.15]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Top surface */}
        <mesh position={[0.06, 0.7, 0]}>
          <boxGeometry args={[0.02, 0.03, 0.9]} />
          <meshPhysicalMaterial color="#7a5a2a" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Vase on sideboard */}
        <mesh position={[0.06, 0.75, 0.15]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, 0.12]} />
          <meshPhysicalMaterial color="#d4a574" roughness={0.5} metalness={0.3} />
        </mesh>
      </group>

      {/* ── Picture Frame ── */}
      <PictureFrame position={[0, 1.3, -1.72]} color="#6b3a1a" imageColor="#7a8a5a" size={0.5} />

      {/* ── Rug ── */}
      <Rug position={[0, 0.002, 0.2]} colors={['#8a1a1a', '#5a0a0a', '#d4a574']} size={[1.8, 1.4]} />

      {/* ── Ceiling Light ── */}
      <CeilingLight position={[0, 2.68, 0]} />

      {/* ── Plant ── */}
      <Plant position={[-1.6, 0, 1.2]} scale={0.9} />
    </group>
  );
}


