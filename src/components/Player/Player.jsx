import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier'
import * as THREE from 'three'

// Pre-allocate objects outside component to avoid re-creation every frame
const _dir = new THREE.Vector3()
const _fwd = new THREE.Vector3()
const _rgt = new THREE.Vector3()
const _camTarget = new THREE.Vector3()
const _lookAt = new THREE.Vector3()

// Level bounds — keep player inside the ground mesh (64x64 → ±30 safe zone)
const BOUND = 30

export default function Player({ status, mobile, touchMove, jumpSignal, sprint, spawnPos = [0, 1.3, 10] }) {
  const body = useRef()
  const visual = useRef()
  const lastJump = useRef(jumpSignal)
  const grounded = useRef(false)
  const keys = useRef({})
  const yaw = useRef(0)
  const pitch = useRef(.28)
  const distance = useRef(6.5)
  const drag = useRef(null)
  // Track space key state to prevent hold-to-spam
  const spaceWasUp = useRef(true)

  const { camera, gl } = useThree()
  const { world, rapier } = useRapier()

  // Pre-allocate ray once per mount
  const rayRef = useRef(null)
  const rayOrigin = useRef({ x: 0, y: 0, z: 0 })
  const rayDir = { x: 0, y: -1, z: 0 }

  useEffect(() => {
    // Lazily create the ray origin object (direction is always down)
    rayRef.current = new rapier.Ray(rayOrigin.current, rayDir)
  }, [rapier])

  useEffect(() => {
    const down = e => {
      keys.current[e.key.toLowerCase()] = true
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) e.preventDefault()
    }
    const up = e => {
      keys.current[e.key.toLowerCase()] = false
      // Reset space guard so next press can jump
      if (e.key === ' ') spaceWasUp.current = true
    }
    const blur = () => { keys.current = {}; drag.current = null; spaceWasUp.current = true }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)

    const canvas = gl.domElement
    const start = e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
      try { canvas.setPointerCapture(e.pointerId) } catch {}
    }
    const move = e => {
      if (!drag.current || drag.current.id !== e.pointerId) return
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y
      yaw.current -= dx * .006
      pitch.current = THREE.MathUtils.clamp(pitch.current + dy * .003, -.05, .8)
      drag.current.x = e.clientX; drag.current.y = e.clientY
    }
    const end = e => { if (drag.current?.id === e.pointerId) drag.current = null }
    const wheel = e => { distance.current = THREE.MathUtils.clamp(distance.current + e.deltaY * .006, 3.5, 10) }

    canvas.addEventListener('pointerdown', start)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', end)
    canvas.addEventListener('pointercancel', end)
    canvas.addEventListener('wheel', wheel, { passive: true })

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      canvas.removeEventListener('pointerdown', start)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', end)
      canvas.removeEventListener('pointercancel', end)
      canvas.removeEventListener('wheel', wheel)
    }
  }, [gl])

  useFrame((_, delta) => {
    if (!body.current || !rayRef.current) return
    const dt = Math.min(delta, .04)
    const pos = body.current.translation()
    const vel = body.current.linvel()

    // Expose position for portal detection
    window.__wildlandsPlayerPosition = [pos.x, pos.y, pos.z]

    // Ground check with pre-allocated ray
    rayOrigin.current.x = pos.x
    rayOrigin.current.y = pos.y - .65
    rayOrigin.current.z = pos.z
    rayRef.current.origin = rayOrigin.current
    const hit = world.castRay(rayRef.current, .9, true, undefined, undefined, undefined, body.current)
    grounded.current = !!hit && vel.y <= .5

    // Pause / non-playing state
    if (status !== 'playing') {
      body.current.setLinvel({ x: 0, y: vel.y, z: 0 }, true)
      return
    }

    const k = keys.current
    let x = (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0) + (touchMove.x || 0)
    let z = (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0) + (touchMove.y || 0)
    const len = Math.hypot(x, z); if (len > 1) { x /= len; z /= len }

    // Reuse pre-allocated vectors
    _fwd.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current))
    _rgt.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current))
    _dir.copy(_fwd).multiplyScalar(-z).addScaledVector(_rgt, x)

    if (_dir.lengthSq() > .001) {
      _dir.normalize()
      const targetYaw = Math.atan2(_dir.x, _dir.z)
      visual.current.rotation.y += Math.atan2(
        Math.sin(targetYaw - visual.current.rotation.y),
        Math.cos(targetYaw - visual.current.rotation.y)
      ) * (1 - Math.exp(-12 * dt))
    }

    const speed = sprint || k.shift ? 7.5 : 4.6
    let newX = _dir.x * speed
    let newZ = _dir.z * speed

    // === Out-of-bounds clamping ===
    const nextX = THREE.MathUtils.clamp(pos.x + newX * dt, -BOUND, BOUND)
    const nextZ = THREE.MathUtils.clamp(pos.z + newZ * dt, -BOUND, BOUND)
    if (Math.abs(nextX) >= BOUND) newX = 0
    if (Math.abs(nextZ) >= BOUND) newZ = 0

    body.current.setLinvel({ x: newX, y: vel.y, z: newZ }, true)

    // === Jump: mobile signal OR desktop Space key ===
    const mobileJump = jumpSignal !== lastJump.current
    const desktopJump = k[' '] && spaceWasUp.current && !mobile

    if (mobileJump || desktopJump) {
      lastJump.current = jumpSignal
      if (desktopJump) spaceWasUp.current = false // prevent hold-spam
      if (grounded.current) {
        body.current.setLinvel({ x: vel.x, y: 8.2, z: vel.z }, true)
      }
    }

    // Camera
    _camTarget.set(
      pos.x + Math.sin(yaw.current) * Math.cos(pitch.current) * distance.current,
      pos.y + 1.25 + Math.sin(pitch.current) * distance.current,
      pos.z + Math.cos(yaw.current) * Math.cos(pitch.current) * distance.current
    )
    camera.position.lerp(_camTarget, 1 - Math.exp(-7 * dt))
    _lookAt.set(pos.x, pos.y + .8, pos.z)
    camera.lookAt(_lookAt)

    // Bob animation
    if (visual.current) {
      const moving = _dir.lengthSq() > .01
      visual.current.position.y = moving ? Math.abs(Math.sin(performance.now() * .012)) * .07 : 0
    }
  })

  return (
    <RigidBody
      ref={body}
      userData={{ player: true }}
      colliders={false}
      position={spawnPos}
      enabledRotations={[false, false, false]}
      linearDamping={0}
      friction={0.5}
      ccd
    >
      <CapsuleCollider args={[.55, .35]} />
      <group ref={visual}>
        <mesh position={[0, .05, 0]} castShadow><capsuleGeometry args={[.34, .7, 4, 8]} /><meshStandardMaterial color="#e8a45e" flatShading /></mesh>
        <mesh position={[0, .72, 0]} castShadow><icosahedronGeometry args={[.31, 1]} /><meshStandardMaterial color="#f1c7a0" flatShading /></mesh>
        <mesh position={[0, .92, -.02]} castShadow><coneGeometry args={[.34, .35, 5]} /><meshStandardMaterial color="#314c48" flatShading /></mesh>
        <mesh position={[-.14, .74, .27]}><sphereGeometry args={[.035, 6, 6]} /><meshBasicMaterial color="#172b2a" /></mesh>
        <mesh position={[.14, .74, .27]}><sphereGeometry args={[.035, 6, 6]} /><meshBasicMaterial color="#172b2a" /></mesh>
        <mesh position={[-.18, -.42, 0]} castShadow><boxGeometry args={[.18, .42, .2]} /><meshStandardMaterial color="#465d8b" flatShading /></mesh>
        <mesh position={[.18, -.42, 0]} castShadow><boxGeometry args={[.18, .42, .2]} /><meshStandardMaterial color="#465d8b" flatShading /></mesh>
        <mesh position={[0, .15, -.31]} castShadow><boxGeometry args={[.48, .48, .17]} /><meshStandardMaterial color="#8c6547" flatShading /></mesh>
      </group>
    </RigidBody>
  )
}

