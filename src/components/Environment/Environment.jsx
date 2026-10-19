import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useMemo } from "react";

function Tree({ position, scale = 1, pine = true }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, 1.4, 5]} />
        <meshStandardMaterial color="#80563c" flatShading />
      </mesh>
      {pine ? (
        <>
          <mesh position={[0, 1.65, 0]} castShadow>
            <coneGeometry args={[0.9, 1.8, 6]} />
            <meshStandardMaterial color="#2f7654" flatShading />
          </mesh>
          <mesh position={[0, 2.25, 0]} castShadow>
            <coneGeometry args={[0.62, 1.4, 6]} />
            <meshStandardMaterial color="#438c5d" flatShading />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 1.6, 0]} castShadow>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#3f8958" flatShading />
        </mesh>
      )}
    </group>
  );
}
function Rock({ position, scale = 1 }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial color="#8c9b8b" flatShading roughness={1} />
    </mesh>
  );
}
function Hill({ position, scale, color }) {
  return (
    <mesh position={position} scale={scale} receiveShadow>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} flatShading roughness={1} />
    </mesh>
  );
}

export default function Environment() {
  const trees = useMemo(() => {
    let seed = 17;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const out = [];
    for (let i = 0; i < 110; i++) {
      const x = (rand() - 0.5) * 58,
        z = (rand() - 0.5) * 58;
      if (Math.abs(x) < 3.2 && z > -22 && z < 14) continue;
      if (Math.abs(x) < 2.5 && z < -15) continue;
      out.push({
        position: [x, 0, z],
        scale: 0.65 + rand() * 0.65,
        pine: rand() > 0.18,
      });
    }
    return out;
  }, []);
  const rocks = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        position: [
          Math.sin(i * 4.1) * (7 + (i % 4) * 2),
          0.25,
          Math.cos(i * 3.7) * (8 + (i % 5) * 2),
        ],
        scale: [0.5 + (i % 3) * 0.25, 0.45 + (i % 2) * 0.25, 0.6],
      })),
    [],
  );
  return (
    <group>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[32, 0.5, 32]} position={[0, -0.55, 0]} />
        <mesh receiveShadow position={[0, -0.6, 0]}>
          <boxGeometry args={[64, 1, 64]} />
          <meshStandardMaterial color="#83b96f" flatShading />
        </mesh>
      </RigidBody>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.075, -2]}
        receiveShadow
      >
        <planeGeometry args={[5.5, 47]} />
        <meshStandardMaterial color="#cbb58a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.065, -19]}>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#a99770" roughness={1} />
      </mesh>
      <Hill position={[-24, 1, -19]} scale={[9, 5, 12]} color="#6b9e67" />
      <Hill position={[24, 1, -20]} scale={[10, 6, 11]} color="#7ca76b" />
      <Hill position={[-22, 1, 19]} scale={[12, 4, 9]} color="#7eaa6d" />
      <Hill position={[23, 1, 19]} scale={[11, 5, 10]} color="#6e9d62" />
      {trees.map((tree, i) => (
        <Tree key={i} {...tree} />
      ))}
      {rocks.map((rock, i) => (
        <Rock key={i} {...rock} />
      ))}
      <group position={[-4, 0, -20]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[(i % 2) * 2.6, 1.1, Math.floor(i / 2) * 2.6]}
            castShadow
          >
            <boxGeometry args={[0.65, 2.2, 0.65]} />
            <meshStandardMaterial color="#a9a99b" flatShading />
          </mesh>
        ))}
        <mesh position={[1.3, 2.4, 1.3]} castShadow>
          <boxGeometry args={[3.2, 0.45, 3.2]} />
          <meshStandardMaterial color="#c2c0ac" flatShading />
        </mesh>
      </group>
      <group position={[4, 0, -20]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[(i % 2) * 2.6, 1.1, Math.floor(i / 2) * 2.6]}
            castShadow
          >
            <boxGeometry args={[0.65, 2.2, 0.65]} />
            <meshStandardMaterial color="#a9a99b" flatShading />
          </mesh>
        ))}
        <mesh position={[1.3, 2.4, 1.3]} castShadow>
          <boxGeometry args={[3.2, 0.45, 3.2]} />
          <meshStandardMaterial color="#c2c0ac" flatShading />
        </mesh>
      </group>
    </group>
  );
}

// ─── Level 2: Glacial Wastes ────────────────────────────────────────────────

function IceSpire({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.28, 3.2, 5]} />
        <meshStandardMaterial color="#b8e4f0" emissive="#4fc3e8" emissiveIntensity={0.25} roughness={0.15} metalness={0.3} flatShading />
      </mesh>
      <mesh position={[0.35, 0.9, 0.2]} castShadow>
        <coneGeometry args={[0.17, 2.0, 5]} />
        <meshStandardMaterial color="#c8edf6" emissive="#5dd4f4" emissiveIntensity={0.2} roughness={0.12} flatShading />
      </mesh>
    </group>
  );
}

function SnowTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.18, 1.3, 5]} />
        <meshStandardMaterial color="#5a3a28" flatShading />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <coneGeometry args={[0.85, 1.7, 6]} />
        <meshStandardMaterial color="#38607a" flatShading />
      </mesh>
      <mesh position={[0, 2.45, 0]} castShadow>
        <coneGeometry args={[0.6, 0.9, 6]} />
        <meshStandardMaterial color="#ddf0f8" flatShading roughness={0.9} />
      </mesh>
    </group>
  );
}

function FrostRock({ position, scale = [1, 1, 1] }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.75, 0]} />
      <meshStandardMaterial color="#9bbdcc" flatShading roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

export function EnvironmentL2() {
  const spires = useMemo(() => {
    let seed = 42;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const out = [];
    for (let i = 0; i < 40; i++) {
      const x = (rand() - 0.5) * 56, z = (rand() - 0.5) * 56;
      if (Math.abs(x) < 5 && z > -24 && z < 16) continue;
      out.push({ position: [x, 0, z], scale: 0.6 + rand() * 0.9 });
    }
    return out;
  }, []);

  const snowTrees = useMemo(() => {
    let seed = 77;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const out = [];
    for (let i = 0; i < 70; i++) {
      const x = (rand() - 0.5) * 56, z = (rand() - 0.5) * 56;
      if (Math.abs(x) < 4 && z > -24 && z < 16) continue;
      out.push({ position: [x, 0, z], scale: 0.55 + rand() * 0.7 });
    }
    return out;
  }, []);

  const frostRocks = useMemo(() =>
    Array.from({ length: 32 }, (_, i) => ({
      position: [Math.sin(i * 3.9) * (8 + (i % 4) * 2.2), 0.2, Math.cos(i * 3.5) * (9 + (i % 5) * 1.8)],
      scale: [0.4 + (i % 3) * 0.3, 0.35 + (i % 2) * 0.3, 0.5],
    })), []);

  return (
    <group>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[32, 0.5, 32]} position={[0, -0.55, 0]} />
        <mesh receiveShadow position={[0, -0.6, 0]}>
          <boxGeometry args={[64, 1, 64]} />
          <meshStandardMaterial color="#c5dde8" flatShading roughness={0.85} />
        </mesh>
      </RigidBody>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, -2]} receiveShadow>
        <planeGeometry args={[6, 52]} />
        <meshStandardMaterial color="#d8eef6" roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Snow-capped hills */}
      {[
        { p: [-25, 1, -20], s: [10, 5.5, 13], c: '#a8c8d8' },
        { p: [25, 1, -22],  s: [11, 6.5, 12], c: '#b2cdd8' },
        { p: [-23, 1, 20],  s: [13, 4.5, 10], c: '#aac5d5' },
        { p: [24, 1, 21],   s: [12, 5, 11],   c: '#9fbccb' },
      ].map((h, i) => <Hill key={i} position={h.p} scale={h.s} color={h.c} />)}
      {[
        { p: [-25, 6.5, -20], s: [6, 2.5, 9],   c: '#e8f4fa' },
        { p: [25, 7.5, -22],  s: [7, 3, 8],     c: '#edf6fb' },
        { p: [-23, 5.5, 20],  s: [9, 2.5, 7],   c: '#e5f2f9' },
        { p: [24, 6, 21],     s: [8, 2.8, 7.5], c: '#eaf5fb' },
      ].map((h, i) => <Hill key={`snow${i}`} position={h.p} scale={h.s} color={h.c} />)}

      {spires.map((s, i) => <IceSpire key={i} {...s} />)}
      {snowTrees.map((t, i) => <SnowTree key={i} {...t} />)}
      {frostRocks.map((r, i) => <FrostRock key={i} {...r} />)}

      {/* Icy portal ruins */}
      {[-4.5, 4.5].map((xOff, gi) => (
        <group key={gi} position={[xOff, 0, -22]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[(i % 2) * 2.8, 1.2, Math.floor(i / 2) * 2.8]} castShadow>
              <boxGeometry args={[0.7, 2.4, 0.7]} />
              <meshStandardMaterial color="#8ba8b8" flatShading />
            </mesh>
          ))}
          <mesh position={[1.4, 2.6, 1.4]} castShadow>
            <boxGeometry args={[3.5, 0.5, 3.5]} />
            <meshStandardMaterial color="#9ab5c2" flatShading />
          </mesh>
          <mesh position={[1.4, 2.9, 1.4]} castShadow>
            <boxGeometry args={[3.7, 0.25, 3.7]} />
            <meshStandardMaterial color="#e5f3fa" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

