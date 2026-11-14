import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Slider } from './shared/Controls'
import type { MissionComponentProps } from './types'

type Clump = { id: number; x: number; y: number; cleared: boolean }

const CLUMPS: Clump[] = [
  { id: 1, x: 22, y: 28, cleared: false },
  { id: 2, x: 47, y: 18, cleared: false },
  { id: 3, x: 74, y: 34, cleared: false },
  { id: 4, x: 34, y: 62, cleared: false },
  { id: 5, x: 66, y: 72, cleared: false },
]

function wavePath(frequency: number, voltage: number): string {
  const amplitude = 8 + (voltage / 100) * 32
  const waves = 0.6 + (frequency / 100) * 4.4
  const points: string[] = []
  for (let index = 0; index <= 120; index += 1) {
    const x = (index / 120) * 320
    const y = 60 - Math.sin((index / 120) * Math.PI * 2 * waves) * amplitude
    points.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return points.join(' ')
}

export function Mission01({ onSolve, onFail }: MissionComponentProps) {
  const [frequency, setFrequency] = useState(24)
  const [voltage, setVoltage] = useState(38)
  const [engaged, setEngaged] = useState(false)
  const [clumps, setClumps] = useState(CLUMPS)
  const [errors, setErrors] = useState(0)
  const [probing, setProbing] = useState(false)
  const [message, setMessage] = useState(
    'Match the electric wave to the dust layer, then engage the shield.',
  )
  const panelRef = useRef<HTMLDivElement>(null)
  const solved = useRef(false)
  const probingRef = useRef(false)
  const [probePos, setProbePos] = useState({ x: 50, y: 50 })

  const inBand = frequency >= 42 && frequency <= 58 && voltage >= 60 && voltage <= 80
  const cleared = clumps.filter((clump) => clump.cleared).length

  useEffect(() => {
    if (solved.current || cleared < clumps.length) return
    solved.current = true
    const timer = window.setTimeout(() => {
      onSolve({
        accuracy: Math.max(20, 100 - errors * 12),
        notes: [
          'Block A is back to 100% output.',
          `${errors === 0 ? 'No arcing events' : `${errors} arcing event${errors > 1 ? 's' : ''} logged`}.`,
        ],
      })
    }, 500)
    return () => window.clearTimeout(timer)
  }, [cleared, clumps.length, errors, onSolve])

  const engage = () => {
    if (engaged) return
    if (!inBand) {
      const nextErrors = errors + 1
      setErrors(nextErrors)
      setMessage(
        nextErrors >= 5
          ? 'Dielectric arcing is damaging the cover glass. The array is offline.'
          : 'Arc detected across the grid. Lower the voltage or retune the frequency.',
      )
      if (nextErrors >= 5) onFail('Dielectric arcing destroyed the solar cover glass.')
      return
    }
    setEngaged(true)
    setMessage('Dust is lifting. Move the field probe over each clump to confirm it cleared.')
  }

  const probeMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!engaged) return
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setProbePos({ x, y })
    if (!probingRef.current) return
    setClumps((current) => {
      let changed = false
      const next = current.map((clump) => {
        if (clump.cleared) return clump
        const distance = Math.hypot(clump.x - x, clump.y - y)
        if (distance < 9) {
          changed = true
          return { ...clump, cleared: true }
        }
        return clump
      })
      return changed ? next : current
    })
  }

  return (
    <div className="mission-workspace eds">
      <div className="mission-column">
        <div className="console-panel panel">
          <div className="panel-title">
            <span className="eyebrow">EDS console</span>
            <span className={inBand ? 'status status--good' : 'status status--warn'}>
              {inBand ? 'Resonance matched' : 'Off resonance'}
            </span>
          </div>

          <svg aria-label="AC wave oscilloscope" className="oscilloscope" viewBox="0 0 320 140">
            <defs>
              <linearGradient id="wave-glow" x1="0" x2="1">
                <stop offset="0" stopColor="#82e6df" stopOpacity="0.2" />
                <stop offset="0.5" stopColor="#82e6df" />
                <stop offset="1" stopColor="#f3b15d" />
              </linearGradient>
            </defs>
            <g opacity="0.22" stroke="#82e6df" strokeWidth="1">
              <path d="M0 20h320M0 45h320M0 70h320M0 95h320M0 120h320" />
              <path d="M40 0v140M80 0v140M120 0v140M160 0v140M200 0v140M240 0v140M280 0v140" />
            </g>
            <path
              d={wavePath(frequency, voltage)}
              fill="none"
              stroke="url(#wave-glow)"
              strokeWidth="3"
            />
            <circle cx="320" cy="60" fill="#fff" opacity="0.4" r="2" />
          </svg>

          <Slider
            label="AC wave frequency"
            max={100}
            min={10}
            onChange={setFrequency}
            target={[42, 58]}
            unit=" Hz"
            value={frequency}
          />
          <Slider
            label="Phase voltage"
            max={100}
            min={0}
            onChange={setVoltage}
            target={[60, 80]}
            unit="%"
            value={voltage}
          />

          <button
            className="btn btn--primary btn--wide"
            disabled={engaged}
            onClick={engage}
            type="button"
          >
            {engaged ? 'Wave engaged' : 'Engage dust shield'}
          </button>
          <p className={`console-message ${errors > 0 ? 'is-warn' : ''}`}>{message}</p>
        </div>
      </div>

      <div className="mission-column mission-column--wide">
        <div className="solar-rig">
          <div className="solar-rig__header">
            <span className="eyebrow">Block A · panel 04</span>
            <span className="mono">{cleared}/5 clumps cleared</span>
          </div>
          <div
            aria-label="Solar panel dust removal area"
            className={`solar-panel ${engaged ? 'is-engaged' : ''} ${probing ? 'is-probing' : ''}`}
            onPointerDown={(event) => {
              probingRef.current = true
              setProbing(true)
              probeMove(event)
            }}
            onPointerLeave={() => {
              probingRef.current = false
              setProbing(false)
            }}
            onPointerMove={probeMove}
            onPointerUp={() => {
              probingRef.current = false
              setProbing(false)
            }}
            ref={panelRef}
          >
            <div className="solar-panel__cells" />
            {clumps.map((clump) => (
              <span
                className={`dust-clump ${clump.cleared ? 'is-cleared' : ''}`}
                key={clump.id}
                style={{ left: `${clump.x}%`, top: `${clump.y}%` }}
              />
            ))}
            {engaged ? <span className="solar-panel__wave" /> : null}
            {engaged ? (
              <span
                className="solar-panel__probe"
                style={{ left: `${probePos.x}%`, top: `${probePos.y}%` }}
              />
            ) : null}
            <span className="solar-panel__label">EDS GRID · ITO ELECTRODES · NO CONTACT</span>
          </div>
        </div>

        <div className="readout-row">
          <div className="readout">
            <span>Panel efficiency</span>
            <strong>{engaged ? 62 + cleared * 7 : 52}%</strong>
          </div>
          <div className="readout">
            <span>Dust charge</span>
            <strong>{engaged ? 'lifting' : 'adhered'}</strong>
          </div>
          <div className="readout">
            <span>Arcing events</span>
            <strong className={errors > 0 ? 'is-bad' : ''}>{errors}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
