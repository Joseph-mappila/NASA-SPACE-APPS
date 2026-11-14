import { useEffect, useState } from 'react'
import {
  fetchSpaceWeather,
  type SpaceWeatherEvent,
} from '../api/nasa'

type PanelState =
  | { status: 'loading'; events: SpaceWeatherEvent[] }
  | { status: 'ready'; events: SpaceWeatherEvent[] }
  | { status: 'error'; events: SpaceWeatherEvent[] }

export function SpaceWeatherPanel() {
  const [state, setState] = useState<PanelState>({
    status: 'loading',
    events: [],
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    setState({ status: 'loading', events: [] })
    fetchSpaceWeather(30, controller.signal)
      .then((events) => {
        if (mounted) setState({ status: 'ready', events })
      })
      .catch(() => {
        if (mounted) setState({ status: 'error', events: [] })
      })

    return () => {
      mounted = false
      controller.abort()
    }
  }, [attempt])

  return (
    <section className="space-weather panel" aria-live="polite">
      <div className="space-weather__head">
        <span className="eyebrow">Live NASA space weather</span>
        <span className="chip chip--cyan">DONKI</span>
      </div>

      <p className="space-weather__intro">
        Real solar activity from NASA’s database. The Day 57 storm in this story
        is fictional, but NASA watches the Sun every day for events like these.
      </p>

      {state.status === 'loading' ? (
        <p className="space-weather__status">Contacting NASA’s DONKI feed…</p>
      ) : null}

      {state.status === 'error' ? (
        <div className="space-weather__fallback">
          <p>
            The live feed is unavailable right now. The Day 58 mission still runs
            on the outpost’s fixed telemetry.
          </p>
          <button
            className="btn btn--small"
            onClick={() => setAttempt((current) => current + 1)}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : null}

      {state.status === 'ready' && state.events.length === 0 ? (
        <p className="space-weather__status">
          No major flares or coronal mass ejections reported in the last 30
          days. The Sun is quiet.
        </p>
      ) : null}

      {state.status === 'ready' && state.events.length > 0 ? (
        <ul className="space-weather__list">
          {state.events.map((event, index) => (
            <li key={event.id}>
              <details open={index === 0}>
                <summary>
                  <span>{event.label}</span>
                  <em>{event.issued}</em>
                </summary>
                <p>{event.summary}</p>
                {event.url ? (
                  <a href={event.url} rel="noreferrer" target="_blank">
                    Read NASA’s notice
                  </a>
                ) : null}
              </details>
            </li>
          ))}
        </ul>
      ) : null}

      <small className="space-weather__source">
        Source: NASA DONKI · latest notices from the past 30 days
      </small>
    </section>
  )
}
