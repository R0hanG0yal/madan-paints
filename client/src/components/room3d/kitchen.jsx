import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CeilingLight, Window } from './shared';

export function KitchenFurniture() {
  return (
    <group>
      {/* ── Full Kitchen Counter (L-shape) ── */}
      {/* Left section - Sink area */}
      <group position={[-1.4, 0, 0]} castShadow>
        {/* Cabinet base */}
        <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.25, 0.7, 1.2]} />
          <meshPhysicalMaterial color="#e8dcc8" roughness={0.8} metalness={0} />
        </mesh>
        {/* Countertop - granite */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[0.28, 0.04, 1.22]} />
          <meshPhysicalMaterial color="#555" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Cabinet doors */}
        {[[0.08, 0.3, -0.3], [0.08, 0.3, 0.3]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <boxGeometry args={[0.02, 0.25, 0.25]} />
            <meshPhysicalMaterial color="#ddd" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        {/* Handles */}
        {[[0.08, 0.25, -0.2], [0.08, 0.25, 0.2]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.006, 6, 6]} />
            <meshPhysicalMaterial color="#c8a030" roughness={0.3} metalness={0.6} />
          </mesh>
        ))}
        {/* Kitchen Sink */}
        <mesh position={[0.08, 0.73, -0.25]}>
          <boxGeometry args={[0.1, 0.02, 0.3]} />
          <meshPhysicalMaterial color="#aaa" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0.08, 0.72, -0.25]}>
          <boxGeometry args={[0.08, 0.01, 0.28]} />
          <meshPhysicalMaterial color="#eee" roughness={0.1} metalness={0} />
        </mesh>
        {/* Sink tap */}
        <mesh position={[0.08, 0.8, -0.25]}>
          <cylinderGeometry args={[0.006, 0.008, 0.06]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0.08, 0.8, -0.21]}>
          <cylinderGeometry args={[0.008, 0.005, 0.04]} rotation={[0.6, 0, 0]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Soap dispenser */}
        <mesh position={[0.08, 0.76, -0.42]}>
          <cylinderGeometry args={[0.012, 0.015, 0.05]} />
          <meshPhysicalMaterial color="#ffaa88" roughness={0.4} metalness={0} />
        </mesh>
        {/* Cutting board on side */}
        <mesh position={[0.08, 0.74, 0.3]}>
          <boxGeometry args={[0.04, 0.015, 0.15]} />
          <meshPhysicalMaterial color="#c8a060" roughness={0.8} metalness={0} />
        </mesh>
      </group>

      {/* ── Gas Stove (with modern exhaust hood) ── */}
      <group position={[0.2, 0, 0.3]} castShadow>
        {/* Stove body */}
        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 0.15, 0.5]} />
          <meshPhysicalMaterial color="#777" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Glass top */}
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.75, 0.01, 0.45]} />
          <meshPhysicalMaterial color="#333" roughness={0.1} metalness={0.1} transparent opacity={0.3} />
        </mesh>
        {/* Burners with blue flame glow */}
        {[[-0.2, 0.19, 0.08], [0.2, 0.19, 0.08], [-0.2, 0.19, -0.12], [0.2, 0.19, -0.12]].map((pos, i) => (
          <group key={i} position={pos}>
            {/* Burner ring */}
            <mesh castShadow>
              <cylinderGeometry args={[0.055, 0.075, 0.015]} />
              <meshPhysicalMaterial color="#555" roughness={0.4} metalness={0.7} />
            </mesh>
            {/* Flame glow */}
            <mesh position={[0, 0.008, 0]}>
              <torusGeometry args={[0.035, 0.005, 6, 12]} />
              <meshPhysicalMaterial
                color="#4488ff"
                emissive="#4488ff"
                emissiveIntensity={0.4 + i * 0.05}
                transparent
                opacity={0.5}
                roughness={0.3}
                metalness={0}
              />
            </mesh>
            {/* Inner flame */}
            <mesh position={[0, 0.008, 0]}>
              <torusGeometry args={[0.02, 0.003, 6, 12]} />
              <meshPhysicalMaterial
                color="#ffcc44"
                emissive="#ffaa22"
                emissiveIntensity={0.3}
                transparent
                opacity={0.3}
                roughness={0.3}
                metalness={0}
              />
            </mesh>
          </group>
        ))}
        {/* Control knobs */}
        {[[-0.3, 0.1, 0.22], [-0.1, 0.1, 0.22], [0.1, 0.1, 0.22], [0.3, 0.1, 0.22]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <cylinderGeometry args={[0.008, 0.01, 0.025]} rotation={[Math.PI / 2, 0, 0]} />
            <meshPhysicalMaterial color={['#444', '#444', '#888', '#888'][i]} roughness={0.4} metalness={0.5} />
          </mesh>
        ))}
        {/* Pot with food on front burner */}
        <mesh position={[-0.2, 0.28, 0.08]} castShadow>
          <cylinderGeometry args={[0.07, 0.065, 0.1]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Pot lid */}
        <mesh position={[-0.2, 0.33, 0.08]}>
          <cylinderGeometry args={[0.072, 0.075, 0.008]} />
          <meshPhysicalMaterial color="#aaa" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Handi (clay pot) on back burner */}
        <mesh position={[0.2, 0.28, -0.12]} castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.12]} />
          <meshPhysicalMaterial color="#c08050" roughness={0.8} metalness={0} />
        </mesh>

        {/* ── Exhaust Hood above stove ── */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.6, 0.08, 0.35]} />
          <meshPhysicalMaterial color="#ddd" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Hood chimney pipe */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.42]} />
          <meshPhysicalMaterial color="#ccc" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Hood glass */}
        <mesh position={[0, 0.62, -0.15]}>
          <planeGeometry args={[0.45, 0.05]} />
          <meshPhysicalMaterial color="#333" roughness={0.1} metalness={0} transparent opacity={0.4} />
        </mesh>
        {/* Hood buttons */}
        {[[-0.12, 0.62, 0.15], [0, 0.62, 0.15], [0.12, 0.62, 0.15]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.006, 6, 6]} />
            <meshPhysicalMaterial color={['#44aa44', '#ff4444', '#4488ff'][i]} roughness={0.3} metalness={0} />
          </mesh>
        ))}
      </group>

      {/* ── Refrigerator ── */}
      <group position={[1.7, 0, 0.5]} castShadow>
        {/* Main body */}
        <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.3, 1.4, 0.5]} />
          <meshPhysicalMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Freezer door */}
        <mesh position={[0.12, 1.1, 0]}>
          <boxGeometry args={[0.02, 0.45, 0.42]} />
          <meshPhysicalMaterial color="#e8e8e8" roughness={0.3} metalness={0} />
        </mesh>
        {/* Fridge door */}
        <mesh position={[0.12, 0.38, 0]}>
          <boxGeometry args={[0.02, 0.65, 0.42]} />
          <meshPhysicalMaterial color="#eee" roughness={0.3} metalness={0} />
        </mesh>
        {/* Door handles */}
        <mesh position={[0.13, 1.1, 0.18]}>
          <boxGeometry args={[0.01, 0.15, 0.01]} />
          <meshPhysicalMaterial color="#888" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.13, 0.38, 0.18]}>
          <boxGeometry args={[0.01, 0.2, 0.01]} />
          <meshPhysicalMaterial color="#888" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Brand strip */}
        <mesh position={[0.12, 0.75, 0]}>
          <planeGeometry args={[0.01, 0.02]} />
          <meshPhysicalMaterial color="#333" roughness={0.3} metalness={0} />
        </mesh>
      </group>

      {/* ── Microwave on stand ── */}
      <group position={[1.5, 0, -0.8]} castShadow>
        {/* Stand */}
        <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.2, 0.5, 0.3]} />
          <meshPhysicalMaterial color="#e8dcc8" roughness={0.8} metalness={0} />
        </mesh>
        {/* Microwave body */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.35]} />
          <meshPhysicalMaterial color="#e0e0e0" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Microwave glass door */}
        <mesh position={[0.13, 0.6, 0]}>
          <planeGeometry args={[0.02, 0.14, 0.2]} />
          <meshPhysicalMaterial color="#333" roughness={0.1} metalness={0} transparent opacity={0.5} />
        </mesh>
        {/* Control panel */}
        <mesh position={[0, 0.6, 0.16]}>
          <planeGeometry args={[0.15, 0.08]} />
          <meshPhysicalMaterial color="#333" roughness={0.3} metalness={0} />
        </mesh>
        {/* Buttons */}
        {[[-0.05, 0.6, 0.17], [0.05, 0.6, 0.17]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.005, 6, 6]} />
            <meshPhysicalMaterial color="#888" roughness={0.3} metalness={0} />
          </mesh>
        ))}
      </group>

      {/* ── Upper Wall Cabinets ── */}
      <group position={[0, 1.5, -1.2]}>
        {/* Shelf 1 */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.6, 0.03, 0.3]} />
          <meshPhysicalMaterial color="#6b3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {/* Cabinet door */}
        <mesh position={[0.35, 0.08, 0.12]}>
          <boxGeometry args={[0.3, 0.12, 0.02]} />
          <meshPhysicalMaterial color="#e8dcc8" roughness={0.7} metalness={0} />
        </mesh>
        <mesh position={[-0.35, 0.08, 0.12]}>
          <boxGeometry args={[0.3, 0.12, 0.02]} />
          <meshPhysicalMaterial color="#e8dcc8" roughness={0.7} metalness={0} />
        </mesh>
        {/* Items on shelf */}
        {/* Utensils */}
        <mesh position={[-0.4, 0.07, -0.05]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.1]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.07, -0.05]} castShadow>
          <cylinderGeometry args={[0.035, 0.045, 0.08]} />
          <meshPhysicalMaterial color="#b08050" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0.4, 0.07, -0.05]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.12]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Plates */}
        <mesh position={[-0.6, 0.04, 0.05]}>
          <cylinderGeometry args={[0.065, 0.07, 0.006]} />
          <meshPhysicalMaterial color="#fff" roughness={0.2} metalness={0} />
        </mesh>
        <mesh position={[-0.6, 0.05, 0.05]}>
          <cylinderGeometry args={[0.065, 0.07, 0.006]} />
          <meshPhysicalMaterial color="#fff" roughness={0.2} metalness={0} />
        </mesh>
        {/* Glass jars */}
        <mesh position={[0.6, 0.05, 0.05]}>
          <cylinderGeometry args={[0.025, 0.03, 0.06]} />
          <meshPhysicalMaterial color="#4488ff" transparent opacity={0.4} roughness={0.1} metalness={0} />
        </mesh>
        <mesh position={[0.6, 0.05, -0.05]}>
          <cylinderGeometry args={[0.025, 0.03, 0.06]} />
          <meshPhysicalMaterial color="#ffaa44" transparent opacity={0.4} roughness={0.1} metalness={0} />
        </mesh>
      </group>

      {/* ── Water Filter (modern RO) ── */}
      <group position={[-1.3, 0.35, -1.3]}>
        {/* Main body */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.5]} />
          <meshPhysicalMaterial color="#e0e0e0" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Transparent filter elements */}
        <mesh position={[-0.07, 0.2, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.15]} />
          <meshPhysicalMaterial color="#4488ff" transparent opacity={0.5} roughness={0.3} metalness={0} />
        </mesh>
        <mesh position={[0.07, 0.2, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.15]} />
          <meshPhysicalMaterial color="#44aa44" transparent opacity={0.5} roughness={0.3} metalness={0} />
        </mesh>
        {/* Tap */}
        <mesh position={[0, 0.58, 0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.06]} rotation={[0.3, 0, 0]} />
          <meshPhysicalMaterial color="#888" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Brand panel */}
        <mesh position={[0, 0.45, 0.06]}>
          <planeGeometry args={[0.02, 0.04]} />
          <meshPhysicalMaterial color="#4488ff" emissive="#4488ff" emissiveIntensity={0.1} />
        </mesh>
      </group>

      {/* ── Small Indian Kitchen Table with items ── */}
      <group position={[-0.8, 0, 0.8]} castShadow>
        <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.5, 0.03, 0.5]} />
          <meshPhysicalMaterial color="#5a3a1a" roughness={0.7} metalness={0} />
        </mesh>
        {[
          [-0.22, 0.18, -0.22],
          [0.22, 0.18, -0.22],
          [-0.22, 0.18, 0.22],
          [0.22, 0.18, 0.22]
        ].map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <cylinderGeometry args={[0.012, 0.015, 0.36]} />
            <meshPhysicalMaterial color="#4a2a0a" roughness={0.7} metalness={0} />
          </mesh>
        ))}
        {/* Steel bowl with fruits */}
        <mesh position={[0, 0.44, 0]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Apple */}
        <mesh position={[0.03, 0.48, 0.02]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshPhysicalMaterial color="#ff4444" roughness={0.5} metalness={0} />
        </mesh>
        {/* Banana */}
        <mesh position={[-0.03, 0.47, -0.03]} rotation={[0.2, 0, 0.3]}>
          <cylinderGeometry args={[0.008, 0.012, 0.05]} />
          <meshPhysicalMaterial color="#ffdd00" roughness={0.6} metalness={0} />
        </mesh>
        {/* Spice box */}
        <mesh position={[0.15, 0.44, 0.12]}>
          <cylinderGeometry args={[0.025, 0.028, 0.03]} />
          <meshPhysicalMaterial color="#c0c0c0" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Tea kettle */}
        <mesh position={[-0.15, 0.45, 0.1]} castShadow>
          <cylinderGeometry args={[0.02, 0.025, 0.05]} />
          <meshPhysicalMaterial color="#4488ff" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>

      {/* ── Kitchen Mat ── */}
      <mesh position={[-0.3, 0.002, 0.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.8, 0.6]} />
        <meshPhysicalMaterial color="#8a6a5a" roughness={0.95} metalness={0} />
      </mesh>

      {/* ── Ceiling Light ── */}
      <CeilingLight position={[0, 2.68, 0]} />

      {/* ── Window above counter ── */}
      <Window position={[0.5, 1.2, -1.45]} width={0.6} height={0.8} />
    </group>
  );
}


