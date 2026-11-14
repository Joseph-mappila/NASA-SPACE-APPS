import { useEffect } from 'react'
import { audio } from '../audio/engine'
import { Brand } from '../components/Hud'
import { formatClock } from '../game/format'
import { missionLimitFor } from '../game/state'
import type { GameState, MissionDefinition } from '../game/types'

type MissionBriefProps = {
  state: GameState
  mission: MissionDefinition
  onStart: () => void
}

export function MissionBrief({ state, mission, onStart }: MissionBriefProps) {
  const limit = missionLimitFor(state, mission.id)

  useEffect(() => {
    audio.beep(920, 0.08, 0.03)
  }, [mission.id])
  const warnings: string[] = []
  if (state.flags.brownout && mission.id === 5) {
    warnings.push('Sensor brownout: scrubber readouts are unstable.')
  }
  if (state.flags.co2Penalty && mission.id >= 6) {
    warnings.push('High CO₂: decision clock cut by 25%.')
  }
  if (state.flags.oxygenLeak && mission.id >= 4 && mission.id <= 7) {
    warnings.push('Airlock leak active: oxygen draining each hour.')
  }

  return (
    <main className="screen mission-brief">
      <div className="mission-brief__bg" />
      <div className="grain" />
      <div className="scanlines" />

      <div className="mission-brief__top">
        <Brand day={mission.day} code={mission.code} />
        <span className="chip chip--amber">Commander · Clock {formatClock(limit)} · no retries</span>
      </div>

      <div className="mission-brief__layout">
        <div aria-hidden="true" className="mission-brief__number">
          {String(mission.id).padStart(2, '0')}
        </div>

        <section className="mission-brief__main">
          <span className="eyebrow">
            Day {mission.day} · {mission.time} · {mission.code}
          </span>
          <h1 className="display">{mission.title}</h1>
          <h2>{mission.subtitle}</h2>
          <p className="mission-brief__lede">{mission.brief}</p>

          <div className="science-card">
            <span className="eyebrow">Real NASA science</span>
            <p>{mission.science}</p>
          </div>

          <div className="mission-brief__objective">
            <span>Objective</span>
            <strong>{mission.objective}</strong>
          </div>

          {warnings.length > 0 ? (
            <div className="mission-brief__warnings">
              {warnings.map((warning) => (
                <span className="chip chip--red" key={warning}>{warning}</span>
              ))}
            </div>
          ) : null}
        </section>

        <aside className="mission-brief__side">
          <div className="flight-plan panel">
            <span className="eyebrow">Flight plan</span>
            <ol>
              {mission.steps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <div className="flight-plan__controls">
              <span>Controls</span>
              <div>
                {mission.controls.map((control) => (
                  <span className="chip" key={control}>{control}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="risk-card">
            <span>If the clock reaches zero</span>
            <p>{mission.risk}</p>
          </div>

          <div className="launch-card panel">
            <div>
              <span className="eyebrow">Mission clock</span>
              <strong>{formatClock(limit)}</strong>
              <small>It starts the moment you begin. There is no retry.</small>
            </div>
            <button className="btn btn--primary btn--wide" onClick={onStart} type="button">
              Begin Mission {String(mission.id).padStart(2, '0')}
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}
