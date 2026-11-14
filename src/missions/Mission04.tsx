import { useMemo, useState } from 'react'
import { Gauge, Toggle } from './shared/Controls'
import { requiredShelterCoverage } from '../game/state'
import type { MissionComponentProps } from './types'

type ShieldType = 'water' | 'food' | 'tile'

type Unit = {
  type: ShieldType
  label: string
  detail: string
  symbol: string
}

const UNITS: Unit[] = [
  { type: 'water', label: 'Water bladder', detail: 'Hydrogen-rich', symbol: '◒' },
  { type: 'food', label: 'Food crate', detail: 'Dense supplies', symbol: '▣' },
  { type: 'tile', label: 'Waste tile', detail: 'Polyethylene', symbol: '▤' },
]

type Breaker = {
  id: string
  label: string
  draw: number
  essential?: boolean
}

const BREAKERS: Breaker[] = [
  { id: 'eclss', label: 'Life support', draw: 2.2, essential: true },
  { id: 'heat', label: 'Cabin heating', draw: 1.3 },
  { id: 'lab', label: 'Science lab', draw: 1.2 },
  { id: 'science', label: 'Surface sensors', draw: 0.9 },
  { id: 'comms', label: 'Comms relay', draw: 0.8 },
  { id: 'lights', label: 'Non-critical lights', draw: 0.4 },
]

const BUNKS = Array.from({ length: 15 }, (_, index) => index)

