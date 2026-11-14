import { useRef, useState, type PointerEvent } from 'react'
import { Gauge, HoldButton } from './shared/Controls'
import type { MissionComponentProps } from './types'

type Side = 'inner' | 'outer'

type DustSpot = { id: number; x: number; y: number; cleared: boolean }

const SPOTS: DustSpot[] = [
  { id: 1, x: 30, y: 26, cleared: false },
  { id: 2, x: 68, y: 40, cleared: false },
  { id: 3, x: 44, y: 70, cleared: false },
]

export function Mission03({ onSolve, onFail }: MissionComponentProps) {
  const [leakSide] = useState<Side>(() => (Math.random() > 0.5 ? 'inner' : 'outer'))
  const [found, setFound] = useState(false)
  const [spots, setSpots] = useState(SPOTS)
  const [reseated, setReseated] = useState(false)
  const [brushing, setBrushing] = useState(false)
  const [errors, setErrors] = useState(0)
  const [message, setMessage] = useState('Run a pressure-decay scan on both hatches.')
  const sealRef = useRef<HTMLDivElement>(null)
  const brushingRef = useRef(false)
  const solved = useRef(false)

  const cleared = spots.filter((spot) => spot.cleared).length
  const allClear = cleared === spots.length

  const scan = (side: Side) => {
    if (found) return
    if (side === leakSide) {
      setFound(true)
      setMessage(
        `Pressure decay confirmed at the ${side} hatch. Inspect the O-ring groove and clear the regolith.`,
      )
    } else {
      setMessage(`The ${side} hatch is holding 8.2 psia. Scan the other hatch.`)
    }
  }

  const wipe = (event: PointerEvent<HTMLDivElement>) => {
    if (!brushingRef.current || !found || reseated) return
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
      const next = errors + 1
      setErrors(next)
      setMessage('Regolith is still trapped in the groove. Wipe all three spots first.')
      if (next >= 3) onFail('The O-ring was reseated over trapped regolith and failed the pressure test.')
      return
    }
    setReseated(true)
    setMessage('O-ring reseated. Hold the pump to bring the airlock back to 8.2 psia.')
  }

  const pump = () => {
    if (!reseated || solved.current) return
    solved.current = true
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
            {(['inner', 'outer'] as Side[]).map((side) => (
              <button
                className={`hatch ${found && side === leakSide ? 'is-leaking' : ''} ${found && side !== leakSide ? 'is-sealed' : ''}`}
                key={side}
                onClick={() => scan(side)}
                type="button"
              >
                <span className="hatch__ring" />
                <span className="hatch__window" />
                <strong>{side} hatch</strong>
                <small>
                  {found
                    ? side === leakSide
                      ? 'ΔP decay · leak'
                      : 'ΔP stable'
                    : 'Tap to scan'}
                </small>
                {found && side === leakSide ? <i className="hatch__bubble" /> : null}
              </button>
            ))}
          </div>

          <div className="airlock-gauges">
            <Gauge label="Cabin pressure" max={14} min={0} tone="amber" unit=" psia" value={reseated ? 8.2 : 7.6} />
            <Gauge label="Leak rate" max={10} min={0} danger={!reseated} tone={reseated ? 'green' : 'red'} unit=" sccm" value={reseated ? 0.2 : 3.8} />
          </div>

          <p className={`console-message ${errors > 0 ? 'is-warn' : ''}`}>{message}</p>
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
            className={`seal ${brushing ? 'is-brushing' : ''} ${reseated ? 'is-sealed' : ''}`}
            onPointerDown={(event) => {
              brushingRef.current = true
              setBrushing(true)
              wipe(event)
            }}
            onPointerLeave={() => {
              brushingRef.current = false
              setBrushing(false)
            }}
            onPointerMove={wipe}
            onPointerUp={() => {
              brushingRef.current = false
              setBrushing(false)
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
              <span>Errors</span>
              <strong className={errors > 0 ? 'is-bad' : ''}>{errors}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
