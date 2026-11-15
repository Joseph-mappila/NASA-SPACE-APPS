import { useEffect, useState } from 'react'
import {
  fetchSpaceWeather,
  type SpaceWeatherEvent,
} from '../api/nasa'
import { nasaArchive, safeUrl } from '../data/nasa/archive'

function shortDate(value: string | null | undefined): string {
  if (!value) return 'a recent date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

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
      <details className="space-weather__disclosure">
        <summary className="space-weather__head">
          <span className="eyebrow">Live NASA space weather</span>
          <span className="chip chip--cyan">DONKI</span>
        </summary>

        <div className="space-weather__body">
          <p className="space-weather__intro">
            Real solar activity from NASA’s DONKI archive.
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

          {nasaArchive.storm ? (
            <div className="space-weather__storm">
              <span className="eyebrow">Storm source</span>
              <p>
                The Day 57 storm is fictional. The fastest real eruption in NASA’s
                recent DONKI catalog was a coronal mass ejection on{' '}
                {shortDate(nasaArchive.storm.event.startTime)} travelling at about{' '}
                {nasaArchive.storm.event.speedKms ?? '—'} km/s. The latest planetary
                K index in the same window was Kp{' '}
                {nasaArchive.storm.latestKp?.kp ?? '—'}.
              </p>
              {safeUrl(nasaArchive.storm.event.link) ? (
                <a
                  href={safeUrl(nasaArchive.storm.event.link) ?? undefined}
                  rel="noreferrer"
                  target="_blank"
                >
                  Read the DONKI record ↗
                </a>
              ) : null}
            </div>
          ) : null}

          <small className="space-weather__source">
            Source: NASA DONKI · latest notices from the past 30 days
          </small>
        </div>
      </details>
    </section>
  )
}
