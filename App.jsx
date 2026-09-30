import { useState, useEffect, useRef } from 'react'
import S from './data/story'

function Reveal({ lines, gap = 1800, big, onDone }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= lines.length) { onDone && onDone(); return }
    const t = setTimeout(() => setN(n + 1), n ? gap : 700)
    return () => clearTimeout(t)
  }, [n])
  return (
    <div className="lines" onClick={() => setN(x => Math.min(x + 1, lines.length))}>
      {lines.slice(0, n).map((l, i) => <p key={i} className={'ln' + (big ? ' big' : '')}>{l}</p>)}
    </div>
  )
}
const Next = ({ onClick, children = 'keep going' }) => <button className="btn soft fade" onClick={onClick}>{children}</button>

function Entry({ next }) {
  const [d, setD] = useState(false)
  return <><Reveal lines={S.entry} gap={2200} onDone={() => setD(true)} />{d && <button className="btn enter fade" onClick={next}>[ ENTER ]</button>}</>
}

function GC({ next }) {
  const [n, setN] = useState(0), [f, setF] = useState(false), [d, setD] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => n < S.gc.length ? setN(n + 1) : setF(true), n < S.gc.length ? 450 : 900)
    return () => clearTimeout(t)
  }, [n])
  return (
    <div className={'gc' + (f ? ' frozen' : '')}>
      {S.gc.slice(0, n).map((m, i) => <span key={i} className="bub" style={{ left: (i * 37) % 62 + 4 + '%', top: (i * 23) % 62 + 6 + '%' }}>{m}</span>)}
      {f && <div className="center"><h2 className="name">Surbhi</h2><Reveal lines={S.gcAfter} gap={2600} onDone={() => setD(true)} />{d && <Next onClick={next} />}</div>}
    </div>
  )
}

function Little({ next }) {
  const [d, setD] = useState(false), [j, setJ] = useState(false)
  return (
    <div className="center">
      {!j ? <>
        <Reveal lines={S.little} onDone={() => setD(true)} />
        {d && <span className="jw fade" onClick={() => setJ(true)}>jaanu</span>}
      </> : <div className="warm" onClick={() => {}}>
        {S.jaanu.map((t, i) => <span key={i} className="hand note" style={{ left: (i * 41) % 70 + 8 + '%', top: (i * 29) % 60 + 10 + '%', animationDelay: i * 0.5 + 's' }}>{t}</span>)}
        <p className="ln hand late">{S.jaanuEnd}</p>
      </div>}
      {(d || j) && <Next onClick={next} />}
    </div>
  )
}

function Memories({ next, egg }) {
  const [st, setSt] = useState({})
  const opened = Object.values(st).filter(v => v > 0).length
  return (
    <div className="memwrap">
      <p className="hint">{opened ? 'there\u2019s more' : 'explore'}</p>
      {S.memories.map((m, i) => {
        const s = st[i] || 0
        return (
          <div key={i} className={'card s' + s} onClick={() => setSt({ ...st, [i]: Math.min(s + 1, 2) })}>
            {s === 0 ? <><span className="hand">{m.clue}</span><h3 className="blur">{m.title}</h3></> : <>
              <h3>{m.title}</h3>
              <div className="ph">{m.photo ? <img src={import.meta.env.BASE_URL + m.photo} alt="" /> : m.label}</div>
              <p>{s === 1 ? m.peek : m.full}</p>
              {s === 1 && <small className="hand">look closer</small>}</>}
          </div>
        )
      })}
      <i className="dot" onClick={egg} />
      {opened > 0 && <Next onClick={next} />}
    </div>
  )
}

function Distance({ next }) {
  const [n, setN] = useState(0)
  return (
    <div className="center">
      <svg viewBox="0 0 100 60" className="dist" onClick={() => setN(x => Math.min(x + 1, 6))}>
        <circle cx="10" cy="30" r="1.6" className="pt" /><circle cx="90" cy="30" r="1.6" className="pt" />
        <line x1="10" y1="30" x2="90" y2="30" className="lin" style={{ opacity: 0.2 + n * 0.13 }} />
        <text x="10" y="38" className="cap">me</text><text x="90" y="38" className="cap">her</text>
        {S.fragments.slice(0, n).map((f, i) => <text key={f} x={22 + i * 14} y={i % 2 ? 40 : 21} className="frag">{f}</text>)}
      </svg>
      <p className="hint">{n === 0 ? 'touch the line' : n < 5 ? 'keep touching' : ''}</p>
      {n >= 5 && <><p className="ln big fade">{S.distanceEnd}</p><Next onClick={next} /></>}
    </div>
  )
}

function Lines({ lines, next, big, gap, label }) {
  const [d, setD] = useState(false)
  return <div className="center"><Reveal lines={lines} big={big} gap={gap} onDone={() => setD(true)} />{d && <Next onClick={next}>{label}</Next>}</div>
}

