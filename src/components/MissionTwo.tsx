import { useEffect, useMemo, useState } from 'react'
import { missionSources } from '../data/content'
import { MissionTimer } from './MissionTimer'

export const MISSION_TWO_SECONDS = 70

type WasteCategory = 'organic' | 'plastic' | 'metal'

type WasteItem = {
  id: string
  label: string
  detail: string
  category: WasteCategory
}

const wasteItems: WasteItem[] = [
  { id: 'wipe', label: 'Wet cotton wipe', detail: 'Damp cloth', category: 'organic' },
  { id: 'pe-pouch', label: 'PE drink pouch', detail: 'Polyethylene · PE', category: 'plastic' },
  { id: 'foil-lid', label: 'Foil food lid', detail: 'Aluminium foil', category: 'metal' },
  { id: 'food', label: 'Food scraps', detail: 'Wet organic waste', category: 'organic' },
  { id: 'wrap', label: 'Bubble wrap', detail: 'Polyethylene · PE', category: 'plastic' },
  { id: 'foil-pack', label: 'Foil packet', detail: 'Metal laminate', category: 'metal' },
]

const bins: Array<{ category: WasteCategory; label: string; code: string }> = [
  { category: 'organic', label: 'Wet organic', code: 'WET' },
  { category: 'plastic', label: 'Polyethylene', code: 'PE' },
  { category: 'metal', label: 'Metal foil', code: 'AL' },
]

type MissionTwoProps = {
  onFinish: (success: boolean) => void
}

export function MissionTwo({ onFinish }: MissionTwoProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sortedIds, setSortedIds] = useState<string[]>([])
  const [temperature, setTemperature] = useState(105)
  const [pressure, setPressure] = useState(30)
  const [processProgress, setProcessProgress] = useState(0)
  const [message, setMessage] = useState('Select an item, then choose the bin that matches its material label.')
  const [finished, setFinished] = useState(false)
  const sortingDone = sortedIds.length === wasteItems.length
  const processSafe = temperature >= 145 && temperature <= 160 && pressure >= 48 && pressure <= 64
  const selectedItem = useMemo(() => wasteItems.find((item) => item.id === selectedId), [selectedId])

  useEffect(() => {
    if (!sortingDone || !processSafe || finished) return
    const interval = window.setInterval(() => {
      setProcessProgress((value) => Math.min(100, value + 4))
    }, 450)
    return () => window.clearInterval(interval)
  }, [finished, processSafe, sortingDone])

  useEffect(() => {
    if (!sortingDone) return
    if (temperature > 170) {
      setMessage('Overheat warning. Lower the heater before plastics release unsafe gases.')
    } else if (pressure > 74) {
      setMessage('Steam spike warning. Reduce chamber pressure.')
    } else if (processSafe) {
      setMessage('Stable cycle. Water is condensing while the tile dries.')
    } else {
      setMessage('Bring both controls into their marked safe bands.')
    }
  }, [pressure, processSafe, sortingDone, temperature])

  useEffect(() => {
    if (processProgress !== 100 || finished) return
    setFinished(true)
    setMessage('Cycle complete. Water recovered and six dense tiles formed.')
    window.setTimeout(() => onFinish(true), 700)
  }, [finished, onFinish, processProgress])

  function sortInto(category: WasteCategory, itemId = selectedId) {
    if (!itemId || finished) return
    const item = wasteItems.find((candidate) => candidate.id === itemId)
    if (!item) return
    if (item.category !== category) {
      setMessage(`${item.label} is labelled ${item.detail}. Try a different bin.`)
      return
    }
    const next = [...sortedIds, item.id]
    setSortedIds(next)
    setSelectedId(null)
    setMessage(next.length === wasteItems.length ? 'Sorting complete. Seal the chamber and tune the process.' : `${item.label} sorted correctly.`)
  }

  function fail() {
    setFinished(true)
    onFinish(false)
  }

  return (
    <main className="mission-page mission-two">
      <header className="mission-heading">
        <div>
          <span className="eyebrow">Mission 02 · Habitat waste</span>
          <h1>Recover water. Build useful tiles.</h1>
        </div>
        <MissionTimer seconds={MISSION_TWO_SECONDS} stopped={finished} onExpire={fail} />
      </header>

      <div className="mission-layout">
        <section className="mission-console" aria-labelledby="tcps-console-title">
          <div className="console-title">
            <div>
              <span>TCPS control</span>
              <h2 id="tcps-console-title">{sortingDone ? 'Run the processing cycle' : 'Sort the incoming waste'}</h2>
            </div>
            <strong>{sortingDone ? `${processProgress}% dry` : `${sortedIds.length}/${wasteItems.length} sorted`}</strong>
          </div>

          {!sortingDone ? (
            <>
              <div className="waste-items" aria-label="Waste items">
                {wasteItems.filter((item) => !sortedIds.includes(item.id)).map((item) => (
                  <button
                    className={selectedId === item.id ? 'is-selected' : ''}
                    draggable
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    onDragStart={(event) => event.dataTransfer.setData('text/plain', item.id)}
                    type="button"
                  >
                    <i aria-hidden="true">{item.category === 'organic' ? '●' : item.category === 'plastic' ? '◇' : '▱'}</i>
                    <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                  </button>
                ))}
              </div>
              <div className="waste-bins">
                {bins.map((bin) => (
                  <button
                    key={bin.category}
                    onClick={() => sortInto(bin.category)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault()
                      sortInto(bin.category, event.dataTransfer.getData('text/plain'))
                    }}
                    type="button"
                  >
                    <b>{bin.code}</b>
                    <span>{bin.label}</span>
                    <small>{selectedItem ? `Place ${selectedItem.label}` : 'Select or drop an item'}</small>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="processor">
              <div className="processor-visual" aria-label={`Processing ${processProgress} percent complete`}>
                <div className="chamber">
                  <div className="tile" style={{ transform: `scaleY(${0.25 + processProgress * 0.0075})` }}>
                    <span>TCPS</span>
                  </div>
                </div>
                <div className="condenser">
                  {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
                  <span style={{ height: `${processProgress}%` }} />
                </div>
              </div>
              <div className="control-pair">
                <label>
                  <span><b>Heater temperature</b><output>{temperature}°C</output></span>
                  <input max="190" min="90" onChange={(event) => setTemperature(Number(event.target.value))} type="range" value={temperature} />
                  <small>Safe process band: 145–160°C</small>
                </label>
                <label>
                  <span><b>Chamber pressure</b><output>{pressure}%</output></span>
                  <input max="90" min="20" onChange={(event) => setPressure(Number(event.target.value))} type="range" value={pressure} />
                  <small>Stable condenser band: 48–64%</small>
                </label>
              </div>
            </div>
          )}

          <p className="console-message" aria-live="polite">{message}</p>
        </section>

        <aside className="science-panel">
          <span className="eyebrow">How it works</span>
          <h2>Nothing gets dumped outside.</h2>
          <p>
            The TCPS applies controlled heat and compression to mixed trash. It recovers up to 98%
            of trapped water and drives water activity below 0.6 so bacteria and mould cannot grow.
          </p>
          <div className="science-rule">
            <strong>Mission result</strong>
            <span>Recover +15% Water and produce six dense radiation-shield tiles.</span>
          </div>
          <a href={missionSources.tcps.href} rel="noreferrer" target="_blank">{missionSources.tcps.label}</a>
        </aside>
      </div>
    </main>
  )
}
