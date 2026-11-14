import { useMemo, useState } from 'react'
import { Gauge, Slider } from './shared/Controls'
import type { MissionComponentProps } from './types'

type WasteType = 'organic' | 'plastic' | 'metal'

type WasteItem = {
  id: number
  label: string
  type: WasteType
  symbol: string
}

const WASTE_ITEMS: WasteItem[] = [
  { id: 1, label: 'Food pouch', type: 'organic', symbol: '◒' },
  { id: 2, label: 'Water bottle', type: 'plastic', symbol: '▭' },
  { id: 3, label: 'Metal foil', type: 'metal', symbol: '◈' },
  { id: 4, label: 'Wet wipe', type: 'organic', symbol: '≋' },
  { id: 5, label: 'Glove wrapper', type: 'plastic', symbol: '▭' },
  { id: 6, label: 'Can lid', type: 'metal', symbol: '◈' },
  { id: 7, label: 'Banana peel', type: 'organic', symbol: '◒' },
  { id: 8, label: 'Packaging film', type: 'plastic', symbol: '▭' },
  { id: 9, label: 'Foil tray', type: 'metal', symbol: '◈' },
  { id: 10, label: 'Coffee grounds', type: 'organic', symbol: '◒' },
  { id: 11, label: 'Poly bag', type: 'plastic', symbol: '▭' },
  { id: 12, label: 'Tin strip', type: 'metal', symbol: '◈' },
]

const BINS: Array<{ type: WasteType; label: string; hint: string }> = [
  { type: 'organic', label: 'Wet organic', hint: 'Water recovery' },
  { type: 'plastic', label: 'Polyethylene', hint: 'Shield tiles' },
  { type: 'metal', label: 'Metal foil', hint: 'Recycle' },
]

export function Mission02({ onSolve, onFail }: MissionComponentProps) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [contamination, setContamination] = useState(0)
  const [feedback, setFeedback] = useState('Sort the stream. Wrong items contaminate the batch.')
  const [heat, setHeat] = useState(96)
  const [pressure, setPressure] = useState(42)
  const [phase, setPhase] = useState<'sort' | 'process'>('sort')

  const current = WASTE_ITEMS[index]
  const heatOk = heat >= 120 && heat <= 140
  const pressureOk = pressure >= 60 && pressure <= 80
  const accuracy = useMemo(
    () => Math.round((correct / WASTE_ITEMS.length) * 100),
    [correct],
  )

  const sort = (type: WasteType) => {
    if (phase !== 'sort' || !current) return
    if (current.type === type) {
      const nextCorrect = correct + 1
      setCorrect(nextCorrect)
      setFeedback(`${current.label} accepted. ${nextCorrect}/12 sorted.`)
    } else {
      const nextContamination = contamination + 1
      setContamination(nextContamination)
      setFeedback(
        nextContamination >= 4
          ? 'The batch is contaminated. The compactor has locked out.'
          : `Wrong bin. ${current.label} contaminated the batch.`,
      )
      if (nextContamination >= 4) {
        onFail('Waste contamination locked out the compactor.')
        return
      }
    }
    const nextIndex = index + 1
    setIndex(nextIndex)
    if (nextIndex >= WASTE_ITEMS.length) {
      setPhase('process')
      setFeedback('Stream sorted. Bring the chamber into the green band, then compact.')
    }
  }

  const compact = () => {
    if (!heatOk || !pressureOk) {
      const next = contamination + 1
      setContamination(next)
      setFeedback(
        next >= 4
          ? 'The chamber overheated. Toxic off-gases have forced a shutdown.'
          : 'Chamber outside the safe band. Adjust heat and pressure before running.',
      )
      if (next >= 4) onFail('The chamber exceeded safe operating limits.')
      return
    }
    onSolve({
      accuracy,
      waterRecovered: 15,
      shieldTiles: 6,
      notes: [
        'Water recovered and routed to the greenhouse reserve.',
        'Six dense polyethylene shield tiles pressed.',
        contamination === 0 ? 'Zero contamination events.' : `${contamination} contamination event${contamination > 1 ? 's' : ''}.`,
      ],
    })
  }

  return (
    <div className="mission-workspace tcps">
      <div className="mission-column mission-column--wide">
        <div className="conveyor-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Cargo transfer · waste stream</span>
            <span className="mono">{index}/12 processed</span>
          </div>

          {phase === 'sort' && current ? (
            <div className="conveyor">
              <div className="conveyor__belt" />
              <div className="waste-item" key={current.id}>
                <span aria-hidden="true">{current.symbol}</span>
                <strong>{current.label}</strong>
                <small>Identify the material</small>
              </div>
              <div className="conveyor__rollers">
                {Array.from({ length: 7 }, (_, i) => <i key={i} />)}
              </div>
            </div>
          ) : (
            <div className="chamber">
              <div className={`chamber__window ${heatOk && pressureOk ? 'is-good' : ''}`}>
                <div className="chamber__steam" />
                <span>{heatOk && pressureOk ? 'Ready to compact' : 'Outside safe band'}</span>
              </div>
              <div className="chamber__dials">
                <Gauge
                  danger={!heatOk}
                  label="Chamber temp"
                  max={180}
                  min={60}
                  tone={heatOk ? 'green' : 'amber'}
                  unit="°C"
                  value={heat}
                />
                <Gauge
                  danger={!pressureOk}
                  label="Pressure"
                  max={100}
                  min={20}
                  tone={pressureOk ? 'green' : 'amber'}
                  unit=" kPa"
                  value={pressure}
                />
              </div>
              <Slider
                label="Heater temperature"
                max={180}
                min={60}
                onChange={setHeat}
                target={[120, 140]}
                unit=" °C"
                value={heat}
              />
              <Slider
                label="Chamber pressure"
                max={100}
                min={20}
                onChange={setPressure}
                target={[60, 80]}
                unit=" kPa"
                value={pressure}
              />
              <button className="btn btn--primary btn--wide" onClick={compact} type="button">
                Run compactor
              </button>
            </div>
          )}

          <p className={`console-message ${contamination > 0 ? 'is-warn' : ''}`}>{feedback}</p>
        </div>
      </div>

      <div className="mission-column">
        <div className="bin-panel panel">
          <span className="eyebrow">Sorting bins</span>
          <div className="bins">
            {BINS.map((bin) => (
              <button
                className={`bin bin--${bin.type}`}
                disabled={phase !== 'sort'}
                key={bin.type}
                onClick={() => sort(bin.type)}
                type="button"
              >
                <span>{bin.type === 'organic' ? '◒' : bin.type === 'plastic' ? '▭' : '◈'}</span>
                <strong>{bin.label}</strong>
                <small>{bin.hint}</small>
              </button>
            ))}
          </div>
          <div className="bin-stats">
            <div>
              <span>Correct</span>
              <strong>{correct}</strong>
            </div>
            <div>
              <span>Contamination</span>
              <strong className={contamination > 0 ? 'is-bad' : ''}>{contamination}/4</strong>
            </div>
            <div>
              <span>Water recovered</span>
              <strong>{phase === 'process' ? 'ready' : '—'}</strong>
            </div>
          </div>
        </div>

        <div className="science-note panel">
          <span className="eyebrow">Why it matters</span>
          <p>
            Wet waste carries water. Polyethylene becomes dense shielding. Metal foil
            is recycled separately. Mixing them ruins the batch.
          </p>
        </div>
      </div>
    </div>
  )
}
