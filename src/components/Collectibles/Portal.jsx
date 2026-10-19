import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";

export default function Portal({ position, unlocked, onComplete }) {
  const ring = useRef(),
    { world, rapier } = useRapier(),
    last = useRef(0);
  useFrame((state) => {
    if (ring.current) {
      ring.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
      ring.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    }
    // Portal interaction is distance-based and checked at a low frequency.
    if (!unlocked || state.clock.elapsedTime - last.current < 0.15) return;
    last.current = state.clock.elapsedTime;
    // The player emits a custom event from the proximity system in LevelOne.
    const handler = () => onComplete();
    if (
      window.__wildlandsPlayerPosition &&
      Math.hypot(
        window.__wildlandsPlayerPosition[0] - position[0],
        window.__wildlandsPlayerPosition[2] - position[2],
      ) < 2.1
    )
      handler();
  });
  return (
    <group position={position}>
      <mesh position={[0, 1.55, 0]}>
        <torusGeometry args={[1.35, 0.18, 8, 16]} />
        <meshStandardMaterial
          color={unlocked ? "#61f6df" : "#667b79"}
          emissive={unlocked ? "#2be6d0" : "#182f31"}
          emissiveIntensity={unlocked ? 1.4 : 0.2}
          metalness={0.25}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, 1.55, -0.08]}>
        <circleGeometry args={[1.15, 16]} />
        <meshBasicMaterial
          color={unlocked ? "#58d9d0" : "#364a4b"}
          transparent
          opacity={unlocked ? 0.42 : 0.22}
          side={2}
        />
      </mesh>
      <mesh ref={ring} position={[0, 1.55, 0]}>
        <torusGeometry args={[1.62, 0.045, 6, 24]} />
        <meshStandardMaterial
          color="#f4d18b"
          emissive="#d39d45"
          emissiveIntensity={0.45}
        />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.9, 2.2, 0.36, 8]} />
        <meshStandardMaterial color="#9a9b8b" flatShading />
      </mesh>
      <pointLight
        position={[0, 1.6, 0]}
        color={unlocked ? "#54fff0" : "#647d79"}
        intensity={unlocked ? 2.5 : 0.5}
        distance={8}
      />
    </group>
  );
}
