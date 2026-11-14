import { useCallback, useEffect, useRef, useState } from 'react'
import { audio } from '../audio/engine'
import { Brand, ResourceHud } from '../components/Hud'
import { formatClock } from '../game/format'
import { missionLimitFor } from '../game/state'
import type {
  GameState,
  Grade,
  MissionDefinition,
  MissionMetrics,
  MissionOutcome,
} from '../game/types'
import { Mission01 } from '../missions/Mission01'
import { Mission02 } from '../missions/Mission02'
import { Mission03 } from '../missions/Mission03'
import { Mission04 } from '../missions/Mission04'
import { Mission05 } from '../missions/Mission05'
import { Mission06 } from '../missions/Mission06'
import { Mission07 } from '../missions/Mission07'
import { Mission08 } from '../missions/Mission08'

type MissionRunnerProps = {
  state: GameState
  mission: MissionDefinition
  soundEnabled: boolean
  onToggleSound: () => void
  onFinish: (outcome: MissionOutcome) => void
}

export function MissionRunner({
  state,
  mission,
  soundEnabled,
  onToggleSound,
  onFinish,
}: MissionRunnerProps) {
  const limitRef = useRef(missionLimitFor(state, mission.id))
  const remainingRef = useRef(limitRef.current)
  const finished = useRef(false)
  const alarmed = useRef(false)
  const [remaining, setRemaining] = useState(limitRef.current)

  const finish = useCallback(
    (
      status: 'passed' | 'failed',
      metrics: MissionMetrics,
      reason?: string,
    ) => {
      if (finished.current) return
      finished.current = true
      const timeUsed = Math.max(0, limitRef.current - remainingRef.current)
      const accuracy = metrics.accuracy ?? (status === 'passed' ? 100 : 0)
      const ratio = remainingRef.current / limitRef.current
      const grade: Grade =
        status === 'failed'
          ? 'F'
          : accuracy >= 95 && ratio >= 0.35
            ? 'S'
            : accuracy >= 80 && ratio >= 0.15
              ? 'A'
              : 'B'
      if (status === 'passed') audio.success()
      else audio.failure()
      onFinish({
        mission: mission.id,
        status,
        grade,
        timeUsedMs: timeUsed,
        timeLimitMs: limitRef.current,
        metrics,
        reason,
      })
    },
    [mission.id, onFinish],
  )

  useEffect(() => {
    let last = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      if (document.hidden) {
        last = now
        return
      }
      const delta = now - last
      last = now
      remainingRef.current = Math.max(0, remainingRef.current - delta)
      setRemaining(remainingRef.current)
      if (remainingRef.current <= 10_000 && !alarmed.current) {
        alarmed.current = true
        audio.alarm()
      }
      if (remainingRef.current <= 0) {
        finish('failed', { accuracy: 0 }, 'The mission clock reached zero.')
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [finish])

  const solve = useCallback(
    (metrics: MissionMetrics) => finish('passed', metrics),
    [finish],
  )
  const fail = useCallback(
    (reason: string) => finish('failed', { accuracy: 0 }, reason),
    [finish],
  )

  const urgent = remaining <= 15_000
  const missionProps = { state, onSolve: solve, onFail: fail }

  return (
    <main className={`screen mission-screen ${urgent ? 'is-urgent' : ''}`}>
      <div className="mission-screen__grid" />
      <div className="grain" />
      <div className="scanlines" />

      <div className="mission-screen__top">
        <Brand day={mission.day} code={mission.code} />
        <div className={`mission-clock ${urgent ? 'is-urgent' : ''}`}>
          <span>Mission clock</span>
          <strong>{formatClock(remaining)}</strong>
          <div>
            <i style={{ transform: `scaleX(${remaining / limitRef.current})` }} />
          </div>
        </div>
        <button
          aria-pressed={soundEnabled}
          className="mission-sound"
          onClick={onToggleSound}
          type="button"
        >
          {soundEnabled ? 'Sound on' : 'Sound off'}
        </button>
      </div>

      <div className="mission-screen__intel">
        <div>
          <span className="eyebrow">
            {mission.code} · {mission.subtitle}
          </span>
          <h1 className="display">{mission.title}</h1>
          <p>{mission.objective}</p>
        </div>
        <ResourceHud resources={state.resources} />
      </div>

      <div className="mission-screen__stage">
        {mission.id === 1 ? <Mission01 {...missionProps} /> : null}
        {mission.id === 2 ? <Mission02 {...missionProps} /> : null}
        {mission.id === 3 ? <Mission03 {...missionProps} /> : null}
        {mission.id === 4 ? <Mission04 {...missionProps} /> : null}
        {mission.id === 5 ? <Mission05 {...missionProps} /> : null}
        {mission.id === 6 ? <Mission06 {...missionProps} /> : null}
        {mission.id === 7 ? <Mission07 {...missionProps} /> : null}
        {mission.id === 8 ? <Mission08 {...missionProps} /> : null}
      </div>

      <footer className="mission-screen__footer">
        <span>{mission.controls.join(' · ')}</span>
        <span>Clock stops when solved · no retry</span>
      </footer>
    </main>
  )
}
