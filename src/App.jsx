import { useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import LevelOne from './scenes/LevelOne.jsx'
import HUD from './components/UI/HUD.jsx'
import { LEVELS } from './game/gameConfig.js'

export default function App() {
  const [levelIndex, setLevelIndex] = useState(0)
  const levelData = LEVELS[levelIndex]

  const [crystals, setCrystals] = useState([])
  const [status, setStatus] = useState('playing')
  const [playerReset, setPlayerReset] = useState(0)
  const [mobile, setMobile] = useState(false)
  const [touchMove, setTouchMove] = useState({ x: 0, y: 0 })
  const [jumpSignal, setJumpSignal] = useState(0)
  const [sprint, setSprint] = useState(false)

  const collect = useCallback((id) => setCrystals(prev => prev.includes(id) ? prev : [...prev, id]), [])

  const restart = useCallback(() => {
    setCrystals([]); setStatus('playing'); setPlayerReset(n => n + 1)
    setTouchMove({ x: 0, y: 0 }); setSprint(false)
  }, [])

  const nextLevel = useCallback(() => {
    const next = levelIndex + 1
    if (next < LEVELS.length) {
      setLevelIndex(next)
      setCrystals([]); setStatus('playing'); setPlayerReset(n => n + 1)
      setTouchMove({ x: 0, y: 0 }); setSprint(false)
    } else {
      // All levels done – restart from level 1
      setLevelIndex(0)
      setCrystals([]); setStatus('playing'); setPlayerReset(n => n + 1)
      setTouchMove({ x: 0, y: 0 }); setSprint(false)
    }
  }, [levelIndex])

  useEffect(() => {
    const detect = () => setMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 760)
    detect(); window.addEventListener('resize', detect)
    const onKey = e => { if (e.key === 'Escape') setStatus(s => s === 'playing' ? 'paused' : s === 'paused' ? 'playing' : s) }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('resize', detect); window.removeEventListener('keydown', onKey) }
  }, [])

  const sky = levelData.sky
  const [fogColor, fogNear, fogFar] = levelData.fog

  return <main className="game-shell">
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 5, 15], fov: 55 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={[levelData.background]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <Sky sunPosition={sky.sunPosition} turbidity={sky.turbidity} rayleigh={sky.rayleigh} mieCoefficient={sky.mieCoefficient} />
      <Stars radius={90} depth={35} count={500} factor={2} saturation={0.2} fade speed={0.2} />
      <ambientLight intensity={levelData.ambient} />
      <directionalLight position={levelData.light.position} intensity={levelData.light.intensity} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Physics gravity={[0, -20, 0]}>
        <LevelOne
          key={levelIndex}
          levelData={levelData}
          crystals={crystals}
          collect={collect}
          status={status}
          setStatus={setStatus}
          playerReset={playerReset}
          mobile={mobile}
          touchMove={touchMove}
          jumpSignal={jumpSignal}
          sprint={sprint}
        />
      </Physics>
    </Canvas>
    <HUD
      crystals={crystals.length}
      total={levelData.requiredCrystals}
      levelData={levelData}
      levelIndex={levelIndex}
      totalLevels={LEVELS.length}
      status={status}
      setStatus={setStatus}
      restart={restart}
      nextLevel={nextLevel}
      hasNextLevel={levelIndex + 1 < LEVELS.length}
      mobile={mobile}
      setTouchMove={setTouchMove}
      setJumpSignal={setJumpSignal}
      sprint={sprint}
      setSprint={setSprint}
    />
  </main>
}

