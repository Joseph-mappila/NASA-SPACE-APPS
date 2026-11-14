import { TelemetryHud } from '../components/Hud'
import { MISSIONS } from '../game/content'
import { formatClock, formatSeconds, gradeLabel } from '../game/format'
import type { GameState, MissionId } from '../game/types'

type ResultScreenProps = {
  state: GameState
  onContinue: () => void
}

const SUCCESS_NOTES: Record<MissionId, string> = {
  1: 'Block A returns to full output. The batteries can reach 100% before the flare.',
  2: 'Water is recovered and six dense shield tiles are stacked for the storm.',
  3: 'Cabin pressure is holding. The airlock is sealed before lockdown.',
  4: 'The crew stays inside the storm shelter. Electronics survive the surge.',
  5: 'CO₂ drops back into the safe band. The coolant loop is clear.',
  6: 'The greenhouse joins the atmospheric loop and oxygen stops falling.',
  7: 'The ISRU reactor refills the oxygen reserve ahead of the lunar night.',
  8: 'Houston locks the telemetry link and certifies Outpost Luna.',
}

const NEXT_LABEL: Record<MissionId, string> = {
  1: 'Continue to waste processing',
  2: 'Continue to airlock check',
  3: 'Continue to storm shelter',
  4: 'Continue to Day 58',
  5: 'Continue to the greenhouse',
  6: 'Continue to the ISRU plant',
  7: 'Continue to LunaNet',
  8: 'Read the final mission log',
}

export function ResultScreen({ state, onContinue }: ResultScreenProps) {
  const missionId = state.lastMission
  if (missionId === null) return null
  const outcome = state.outcomes[missionId]
  if (!outcome) return null
  const mission = MISSIONS[missionId]
  const passed = outcome.status === 'passed'
  const timedOut = !passed && Boolean(outcome.reason?.includes('clock reached zero'))
  const heading = passed
    ? 'Objective secured.'
    : timedOut
      ? 'The clock ran out.'
      : 'Objective lost.'

  return (
    <main className={`screen result-screen ${passed ? 'is-pass' : 'is-fail'}`}>
      <div className="result-screen__glow" />
      <div className="grain" />
      <div className="scanlines" />

      <div className="result-screen__layout">
        <section className="result-card panel">
          <div className="result-card__head">
            <span className="eyebrow">
              Day {mission.day} · {mission.code} · {passed ? 'Objective complete' : 'Mission failed'}
            </span>
            <span className={`grade grade--${outcome.grade.toLowerCase()}`}>
              {outcome.grade}
            </span>
          </div>

          <h1 className="display">
            {heading}
          </h1>
          <h2>{mission.title}</h2>

          <p className="result-card__summary">
            {passed ? SUCCESS_NOTES[missionId] : mission.risk}
          </p>
          {outcome.reason ? (
            <p className="result-card__reason">{outcome.reason}</p>
          ) : null}

          <div className="result-stats">
            <div>
              <span>Grade</span>
              <strong>{outcome.grade} · {gradeLabel(outcome.grade)}</strong>
            </div>
            <div>
              <span>Time used</span>
              <strong>{formatSeconds(outcome.timeUsedMs)} / {formatClock(outcome.timeLimitMs)}</strong>
            </div>
            <div>
              <span>Personal best</span>
              <strong>
                {state.bestTimes[missionId]
                  ? formatSeconds(state.bestTimes[missionId]!)
                  : '—'}
              </strong>
            </div>
          </div>

          {outcome.metrics.notes && outcome.metrics.notes.length > 0 ? (
            <ul className="result-notes">
              {outcome.metrics.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}

          <div className={`consequence-card ${passed ? 'is-good' : 'is-bad'}`}>
            <span>Consequence</span>
            <p>
              {passed
                ? 'This result carries forward. Later missions can use the resource you secured.'
                : 'This failure carries forward. The next mission will feel it.'}
            </p>
          </div>

          <TelemetryHud state={state} />

          <button className="btn btn--primary btn--wide" onClick={onContinue} type="button">
            {NEXT_LABEL[missionId]}
          </button>
        </section>
      </div>
    </main>
  )
}
