import { useEffect, useState } from 'react'
import { fetchLatestEarthImage, type EarthImage } from '../api/nasa'

type EarthState =
  | { status: 'loading' }
  | { status: 'ready'; image: EarthImage }
  | { status: 'unavailable' }

export function EarthFromNasa() {
  const [state, setState] = useState<EarthState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    setState({ status: 'loading' })
    fetchLatestEarthImage(controller.signal)
      .then((image) => {
        if (!mounted) return
        setState(
          image ? { status: 'ready', image } : { status: 'unavailable' },
        )
      })
      .catch(() => {
        if (mounted) setState({ status: 'unavailable' })
      })

    return () => {
      mounted = false
      controller.abort()
    }
  }, [attempt])

  return (
    <section className="earth-view panel" aria-live="polite">
      <div className="earth-view__head">
        <span className="eyebrow">Live from NASA EPIC</span>
        <span className="chip chip--cyan">Earth</span>
      </div>

      {state.status === 'loading' ? (
        <p className="earth-view__status">
          Receiving Earth’s latest portrait from deep space…
        </p>
      ) : null}

      {state.status === 'unavailable' ? (
        <div className="earth-view__fallback">
          <p>
            The Earth camera is offline right now. The LunaNet radio link is
            still ready for the mission.
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

      {state.status === 'ready' ? (
        <figure className="earth-view__figure">
          <img
            alt={`Earth seen from deep space by NASA's EPIC camera on ${state.image.date}`}
            decoding="async"
            loading="lazy"
            src={state.image.url}
          />
          <figcaption>
            <strong>{state.image.date}</strong>
            <span>
              DSCOVR watches the full sunlit disk from the Sun–Earth L1 point,
              about 1.5 million km from Earth. This is the planet the outpost is
              calling home.
            </span>
            <a
              href="https://epic.gsfc.nasa.gov/"
              rel="noreferrer"
              target="_blank"
            >
              See more EPIC images
            </a>
          </figcaption>
        </figure>
      ) : null}

      <small className="earth-view__source">
        Source: NASA EPIC · DSCOVR natural-colour camera
      </small>
    </section>
  )
}
