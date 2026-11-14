import { useEffect, useRef, useState } from 'react'
import { Gauge } from './shared/Controls'
import type { MissionComponentProps } from './types'

type Bed = {
  id: string
  moisture: number
  ppco2: number
  temperature: number
}

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

const BED_BASE: Bed[] = [
  { id: 'A', moisture: 11, ppco2: 1.7, temperature: 21.8 },
  { id: 'B', moisture: 14, ppco2: 1.8, temperature: 22.1 },
  { id: 'C', moisture: 12, ppco2: 1.9, temperature: 22.4 },
]

const BUBBLES = [
  { id: 1, x: 22, y: 32 },
  { id: 2, x: 43, y: 18 },
  { id: 3, x: 66, y: 28 },
  { id: 4, x: 76, y: 58 },
  { id: 5, x: 52, y: 72 },
  { id: 6, x: 28, y: 62 },
]

export function Mission05({ state, onSolve, onFail }: MissionComponentProps) {
  const [faulty] = useState(() => Math.floor(Math.random() * 3))
  const [beds] = useState<Bed[]>(() =>
    BED_BASE.map((bed, index) =>
      index === faulty
        ? { ...bed, moisture: 82, ppco2: 3.4, temperature: 18.6 }
        : bed,
    ),
  )
  const [inspected, setInspected] = useState<string[]>([])
  const [cabinOpen, setCabinOpen] = useState(true)
  const [bedOpen, setBedOpen] = useState(true)
  const [vacuumOpen, setVacuumOpen] = useState(false)
  const [step, setStep] = useState<Step>(0)
  const [bubbles, setBubbles] = useState(BUBBLES)
  const [errors, setErrors] = useState(0)
  const [message, setMessage] = useState(
    'Inspect the three amine beds. Find the one holding moisture.',
  )
  const solved = useRef(false)

  const glitch = state.flags.brownout
  const faultyBed = beds[faulty]
  const bubblesLeft = bubbles.length

  useEffect(() => {
    if (step < 7 || bubbles.length > 0 || solved.current) return
    solved.current = true
    onSolve({
      accuracy: Math.max(25, 100 - errors * 12),
      notes: [
        `Moisture-fouled bed ${faultyBed.id} replaced.`,
        'Cabin CO₂ returning below 1.8 mmHg.',
        'Coolant loop clear and thermal rejection stable at 22 °C.',
      ],
    })
  }, [bubbles.length, errors, faultyBed.id, onSolve, step])

  const error = (text: string) => {
    const next = errors + 1
    setErrors(next)
    setMessage(text)
    if (next >= 4) {
      onFail('The valve sequence vented cabin air into space.')
    }
  }

  const advance = (next: Step) => {
    setStep(next)
  }

  const toggleValve = (valve: 'cabin' | 'bed' | 'vacuum') => {
    if (valve === 'cabin') {
      if (step === 0 && cabinOpen) {
        setCabinOpen(false)
        advance(1)
        setMessage('Cabin isolation closed. Now close the bed isolation valve.')
      } else if (step === 6 && !cabinOpen) {
        setCabinOpen(true)
        advance(7)
        setMessage('Cabin isolation reopened. Now bleed the coolant loop.')
      } else {
        error('Cabin isolation valve is out of sequence.')
      }
      return
    }
    if (valve === 'bed') {
      if (step === 1 && bedOpen) {
        setBedOpen(false)
        advance(2)
        setMessage('Bed isolation closed. Open the vacuum-desorb valve.')
      } else if (step === 5 && !bedOpen) {
        setBedOpen(true)
        advance(6)
        setMessage('Bed isolation reopened. Open cabin isolation.')
      } else {
        error('Bed isolation valve is out of sequence.')
      }
      return
    }
    if (valve === 'vacuum') {
      if (step === 2 && !vacuumOpen) {
        setVacuumOpen(true)
        advance(3)
        setMessage('Vacuum path open. Swap the moisture-fouled ORU now.')
      } else if (step === 4 && vacuumOpen) {
        setVacuumOpen(false)
        advance(5)
        setMessage('Vacuum path closed. Open bed isolation.')
      } else {
        error('Vacuum valve is out of sequence.')
      }
    }
  }

  const replace = () => {
    if (step !== 3) {
      error('The vacuum path is not ready. Complete the isolation sequence first.')
      return
    }
    if (!inspected.includes(faultyBed.id)) {
      setMessage(
        `Inspect the three amine beds first. You must confirm which bed is fouled before opening the ORU.`,
      )
      return
    }
    advance(4)
    setMessage('ORU replaced. Close the vacuum path, then reopen the bed and cabin valves.')
  }

  const inspect = (bed: Bed) => {
    setInspected((current) =>
      current.includes(bed.id) ? current : [...current, bed.id],
    )
    setMessage(
      bed.moisture > 50
        ? `Bed ${bed.id} is saturated. Moisture ${bed.moisture}% · CO₂ ${bed.ppco2} mmHg.`
        : `Bed ${bed.id} is dry. Moisture ${bed.moisture}% · CO₂ ${bed.ppco2} mmHg.`,
    )
  }

  const bleed = (id: number) => {
    if (step < 7) {
      setMessage('Finish the valve and ORU sequence before bleeding the coolant loop.')
      return
    }
    setBubbles((current) => current.filter((bubble) => bubble.id !== id))
  }

  const stepLabels = [
    'Close cabin isolation',
    'Close bed isolation',
    'Open vacuum desorb',
    'Swap the ORU',
    'Close vacuum desorb',
    'Open bed isolation',
    'Open cabin isolation',
  ]

  return (
    <div className="mission-workspace eclss">
      <div className="mission-column mission-column--wide">
        <div className="beds-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Rapid cycling amine · three beds</span>
            <span className={glitch ? 'status status--warn' : 'status status--good'}>
              {glitch ? 'Sensor brownout' : 'Telemetry stable'}
            </span>
          </div>

          <div className="bed-grid">
            {beds.map((bed, index) => {
              const isFaulty = index === faulty
              const isInspected = inspected.includes(bed.id)
              return (
                <button
                  className={`scrubber-bed ${isInspected ? 'is-inspected' : ''} ${isFaulty && isInspected ? 'is-faulty' : ''}`}
                  key={bed.id}
                  onClick={() => inspect(bed)}
                  type="button"
                >
                  <span className="scrubber-bed__id">{bed.id}</span>
                  <div className="scrubber-bed__readouts">
                    <span>
                      Moisture
                      <strong className={glitch ? 'is-glitch' : ''}>
                        {glitch ? Math.round(bed.moisture + Math.random() * 8) : bed.moisture}%
                      </strong>
                    </span>
                    <span>
                      CO₂
                      <strong className={glitch ? 'is-glitch' : ''}>
                        {(glitch ? bed.ppco2 + Math.random() * 0.6 : bed.ppco2).toFixed(1)} mmHg
                      </strong>
                    </span>
                    <span>
                      Temp
                      <strong>{(glitch ? bed.temperature + Math.random() * 2 : bed.temperature).toFixed(1)} °C</strong>
                    </span>
                  </div>
                  <small>{isInspected ? (isFaulty ? 'moisture-fouled' : 'nominal') : 'tap to inspect'}</small>
                </button>
              )
            })}
          </div>

          <div className="valve-board">
            <span className="eyebrow">Valve sequence</span>
            <div className="valves">
              <button
                aria-pressed={cabinOpen}
                className={`valve ${cabinOpen ? 'is-open' : ''}`}
                onClick={() => toggleValve('cabin')}
                type="button"
              >
                <i />
                <strong>Cabin isolation</strong>
                <small>{cabinOpen ? 'OPEN' : 'CLOSED'}</small>
              </button>
              <button
                aria-pressed={bedOpen}
                className={`valve ${bedOpen ? 'is-open' : ''}`}
                onClick={() => toggleValve('bed')}
                type="button"
              >
                <i />
                <strong>Bed isolation</strong>
                <small>{bedOpen ? 'OPEN' : 'CLOSED'}</small>
              </button>
              <button
                aria-pressed={vacuumOpen}
                className={`valve valve--vacuum ${vacuumOpen ? 'is-open' : ''}`}
                onClick={() => toggleValve('vacuum')}
                type="button"
              >
                <i />
                <strong>Vacuum desorb</strong>
                <small>{vacuumOpen ? 'OPEN' : 'CLOSED'}</small>
              </button>
              <button
                className={`valve valve--oru ${step >= 4 ? 'is-done' : ''}`}
                disabled={step !== 3}
                onClick={replace}
                type="button"
              >
                <i />
                <strong>Swap ORU</strong>
                <small>{step >= 4 ? 'SWAPPED' : 'READY'}</small>
              </button>
            </div>
            <div className="valve-progress">
              {stepLabels.map((label, index) => (
                <span className={index < step ? 'is-done' : index === step ? 'is-next' : ''} key={label}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <p className={`console-message ${errors > 0 ? 'is-warn' : ''}`}>{message}</p>
        </div>
      </div>

      <div className="mission-column">
        <div className="coolant-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Coolant loop · bleed</span>
            <span className="mono">{bubblesLeft}/6 bubbles</span>
          </div>

          <div className="coolant-loop">
            <span className="coolant-loop__pipe" />
            {bubbles.map((bubble) => (
              <button
                aria-label="Bleed coolant bubble"
                className="coolant-bubble"
                key={bubble.id}
                onClick={() => bleed(bubble.id)}
                style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                type="button"
              />
            ))}
            <span className="coolant-loop__flow" />
          </div>

          <div className="eclss-gauges">
            <Gauge
              danger={step < 7}
              label="Cabin CO₂"
              max={6}
              min={0}
              tone={step >= 7 ? 'green' : 'amber'}
              unit=" mmHg"
              value={step >= 7 ? 1.8 : 3.4}
            />
            <Gauge
              label="Loop temp"
              max={40}
              min={0}
              tone="cyan"
              unit=" °C"
              value={step >= 4 ? 22 : 28}
            />
          </div>

          {step >= 7 ? (
            <p className="console-message is-good">Valve sequence complete. Clear the bubbles.</p>
          ) : (
            <p className="console-message">
              The coolant loop is locked until the cabin is back in the atmospheric loop.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
