import { useEffect } from 'react'
import { audio } from '../audio/engine'
import { Brand, TelemetryHud } from '../components/Hud'
import { EarthFromNasa } from '../components/EarthFromNasa'
import { NasaArchiveDialog } from '../components/NasaArchiveDialog'
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
        <div className="mission-brief__top-tools">
          <NasaArchiveDialog mission={mission} />
          <span className="chip chip--amber">Commander · Clock {formatClock(limit)} · no retries</span>
        </div>
      </div>

      <div className="mission-brief__layout">
        <div aria-hidden="true" className="mission-brief__number">
          {String(mission.id).padStart(2, '0')}
        </div>

        <section className="mission-brief__main">
          <span className="eyebrow">
            Day {mission.day} · {mission.time} · Mission {String(mission.id).padStart(2, '0')}
          </span>
          <h1 className="display">{mission.title}</h1>
          <h2>{mission.subtitle}</h2>

          <div className="goal-card">
            <span>Your goal</span>
            <strong>{mission.objective}</strong>
          </div>

          <p className="mission-brief__lede">{mission.brief}</p>

          <div className="brief-steps">
            <span className="eyebrow">What to do</span>
            <ol>
              {mission.steps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mission-brief__facts">
            <div className="science-card">
              <span className="eyebrow">NASA fact</span>
              <p>{mission.science}</p>
            </div>

            <div className="glossary">
              <span className="eyebrow">Words to know</span>
              <div>
                {mission.glossary.map((item) => (
                  <span className="glossary__item" key={item.term}>
                    <strong>{item.term}</strong>
                    <small>{item.meaning}</small>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {mission.id === 8 ? <EarthFromNasa /> : null}

          {warnings.length > 0 ? (
            <div className="mission-brief__warnings">
              {warnings.map((warning) => (
                <span className="chip chip--red" key={warning}>{warning}</span>
              ))}
            </div>
          ) : null}
        </section>

        <aside className="mission-brief__side">
          <TelemetryHud state={state} />

          <div className="flight-plan panel">
            <span className="eyebrow">Controls</span>
            <div className="flight-plan__controls">
              {mission.controls.map((control) => (
                <span className="chip" key={control}>{control}</span>
              ))}
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
              <small>It starts when you begin. There is no retry.</small>
            </div>
            <button className="btn btn--primary btn--wide" onClick={onStart} type="button">
              Start Mission {String(mission.id).padStart(2, '0')}
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}
