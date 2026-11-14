import { useMemo, useState } from 'react'

type Circuit = {
  id: string
  label: string
  demand: string
  symbol: string
}

const circuits: Circuit[] = [
  { id: 'air', label: 'Air circulation', demand: '3 units', symbol: 'AIR' },
  { id: 'monitor', label: 'Environment monitor', demand: '2 units', symbol: 'ENV' },
  { id: 'comms', label: 'Emergency communications', demand: '3 units', symbol: 'COM' },
]

export function ShelterRouting({
  unlocked,
  onComplete,
}: {
  unlocked: boolean
  onComplete: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [connected, setConnected] = useState<string[]>([])
  const complete = connected.length === circuits.length
  const status = useMemo(
    () => (complete ? 'Shelter power stable' : `${connected.length} of ${circuits.length} circuits connected`),
    [complete, connected.length],
  )

  function chooseCable(id: string) {
    if (!unlocked || connected.includes(id)) return
    setSelected(id)
  }

  function chooseSocket(id: string) {
    if (!unlocked || !selected) return
    if (selected === id && !connected.includes(id)) {
      const next = [...connected, id]
      setConnected(next)
      setSelected(null)
      if (next.length === circuits.length) {
        window.setTimeout(onComplete, 500)
      }
    }
  }

  return (
    <div className={`routing-game ${unlocked ? '' : 'routing-game--locked'}`}>
      <div className="routing-game__header">
        <div>
          <span className="kicker">Shelter distribution board</span>
          <h3>Connect each labeled cable</h3>
        </div>
        <span className={`routing-game__status ${complete ? 'is-complete' : ''}`} aria-live="polite">
          {status}
        </span>
      </div>

      {!unlocked && <p className="routing-game__lock">Make the mission decision above to unlock this procedure.</p>}

      <div className="routing-board">
        <div className="routing-column" aria-label="Power cables">
          <span className="routing-column__label">Battery bus</span>
          {circuits.map((circuit) => (
            <button
              className={`circuit-node ${selected === circuit.id ? 'is-selected' : ''} ${
                connected.includes(circuit.id) ? 'is-connected' : ''
              }`}
              disabled={!unlocked || connected.includes(circuit.id)}
              key={circuit.id}
              onClick={() => chooseCable(circuit.id)}
              type="button"
            >
              <strong>{circuit.symbol}</strong>
              <span>{circuit.demand}</span>
            </button>
          ))}
        </div>

        <div className="routing-lines" aria-hidden="true">
          {circuits.map((circuit) => (
            <span className={connected.includes(circuit.id) ? 'is-live' : ''} key={circuit.id} />
          ))}
        </div>

        <div className="routing-column" aria-label="Shelter sockets">
          <span className="routing-column__label">Shelter systems</span>
          {circuits.map((circuit) => (
            <button
              className={`circuit-node circuit-node--socket ${
                connected.includes(circuit.id) ? 'is-connected' : ''
              }`}
              disabled={!unlocked || connected.includes(circuit.id)}
              key={circuit.id}
              onClick={() => chooseSocket(circuit.id)}
              type="button"
            >
              <strong>{circuit.label}</strong>
              <span>{selected === circuit.id ? 'Connect now' : 'Select matching cable'}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="routing-game__hint">
        Select a cable on the left, then its matching labeled socket. This click-based control also works with keyboard and touch.
      </p>
    </div>
  )
}

