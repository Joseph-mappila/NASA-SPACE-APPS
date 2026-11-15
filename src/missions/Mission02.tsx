import { useMemo, useState } from 'react'
import { audio } from '../audio/engine'
import { shuffled } from '../game/random'
import { HoldButton, Slider } from './shared/Controls'
import type { MissionComponentProps } from './types'

type WasteItem = {
  id: number
  label: string
  detail: string
  unsafe: boolean
  removed: boolean
}

const WASTE_ITEMS: WasteItem[] = [
  { id: 1, label: 'Food pouch', detail: 'Wet organic waste', unsafe: false, removed: false },
  { id: 2, label: 'Wet wipe', detail: 'Wet organic waste', unsafe: false, removed: false },
  { id: 3, label: 'Plastic film', detail: 'Polyethylene', unsafe: false, removed: false },
  { id: 4, label: 'Foil tray', detail: 'Clean metal foil', unsafe: false, removed: false },
  { id: 5, label: 'Sealed battery pack', detail: 'Pressure and fire risk', unsafe: true, removed: false },
  { id: 6, label: 'Sharp metal strip', detail: 'Can puncture the chamber', unsafe: true, removed: false },
]

const UNSAFE_TOTAL = WASTE_ITEMS.filter((item) => item.unsafe).length

