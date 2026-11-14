import { useCallback, useRef, useState } from 'react'
import { audio } from '../audio/engine'
import type { CSSProperties } from 'react'
import type { MinigameResult } from './catalog'
import { MinigameOutcome } from './MinigameOutcome'
import { formatMinigameTime, useMinigameTimer } from './useMinigameTimer'

const TIME_LIMIT = 45
const WRONG_NUTRIENT_PENALTY = 2

type Plant = {
  id: number
  name: string
  emoji: string
  needs: string[]
}

type Nutrient = {
  id: string
  label: string
  color: string
  symbol: string
}

const PLANTS: Plant[] = [
  { id: 0, name: 'Wheat seedling', emoji: '🌾', needs: ['N', 'P'] },
  { id: 1, name: 'Lettuce', emoji: '🥬', needs: ['N', 'K'] },
  { id: 2, name: 'Algae panel', emoji: '🌿', needs: ['P', 'K'] },
  { id: 3, name: 'Tomato plant', emoji: '🍅', needs: ['N', 'P', 'K'] },
]

const NUTRIENTS: Nutrient[] = [
  { id: 'N', label: 'Nitrogen', color: '#7db7ff', symbol: 'N' },
  { id: 'P', label: 'Phosphorus', color: '#f3b15d', symbol: 'P' },
  { id: 'K', label: 'Potassium', color: '#7fe0a6', symbol: 'K' },
]

const chipStyle = (color: string): CSSProperties => ({ borderColor: color })

