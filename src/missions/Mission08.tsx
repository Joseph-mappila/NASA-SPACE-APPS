import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { MissionComponentProps } from './types'

const QUEUE = [
  { id: 'eclss', label: 'Critical ECLSS telemetry', detail: 'Oxygen · CO₂ · pressure', priority: 1 },
  { id: 'crew', label: 'Crew health bundle', detail: 'Dose · sleep · vitals', priority: 2 },
  { id: 'nav', label: 'Navigation state', detail: 'Attitude · orbit', priority: 3 },
  { id: 'science', label: 'Science logs', detail: 'Camera · samples', priority: 4 },
]

const QUEUE_ORDER = ['eclss', 'crew', 'nav', 'science']

function shuffled<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

export function Mission08({ onSolve, onFail }: MissionComponentProps) {
  const [reticle, setReticle] = useState({ x: 50, y: 50 })
  const [dragging, setDragging] = useState(false)
  const [lock, setLock] = useState(0)
  const [locked, setLocked] = useState(false)
  const [packets, setPackets] = useState(() => shuffled(QUEUE))
  const [chosen, setChosen] = useState<string[]>([])
  const [errors, setErrors] = useState(0)
  const [message, setMessage] = useState(
    'Drag the reticle onto the moving Ka-band carrier. Hold it inside the ring.',
  )
  const radarRef = useRef<HTMLDivElement>(null)
  const signalRef = useRef<HTMLSpanElement>(null)
  const reticleRef = useRef(reticle)
  const lockRef = useRef(0)
  const lockedRef = useRef(false)
  const chosenRef = useRef<string[]>([])
  const solved = useRef(false)
  const errorsRef = useRef(0)

  reticleRef.current = reticle

  const maybeSolve = () => {
    if (solved.current) return
    if (lockedRef.current && chosenRef.current.length === QUEUE.length) {
      solved.current = true
      onSolve({
        accuracy: Math.max(30, 100 - errorsRef.current * 10),
        signalLocked: true,
        packetsPrioritized: true,
        notes: [
          'Ka-band pointing error held below 0.2°.',
          'Critical ECLSS telemetry sent first.',
          'Houston certifies Outpost Luna for the lunar night.',
        ],
      })
    }
  }

  useEffect(() => {
    let frame = 0
    let last = performance.now()
    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000)
      last = time
      const angle = (time / 1000) * 0.82
      const signalX = 50 + Math.cos(angle) * 27 + Math.sin(angle * 2.3) * 3
      const signalY = 50 + Math.sin(angle * 0.93) * 23 + Math.cos(angle * 1.7) * 3
      if (signalRef.current) {
        signalRef.current.style.left = `${signalX}%`
        signalRef.current.style.top = `${signalY}%`
      }
      const distance = Math.hypot(
        signalX - reticleRef.current.x,
        signalY - reticleRef.current.y,
      )
      const inside = distance < 9
      lockRef.current = Math.min(
        1,
        Math.max(0, lockRef.current + (inside ? dt / 2.6 : -dt / 4)),
      )
      setLock((current) => {
        const next = Math.round(lockRef.current * 20) / 20
        return current === next ? current : next
      })
      if (lockRef.current >= 1 && !lockedRef.current) {
        lockedRef.current = true
        setLocked(true)
        setMessage('Signal locked. Now prioritize the DTN queue: ECLSS first.')
      }
      if (!lockedRef.current) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const moveReticle = (event: PointerEvent<HTMLDivElement>, force = false) => {
    if ((!dragging && !force) || locked) return
    const radar = radarRef.current
    if (!radar) return
    const rect = radar.getBoundingClientRect()
    const x = Math.min(96, Math.max(4, ((event.clientX - rect.left) / rect.width) * 100))
    const y = Math.min(96, Math.max(4, ((event.clientY - rect.top) / rect.height) * 100))
    setReticle({ x, y })
  }

  const choose = (id: string) => {
    if (chosenRef.current.includes(id)) return
    const nextIndex = chosenRef.current.length
    const expected = QUEUE_ORDER[nextIndex]
    if (id !== expected) {
      const nextErrors = errorsRef.current + 1
      setErrors(nextErrors)
      errorsRef.current = nextErrors
      setChosen([])
      chosenRef.current = []
      setMessage(
        nextErrors >= 4
          ? 'Mission Control has lost the priority queue. The certification window is closing.'
          : 'Wrong priority. Critical life-support telemetry must go first.',
      )
      if (nextErrors >= 4) {
        onFail('Mission Control rejected the DTN priority queue.')
      }
      return
    }
    const nextChosen = [...chosenRef.current, id]
    setChosen(nextChosen)
    chosenRef.current = nextChosen
    setMessage(
      nextIndex === QUEUE.length - 1
        ? lockedRef.current
          ? 'Queue transmitted. Awaiting Houston certification.'
          : 'Queue is ready. Lock the Ka-band signal to transmit.'
        : `Packet ${nextChosen.length}/4 queued.`,
    )
    if (nextChosen.length === QUEUE.length && lockedRef.current) {
      maybeSolve()
    }
  }

  useEffect(() => {
    if (locked) maybeSolve()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, chosen])

  return (
    <div className="mission-workspace lunanet">
      <div className="mission-column mission-column--wide">
        <div className="radar-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Ka-band acquisition · 23/27 GHz</span>
            <span className={locked ? 'status status--good' : 'status status--warn'}>
              {locked ? 'Signal locked' : `Lock ${Math.round(lock * 100)}%`}
            </span>
          </div>

          <div
            aria-label="LunaNet dish pointing radar"
            className={`radar ${dragging ? 'is-dragging' : ''} ${locked ? 'is-locked' : ''}`}
            onPointerDown={(event) => {
              setDragging(true)
              moveReticle(event, true)
            }}
            onPointerLeave={() => setDragging(false)}
            onPointerMove={moveReticle}
            onPointerUp={() => setDragging(false)}
            ref={radarRef}
          >
            <span className="radar__sweep" />
            <span className="radar__ring radar__ring--one" />
            <span className="radar__ring radar__ring--two" />
            <span className="radar__ring radar__ring--three" />
            <span className="radar__cross radar__cross--x" />
            <span className="radar__cross radar__cross--y" />
            <span className="radar__signal" ref={signalRef} />
            <span
              className="radar__reticle"
              style={{ left: `${reticle.x}%`, top: `${reticle.y}%` }}
            >
              <i />
              <b />
            </span>
            <span className="radar__label">AZ 214.6° · EL 38.2° · ERROR 0.18°</span>
          </div>

          <div className="lock-track">
            <i style={{ width: `${lock * 100}%` }} />
          </div>
          <p className={`console-message ${errors > 0 ? 'is-warn' : ''}`}>{message}</p>
        </div>
      </div>

      <div className="mission-column">
        <div className="dtn-panel panel">
          <div className="panel-title">
            <span className="eyebrow">DTN bundle queue</span>
            <span className="mono">{chosen.length}/4 sent</span>
          </div>

          <div className="packet-list">
            {packets.map((packet) => (
              <button
                className={`packet ${chosen.includes(packet.id) ? 'is-sent' : ''}`}
                disabled={chosen.includes(packet.id)}
                key={packet.id}
                onClick={() => choose(packet.id)}
                type="button"
              >
                <span>{String(packets.indexOf(packet) + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{packet.label}</strong>
                  <small>{packet.detail}</small>
                </div>
                <b>{chosen.includes(packet.id) ? 'SENT' : 'QUEUE'}</b>
              </button>
            ))}
          </div>

          <div className="queue-order">
            <span>Transmit order</span>
            <ol>
              {QUEUE_ORDER.map((id, index) => (
                <li className={chosen[index] === id ? 'is-done' : ''} key={id}>
                  {QUEUE.find((packet) => packet.id === id)?.label}
                </li>
              ))}
            </ol>
          </div>

          <div className="dtn-footer">
            <span>Priority</span>
            <strong>Life support &gt; crew &gt; navigation &gt; science</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
