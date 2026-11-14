import { useEffect } from 'react'
import { audio } from '../audio/engine'
import commanderImage from '../images/commander_chen.webp'
import controlImage from '../images/line20-24.webp'
import { Brand, ResourceHud } from '../components/Hud'
import { DAY_BRIEFS, MISSIONS } from '../game/content'
import { passedCount } from '../game/state'
import type { GameState, MissionId } from '../game/types'

type DayBriefProps = {
  state: GameState
  onContinue: () => void
}

const DAY_MISSIONS: Record<57 | 58, MissionId[]> = {
  57: [1, 2, 3, 4],
  58: [5, 6, 7, 8],
}

export function DayBrief({ state, onContinue }: DayBriefProps) {
  const brief = DAY_BRIEFS[state.day]
  const missions = DAY_MISSIONS[state.day]
  const commanderLine = state.day === 57
    ? 'I have fifteen people down here, Captain. Let’s make the Moon boring.'
    : 'We made it through the night. Now let’s make sure the air stays breathable.'

  useEffect(() => {
    audio.beep(state.day === 57 ? 1040 : 860, 0.09)
  }, [state.day])

  return (
    <main className="screen day-brief">
      <img
        alt="The Luna outpost mission control room"
        className="day-brief__image"
        src={controlImage}
      />
      <div className="day-brief__veil" />
      <div className="grain" />
      <div className="scanlines" />

      <div className="day-brief__top">
        <Brand day={state.day} code={state.day === 57 ? 'MISSION LUNA' : 'POST-STORM'} />
        <ResourceHud resources={state.resources} />
      </div>

      <div className="day-brief__layout">
        <section className="day-brief__log panel">
          <div className="day-brief__log-head">
            <span className="eyebrow">{brief.eyebrow}</span>
            <span className="chip chip--cyan">HAL · online</span>
          </div>
          <h1 className="display">{brief.title},<br />Captain {state.playerName}.</h1>
          <div className="hal-lines">
            {brief.lines.map((line, index) => (
              <p key={line} style={{ animationDelay: `${index * 120}ms` }}>
                <span aria-hidden="true">›</span> {line}
              </p>
            ))}
          </div>

          {state.day === 58 ? (
            <div className="storm-report">
              <span>Day 57 report</span>
              <strong>{passedCount(state)} / 4 objectives complete</strong>
              <ul>
                <li className={state.flags.shieldTiles > 0 ? 'ok' : 'bad'}>
                  {state.flags.shieldTiles > 0
                    ? `${state.flags.shieldTiles} shield tiles ready`
                    : 'No shield tiles recovered'}
                </li>
                <li className={state.flags.oxygenLeak ? 'bad' : 'ok'}>
                  {state.flags.oxygenLeak ? 'Airlock leak still active' : 'Airlock pressure holding'}
                </li>
                <li className={state.flags.brownout ? 'bad' : 'ok'}>
                  {state.flags.brownout ? 'Storm brownout damaged sensors' : 'Electronics survived the storm'}
                </li>
              </ul>
            </div>
          ) : (
            <div className="alert-strip">
              <i aria-hidden="true" />
              Solar Particle Event expected in 8 hours
            </div>
          )}

          <div className="objective-list">
            <span>Pending objectives</span>
            <ol>
              {brief.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ol>
          </div>

          <button className="btn btn--primary" onClick={onContinue} type="button">
            {state.day === 57 ? 'Begin Day 57' : 'Begin post-storm recovery'}
          </button>
        </section>

        <aside className="day-brief__side">
          <div className="commander-card panel">
            <img alt="Commander Chen" src={commanderImage} />
            <div>
              <span className="eyebrow">Commander Chen</span>
              <blockquote>“{commanderLine}”</blockquote>
            </div>
          </div>

          <div className="crew-manifest panel">
            <span className="eyebrow">Flight plan</span>
            <ul>
              {missions.map((id) => {
                const mission = MISSIONS[id]
                const outcome = state.outcomes[id]
                return (
                  <li className={outcome ? 'is-done' : ''} key={id}>
                    <span>{String(id).padStart(2, '0')}</span>
                    <div>
                      <strong>{mission.title}</strong>
                      <small>{mission.time} · {mission.code}</small>
                    </div>
                    <em>
                      {outcome
                        ? outcome.status === 'passed'
                          ? outcome.grade
                          : 'FAIL'
                        : '—'}
                    </em>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="crew-manifest crew-manifest--crew panel">
            <span className="eyebrow">Crew</span>
            <div className="crew-count">
              <strong>15</strong>
              <span>astronauts on station</span>
            </div>
            <small>HAL is monitoring every hatch, scrubber, and battery.</small>
          </div>
        </aside>
      </div>
    </main>
  )
}
