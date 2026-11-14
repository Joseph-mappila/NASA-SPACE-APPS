import { useCallback, useRef, useState } from 'react'
import { audio } from '../audio/engine'
import type { MinigameResult } from './catalog'
import { MinigameOutcome } from './MinigameOutcome'
import { formatMinigameTime, useMinigameTimer } from './useMinigameTimer'

const TIME_LIMIT = 45
const TOLERANCE = 4

type ArrayId = 'alpha' | 'beta' | 'gamma'

type SolarArray = {
  id: ArrayId
  name: string
  shortName: string
  target: number
  color: string
}

const ARRAYS: SolarArray[] = [
  { id: 'alpha', name: 'Array Wing Alpha', shortName: 'ALPHA', target: 60, color: '#7db7ff' },
  { id: 'beta', name: 'Array Wing Beta', shortName: 'BETA', target: 180, color: '#f3b15d' },
  { id: 'gamma', name: 'Array Wing Gamma', shortName: 'GAMMA', target: 300, color: '#7fe0a6' },
]

const START_ANGLES: Record<ArrayId, number> = {
  alpha: 0,
  beta: 90,
  gamma: 200,
}

function normalize(angle: number): number {
  return ((angle % 360) + 360) % 360
}

function difference(current: number, target: number): number {
  return Math.abs((((current - target) % 360) + 540) % 360 - 180)
}

function efficiency(current: number, target: number): number {
  const diff = difference(current, target)
  if (diff <= TOLERANCE) return 100
  return Math.max(0, Math.round(100 - (diff - TOLERANCE) * 1.6))
}

export function SolarPanel() {
  const [angles, setAngles] = useState<Record<ArrayId, number>>({
    ...START_ANGLES,
  })
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

  function adjust(id: ArrayId, delta: number) {
    if (result) return
    const next = { ...angles, [id]: normalize(angles[id] + delta) }
    setAngles(next)
    audio.beep(delta > 0 ? 820 : 620, 0.04, 0.025)

    const aligned = ARRAYS.every(
      (array) => difference(next[array.id], array.target) <= TOLERANCE,
    )
    if (aligned) finish('success')
  }

  function restart() {
    finished.current = false
    setAngles({ ...START_ANGLES })
    setResult(null)
    reset()
  }

  const totalPower = Math.round(
    ARRAYS.reduce(
      (sum, array) => sum + efficiency(angles[array.id], array.target),
      0,
    ) / ARRAYS.length,
  )
  const urgent = result === null && timeLeft <= 12
  const alignedCount = ARRAYS.filter(
    (array) => difference(angles[array.id], array.target) <= TOLERANCE,
  ).length

  return (
    <div className="minigame-game solar-game">
      <div className="minigame-status">
        <div>
          <span className="eyebrow">Solar array control</span>
          <strong>
            {alignedCount} of {ARRAYS.length} wings on the Sun vector
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

      <div className="solar-power">
        <div className="solar-power__label">
          <span>Array bus output</span>
          <small>Irradiance reference · deep-space transit</small>
        </div>
        <div className="solar-power__track">
          <i
            style={{
              width: `${totalPower}%`,
              background:
                totalPower >= 95
                  ? 'var(--green)'
                  : totalPower >= 60
                    ? 'var(--cyan)'
                    : totalPower >= 35
                      ? 'var(--amber)'
                      : 'var(--red)',
            }}
          />
        </div>
        <strong>{totalPower}%</strong>
      </div>

      <p className="minigame-instruction">
        Rotate each wing until its pointer sits inside the glowing Sun target.
        Large buttons turn 30°; small buttons fine-tune by 5°. Every wing must
        reach the target together.
      </p>

      <div className="solar-wings">
        {ARRAYS.map((array) => {
          const current = angles[array.id]
          const aligned =
            difference(current, array.target) <= TOLERANCE
          const power = efficiency(current, array.target)
          return (
            <section
              className={`solar-wing ${aligned ? 'is-aligned' : ''}`}
              key={array.id}
              style={{ borderColor: aligned ? array.color : undefined }}
            >
              <div className="solar-wing__head">
                <span style={{ color: array.color }}>{array.name}</span>
                <em>{aligned ? 'LOCKED' : `${power}%`}</em>
              </div>

              <div className="solar-dial">
                <div
                  className="solar-target"
                  style={{
                    transform: `rotate(${array.target}deg)`,
                    color: array.color,
                  }}
                  title={`Target ${array.target}°`}
                >
                  <span aria-hidden="true">☀</span>
                </div>
                <div
                  className="solar-array"
                  style={{
                    transform: `rotate(${current}deg)`,
                    borderColor: array.color,
                    boxShadow: `0 0 18px -4px ${array.color}`,
                  }}
                >
                  <i style={{ background: array.color }} />
                  <b style={{ background: array.color }} />
                  <i style={{ background: array.color }} />
                </div>
                <span className="solar-dial__hub" aria-hidden="true" />
              </div>

              <div className="solar-wing__readout">
                <span>CURRENT {current}°</span>
                <span style={{ color: array.color }}>
                  TARGET {array.target}°
                </span>
              </div>

              <div className="solar-controls">
                <button
                  aria-label={`Rotate ${array.shortName} 30 degrees counter-clockwise`}
                  disabled={result !== null}
                  onClick={() => adjust(array.id, -30)}
                  type="button"
                >
                  −30°
                </button>
                <button
                  aria-label={`Rotate ${array.shortName} 5 degrees counter-clockwise`}
                  disabled={result !== null}
                  onClick={() => adjust(array.id, -5)}
                  type="button"
                >
                  −5°
                </button>
                <button
                  aria-label={`Rotate ${array.shortName} 5 degrees clockwise`}
                  disabled={result !== null}
                  onClick={() => adjust(array.id, 5)}
                  type="button"
                >
                  +5°
                </button>
                <button
                  aria-label={`Rotate ${array.shortName} 30 degrees clockwise`}
                  disabled={result !== null}
                  onClick={() => adjust(array.id, 30)}
                  type="button"
                >
                  +30°
                </button>
              </div>
            </section>
          )
        })}
      </div>

      {result ? (
        <MinigameOutcome
          failText="The auxiliary batteries ran out before the wings lined up. On a real spacecraft, the crew would shed non-critical loads and wait for a better Sun angle."
          onRestart={restart}
          result={result}
          successText="All three wings are on the Sun vector. The array bus is back at full output."
        />
      ) : (
        <p className="minigame-science">
          <strong>NASA link:</strong> solar panels make the most power when they
          face the Sun directly. As a spacecraft moves farther from the Sun,
          available power falls with the square of the distance, so pointing
          accuracy matters.
        </p>
      )}
    </div>
  )
}