export function OxygenGarden() {
  const [fed, setFed] = useState<Record<number, string[]>>({})
  const [selected, setSelected] = useState<Nutrient | null>(null)
  const [dragging, setDragging] = useState<Nutrient | null>(null)
  const [flash, setFlash] = useState<{ plant: number; ok: boolean } | null>(
    null,
  )
  const [result, setResult] = useState<MinigameResult | null>(null)
  const finished = useRef(false)

  const finish = useCallback((next: MinigameResult) => {
    if (finished.current) return
    finished.current = true
    setResult(next)
    if (next === 'success') audio.success()
    else audio.failure()
  }, [])

  const { timeLeft, reset, penalize } = useMinigameTimer(
    TIME_LIMIT,
    result !== null,
    () => finish('fail'),
  )

  function feed(plantId: number, nutrient: Nutrient | null) {
    if (!nutrient || result) return
    const plant = PLANTS.find((entry) => entry.id === plantId)
    if (!plant) return
    const alreadyFed = (fed[plantId] ?? []).includes(nutrient.id)
    if (alreadyFed) {
      audio.beep(520, 0.06, 0.03)
      return
    }

    const correct = plant.needs.includes(nutrient.id)
    setFlash({ plant: plantId, ok: correct })
    window.setTimeout(() => setFlash(null), 650)

    if (!correct) {
      audio.beep(180, 0.18, 0.05)
      penalize(WRONG_NUTRIENT_PENALTY)
      return
    }

    audio.beep(1040, 0.08, 0.04)
    const next = { ...fed, [plantId]: [...(fed[plantId] ?? []), nutrient.id] }
    setFed(next)

    const complete = PLANTS.every((entry) =>
      entry.needs.every((need) => (next[entry.id] ?? []).includes(need)),
    )
    if (complete) finish('success')
  }

  function restart() {
    finished.current = false
    setFed({})
    setSelected(null)
    setDragging(null)
    setFlash(null)
    setResult(null)
    reset()
  }

  const totalNeeds = PLANTS.reduce((sum, plant) => sum + plant.needs.length, 0)
  const fedCount = PLANTS.reduce(
    (sum, plant) =>
      sum + plant.needs.filter((need) => (fed[plant.id] ?? []).includes(need)).length,
    0,
  )
  const scrubber = Math.round((fedCount / totalNeeds) * 100)
  const urgent = result === null && timeLeft <= 12

  return (
    <div className="minigame-game garden-game">
      <div className="minigame-status">
        <div>
          <span className="eyebrow">Plant habitat</span>
          <strong>
            {fedCount} of {totalNeeds} nutrient doses delivered
          </strong>
        </div>
        <div className={`minigame-timer ${urgent ? 'is-urgent' : ''}`}>
          <span>TIME</span>
          <strong>{formatMinigameTime(timeLeft)}</strong>
          <div>
            <i
              style={{
                transform: `scaleX(${Math.max(0, timeLeft / TIME_LIMIT)})`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="garden-scrubber">
        <div>
          <span>CO₂ scrubber recovery</span>
          <strong>{scrubber}%</strong>
        </div>
        <div className="garden-scrubber__track">
          <i
            style={{
              width: `${scrubber}%`,
              background:
                scrubber >= 80
                  ? 'var(--green)'
                  : scrubber >= 45
                    ? 'var(--amber)'
                    : 'var(--orange)',
            }}
          />
        </div>
      </div>

      <p className="minigame-instruction">
        Select a nutrient, then tap the crops that need it. Each crop lists its
        nutrient chips. A wrong nutrient costs <strong>2 seconds</strong>; every
        correct dose is kept.
      </p>

      <div className="garden-plants">
        {PLANTS.map((plant) => {
          const plantFed = fed[plant.id] ?? []
          const isFlashing = flash?.plant === plant.id
          return (
            <button
              className={`garden-plant ${isFlashing ? (flash.ok ? 'is-ok' : 'is-bad') : ''} ${selected ? 'is-target' : ''}`}
              disabled={result !== null}
              key={plant.id}
              onClick={() => feed(plant.id, selected)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                feed(plant.id, dragging)
                setDragging(null)
              }}
              type="button"
            >
              <span aria-hidden="true" className="garden-plant__emoji">
                {plant.emoji}
              </span>
              <span className="garden-plant__name">{plant.name}</span>
              <span className="garden-plant__needs">
                {plant.needs.map((need) => {
                  const nutrient = NUTRIENTS.find((entry) => entry.id === need)
                  if (!nutrient) return null
                  const isFed = plantFed.includes(need)
                  return (
                    <span
                      className={`garden-chip ${isFed ? 'is-fed' : ''}`}
                      key={need}
                      style={chipStyle(nutrient.color)}
                    >
                      {nutrient.symbol}
                    </span>
                  )
                })}
              </span>
            </button>
          )
        })}
      </div>

      <div className="garden-nutrients">
        <span className="garden-nutrients__label">
          {selected
            ? `Selected ${selected.label} — tap a crop`
            : 'Available nutrients — select one, then tap a crop'}
        </span>
        <div className="garden-nutrients__row">
          {NUTRIENTS.map((nutrient) => {
            const isSelected = selected?.id === nutrient.id
            return (
              <button
                aria-pressed={isSelected}
                className={`garden-nutrient ${isSelected ? 'is-selected' : ''}`}
                disabled={result !== null}
                draggable={result === null}
                key={nutrient.id}
                onClick={() => {
                  audio.beep(680, 0.05, 0.03)
                  setSelected(isSelected ? null : nutrient)
                }}
                onDragEnd={() => setDragging(null)}
                onDragStart={() => {
                  setDragging(nutrient)
                  setSelected(nutrient)
                }}
                style={chipStyle(nutrient.color)}
                type="button"
              >
                <span
                  className="garden-nutrient__symbol"
                  style={{ color: nutrient.color }}
                >
                  {nutrient.symbol}
                </span>
                <span>{nutrient.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {result ? (
        <MinigameOutcome
          failText="The scrubber stayed below its safe limit. On the outpost, the crew would fall back to stored oxygen and shut down non-critical work."
          onRestart={restart}
          result={result}
          successText="The crops are fed and the scrubber is recovering. Plants can help stabilize cabin air, but they cannot replace the outpost’s main oxygen supply."
        />
      ) : (
        <p className="minigame-science">
          <strong>NASA link:</strong> crops in NASA’s Advanced Plant Habitat need
          nitrogen, phosphorus, and potassium. The right nutrients keep
          photosynthesis running, which absorbs CO₂ and releases oxygen.
        </p>
      )}
    </div>
  )
}
