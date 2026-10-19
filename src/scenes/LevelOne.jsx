import { Suspense } from 'react'
import Player from '../components/Player/Player.jsx'
import Environment from '../components/Environment/Environment.jsx'
import { EnvironmentL2 } from '../components/Environment/Environment.jsx'
import Crystal from '../components/Collectibles/Crystal.jsx'
import Portal from '../components/Collectibles/Portal.jsx'

export default function LevelOne({ levelData, crystals, collect, status, setStatus, playerReset, mobile, touchMove, jumpSignal, sprint }) {
  const Env = levelData.id === 2 ? EnvironmentL2 : Environment
  return <Suspense fallback={null}>
    <Env />
    {levelData.crystals.map((position, i) => !crystals.includes(i) && <Crystal key={i} id={i} position={position} collect={collect} />)}
    <Portal position={levelData.portal} unlocked={crystals.length === levelData.requiredCrystals} onComplete={() => setStatus('won')} />
    <Player key={playerReset} status={status} mobile={mobile} touchMove={touchMove} jumpSignal={jumpSignal} sprint={sprint} spawnPos={levelData.spawn} />
  </Suspense>
}

