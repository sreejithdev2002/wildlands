import { useEffect, useRef } from 'react'
import { Compass, Gem, Pause, Play, RotateCcw, Sparkles, ChevronRight, Footprints, MousePointer2, X } from 'lucide-react'

export default function HUD({ crystals, total, levelData, levelIndex, totalLevels, status, setStatus, restart, nextLevel, hasNextLevel, mobile, setTouchMove, setJumpSignal, sprint, setSprint }) {
  const joystick = useRef(null), pointer = useRef(null), touchStart = useRef({ x: 0, y: 0 })
  const onJoyStart = e => { e.preventDefault(); joystick.current?.setPointerCapture?.(e.pointerId); pointer.current = e.pointerId; const r = e.currentTarget.getBoundingClientRect(); touchStart.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; updateJoy(e) }
  const updateJoy = e => { if (pointer.current !== e.pointerId) return; const dx = e.clientX - touchStart.current.x, dy = e.clientY - touchStart.current.y; setTouchMove({ x: Math.max(-1, Math.min(1, dx / 36)), y: Math.max(-1, Math.min(1, dy / 36)) }) }
  const stopJoy = e => { if (pointer.current === e.pointerId) { pointer.current = null; setTouchMove({ x: 0, y: 0 }) } }
  useEffect(() => { const clear = () => { pointer.current = null; setTouchMove({ x: 0, y: 0 }) }; window.addEventListener('blur', clear); return () => window.removeEventListener('blur', clear) }, [setTouchMove])
  const won = status === 'won', paused = status === 'paused'
  const levelNum = String(levelIndex + 1).padStart(2, '0')
  return <div className="ui-layer">
    <header className="topbar">
      <div className="brand-mark"><Compass size={23}/></div>
      <div className="brand"><div className="eyebrow">{levelData.chapter}</div><div className="game-name">{levelData.title} <span>/</span> <i>{levelData.subtitle}</i></div></div>
      <div className="crystal-counter"><div className="gem-icon"><Gem size={20}/></div><div><small>ANCIENT CRYSTALS</small><strong>{String(crystals).padStart(2, '0')} <em>/ {total}</em></strong></div><div className="crystal-progress">{Array.from({ length: total }, (_, i) => <span key={i} className={i < crystals ? 'filled' : ''}/>)}</div></div>
      <button className="icon-button pause-button" aria-label="Pause game" onClick={() => setStatus(paused ? 'playing' : 'paused')}><Pause size={18}/></button>
    </header>
    <section className="quest-card"><div className="quest-symbol"><Sparkles size={19}/></div><div><div className="quest-label">CURRENT QUEST</div><div className="quest-title">{crystals === total ? 'The portal awaits' : 'Find the lost crystals'}</div><div className="quest-copy">{crystals === total ? 'Return to the ancient portal to leave the island.' : `Gather all ${total} crystals to awaken the ancient portal.`}</div></div><div className="quest-count">{crystals}/{total}</div></section>
    <div className="location-tag"><span className="location-dot"/> {levelData.location}</div>
    {!mobile && <div className="desktop-hints"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> MOVE</span><span><kbd>SHIFT</kbd> SPRINT</span><span><kbd>SPACE</kbd> JUMP</span><span><MousePointer2 size={13}/> DRAG TO LOOK</span><span><kbd>ESC</kbd> PAUSE</span></div>}
    {mobile && status === 'playing' && <div className="mobile-controls">
      <div ref={joystick} className="joystick" onPointerDown={onJoyStart} onPointerMove={updateJoy} onPointerUp={stopJoy} onPointerCancel={stopJoy} onLostPointerCapture={stopJoy}><div className="joystick-knob"/><span>MOVE</span></div>
      <div className="mobile-actions"><button className={`action-button ${sprint ? 'active' : ''}`} onPointerDown={e => e.preventDefault()} onClick={() => setSprint(s => !s)}><Footprints size={19}/><span>RUN</span></button><button className="action-button jump-action" onPointerDown={e => { e.preventDefault(); setJumpSignal(n => n + 1) }}><span className="jump-arrow">↑</span><span>JUMP</span></button></div>
      <div className="touch-look"><MousePointer2 size={15}/> DRAG RIGHT SIDE TO LOOK</div>
    </div>}
    {(paused || won) && <div className="modal-backdrop"><div className="game-modal">
      <div className="modal-emblem">{won ? <Sparkles size={30}/> : <Pause size={28}/>}</div>
      <div className="modal-kicker">{won ? 'QUEST COMPLETE' : 'TAKE A BREATHER'}</div>
      <h1>{won ? 'The island is yours.' : 'Adventure paused.'}</h1>
      <p>{won
        ? hasNextLevel
          ? `You found all ${total} ancient crystals. A new challenge awaits beyond the portal.`
          : `You found all ${total} ancient crystals and completed all chapters. A legend is born.`
        : 'The wildlands will be right here when you are ready.'
      }</p>
      {won && <div className="victory-stats"><span><Gem size={16}/> {total}/{total} CRYSTALS</span><span>✦ LEVEL {levelNum} COMPLETE</span></div>}
      {won && hasNextLevel && <button className="primary-button" onClick={nextLevel}><ChevronRight size={17}/> NEXT LEVEL</button>}
      {won && !hasNextLevel && <button className="primary-button" onClick={restart}><RotateCcw size={17}/> PLAY AGAIN</button>}
      {!won && <button className="primary-button" onClick={() => setStatus('playing')}><Play size={17}/> RESUME ADVENTURE</button>}
      <button className="secondary-button" onClick={restart}><RotateCcw size={15}/> RESTART LEVEL</button>
      <button className="modal-close" aria-label="Close menu" onClick={() => setStatus('playing')}><X size={18}/></button>
    </div></div>}
    <div className="bottom-note"><span className="status-pulse"/> ISLAND EXPEDITION <span className="note-divider">/</span> LEVEL {levelNum}</div>
  </div>
}