export function Mission04({ state, onSolve }: MissionComponentProps) {
  const [selected, setSelected] = useState<ShieldType | null>('water')
  const [counts, setCounts] = useState<Record<ShieldType, number>>({
    water: 8,
    food: 4,
    tile: state.flags.shieldTiles,
  })
  const [bunks, setBunks] = useState<Array<ShieldType | null>>(
    Array.from({ length: 15 }, () => null),
  )
  const [breakers, setBreakers] = useState<Record<string, boolean>>(
    Object.fromEntries(BREAKERS.map((breaker) => [breaker.id, true])),
  )
  const [message, setMessage] = useState(
    'Place shielding on the crew bunks. Then shed enough load to stay inside the battery limit.',
  )

  const covered = bunks.filter(Boolean).length
  const coverage = Math.round((covered / BUNKS.length) * 100)
  const required = requiredShelterCoverage(state)
  const load = BREAKERS.reduce(
    (sum, breaker) => sum + (breakers[breaker.id] ? breaker.draw : 0),
    0,
  )
  const dose = Math.max(70, Math.round(420 - coverage * 2.7))
  const lifeSupport = breakers.eclss
  const powerOk = load <= 4.5
  const ready = coverage >= required && powerOk && lifeSupport

  const available = useMemo(
    () => (selected ? counts[selected] : 0),
    [counts, selected],
  )

  const place = (index: number) => {
    const existing = bunks[index]
    if (existing) {
      setBunks((current) => current.map((value, i) => (i === index ? null : value)))
      setCounts((current) => ({ ...current, [existing]: current[existing] + 1 }))
      setMessage('Shield unit returned to the supply rack.')
      return
    }
    if (!selected || counts[selected] <= 0) {
      setMessage('No units of that type left. Choose another shielding material.')
      return
    }
    setBunks((current) => current.map((value, i) => (i === index ? selected : value)))
    setCounts((current) => ({ ...current, [selected]: current[selected] - 1 }))
    setMessage(
      `Bunk ${index + 1} shielded with ${UNITS.find((unit) => unit.type === selected)?.label.toLowerCase()}.`,
    )
  }

  const seal = () => {
    if (!lifeSupport) {
      setMessage('Life support is offline. The shelter cannot be certified without it.')
      return
    }
    if (!powerOk) {
      setMessage('Battery load is too high. Shed another breaker before sealing.')
      return
    }
    if (coverage < required) {
      setMessage(
        `Coverage is ${coverage}%. The storm shelter needs ${required}% to keep the crew below 250 mSv.`,
      )
      return
    }
    onSolve({
      accuracy: coverage,
      shelterCoverage: coverage,
      breakerLoad: load,
      notes: [
        `${coverage}% of the crew bunks shielded.`,
        `Estimated dose ${dose} mSv, below the 250 mSv limit.`,
        `Battery load ${load.toFixed(1)} kW, inside the 4.5 kW storm limit.`,
      ],
    })
  }

  return (
    <div className="mission-workspace spe">
      <div className="mission-column mission-column--wide">
        <div className="bunk-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Crew storm shelter · 15 bunks</span>
            <span className="mono">{coverage}% covered · goal {required}%</span>
          </div>

          <div className="shield-picker">
            {UNITS.map((unit) => (
              <button
                aria-pressed={selected === unit.type}
                className={`shield-unit shield-unit--${unit.type} ${selected === unit.type ? 'is-selected' : ''}`}
                disabled={counts[unit.type] <= 0}
                key={unit.type}
                onClick={() => setSelected(unit.type)}
                type="button"
              >
                <span aria-hidden="true">{unit.symbol}</span>
                <strong>{unit.label}</strong>
                <small>{unit.detail}</small>
                <b>{counts[unit.type]} left</b>
              </button>
            ))}
          </div>

          <div className="bunk-grid">
            {BUNKS.map((index) => {
              const unit = bunks[index]
              return (
                <button
                  className={`bunk ${unit ? `bunk--${unit}` : ''}`}
                  key={index}
                  onClick={() => place(index)}
                  type="button"
                >
                  <span>{unit ? UNITS.find((item) => item.type === unit)?.symbol : 'BUNK'}</span>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                </button>
              )
            })}
          </div>

          <div className="shelter-status">
            <Gauge
              danger={dose >= 250}
              label="Dose estimate"
              max={400}
              min={0}
              tone={dose < 250 ? 'green' : 'red'}
              unit=" mSv"
              value={dose}
            />
            <div className="shelter-status__text">
              <span>Selected material</span>
              <strong>{selected ? `${available} ${selected} units ready` : 'None'}</strong>
              <small>Click a bunk to place. Click a shielded bunk to return the unit.</small>
            </div>
          </div>

          <p className="console-message">{message}</p>
        </div>
      </div>

      <div className="mission-column">
        <div className="breaker-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Load shed · battery limit 4.5 kW</span>
            <span className={powerOk ? 'status status--good' : 'status status--warn'}>
              {load.toFixed(1)} kW
            </span>
          </div>

          <div className="breakers">
            {BREAKERS.map((breaker) => (
              <Toggle
                active={breakers[breaker.id]}
                detail={`${breaker.draw.toFixed(1)} kW${breaker.essential ? ' · essential' : ''}`}
                key={breaker.id}
                label={breaker.label}
                onChange={(active) =>
                  setBreakers((current) => ({ ...current, [breaker.id]: active }))
                }
                tone={breaker.essential ? 'red' : 'cyan'}
              />
            ))}
          </div>

          <div className="load-bar">
            <span>Battery load</span>
            <div>
              <i style={{ width: `${Math.min(100, (load / 6.8) * 100)}%` }} />
              <b style={{ left: `${(4.5 / 6.8) * 100}%` }} />
            </div>
            <small>White marker = 4.5 kW limit</small>
          </div>

          <button
            className="btn btn--primary btn--wide"
            disabled={!ready}
            onClick={seal}
            type="button"
          >
            Seal the shelter
          </button>
          {!ready ? (
            <small className="breaker-hint">
              {!lifeSupport
                ? 'Life support must remain on.'
                : !powerOk
                  ? 'Shed more non-essential load.'
                  : `Cover at least ${required}% of the bunks.`}
            </small>
          ) : null}
        </div>
      </div>
    </div>
  )
}
