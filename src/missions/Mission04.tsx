import { useMemo, useState } from 'react'
import { Gauge, Toggle } from './shared/Controls'
import { requiredShelterCoverage } from '../game/state'
import type { MissionComponentProps } from './types'

type ShieldType = 'water' | 'food' | 'tile'

type Unit = {
  type: ShieldType
  label: string
  detail: string
  density: number
  symbol: string
}

const UNITS: Unit[] = [
  { type: 'water', label: 'Water bladder', detail: '+5 g/cm² · hydrogen-rich', density: 5, symbol: '◒' },
  { type: 'food', label: 'Food crate', detail: '+10 g/cm² · dense supplies', density: 10, symbol: '▣' },
  { type: 'tile', label: 'Waste tile', detail: '+4 g/cm² · polyethylene', density: 4, symbol: '▤' },
]

const UNIT_BY_TYPE = Object.fromEntries(UNITS.map((unit) => [unit.type, unit])) as Record<
  ShieldType,
  Unit
>

const ZONE_COUNT = 5
const TARGET_DENSITY = 20

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

export function Mission04({ state, onSolve }: MissionComponentProps) {
  const [selected, setSelected] = useState<ShieldType | null>('water')
  const [counts, setCounts] = useState<Record<ShieldType, number>>({
    water: 8,
    food: 4,
    tile: state.flags.shieldTiles,
  })
  const [zones, setZones] = useState<ShieldType[][]>(
    Array.from({ length: ZONE_COUNT }, () => []),
  )
  const [breakers, setBreakers] = useState<Record<string, boolean>>(
    Object.fromEntries(BREAKERS.map((breaker) => [breaker.id, true])),
  )
  const [message, setMessage] = useState(
    'Build 20 g/cm² of hydrogen-rich shielding around each shelter zone. Then shed enough power to stay under 4.5 kW.',
  )

  const densities = zones.map((zone) =>
    zone.reduce((sum, type) => sum + UNIT_BY_TYPE[type].density, 0),
  )
  const shieldedZones = densities.filter((density) => density >= TARGET_DENSITY).length
  const coverage = Math.round((shieldedZones / ZONE_COUNT) * 100)
  const required = requiredShelterCoverage(state)
  const averageDensity =
    densities.reduce((sum, density) => sum + density, 0) / ZONE_COUNT
  const dose = Math.max(30, Math.round(300 - averageDensity * 9))
  const load = BREAKERS.reduce(
    (sum, breaker) => sum + (breakers[breaker.id] ? breaker.draw : 0),
    0,
  )
  const lifeSupport = breakers.eclss
  const powerOk = load <= 4.5
  const doseOk = dose < 250
  const ready = coverage >= required && powerOk && lifeSupport && doseOk

  const available = useMemo(
    () => (selected ? counts[selected] : 0),
    [counts, selected],
  )

  const place = (index: number) => {
    if (!selected) {
      setMessage('Pick a shielding material first.')
      return
    }
    if (counts[selected] <= 0) {
      setMessage('No units of that type left. Choose another material.')
      return
    }
    if (densities[index] >= TARGET_DENSITY) {
      setMessage(`Zone ${index + 1} already has 20 g/cm². Shield a different zone.`)
      return
    }
    setZones((current) =>
      current.map((zone, zoneIndex) =>
        zoneIndex === index ? [...zone, selected] : zone,
      ),
    )
    setCounts((current) => ({ ...current, [selected]: current[selected] - 1 }))
    setMessage(
      `Zone ${index + 1} now has ${densities[index] + UNIT_BY_TYPE[selected].density} g/cm² of shielding.`,
    )
  }

  const clearZone = (index: number) => {
    const removed = zones[index]
    if (removed.length === 0) return
    setZones((current) =>
      current.map((zone, zoneIndex) => (zoneIndex === index ? [] : zone)),
    )
    setCounts((current) => {
      const next = { ...current }
      for (const type of removed) next[type] += 1
      return next
    })
    setMessage(`Zone ${index + 1} cleared. Units returned to the supply rack.`)
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
        `Coverage is ${coverage}%. The storm shelter needs ${required}% of the zones at 20 g/cm².`,
      )
      return
    }
    if (!doseOk) {
      setMessage(`Estimated dose is ${dose} mSv. Add more shielding to get below 250 mSv.`)
      return
    }
    onSolve({
      accuracy: coverage,
      shelterCoverage: coverage,
      breakerLoad: load,
      notes: [
        `${coverage}% of the shelter zones have 20 g/cm² of shielding.`,
        `Estimated dose ${dose} mSv, below the 250 mSv limit.`,
        `Battery load ${load.toFixed(1)} kW, inside the 4.5 kW storm limit.`,
      ],
    })
  }

  return (
    <div className="mission-workspace spe">
      <div className="mission-column mission-column--wide">
        <div className="shelter-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Storm shelter · 5 zones · 15 crew</span>
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

          <div className="shelter-grid">
            {zones.map((zone, index) => {
              const density = densities[index]
              const shielded = density >= TARGET_DENSITY
              return (
                <div className={`shelter-zone ${shielded ? 'is-shielded' : ''}`} key={index}>
                  <button
                    className="shelter-zone__place"
                    onClick={() => place(index)}
                    type="button"
                  >
                    <span>Zone {index + 1}</span>
                    <strong>{density} g/cm²</strong>
                    <small>{shielded ? 'Crew shielded' : `${TARGET_DENSITY - density} more needed`}</small>
                    <i>
                      <b style={{ width: `${Math.min(100, (density / TARGET_DENSITY) * 100)}%` }} />
                    </i>
                  </button>
                  <button
                    className="shelter-zone__clear"
                    disabled={zone.length === 0}
                    onClick={() => clearZone(index)}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              )
            })}
          </div>

          <div className="shelter-status">
            <Gauge
              danger={!doseOk}
              label="Dose estimate"
              max={350}
              min={0}
              tone={doseOk ? 'green' : 'red'}
              unit=" mSv"
              value={dose}
            />
            <div className="shelter-status__text">
              <span>Selected material</span>
              <strong>{selected ? `${available} ${UNIT_BY_TYPE[selected].label.toLowerCase()}s ready` : 'None'}</strong>
              <small>
                Water gives 5 g/cm², food gives 10, waste tiles give 4. NASA targets
                20 g/cm² around a storm shelter.
              </small>
            </div>
          </div>

          <p aria-live="polite" className="console-message">{message}</p>
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
                  : !doseOk
                    ? 'Add more shielding to lower the dose.'
                    : `Cover at least ${required}% of the zones with 20 g/cm².`}
            </small>
          ) : null}
        </div>
      </div>
    </div>
  )
}
