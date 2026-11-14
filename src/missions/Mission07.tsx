import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Gauge, Slider } from './shared/Controls'
import type { MissionComponentProps } from './types'

type Clump = { id: number; x: number; y: number; cleared: boolean }

const CLUMPS: Clump[] = [
  { id: 1, x: 20, y: 30, cleared: false },
  { id: 2, x: 42, y: 22, cleared: false },
  { id: 3, x: 67, y: 36, cleared: false },
  { id: 4, x: 32, y: 58, cleared: false },
  { id: 5, x: 56, y: 66, cleared: false },
  { id: 6, x: 78, y: 60, cleared: false },
  { id: 7, x: 50, y: 44, cleared: false },
]

export function Mission07({ onSolve, onFail }: MissionComponentProps) {
  const [clumps, setClumps] = useState(CLUMPS)
  const [probe, setProbe] = useState(false)
  const [phase, setPhase] = useState<'hopper' | 'reactor'>('hopper')
  const [temperature, setTemperature] = useState(640)
  const [hydrogen, setHydrogen] = useState(20)
  const [current, setCurrent] = useState(18)
  const [stability, setStability] = useState(0)
  const [message, setMessage] = useState(
    'Clear the electrostatic clumps from the feed hopper with the vibration probe.',
  )
  const hopperRef = useRef<HTMLDivElement>(null)
  const solved = useRef(false)
  const overheat = useRef(0)
  const probingRef = useRef(false)
  const failed = useRef(false)
  const [probePos, setProbePos] = useState({ x: 50, y: 50 })

  const cleared = clumps.filter((clump) => clump.cleared).length
  const tempOk = temperature >= 900 && temperature <= 1000
  const hydrogenOk = hydrogen >= 45 && hydrogen <= 55
  const currentOk = current >= 45 && current <= 55
  const allOk = tempOk && hydrogenOk && currentOk
  const o2 = Math.round(52 + (stability / 100) * 48)

  useEffect(() => {
    if (phase === 'hopper' && cleared === clumps.length) {
      setPhase('reactor')
      setMessage('Feed clear. Ramp the reactor to 950 °C and balance the hydrogen loop.')
    }
  }, [cleared, clumps.length, phase])

  const probeMove = (event: PointerEvent<HTMLDivElement>) => {
    if (phase !== 'hopper') return
    const hopper = hopperRef.current
    if (!hopper) return
    const rect = hopper.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setProbePos({ x, y })
    if (!probingRef.current) return
    setClumps((currentClumps) => {
      let changed = false
      const next = currentClumps.map((clump) => {
        if (clump.cleared) return clump
        if (Math.hypot(clump.x - x, clump.y - y) < 10) {
          changed = true
          return { ...clump, cleared: true }
        }
        return clump
      })
      return changed ? next : currentClumps
    })
  }

  useEffect(() => {
    if (phase !== 'reactor') return
    const id = window.setInterval(() => {
      setStability((currentStability) =>
        Math.min(100, Math.max(0, currentStability + (allOk ? 5 : -3))),
      )
      if (temperature > 1100) {
        overheat.current += 0.5
        if (overheat.current >= 4 && !failed.current) {
          failed.current = true
          onFail('The reactor bed overheated and sintered the feed.')
        }
      } else {
        overheat.current = Math.max(0, overheat.current - 0.25)
      }
    }, 260)
    return () => window.clearInterval(id)
  }, [allOk, onFail, phase, temperature])

  useEffect(() => {
    if (stability < 100 || solved.current) return
    solved.current = true
    onSolve({
      accuracy: Math.max(20, 100 - Math.round(overheat.current) * 18),
      notes: [
        'Ilmenite reduced at 950 °C.',
        'Hydrogen recycle balanced with the electrolyzer.',
        'Oxygen reserve returned to 100%.',
      ],
    })
  }, [onSolve, stability])

  return (
    <div className="mission-workspace isru">
      <div className="mission-column">
        <div className="hopper-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Feed hopper · electrostatic clumps</span>
            <span className="mono">{cleared}/7 cleared</span>
          </div>

          <div
            aria-label="Regolith hopper"
            className={`hopper ${probe ? 'is-probing' : ''}`}
            onPointerDown={(event) => {
              probingRef.current = true
              setProbe(true)
              probeMove(event)
            }}
            onPointerLeave={() => {
              probingRef.current = false
              setProbe(false)
            }}
            onPointerMove={probeMove}
            onPointerUp={() => {
              probingRef.current = false
              setProbe(false)
            }}
            ref={hopperRef}
          >
            <div className="hopper__mesh" />
            {clumps.map((clump) => (
              <span
                className={`hopper__clump ${clump.cleared ? 'is-cleared' : ''}`}
                key={clump.id}
                style={{ left: `${clump.x}%`, top: `${clump.y}%` }}
              />
            ))}
            {probe ? (
              <span
                className="hopper__probe"
                style={{ left: `${probePos.x}%`, top: `${probePos.y}%` }}
              />
            ) : null}
            <span className="hopper__label">FEED MESH · 1/6 g REGOLITH</span>
          </div>

          <div className="reactor-gauges">
            <Gauge
              danger={!tempOk}
              label="Bed temp"
              max={1200}
              min={600}
              tone={tempOk ? 'green' : 'amber'}
              unit=" °C"
              value={temperature}
            />
            <Gauge
              danger={!hydrogenOk}
              label="H₂ recycle"
              max={100}
              min={0}
              tone={hydrogenOk ? 'green' : 'amber'}
              unit="%"
              value={hydrogen}
            />
            <Gauge
              danger={!currentOk}
              label="Cell current"
              max={100}
              min={0}
              tone={currentOk ? 'green' : 'amber'}
              unit="%"
              value={current}
            />
          </div>

          <div className="readout-row">
            <div className="readout">
              <span>Feed cleared</span>
              <strong className={cleared === clumps.length ? 'is-good' : ''}>
                {cleared}/7
              </strong>
            </div>
            <div className="readout">
              <span>Bed setpoint</span>
              <strong className={tempOk ? 'is-good' : ''}>950 °C</strong>
            </div>
            <div className="readout">
              <span>O₂ purity</span>
              <strong className={stability >= 100 ? 'is-good' : ''}>
                {stability >= 100 ? '98%' : '—'}
              </strong>
            </div>
          </div>

          {phase === 'hopper' ? (
            <p className="console-message">
              Drag the vibration probe across every clump to clear the auger feed.
            </p>
          ) : (
            <p aria-live="polite" className={`console-message ${temperature > 1100 ? 'is-warn' : ''}`}>
              {temperature > 1100
                ? 'Bed temperature critical. Back off the heater.'
                : allOk
                  ? 'Reaction stable. Hold the balance until the oxygen tank is full.'
                  : 'Bring temperature and both flow meters into the green bands.'}
            </p>
          )}
        </div>
      </div>

      <div className="mission-column mission-column--wide">
        <div className="reactor-panel panel">
          <div className="panel-title">
            <span className="eyebrow">ROxygen reactor · FeTiO₃ + H₂</span>
            <span className={allOk ? 'status status--good' : 'status status--warn'}>
              {allOk ? 'Reduction running' : phase === 'hopper' ? 'Feed blocked' : 'Ramping'}
            </span>
          </div>

          <p className="reactor-equation">
            Moon dirt + hydrogen → iron + titanium dioxide + water. Electricity then
            splits the water into oxygen for the crew and hydrogen to use again.
          </p>

          <div className="reactor-core">
            <div className="reactor-core__chamber">
              <span className="reactor-core__glow" />
              <span className="reactor-core__bed" />
              <i style={{ opacity: phase === 'reactor' ? 1 : 0.2 }} />
            </div>
            <div className="reactor-core__pipes">
              <span />
              <span />
              <span />
            </div>
            <div className="o2-tank">
              <div>
                <i style={{ height: `${o2}%` }} />
              </div>
              <span>O₂</span>
              <strong>{o2}%</strong>
            </div>
          </div>

          <div className="reactor-controls">
            <Slider
              disabled={phase !== 'reactor'}
              label="Reactor bed temperature"
              max={1200}
              min={600}
              onChange={setTemperature}
              step={10}
              target={[900, 1000]}
              unit=" °C"
              value={temperature}
            />
            <Slider
              disabled={phase !== 'reactor'}
              label="Hydrogen recycle flow"
              max={100}
              min={0}
              onChange={setHydrogen}
              target={[45, 55]}
              unit="%"
              value={hydrogen}
            />
            <Slider
              disabled={phase !== 'reactor'}
              label="Electrolyzer cell current"
              max={100}
              min={0}
              onChange={setCurrent}
              target={[45, 55]}
              unit="%"
              value={current}
            />
          </div>

          <div className="stability-track">
            <i style={{ width: `${stability}%` }} />
          </div>
          <div className="reactor-status">
            <span>Stability</span>
            <strong>{Math.round(stability)}%</strong>
            <span>O₂ output</span>
            <strong>{Math.round(stability * 0.38)} kg/day</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
