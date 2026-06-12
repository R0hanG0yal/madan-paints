import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CeilingLight, Curtains, FloorLamp, PictureFrame, Plant, Rug } from './shared';

export function LivingRoomFurniture() {
  return (
    <group>
      {/* ── Indian Diwan (Sofa) ── */}
      <group position={[0, 0, 0.8]} castShadow>
        {/* Base frame */}
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.0, 0.2, 0.8]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.8} metalness={0} />
        </mesh>
        {/* Seat cushion */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <RoundedBox args={[1.85, 0.12, 0.7]} radius={0.04} smoothness={4}>
            <meshPhysicalMaterial color="#c08060" roughness={0.9} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Back cushion */}
        <mesh position={[0, 0.5, -0.3]} castShadow>
          <RoundedBox args={[1.85, 0.2, 0.15]} radius={0.04} smoothness={4}>
            <meshPhysicalMaterial color="#a06040" roughness={0.9} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Arm rests */}
        <mesh position={[-0.95, 0.35, 0]} castShadow>
          <RoundedBox args={[0.08, 0.25, 0.7]} radius={0.02} smoothness={4}>
            <meshPhysicalMaterial color="#6b3a1a" roughness={0.8} metalness={0} />
          </RoundedBox>
        </mesh>
        <mesh position={[0.95, 0.35, 0]} castShadow>
          <RoundedBox args={[0.08, 0.25, 0.7]} radius={0.02} smoothness={4}>
            <meshPhysicalMaterial color="#6b3a1a" roughness={0.8} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Decorative cushions */}
        <mesh position={[-0.4, 0.44, 0.15]} castShadow>
          <RoundedBox args={[0.35, 0.08, 0.35]} radius={0.04} smoothness={4}>
            <meshPhysicalMaterial color="#800020" roughness={0.9} metalness={0} />
          </RoundedBox>
        </mesh>
        <mesh position={[0.4, 0.44, 0.15]} castShadow>
          <RoundedBox args={[0.35, 0.08, 0.35]} radius={0.04} smoothness={4}>
            <meshPhysicalMaterial color="#d4a574" roughness={0.9} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Cushion tassels */}
        <mesh position={[-0.4, 0.48, 0.35]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshPhysicalMaterial color="#800020" />
        </mesh>
        <mesh position={[0.4, 0.48, 0.35]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshPhysicalMaterial color="#d4a574" />
        </mesh>
      </group>

      {/* ── Coffee Table ── */}
      <group position={[0, 0, -0.2]}>
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.9, 0.04, 0.5]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.6} metalness={0} />
        </mesh>
        <mesh position={[-0.4, 0.08, -0.2]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.16]} />
          <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
        </mesh>
        <mesh position={[0.4, 0.08, -0.2]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.16]} />
          <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
        </mesh>
        <mesh position={[-0.4, 0.08, 0.2]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.16]} />
          <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
        </mesh>
        <mesh position={[0.4, 0.08, 0.2]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.16]} />
          <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
        </mesh>
        {/* Vase on table */}
        <mesh position={[-0.2, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.1]} />
          <meshPhysicalMaterial color="#d4a574" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0.2, 0.22, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.08]} />
          <meshPhysicalMaterial color="#800020" roughness={0.6} metalness={0} />
        </mesh>
      </group>

      {/* ── TV Unit ── */}
      <group position={[0, 0.2, -1.55]} castShadow>
        {/* Cabinet */}
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.4, 0.4, 0.3]} />
          <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
        </mesh>
        {/* Cabinet doors */}
        <mesh position={[-0.35, 0.2, 0.12]}>
          <boxGeometry args={[0.55, 0.3, 0.02]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0.35, 0.2, 0.12]}>
          <boxGeometry args={[0.55, 0.3, 0.02]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.1, 0.2, 0.14]}>
          <cylinderGeometry args={[0.008, 0.008, 0.04]} rotation={[0, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.1, 0.2, 0.14]}>
          <cylinderGeometry args={[0.008, 0.008, 0.04]} rotation={[0, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* TV Screen */}
        <mesh position={[0, 0.5, 0.05]} castShadow>
          <boxGeometry args={[0.9, 0.5, 0.03]} />
          <meshPhysicalMaterial color="#1a1a2e" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* TV emissive screen glow */}
        <mesh position={[0, 0.5, 0.045]}>
          <planeGeometry args={[0.85, 0.45]} />
          <meshPhysicalMaterial
            color="#335"
            emissive="#4466aa"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
            roughness={0}
            metalness={0}
          />
        </mesh>
        {/* Soundbar */}
        <mesh position={[0, 0.28, 0.1]}>
          <boxGeometry args={[0.7, 0.02, 0.04]} />
          <meshPhysicalMaterial color="#333" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* ── Air Cooler ── */}
      <group position={[-1.6, 0, 0.6]} castShadow>
        {/* Main body */}
        <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.35, 0.8, 0.3]} />
          <meshPhysicalMaterial color="#e0e0e0" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Cooling pad */}
        <mesh position={[0, 0.4, 0.12]}>
          <boxGeometry args={[0.28, 0.45, 0.02]} />
          <meshPhysicalMaterial color="#999" roughness={0.9} metalness={0} />
        </mesh>
        {/* Fan grille */}
        <mesh position={[0, 0.4, -0.12]}>
          <planeGeometry args={[0.25, 0.25]} />
          <meshPhysicalMaterial
            color="#aaa"
            transparent
            opacity={0.5}
            roughness={0.8}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Water tank */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.2, 0.04, 0.12]} />
          <meshPhysicalMaterial color="#4488ff" transparent opacity={0.5} roughness={0.2} metalness={0} />
        </mesh>
        {/* Top */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.32, 0.02, 0.28]} />
          <meshPhysicalMaterial color="#ccc" roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      {/* ── Rug ── */}
      <Rug position={[0, 0.002, 0.35]} colors={['#c04040', '#800020', '#d4a574']} size={[2.0, 1.4]} />

      {/* ── Curtains ── */}
      <Curtains width={4.5} height={2.3} color="#d4c5b0" />

      {/* ── Picture Frame ── */}
      <PictureFrame
        position={[-1.0, 1.2, -1.72]}
        color="#6b3a1a"
        imageColor="#5a7a8a"
        size={0.4}
      />
      <PictureFrame
        position={[1.0, 1.2, -1.72]}
        color="#6b3a1a"
        imageColor="#8a6a5a"
        size={0.35}
      />

      {/* ── Plant ── */}
      <Plant position={[1.6, 0, 1.0]} scale={0.9} />

      {/* ── Floor Lamp ── */}
      <FloorLamp position={[-1.6, 0, -0.6]} />

      {/* ── Ceiling Light ── */}
      <CeilingLight position={[0, 2.68, 0]} />

      {/* ── Books/Magazines on table ── */}
      <group position={[0.25, 0.21, -0.1]}>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.15]} />
          <meshPhysicalMaterial color="#335" roughness={0.7} metalness={0} />
        </mesh>
        <mesh position={[0.015, 0.025, 0.005]}>
          <boxGeometry args={[0.09, 0.015, 0.14]} />
          <meshPhysicalMaterial color="#800020" roughness={0.7} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}


