export type Resources = {
  power: number
  lifeSupport: number
  food: number
  rescue: number
}

const labels: Array<{ key: keyof Resources; label: string; icon: string }> = [
  { key: 'power', label: 'Power', icon: '⚡' },
  { key: 'lifeSupport', label: 'Life support', icon: '◉' },
  { key: 'food', label: 'Food', icon: '⌁' },
  { key: 'rescue', label: 'Rescue', icon: '⌁' },
]

export function ResourceRibbon({ resources }: { resources: Resources }) {
  return (
    <aside className="resource-ribbon" aria-label="Outpost resources">
      {labels.map(({ key, label, icon }) => (
        <div className="resource" key={key}>
          <span className="resource__icon" aria-hidden="true">
            {icon}
          </span>
          <span className="resource__copy">
            <span>{label}</span>
            <strong>{resources[key]}%</strong>
          </span>
          <span className="resource__track" aria-hidden="true">
            <span style={{ width: `${resources[key]}%` }} />
          </span>
        </div>
      ))}
    </aside>
  )
}

