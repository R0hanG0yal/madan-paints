import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CeilingLight, Curtains, FloorLamp, PictureFrame, Plant, Rug } from './shared';

export function BedroomFurniture() {
  return (
    <group>
      {/* ── Bed (Charpai) ── */}
      <group position={[0, 0, 0.6]} castShadow>
        {/* Bed frame */}
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.7, 0.2, 1.4]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.8} metalness={0} />
        </mesh>
        {/* Mattress */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <RoundedBox args={[1.6, 0.12, 1.3]} radius={0.03} smoothness={4}>
            <meshPhysicalMaterial color="#fff8dc" roughness={0.95} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Bedsheet layer */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <RoundedBox args={[1.55, 0.03, 1.25]} radius={0.02} smoothness={4}>
            <meshPhysicalMaterial color="#f0ead6" roughness={0.9} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Pillows */}
        <mesh position={[-0.5, 0.48, -0.5]} castShadow>
          <RoundedBox args={[0.4, 0.08, 0.35]} radius={0.04} smoothness={4}>
            <meshPhysicalMaterial color="#fff" roughness={0.95} metalness={0} />
          </RoundedBox>
        </mesh>
        <mesh position={[0.5, 0.48, -0.5]} castShadow>
          <RoundedBox args={[0.4, 0.08, 0.35]} radius={0.04} smoothness={4}>
            <meshPhysicalMaterial color="#fff" roughness={0.95} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Quilt/Blanket folded at foot */}
        <mesh position={[0, 0.45, 0.55]} castShadow>
          <RoundedBox args={[1.0, 0.06, 0.15]} radius={0.03} smoothness={4}>
            <meshPhysicalMaterial color="#800020" roughness={0.9} metalness={0} />
          </RoundedBox>
        </mesh>
        {/* Bed legs */}
        {[
          [-0.8, -0.1, -0.65],
          [0.8, -0.1, -0.65],
          [-0.8, -0.1, 0.65],
          [0.8, -0.1, 0.65]
        ].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <boxGeometry args={[0.04, 0.12, 0.04]} />
            <meshPhysicalMaterial color="#555" roughness={0.6} metalness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ── Wardrobe (Almirah) ── */}
      <group position={[1.85, 0, -0.4]} castShadow>
        <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.15, 1.4, 0.9]} />
          <meshPhysicalMaterial color="#8b6914" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Mirror */}
        <mesh position={[0.06, 0.7, 0]}>
          <planeGeometry args={[0.05, 0.5, 0.35]} />
          <meshPhysicalMaterial
            color="#aaddff"
            transparent
            opacity={0.3}
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>
        {/* Handles */}
        <mesh position={[0.06, 0.65, -0.15]}>
          <boxGeometry args={[0.02, 0.04, 0.02]} />
          <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.06, 0.65, 0.15]}>
          <boxGeometry args={[0.02, 0.04, 0.02]} />
          <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Drawer at bottom */}
        <mesh position={[0.06, 0.12, 0]}>
          <boxGeometry args={[0.06, 0.15, 0.15]} />
          <meshPhysicalMaterial color="#7a5a10" roughness={0.6} metalness={0} />
        </mesh>
        <mesh position={[0.06, 0.12, 0.1]}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* ── Dressing Table ── */}
      <group position={[1.4, 0, 1.2]} castShadow>
        {/* Table top */}
        <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.6, 0.03, 0.35]} />
          <meshPhysicalMaterial color="#6b3a1a" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Legs */}
        {[
          [-0.27, 0.16, -0.15],
          [0.27, 0.16, -0.15],
          [-0.27, 0.16, 0.15],
          [0.27, 0.16, 0.15]
        ].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.015, 0.018, 0.32]} />
            <meshPhysicalMaterial color="#5a2d0e" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        {/* Mirror */}
        <mesh position={[0, 0.6, -0.16]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshPhysicalMaterial
            color="#aaddff"
            transparent
            opacity={0.25}
            roughness={0.02}
            metalness={0.9}
          />
        </mesh>
        {/* Mirror frame */}
        <mesh position={[0, 0.6, -0.16]}>
          <planeGeometry args={[0.44, 0.44]} />
          <meshPhysicalMaterial
            color="#6b3a1a"
            transparent
            opacity={0.3}
            roughness={0.6}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Drawer */}
        <mesh position={[0, 0.18, -0.1]}>
          <boxGeometry args={[0.5, 0.08, 0.04]} />
          <meshPhysicalMaterial color="#5a2d0e" roughness={0.7} metalness={0} />
        </mesh>
        <mesh position={[0, 0.18, -0.08]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* ── Nightstand ── */}
      <group position={[-1.2, 0, 1.0]} castShadow>
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.35, 0.3, 0.3]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.7} metalness={0} />
        </mesh>
        <mesh position={[0, 0.37, 0]}>
          <boxGeometry args={[0.38, 0.03, 0.33]} />
          <meshPhysicalMaterial color="#6b4a2a" roughness={0.6} metalness={0} />
        </mesh>
        {/* Lamp on nightstand */}
        <mesh position={[-0.08, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.15]} />
          <meshPhysicalMaterial color="#d4a574" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[-0.08, 0.52, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshPhysicalMaterial color="#ffe082" roughness={0.7} metalness={0} />
        </mesh>
        {/* Book */}
        <mesh position={[0.1, 0.39, 0]}>
          <boxGeometry args={[0.1, 0.015, 0.14]} />
          <meshPhysicalMaterial color="#446" roughness={0.7} metalness={0} />
        </mesh>
      </group>

      {/* ── Rug ── */}
      <Rug position={[0, 0.002, 0.4]} colors={['#5a7a6a', '#3a5a4a', '#d4a574']} size={[1.4, 1.0]} />

      {/* ── Curtains ── */}
      <Curtains width={4.0} height={2.3} color="#c0b5a0" />

      {/* ── Picture Frame ── */}
      <PictureFrame position={[0, 1.3, -1.72]} color="#4a2a0a" imageColor="#7a9a8a" size={0.45} />

      {/* ── Ceiling Light ── */}
      <CeilingLight position={[0, 2.68, 0]} />

      {/* ── Floor Lamp ── */}
      <FloorLamp position={[-1.6, 0, -0.8]} />

      {/* ── Plant ── */}
      <Plant position={[1.7, 0, 1.2]} scale={0.7} />
    </group>
  );
}