export function Mission02({ onSolve, onFail }: MissionComponentProps) {
  // Reorder the bag on every run, so the unsafe items are not always in the
  // same two slots. The item types and scoring stay the same.
  const [items, setItems] = useState(() => shuffled(WASTE_ITEMS))
  const [contamination, setContamination] = useState(0)
  const [feedback, setFeedback] = useState(
    'Open the bag. Remove the two items that could damage the compactor.',
  )
  const [heat, setHeat] = useState(96)
  const [pressure, setPressure] = useState(42)
  const [waterActivity, setWaterActivity] = useState(0.82)
  const [phase, setPhase] = useState<'inspect' | 'process' | 'done'>('inspect')

  const heatOk = heat >= 120 && heat <= 140
  const pressureOk = pressure >= 60 && pressure <= 80
  const unsafeLeft = items.filter((item) => item.unsafe && !item.removed).length

  const accuracy = useMemo(
    () => Math.max(20, 100 - contamination * 18),
    [contamination],
  )

  const inspect = (item: WasteItem) => {
    if (phase !== 'inspect' || item.removed) return
    if (!item.unsafe) {
      audio.beep(320, 0.12, 0.03)
      const next = contamination + 1
      setContamination(next)
      setFeedback(
        next >= 4
          ? 'The bag is contaminated. The compactor has locked out.'
          : `${item.label} is safe to process. Only remove sharp or sealed items.`,
      )
      if (next >= 4) onFail('Waste contamination locked out the compactor.')
      return
    }
    audio.latch()
    const nextItems = items.map((entry) =>
      entry.id === item.id ? { ...entry, removed: true } : entry,
    )
    setItems(nextItems)
    const remaining = nextItems.filter((entry) => entry.unsafe && !entry.removed).length
    if (remaining === 0) {
      setPhase('process')
      setFeedback(
        'Bag inspected. Now set the heater and pressure into the green bands.',
      )
    } else {
      setFeedback(`${item.label} removed. Find one more unsafe item.`)
    }
  }

  const compact = () => {
    if (!heatOk || !pressureOk) {
      audio.beep(300, 0.14, 0.035)
      const next = contamination + 1
      setContamination(next)
      setFeedback(
        next >= 4
          ? 'The chamber overheated. Toxic gases have forced a shutdown.'
          : 'Chamber outside the safe band. Adjust heat and pressure before pressing.',
      )
      if (next >= 4) onFail('The chamber exceeded safe operating limits.')
      return
    }
    setWaterActivity(0.48)
    setPhase('done')
    audio.hydraulic()
    setFeedback('Water recovered. The tile is dense enough to use as radiation shielding.')
    onSolve({
      accuracy,
      waterRecovered: 15,
      shieldTiles: 6,
      notes: [
        'Water recovered and routed to the greenhouse reserve.',
        'Six dense polyethylene shield tiles pressed.',
        'Water activity measured at 0.48, below the 0.5 storage limit.',
        contamination === 0
          ? 'Zero contamination events.'
          : `${contamination} contamination event${contamination > 1 ? 's' : ''}.`,
      ],
    })
  }

  return (
    <div className="mission-workspace tcps">
      <div className="mission-column mission-column--wide">
        <div className="console-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Cargo transfer · waste bag</span>
            <span className={phase === 'inspect' ? 'status status--warn' : 'status status--good'}>
              {phase === 'inspect' ? `${unsafeLeft} unsafe items left` : phase === 'done' ? 'Tile pressed' : 'Ready to press'}
            </span>
          </div>

          {phase === 'inspect' ? (
            <div className="bag-inspection">
              <div className="waste-grid">
                {items.map((item) => (
                  <button
                    className={`waste-card ${item.removed ? 'is-removed' : ''}`}
                    disabled={item.removed}
                    key={item.id}
                    onClick={() => inspect(item)}
                    type="button"
                  >
                    <span aria-hidden="true">{item.unsafe ? '⚠' : '◒'}</span>
                    <strong>{item.label}</strong>
                    <small>{item.removed ? 'Removed' : item.detail}</small>
                  </button>
                ))}
              </div>
              <p className="console-message">
                Sharp metal can puncture the chamber. Sealed containers can burst when heated.
              </p>
            </div>
          ) : (
            <div className="chamber">
              <div className={`chamber__window ${heatOk && pressureOk ? 'is-good' : ''}`}>
                <div className="chamber__steam" />
                <span>{phase === 'done' ? 'Tile complete' : heatOk && pressureOk ? 'Ready to press' : 'Outside safe band'}</span>
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

              <div className="readout-row">
                <div className="readout">
                  <span>Water activity</span>
                  <strong className={waterActivity < 0.5 ? 'is-good' : ''}>
                    {waterActivity.toFixed(2)}
                  </strong>
                </div>
                <div className="readout">
                  <span>Water recovered</span>
                  <strong>{phase === 'done' ? '15%' : '—'}</strong>
                </div>
                <div className="readout">
                  <span>Shield tiles</span>
                  <strong>{phase === 'done' ? '6' : '0'}</strong>
                </div>
              </div>

              <HoldButton
                disabled={phase !== 'process' || !heatOk || !pressureOk}
                label={phase === 'done' ? 'Tile pressed' : 'Hold to press the tile'}
                onComplete={compact}
                durationMs={2400}
              />
            </div>
          )}

          <p aria-live="polite" className={`console-message ${contamination > 0 ? 'is-warn' : ''}`}>
            {feedback}
          </p>
        </div>
      </div>

      <div className="mission-column">
        <div className="bin-panel panel">
          <span className="eyebrow">Bag status</span>
          <div className="bin-stats">
            <div>
              <span>Unsafe items</span>
              <strong>{unsafeLeft}</strong>
            </div>
            <div>
              <span>Contamination</span>
              <strong className={contamination > 0 ? 'is-bad' : ''}>{contamination}/4</strong>
            </div>
            <div>
              <span>Tiles made</span>
              <strong>{phase === 'done' ? '6' : '0'}</strong>
            </div>
          </div>
          <p className="console-message">
            NASA’s TCPS heats and squeezes mixed trash until water activity is below 0.5.
            That stops mold and bacteria. The tile is less than one-eighth of the original
            trash volume.
          </p>
        </div>

        <div className="science-note panel">
          <span className="eyebrow">Why it matters</span>
          <p>
            The tiles are full of hydrogen, which helps block radiation. Without them,
            the storm shelter will not have enough shielding.
          </p>
        </div>
      </div>
    </div>
  )
}
