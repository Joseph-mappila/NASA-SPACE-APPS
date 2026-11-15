import starterImage from '../images/starter_img.webp'
import { NasaDebrief } from '../components/NasaDebrief'
import { ENDINGS, MISSIONS } from '../game/content'
import { formatSeconds } from '../game/format'
import { getEndingId, passedCount } from '../game/state'
import { MISSION_IDS, type GameState } from '../game/types'

type EndingProps = {
  state: GameState
  onRestart: () => void
}

export function Ending({ state, onRestart }: EndingProps) {
  const ending = ENDINGS[getEndingId(state)]
  const passed = passedCount(state)

  return (
    <main className={`screen ending ending--${ending.id}`}>
      <img
        alt="Outpost Luna on the lunar surface"
        className="ending__image"
        src={starterImage}
      />
      <div className="ending__veil" />
      <div className="grain" />
      <div className="scanlines" />

      <section className="ending__card panel">
        <span className="eyebrow">{ending.eyebrow}</span>
        <h1 className="display">{ending.title}</h1>
        <p className="ending__body">{ending.body}</p>

        <div className="ending__stats">
          <div>
            <strong>{passed}/8</strong>
            <span>missions passed</span>
          </div>
          <div>
            <strong>{state.resources.oxygen}%</strong>
            <span>oxygen reserve</span>
          </div>
          <div>
            <strong>{state.resources.crewHealth}%</strong>
            <span>crew health</span>
          </div>
        </div>

        <section className="ending__science">
          <NasaDebrief />
        </section>

        <div className="ending__log">
          <span className="eyebrow">Mission log</span>
          <ol>
            {MISSION_IDS.map((id) => {
              const outcome = state.outcomes[id]
              const mission = MISSIONS[id]
              return (
                <li className={outcome?.status === 'passed' ? 'is-pass' : 'is-fail'} key={id}>
                  <span>{String(id).padStart(2, '0')}</span>
                  <strong>{mission.title}</strong>
                  <em>{outcome ? outcome.grade : '—'}</em>
                  <small>
                    {outcome && outcome.status === 'passed'
                      ? formatSeconds(outcome.timeUsedMs)
                      : 'failed'}
                  </small>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="ending__actions">
          <button className="btn btn--primary" onClick={onRestart} type="button">
            Run the outpost again
          </button>
        </div>

        <details className="ending__credits">
          <summary>Science, credits, and sources</summary>
          <p>
            LUNA is a fictional NASA outpost built with real mission science from
            NASA’s Moon-to-Mars architecture, NASA-STD-3001, the Electrodynamic Dust
            Shield, the Trash Compaction and Processing System, ROxygen ISRU, and
            LunaNet. NASA does not operate a crewed lunar outpost, and this project
            does not imply NASA endorsement.
          </p>
        </details>
      </section>
    </main>
  )
}
