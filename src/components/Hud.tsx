import type { CSSProperties, ReactNode } from 'react'
import type { Resources } from '../game/types'

type MeterTone = 'cyan' | 'amber' | 'red' | 'green'

function toneFor(value: number): MeterTone {
  if (value <= 20) return 'red'
  if (value <= 50) return 'amber'
  return 'cyan'
}

const RESOURCE_LABELS: Array<{
  key: keyof Resources
  label: string
  code: string
  icon: string
}> = [
  { key: 'power', label: 'Power', code: 'PWR', icon: '⚡' },
  { key: 'oxygen', label: 'Oxygen', code: 'O₂', icon: '◌' },
  { key: 'waterFood', label: 'Water / Food', code: 'H₂O', icon: '◒' },
  { key: 'crewHealth', label: 'Crew health', code: 'CREW', icon: '✚' },
]

export function ResourceHud({ resources }: { resources: Resources }) {
  return (
    <div className="resource-hud" aria-label="Outpost resources">
      {RESOURCE_LABELS.map((item) => {
        const value = resources[item.key]
        const tone = toneFor(value)
        return (
          <div
            className={`resource-meter resource-meter--${tone}`}
            key={item.key}
            style={{ '--meter-value': `${value}%` } as CSSProperties}
          >
            <span aria-hidden="true" className="resource-meter__icon">
              {item.icon}
            </span>
            <span className="resource-meter__body">
              <span className="resource-meter__label">
                <b>{item.code}</b>
                <small>{item.label}</small>
              </span>
              <span className="resource-meter__track">
                <i />
              </span>
            </span>
            <strong>{value}%</strong>
          </div>
        )
      })}
    </div>
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
