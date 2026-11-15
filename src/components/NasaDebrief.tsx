import type { CSSProperties } from 'react'
import { nasaArchive, nasaArchiveDate, safeUrl } from '../data/nasa/archive'

function shortDate(value: string | null | undefined): string {
  if (!value) return 'date unknown'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Post-run science panel. It lives inside the ending's existing "Science,
 * credits, and sources" disclosure, so it is collapsed by default and cannot
 * change the ending layout.
 */
export function NasaDebrief() {
  const { earth, sky, solar, pointing, mars, earthToday } = nasaArchive
  const epicFrames = earth?.frames.filter((frame) => safeUrl(frame.thumbUrl)) ?? []
  const epicHref = earth ? safeUrl(earth.pageUrl) : null
  const skyHref = 'https://cneos.jpl.nasa.gov/'
  const solarMax = solar ? Math.max(...solar.days.map((day) => day.kwh), 1) : 1
  const earthTodayHref = earthToday ? safeUrl(earthToday.pageUrl) : null
  const earthTodaySrc = earthToday ? safeUrl(earthToday.url) : null

  const hasAnything =
    epicFrames.length > 0 ||
    (sky?.approaches.length ?? 0) > 0 ||
    Boolean(solar) ||
    Boolean(pointing) ||
    Boolean(mars) ||
    Boolean(earthTodaySrc)

  if (!hasAnything) return null

  return (
    <div className="nasa-debrief">
      <span className="eyebrow">Science debrief · real NASA data</span>

      {epicFrames.length > 0 && earth ? (
        <section className="nasa-debrief__section">
          <h3>Earth, seen from deep space</h3>
          <div
            aria-hidden="true"
            className="nasa-epic__stage"
            style={{ '--nasa-frames': epicFrames.length } as CSSProperties}
          >
            {epicFrames.map((frame, index) => (
              <img
                alt=""
                className="nasa-epic__frame"
                decoding="async"
                key={frame.thumbUrl}
                loading="lazy"
                referrerPolicy="no-referrer"
                src={frame.thumbUrl}
                style={{ '--nasa-index': index } as CSSProperties}
              />
            ))}
          </div>
          <p>
            NASA&apos;s EPIC camera on DSCOVR watches the whole sunlit disk from
            the Sun–Earth L1 point. These frames were captured on{' '}
            {shortDate(earth.date)}; the slow fade is the real Earth turning.
          </p>
          {epicHref ? (
            <a href={epicHref} rel="noreferrer" target="_blank">
              See the full EPIC archive ↗
            </a>
          ) : null}
        </section>
      ) : null}

      {earthTodaySrc ? (
        <figure className="nasa-earth">
          <img
            alt={`Satellite view of Earth on ${earthToday?.date ?? 'today'}`}
            decoding="async"
            loading="lazy"
            referrerPolicy="no-referrer"
            src={earthTodaySrc}
          />
          <figcaption>
            <strong>Earth today, in true colour</strong>
            <span>
              MODIS Terra via NASA Worldview · {shortDate(earthToday?.date)}
            </span>
            {earthTodayHref ? (
              <a href={earthTodayHref} rel="noreferrer" target="_blank">
                Open NASA Worldview ↗
              </a>
            ) : null}
          </figcaption>
        </figure>
      ) : null}

      {sky && sky.approaches.length > 0 ? (
        <section className="nasa-debrief__section">
          <h3>What passes Earth this week</h3>
          <ul className="nasa-sky">
            {sky.approaches.map((approach) => (
              <li key={`${approach.name}-${approach.date}`}>
                <strong>{approach.name}</strong>
                <span>{shortDate(approach.date)}</span>
                <span>{approach.distanceLunar.toFixed(1)} lunar distances</span>
                <span>{approach.velocityKms.toFixed(1)} km/s</span>
                {approach.diameterM ? <span>about {approach.diameterM} m wide</span> : null}
                {approach.hazardous ? <em>watched closely</em> : null}
              </li>
            ))}
          </ul>
          <p>
            One lunar distance is about 384,400 km. NASA&apos;s NeoWs feed lists
            every known close approach; none of these is a threat, and the
            outpost is much too small to notice them.
          </p>
          <a href={skyHref} rel="noreferrer" target="_blank">
            Browse near-Earth objects ↗
          </a>
        </section>
      ) : null}

      {solar ? (
        <section className="nasa-debrief__section">
          <h3>Real sunlight, real power budget</h3>
          <div className="nasa-solar" aria-hidden="true">
            {solar.days.map((day) => (
              <span className="nasa-solar__bar" key={day.date}>
                <i style={{ height: `${Math.max(6, (day.kwh / solarMax) * 100)}%` }} />
                <small>{day.date.slice(5)}</small>
              </span>
            ))}
          </div>
          <p>
            NASA POWER measured an average of {solar.averageKwh} kWh/m² per day
            at {solar.site}, a dry high-altitude stand-in for lunar solar
            testing. {solar.note}
          </p>
          <a href="https://power.larc.nasa.gov/" rel="noreferrer" target="_blank">
            Explore NASA POWER ↗
          </a>
        </section>
      ) : null}

      {pointing ? (
        <section className="nasa-debrief__section">
          <h3>Where Earth really is</h3>
          <div className="nasa-readouts">
            <div>
              <strong>{pointing.azimuth}°</strong>
              <span>azimuth</span>
            </div>
            <div>
              <strong>{pointing.elevation}°</strong>
              <span>elevation</span>
            </div>
          </div>
          <p>
            JPL Horizons puts Earth at that spot in the sky above{' '}
            {pointing.site} on {shortDate(pointing.date)}. From the lunar south
            pole Earth stays close to the horizon, which is why a relay dish has
            to aim almost sideways.
          </p>
          <a href="https://ssd.jpl.nasa.gov/horizons/" rel="noreferrer" target="_blank">
            Open JPL Horizons ↗
          </a>
        </section>
      ) : null}

      {mars ? (
        <section className="nasa-debrief__section">
          <h3>Meanwhile, on Mars</h3>
          <div className="nasa-readouts">
            <div>
              <strong>{mars.airTempC ?? '—'}°C</strong>
              <span>air temperature</span>
            </div>
            <div>
              <strong>{mars.windMps ?? '—'} m/s</strong>
              <span>wind</span>
            </div>
            <div>
              <strong>{mars.pressurePa ?? '—'} Pa</strong>
              <span>pressure</span>
            </div>
          </div>
          <p>
            Sol {mars.sol} of NASA&apos;s InSight lander, the last weather in the
            public archive ({shortDate(mars.lastUtc)}). Mars is colder and its
            air is about 150 times thinner than Earth&apos;s, which is why the
            outpost needs a sealed habitat.
          </p>
        </section>
      ) : null}

      <small className="nasa-debrief__source">
        Snapshot of public NASA data, fetched {nasaArchiveDate}. Sources: NASA
        TechPort, NASA Image and Video Library, DONKI, EPIC, NeoWs, POWER, JPL
        Horizons, InSight, and Worldview. NASA does not endorse this project.
      </small>
    </div>
  )
}
