import { useState, type ReactNode } from 'react'
import { buildTelemetry, type TelemetryReading } from '../game/telemetry'
import type { GameState } from '../game/types'

function ReadingCard({ reading }: { reading: TelemetryReading }) {
  return (
    <div className={`telemetry-card telemetry-card--${reading.tone}`}>
      <span className="telemetry-card__label">{reading.label}</span>
      <span className="telemetry-card__value">
        {reading.value}
        <small>{reading.unit}</small>
      </span>
    </div>
  )
}

function ReadingRow({ reading }: { reading: TelemetryReading }) {
  return (
    <li className={`telemetry-row telemetry-row--${reading.tone}`}>
      <span aria-hidden="true" className="telemetry-row__dot" />
      <div className="telemetry-row__body">
        <div className="telemetry-row__head">
          <strong>{reading.label}</strong>
          <span>
            {reading.value} {reading.unit}
          </span>
        </div>
        <p>{reading.detail}</p>
        <small>{reading.limit}</small>
        <em>{reading.source}</em>
      </div>
    </li>
  )
}

export function TelemetryHud({
  state,
  compact = false,
}: {
  state: GameState
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const telemetry = buildTelemetry(state)

  return (
    <section
      aria-label="Outpost telemetry"
      className={`telemetry ${compact ? 'telemetry--compact' : ''}`}
    >
      <div className="telemetry__primary">
        {telemetry.primary.map((reading) => (
          <ReadingCard key={reading.id} reading={reading} />
        ))}
      </div>

      <button
        aria-expanded={open}
        className="telemetry__toggle"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? 'Hide details' : 'All systems'}
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      {open ? (
        <div className="telemetry__drawer">
          <div className="telemetry__drawer-head">
            <span className="eyebrow">Outpost telemetry</span>
            <small>Live values · NASA limits</small>
          </div>
          <ul>
            {telemetry.primary.map((reading) => (
              <ReadingRow key={reading.id} reading={reading} />
            ))}
            {telemetry.secondary.map((reading) => (
              <ReadingRow key={reading.id} reading={reading} />
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

export function Brand({
  day,
  code,
  right,
}: {
  day?: number
  code?: string
  right?: ReactNode
}) {
  return (
    <div className="brand-bar">
      <div className="brand-bar__mark">
        <span className="brand-bar__luna">LUNA</span>
        <span className="brand-bar__sub">OUTPOST 57</span>
      </div>
      <div className="brand-bar__meta">
        {day ? <span>DAY {String(day).padStart(2, '0')}</span> : null}
        {code ? <span>{code}</span> : null}
      </div>
      {right ? <div className="brand-bar__right">{right}</div> : null}
    </div>
  )
}
