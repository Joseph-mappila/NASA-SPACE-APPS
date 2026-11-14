import { useCallback, useRef, useState } from 'react'
import { audio } from '../audio/engine'
import type { CSSProperties } from 'react'
import type { MinigameResult } from './catalog'
import { MinigameOutcome } from './MinigameOutcome'
import { formatMinigameTime, useMinigameTimer } from './useMinigameTimer'

const TIME_LIMIT = 60
const COLORS = ['#00d4ff', '#00ff88', '#f5a623', '#e63946']

type Wire = { id: number; color: string }
type Puzzle = { left: Wire[]; right: Wire[] }

function generatePuzzle(): Puzzle {
  const left = COLORS.map((color, id) => ({ id, color }))
  const right = [...left].sort(() => Math.random() - 0.5)
  return { left, right }
}

const wireStyle = (color: string): CSSProperties => ({ borderColor: color })

export function EVARepair() {
  const [puzzle, setPuzzle] = useState<Puzzle>(generatePuzzle)
  const [connections, setConnections] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [result, setResult] = useState<MinigameResult | null>(null)
  const finished = useRef(false)

  const finish = useCallback((next: MinigameResult) => {
    if (finished.current) return
    finished.current = true
    setResult(next)
    if (next === 'success') audio.success()
    else audio.failure()
  }, [])

  const { timeLeft, reset } = useMinigameTimer(
    TIME_LIMIT,
    result !== null,
    () => finish('fail'),
  )

  function connect(leftId: number, rightId: number) {
    if (result || connections[leftId] === leftId) return

    // Each port accepts one wire. A port that is already correctly linked is
    // protected, so a wrong wire cannot break a finished pair.
    if (connections[rightId] === rightId && leftId !== rightId) {
      audio.beep(190, 0.16, 0.05)
      return
    }

    const next = { ...connections }
    for (const [otherLeft, otherRight] of Object.entries(next)) {
      if (otherRight === rightId && Number(otherLeft) !== leftId) {
        delete next[Number(otherLeft)]
      }
    }
    next[leftId] = rightId
    setConnections(next)
    setSelected(null)
    setDragging(null)

    if (leftId === rightId) {
      audio.beep(1180, 0.08, 0.05)
      if (puzzle.left.every((wire) => next[wire.id] === wire.id)) {
        finish('success')
      }
    } else {
      audio.beep(190, 0.16, 0.05)
    }
  }

  function restart() {
    finished.current = false
    setPuzzle(generatePuzzle())
    setConnections({})
    setSelected(null)
    setDragging(null)
    setResult(null)
    reset()
  }

  const matched = puzzle.left.filter(
    (wire) => connections[wire.id] === wire.id,
  ).length
  const urgent = result === null && timeLeft <= 15

  return (
    <div className="minigame-game eva-game">
      <div className="minigame-status">
        <div>
          <span className="eyebrow">Suit circuit check</span>
          <strong>
            {matched} of {puzzle.left.length} wire pairs matched
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

      <p className="minigame-instruction">
        Drag a <strong>WIRE</strong> onto the matching <strong>PORT</strong>, or
        tap a wire and then tap a port. A wrong pair glows red and can be tried
        again.
      </p>

      <div className="eva-puzzle">
        <div className="eva-column">
          <span className="eva-column__label">SUIT HARNESS</span>
          {puzzle.left.map((wire) => {
            const solved = connections[wire.id] === wire.id
            const isSelected = selected === wire.id
            return (
              <button
                aria-label={`Wire ${String.fromCharCode(65 + wire.id)}`}
                aria-pressed={isSelected}
                className={`eva-connector ${solved ? 'is-solved' : ''} ${isSelected ? 'is-selected' : ''}`}
                disabled={result !== null || solved}
                draggable={!solved && result === null}
                key={wire.id}
                onClick={() => {
                  if (solved || result) return
                  audio.beep(760, 0.05, 0.03)
                  setSelected(isSelected ? null : wire.id)
                }}
                onDragEnd={() => setDragging(null)}
                onDragStart={() => {
                  if (solved || result) return
                  setDragging(wire.id)
                  setSelected(wire.id)
                }}
                style={wireStyle(wire.color)}
                type="button"
              >
                <span
                  className="eva-dot"
                  style={{ background: wire.color }}
                />
                <span className="eva-connector__name">
                  WIRE-{String.fromCharCode(65 + wire.id)}
                </span>
                <span
                  className="eva-tail"
                  style={{ background: wire.color }}
                />
              </button>
            )
          })}
        </div>

        <div className="eva-center" aria-hidden="true">
          <span>{selected === null ? '⚡' : '→'}</span>
          <small>{selected === null ? 'SELECT' : 'CONNECT'}</small>
        </div>

        <div className="eva-column">
          <span className="eva-column__label">PORT BUS</span>
          {puzzle.right.map((wire) => {
            const isConnected = Object.values(connections).includes(wire.id)
            const correct = connections[wire.id] === wire.id
            const isWrong = isConnected && !correct
            return (
              <button
                aria-label={`Port ${String.fromCharCode(65 + wire.id)}`}
                className={`eva-connector eva-connector--port ${correct ? 'is-solved' : ''} ${isWrong ? 'is-wrong' : ''}`}
                disabled={result !== null}
                key={wire.id}
                onClick={() => {
                  if (selected === null) {
                    audio.beep(300, 0.1, 0.04)
                    return
                  }
                  connect(selected, wire.id)
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragging !== null) connect(dragging, wire.id)
                }}
                style={wireStyle(wire.color)}
                type="button"
              >
                <span
                  className="eva-tail"
                  style={{ background: wire.color }}
                />
                <span className="eva-connector__name">
                  PORT-{String.fromCharCode(65 + wire.id)}
                </span>
                <span
                  className="eva-dot"
                  style={{ background: wire.color }}
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="minigame-progress" aria-hidden="true">
        <i
          style={{
            width: `${(matched / puzzle.left.length) * 100}%`,
          }}
        />
      </div>

      {result ? (
        <MinigameOutcome
          failText="The suit oxygen reserve hit zero before the harness was repaired. In a real EVA, the crew would abort back through the airlock."
          onRestart={restart}
          result={result}
          successText="All four circuits are sealed. The suit can hold pressure and oxygen for the next Moon walk."
        />
      ) : (
        <p className="minigame-science">
          <strong>NASA link:</strong> spacesuit systems use colour-coded connectors
          so a crew member can trace a circuit quickly while wearing thick gloves.
        </p>
      )}
    </div>
  )
}