function Love({ next }) {
  const [sel, setSel] = useState(null), [seen, setSeen] = useState({})
  const n = Object.keys(seen).length
  return (
    <div className="room">
      <p className="hint">{n ? 'there\u2019s more' : 'look around'}</p>
      {S.love.map(([t, g], i) => (
        <button key={i} className={'obj' + (seen[i] ? ' seen' : '')} style={{ left: (i * 43) % 70 + 8 + '%', top: (i * 31) % 55 + 14 + '%', animationDelay: -i * 1.3 + 's' }}
          onClick={() => { setSel(i); setSeen({ ...seen, [i]: 1 }) }} aria-label="object">{g}</button>
      ))}
      {sel !== null && <p key={sel} className="ln big reveal-pop">{S.love[sel][0]}</p>}
      {n >= 4 && <Next onClick={next} />}
    </div>
  )
}

// Z + S constellation. Every tap lights the next star.
const P = [[10, 22], [38, 22], [10, 56], [38, 56], [90, 22], [62, 22], [62, 39], [90, 39], [90, 56], [62, 56]]
const L = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]
function Stars({ next }) {
  const [n, setN] = useState(1), [d, setD] = useState(false), [fin, setFin] = useState(false)
  const done = n >= P.length
  useEffect(() => { if (done) { const t = setTimeout(() => setFin(true), 1600); return () => clearTimeout(t) } }, [done])
  return (
    <div className="center sky" onPointerDown={() => !done && setN(n + 1)}>
      <svg viewBox="0 0 100 80" className={'const' + (fin ? ' up' : '')}>
        {L.map(([a, b], i) => n > b && <line key={i} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} className="cl" />)}
        {P.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={n > i ? 1.5 : 0.5} className={n > i ? 'st on' : 'st'} />)}
      </svg>
      {!done && <p className="hint">touch the dark</p>}
      {fin && <div className="fin"><Reveal lines={S.constEnd} gap={2200} onDone={() => setD(true)} />{d && <Next onClick={next}>read the letter</Next>}</div>}
    </div>
  )
}

function Letter({ replay }) {
  return <div className="letter"><pre className="ln">{S.letter}</pre><button className="btn soft" onClick={replay}>start again</button></div>
}

const NAMES = ['entry', 'gc', 'little', 'memories', 'distance', 'wrong', 'love', 'apology', 'stars', 'letter']

export default function App() {
  const [sc, setSc] = useState(0), [max, setMax] = useState(0), [egg, setEgg] = useState(false)
  const [on, setOn] = useState(false), [has, setHas] = useState(true), au = useRef(null), touched = useRef(false)
  const go = i => { setSc(i); setMax(m => Math.max(m, i)); window.scrollTo(0, 0) }
  const next = () => go(sc + 1)

  useEffect(() => {
    const a = new Audio(import.meta.env.BASE_URL + 'audio/our-song.mp3')
    a.loop = true; a.volume = 0; a.onerror = () => setHas(false); au.current = a
    return () => a.pause()
  }, [])
  const target = !on ? 0 : sc === 5 || sc === 7 ? 0 : sc === 6 ? 0.15 : sc >= 8 ? 0.5 : 0.3
  useEffect(() => {
    const a = au.current; if (!a || !has) return
    if (target > 0 && a.paused) a.play().catch(() => {})
    const t = setInterval(() => {
      const diff = target - a.volume
      a.volume = Math.abs(diff) < 0.02 ? target : Math.max(0, Math.min(1, a.volume + Math.sign(diff) * 0.02))
      if (a.volume === target) clearInterval(t)
    }, 80)
    return () => clearInterval(t)
  }, [target, has])
  const firstTouch = () => { if (!touched.current) { touched.current = true; setOn(true) } }

  const V = [
    <Entry next={next} />, <GC next={next} />, <Little next={next} />, <Memories next={next} egg={() => setEgg(true)} />,
    <Distance next={next} />, <Lines lines={S.wrong} next={next} big gap={2400} label="keep going" />, <Love next={next} />,
    <Lines lines={S.apology} next={next} big gap={3000} label="look up" />, <Stars next={next} />, <Letter replay={() => go(0)} />,
  ]
  return (
    <main onPointerDown={firstTouch} className={'scene sc-' + NAMES[sc]}>
      <div className="grain" />
      <div className="stage" key={sc}>{V[sc]}</div>
      {sc > 0 && <nav className="prog" aria-label="progress">
        {NAMES.slice(1).map((_, k) => <button key={k} disabled={k + 1 > max} className={k + 1 <= sc ? 'on' : ''} onClick={() => go(k + 1)} aria-label={'scene ' + (k + 1)} />)}
      </nav>}
      {has && <button className="mus" onClick={() => { touched.current = true; setOn(o => !o) }}>{on ? 'music on' : 'music off'}</button>}
      {egg && <div className="egg" onClick={() => setEgg(false)}><p className="ln big hand">{S.egg}</p></div>}
    </main>
  )
}
