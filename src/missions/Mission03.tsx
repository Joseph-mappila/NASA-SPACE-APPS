import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { audio } from '../audio/engine'
import { Gauge, HoldButton } from './shared/Controls'
import type { MissionComponentProps } from './types'

type Side = 'inner' | 'outer'

type DustSpot = { id: number; x: number; y: number; cleared: boolean }

const SPOTS: DustSpot[] = [
  { id: 1, x: 30, y: 26, cleared: false },
  { id: 2, x: 68, y: 40, cleared: false },
  { id: 3, x: 44, y: 70, cleared: false },
]

const SIDES: Side[] = ['inner', 'outer']

export function Mission03({ onSolve, onFail }: MissionComponentProps) {
  const [leakSide] = useState<Side>(() => (Math.random() > 0.5 ? 'inner' : 'outer'))
  const [found, setFound] = useState(false)
  const [tested, setTested] = useState<Record<Side, boolean>>({ inner: false, outer: false })
  const [testing, setTesting] = useState<Side | null>(null)
  const [spots, setSpots] = useState(SPOTS)
  const [reseated, setReseated] = useState(false)
  const [wiping, setWiping] = useState(false)
  const [errors, setErrors] = useState(0)
  const [message, setMessage] = useState(
    'Run a pressure-decay test on each hatch. The faster pressure drops, the bigger the leak.',
  )
  const sealRef = useRef<HTMLDivElement>(null)
  const wipingRef = useRef(false)
  const solved = useRef(false)
  const testTimer = useRef<number | null>(null)

  const cleared = spots.filter((spot) => spot.cleared).length
  const allClear = cleared === spots.length
  const lastCleared = useRef(0)

  useEffect(() => {
    if (cleared > lastCleared.current) audio.wipe()
    lastCleared.current = cleared
  }, [cleared])

  useEffect(() => {
    return () => {
      if (testTimer.current !== null) window.clearTimeout(testTimer.current)
    }
  }, [])

  const test = (side: Side) => {
    if (found || testing || tested[side]) return
    audio.pump()
    setTesting(side)
    setMessage(`Pressure-decay test running on the ${side} hatch…`)
    testTimer.current = window.setTimeout(() => {
      testTimer.current = null
      setTesting(null)
      setTested((current) => ({ ...current, [side]: true }))
      if (side === leakSide) {
        audio.scanner()
        setFound(true)
        setMessage(
          `Decay confirmed at the ${side} hatch: 3.8 sccm. Inspect the O-ring groove and clear the regolith.`,
        )
      } else {
        audio.beep(820, 0.1, 0.03)
        setMessage(`The ${side} hatch held pressure at 0.2 sccm. Test the other hatch.`)
      }
    }, 1400)
  }

  const wipe = (event: PointerEvent<HTMLDivElement>) => {
    if (!wipingRef.current || !found || reseated) return
    const seal = sealRef.current
    if (!seal) return
    const rect = seal.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setSpots((current) => {
      let changed = false
      const next = current.map((spot) => {
        if (spot.cleared) return spot
        if (Math.hypot(spot.x - x, spot.y - y) < 10) {
          changed = true
          return { ...spot, cleared: true }
        }
        return spot
      })
      return changed ? next : current
    })
  }

  const reseat = () => {
    if (!allClear) {
      audio.beep(300, 0.12, 0.035)
      const next = errors + 1
      setErrors(next)
      setMessage('Regolith is still trapped in the groove. Clean all three spots first.')
      if (next >= 3) onFail('The O-ring was reseated over trapped regolith and failed the pressure test.')
      return
    }
    audio.latch()
    setReseated(true)
    setMessage('O-ring reseated. Hold the pump until the cabin reaches 8.2 psia.')
  }

  const pump = () => {
    if (!reseated || solved.current) return
    solved.current = true
    audio.pump()
    onSolve({
      accuracy: Math.max(25, 100 - errors * 15),
      notes: [
        'Cabin pressure holds at 8.2 psia.',
        `Leak isolated to the ${leakSide} hatch.`,
        errors === 0 ? 'Clean seal, no repeated leaks.' : `${errors} failed seal attempt${errors > 1 ? 's' : ''}.`,
      ],
    })
  }

  return (
    <div className="mission-workspace airlock">
      <div className="mission-column">
        <div className="console-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Differential pressure test</span>
            <span className={found ? 'status status--good' : 'status status--warn'}>
              {found ? 'Leak isolated' : 'Leak active'}
            </span>
          </div>

          <div className="hatches">
            {SIDES.map((side) => {
              const isLeak = found && side === leakSide
              const isSealed = found && side !== leakSide
              return (
                <button
                  aria-pressed={tested[side]}
                  className={`hatch ${isLeak ? 'is-leaking' : ''} ${isSealed ? 'is-sealed' : ''}`}
                  disabled={found || testing !== null || tested[side]}
                  key={side}
                  onClick={() => test(side)}
                  type="button"
                >
                  <span className="hatch__ring" />
                  <span className="hatch__window" />
                  <strong>{side} hatch</strong>
                  <small>
                    {testing === side
                      ? 'Testing pressure…'
                      : tested[side]
                        ? side === leakSide
                          ? '3.8 sccm · leak'
                          : '0.2 sccm · stable'
                        : 'Run decay test'}
                  </small>
                  {isLeak ? <i className="hatch__bubble" /> : null}
                </button>
              )
            })}
          </div>

          <div className="airlock-gauges">
            <Gauge
              label="Cabin pressure"
              max={14}
              min={0}
              tone={reseated ? 'green' : 'amber'}
              unit=" psia"
              value={reseated ? 8.2 : found ? 7.6 : 8.0}
            />
            <Gauge
              danger={found && !reseated}
              label="Leak rate"
              max={10}
              min={0}
              tone={found && !reseated ? 'red' : 'green'}
              unit=" sccm"
              value={found && !reseated ? 3.8 : 0.2}
            />
          </div>

          <p aria-live="polite" className={`console-message ${errors > 0 ? 'is-warn' : ''}`}>
            {message}
          </p>
        </div>
      </div>

      <div className="mission-column mission-column--wide">
        <div className="seal-panel panel">
          <div className="panel-title">
            <span className="eyebrow">O-ring groove · borescope</span>
            <span className="mono">{cleared}/3 regolith spots</span>
          </div>

          <div
            aria-label="Airlock seal inspection area"
            className={`seal ${wiping ? 'is-wiping' : ''} ${reseated ? 'is-sealed' : ''}`}
            onPointerDown={(event) => {
              wipingRef.current = true
              setWiping(true)
              wipe(event)
            }}
            onPointerLeave={() => {
              wipingRef.current = false
              setWiping(false)
            }}
            onPointerMove={wipe}
            onPointerUp={() => {
              wipingRef.current = false
              setWiping(false)
            }}
            ref={sealRef}
          >
            <span className="seal__ring" />
            <span className="seal__groove" />
            {spots.map((spot) => (
              <span
                className={`seal__dust ${spot.cleared ? 'is-cleared' : ''}`}
                key={spot.id}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              />
            ))}
            <span className="seal__label">ELASTOMER GASKET · 8.2 psia BOUNDARY</span>
          </div>

          <div className="seal-actions">
            <button className="btn btn--small" disabled={!found || reseated} onClick={reseat} type="button">
              Reseat O-ring
            </button>
            <HoldButton
              disabled={!reseated}
              label="Hold to repressurize"
              onComplete={pump}
              durationMs={2200}
            />
          </div>

          <div className="seal-readouts">
            <div>
              <span>Regolith</span>
              <strong>{allClear ? 'clear' : `${3 - cleared} spots`}</strong>
            </div>
            <div>
              <span>Seal</span>
              <strong>{reseated ? 'reseated' : 'open'}</strong>
            </div>
            <div>
              <span>Retries</span>
              <strong className={errors > 0 ? 'is-bad' : ''}>{errors}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
