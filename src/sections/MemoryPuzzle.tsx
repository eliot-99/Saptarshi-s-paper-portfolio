import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { Brain } from '@phosphor-icons/react/dist/csr/Brain'
import type { PortfolioData } from '../types/portfolio'

const letters = ['S', 'G', 'C', 'D']
export function MemoryPuzzle({ data }: { data: PortfolioData }) {
  const [open, setOpen] = useState(false)
  const [sequence, setSequence] = useState<number[]>([])
  const [phase, setPhase] = useState<'idle' | 'watch' | 'play' | 'lost'>('idle')
  const [active, setActive] = useState(-1)
  const [status, setStatus] = useState('A little exercise for your eye and memory.')
  const inputIndex = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => () => clear(), [])
  const play = (next: number[]) => {
    clear(); setSequence(next); inputIndex.current = 0; setPhase('watch'); setStatus('Watch the sequence, then repeat it.')
    next.forEach((value, index) => {
      timers.current.push(setTimeout(() => setActive(value), 600 + index * 700))
      timers.current.push(setTimeout(() => setActive(-1), 1030 + index * 700))
    })
    timers.current.push(setTimeout(() => { setPhase('play'); setStatus('Your turn. Repeat the sequence.') }, 600 + next.length * 700))
  }
  const press = (index: number) => {
    if (phase !== 'play') return
    setActive(index); timers.current.push(setTimeout(() => setActive(-1), 200))
    if (sequence[inputIndex.current] !== index) { clear(); setActive(-1); setPhase('lost'); setStatus(`You reached round ${sequence.length}. Ready for another edition?`); return }
    inputIndex.current += 1
    if (inputIndex.current === sequence.length) { setPhase('watch'); setStatus('Well spotted. The next round adds one letter.'); timers.current.push(setTimeout(() => play([...sequence, Math.floor(Math.random() * 4)]), 750)) }
  }
  return <section id="puzzle" className="puzzle-section"><div><p className="folio">{data.editorial.puzzleEyebrow}</p><h2 className="preserve-lines">{data.editorial.puzzleTitle}</h2></div><div className="puzzle-copy"><p>{data.editorial.puzzleDescription}</p><button className="text-link" onClick={() => { setOpen(!open); clear(); setPhase('idle'); setActive(-1) }}>{open ? 'Fold the puzzle' : data.editorial.puzzleAction} <ArrowRight size={20} /></button></div>{open && <div className="puzzle-board"><div className="puzzle-top"><Brain size={26} /><span className="folio">ROUND {Math.max(1, sequence.length)}</span><button className="ink-button" onClick={() => play([Math.floor(Math.random() * 4)])}>{phase === 'idle' ? 'Start puzzle' : 'Restart'}</button></div><div className="puzzle-keys">{letters.map((letter, index) => <button key={letter} disabled={phase !== 'play'} className={active === index ? 'lit' : ''} onClick={() => press(index)} aria-label={`Letter ${letter}`}>{letter}</button>)}</div><p role="status">{status}</p></div>}</section>
}
