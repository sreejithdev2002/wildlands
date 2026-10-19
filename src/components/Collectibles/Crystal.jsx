import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody } from "@react-three/rapier";

export default function Crystal({ id, position, collect }) {
  const group = useRef(),
    collected = useRef(false);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 1.1;
    // Animate Y relative to origin since RigidBody is now at position
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 2.2 + id) * 0.18;
  });
  return (
    // RigidBody placed at crystal world position so BallCollider sensor aligns correctly
    <RigidBody type="fixed" colliders={false} position={position}>
      <group ref={group}>
        <mesh>
          <octahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial
            color="#5cf5e8"
            emissive="#20bdbd"
            emissiveIntensity={1.7}
            roughness={0.18}
            metalness={0.15}
            flatShading
          />
        </mesh>
        <mesh scale={0.55} rotation={[0.2, 0.4, 0.2]}>
          <octahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial
            color="#d2fff6"
            emissive="#7dfff4"
            emissiveIntensity={1.2}
            roughness={0.2}
            flatShading
          />
        </mesh>
        <pointLight color="#3ffff0" intensity={1.2} distance={3} />
      </group>
      <BallCollider
        args={[1.15]}
        sensor
        onIntersectionEnter={({ other }) => {
          if (!collected.current && other.rigidBodyObject?.userData?.player) {
            collected.current = true;
            collect(id);
          }
        }}
      />
    </RigidBody>
  );
}
