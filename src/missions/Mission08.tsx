import { useEffect, useRef, useState } from 'react'
import { audio } from '../audio/engine'
import { shuffled } from '../game/random'
import { Gauge, Slider } from './shared/Controls'
import type { MissionComponentProps } from './types'

const QUEUE = [
  { id: 'eclss', label: 'Critical ECLSS telemetry', detail: 'Oxygen · CO₂ · pressure', priority: 1 },
  { id: 'crew', label: 'Crew health bundle', detail: 'Dose · sleep · vitals', priority: 2 },
  { id: 'nav', label: 'Navigation state', detail: 'Attitude · orbit', priority: 3 },
  { id: 'science', label: 'Science logs', detail: 'Camera · samples', priority: 4 },
]

const QUEUE_ORDER = ['eclss', 'crew', 'nav', 'science']

function angleGap(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180)
}

export function Mission08({ onSolve, onFail }: MissionComponentProps) {
  // Pick a fresh patch of sky on every run, spanning most of the plot while
  // staying away from the edges and from the starting dish position.
  const [target] = useState(() => ({
    azimuth: 180 + Math.random() * 140,
    elevation: 28 + Math.random() * 42,
  }))
  const [azimuth, setAzimuth] = useState(140)
  const [elevation, setElevation] = useState(12)
  const [lock, setLock] = useState(0)
  const [locked, setLocked] = useState(false)
  const [packets] = useState(() => shuffled(QUEUE))
  const [chosen, setChosen] = useState<string[]>([])
  const [errors, setErrors] = useState(0)
  const [message, setMessage] = useState(
    'Peak the dish on the LunaNet satellite. Move azimuth and elevation until the signal tops out.',
  )
  const lockRef = useRef(0)
  const lockedRef = useRef(false)
  const chosenRef = useRef<string[]>([])
  const solved = useRef(false)
  const errorsRef = useRef(0)

  const pointingError = Math.hypot(
    angleGap(azimuth, target.azimuth),
    elevation - target.elevation,
  )
  const signal = Math.max(0, Math.min(100, Math.round(100 - pointingError * 3.2)))
  const peaking = signal >= 90

  const maybeSolve = () => {
    if (solved.current) return
    if (lockedRef.current && chosenRef.current.length === QUEUE.length) {
      solved.current = true
      onSolve({
        accuracy: Math.max(30, 100 - errorsRef.current * 10),
        signalLocked: true,
        packetsPrioritized: true,
        notes: [
          `Ka-band pointing error held at ${pointingError.toFixed(1)}°.`,
          'Critical ECLSS telemetry sent first.',
          'Houston certifies Outpost Luna for the lunar night.',
        ],
      })
    }
  }

  useEffect(() => {
    if (locked) return
    const id = window.setInterval(() => {
      lockRef.current = Math.min(
        1,
        Math.max(0, lockRef.current + (peaking ? 0.09 : -0.12)),
      )
      setLock(Math.round(lockRef.current * 20) / 20)
      if (lockRef.current >= 1 && !lockedRef.current) {
        lockedRef.current = true
        setLocked(true)
        audio.radio()
        setMessage('Signal locked. Now send the DTN queue: life support first.')
      }
    }, 180)
    return () => window.clearInterval(id)
  }, [peaking, locked])

  const choose = (id: string) => {
    if (chosenRef.current.includes(id)) return
    const nextIndex = chosenRef.current.length
    const expected = QUEUE_ORDER[nextIndex]
    if (id !== expected) {
      audio.beep(300, 0.16, 0.045)
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
    audio.beep(1180, 0.06, 0.025)
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

  const beamX = 6 + (azimuth / 360) * 88
  const beamY = 6 + (1 - elevation / 90) * 88
  const targetX = 6 + (target.azimuth / 360) * 88
  const targetY = 6 + (1 - target.elevation / 90) * 88

  return (
    <div className="mission-workspace lunanet">
      <div className="mission-column mission-column--wide">
        <div className="antenna-panel panel">
          <div className="panel-title">
            <span className="eyebrow">LunaNet acquisition · Ka-band 23/27 GHz</span>
            <span className={locked ? 'status status--good' : peaking ? 'status status--warn' : 'status'}>
              {locked ? 'Signal locked' : peaking ? `Peaking · ${Math.round(lock * 100)}%` : 'Searching'}
            </span>
          </div>

          <div className="sky-plot" aria-label="Antenna sky plot">
            <span className="sky-plot__grid" />
            <span className="sky-plot__axis sky-plot__axis--x" />
            <span className="sky-plot__axis sky-plot__axis--y" />
            <span
              className={`sky-plot__target ${peaking ? 'is-near' : ''} ${locked ? 'is-locked' : ''}`}
              style={{ left: `${targetX}%`, top: `${targetY}%` }}
            >
              <i />
              <b>SAT</b>
            </span>
            <span
              className={`sky-plot__beam ${peaking ? 'is-near' : ''} ${locked ? 'is-locked' : ''}`}
              style={{ left: `${beamX}%`, top: `${beamY}%` }}
            />
            <span className="sky-plot__label">SKY PLOT · AZ LEFT–RIGHT · EL BOTTOM–TOP</span>
          </div>

          <div className="antenna-controls">
            <Slider
              label="Azimuth"
              max={360}
              min={0}
              onChange={setAzimuth}
              step={0.5}
              unit="°"
              value={azimuth}
              format={(value) => value.toFixed(1)}
            />
            <Slider
              label="Elevation"
              max={85}
              min={5}
              onChange={setElevation}
              step={0.5}
              unit="°"
              value={elevation}
              format={(value) => value.toFixed(1)}
            />
          </div>

          <div className="antenna-readouts">
            <Gauge
              label="Signal"
              max={100}
              min={0}
              tone={locked ? 'green' : peaking ? 'amber' : 'cyan'}
              unit="%"
              value={signal}
            />
            <div className="readout">
              <span>Pointing error</span>
              <strong className={peaking ? 'is-good' : ''}>{pointingError.toFixed(1)}°</strong>
            </div>
            <div className="readout">
              <span>Lock hold</span>
              <strong className={locked ? 'is-good' : ''}>{Math.round(lock * 100)}%</strong>
            </div>
          </div>

          <div className="lock-track">
            <i style={{ width: `${lock * 100}%` }} />
          </div>
          <p className={`console-message ${errors > 0 ? 'is-warn' : ''}`} aria-live="polite">
            {message}
          </p>
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
