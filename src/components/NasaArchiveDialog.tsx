import { useId, useRef, useState } from 'react'
import {
  missionArchive,
  nasaArchive,
  nasaArchiveDate,
  safeUrl,
} from '../data/nasa/archive'
import type { MissionDefinition } from '../game/types'

type NasaArchiveDialogProps = {
  mission: MissionDefinition
}

function shortDate(value: string | null): string {
  if (!value) return 'date unknown'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Opens the archive dialog for a mission from anywhere on the briefing. */
export function openNasaArchive(missionId: number) {
  const dialog = document.getElementById(
    `nasa-archive-${missionId}`,
  ) as HTMLDialogElement | null
  if (!dialog) return
  if (dialog.open) return
  if (typeof dialog.showModal === 'function') dialog.showModal()
  else dialog.setAttribute('open', '')
}

type Extra = { label: string; text: string; href: string; linkLabel: string }

function extrasFor(missionId: number): Extra[] {
  const extras: Extra[] = []

  if (missionId === 1 && nasaArchive.solar) {
    const solar = nasaArchive.solar
    extras.push({
      label: 'NASA POWER · real sunlight',
      text: `Over the last ${solar.days.length} days the sky above ${solar.site} delivered an average of ${solar.averageKwh} kWh/m² per day. A lunar day lasts about 14 Earth days, so a real array has to store what it makes.`,
      href: 'https://power.larc.nasa.gov/',
      linkLabel: 'Explore NASA POWER',
    })
  }

  if (missionId === 4 && nasaArchive.storm) {
    const storm = nasaArchive.storm
    const event = storm.event
    extras.push({
      label: 'NASA DONKI · reference eruption',
      text: `A real coronal mass ejection on ${shortDate(event.startTime)} left the Sun at about ${event.speedKms ?? '—'} km/s with a ${event.halfAngle ?? '—'}° half-angle. The Day 57 storm is fictional, but its physics follows events like this one.`,
      href: event.link ?? 'https://ccmc.gsfc.nasa.gov/',
      linkLabel: 'Read the DONKI record',
    })
  }

  if (missionId === 8 && nasaArchive.pointing) {
    const pointing = nasaArchive.pointing
    extras.push({
      label: 'JPL Horizons · real pointing',
      text: `From ${pointing.site} on ${shortDate(pointing.date)}, Earth sits at azimuth ${pointing.azimuth}° and elevation ${pointing.elevation}°. At the lunar south pole our home planet never climbs far above the horizon, so the dish has to aim almost sideways.`,
      href: 'https://ssd.jpl.nasa.gov/horizons/',
      linkLabel: 'Open JPL Horizons',
    })
  }

  return extras
}

/**
 * A compact "NASA archive" button plus a modal with the real project and photo
 * behind this mission. The button lives in the briefing header so the archive
 * never changes the briefing layout; the modal is a native <dialog>.
 */
export function NasaArchiveDialog({ mission }: NasaArchiveDialogProps) {
  const data = missionArchive(mission.id)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const titleId = useId()

  if (!data) return null

  const extras = extrasFor(mission.id)
  const imageHref = data.image ? safeUrl(data.image.pageUrl) : null
  const projectHref = data.project ? safeUrl(data.project.url) : null

  const open = () => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
  }

  const close = () => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (typeof dialog.close === 'function') dialog.close()
    else dialog.removeAttribute('open')
  }

  return (
    <>
      <button
        aria-haspopup="dialog"
        className="nasa-archive__trigger"
        onClick={open}
        title="The real NASA project and photo behind this mission"
        type="button"
      >
        <span aria-hidden="true">◎</span> Open NASA archive
      </button>

      <dialog
        aria-labelledby={titleId}
        className="nasa-dialog"
        id={`nasa-archive-${mission.id}`}
        onClick={(event) => {
          if (event.target === dialogRef.current) close()
        }}
        ref={dialogRef}
      >
        <div className="nasa-dialog__panel">
          <header className="nasa-dialog__head">
            <div>
              <span className="eyebrow">Real NASA data</span>
              <h2 id={titleId}>{mission.title}</h2>
            </div>
            <button
              aria-label="Close NASA archive"
              className="nasa-dialog__close"
              onClick={close}
              type="button"
            >
              ×
            </button>
          </header>

          <div className="nasa-dialog__body">
            {data.project ? (
              <section className="nasa-project">
                <span className="eyebrow">NASA technology project</span>
                <h3>{data.project.title}</h3>
                <div className="nasa-project__meta">
                  {data.project.trl !== null ? (
                    <span className="chip chip--cyan">TRL {data.project.trl}</span>
                  ) : null}
                  {data.project.status ? (
                    <span className="chip">{data.project.status}</span>
                  ) : null}
                  {data.project.program ? (
                    <span className="chip chip--amber">{data.project.program}</span>
                  ) : null}
                </div>
                {projectHref ? (
                  <a href={projectHref} rel="noreferrer" target="_blank">
                    Open in NASA TechPort ↗
                  </a>
                ) : null}
                <p>{data.project.description}</p>
              </section>
            ) : null}

            {data.image && !imageFailed ? (
              <figure className="nasa-photo">
                <img
                  alt={`${data.image.title}, photographed by NASA`}
                  decoding="async"
                  loading="lazy"
                  onError={() => setImageFailed(true)}
                  referrerPolicy="no-referrer"
                  src={data.image.url}
                />
                <figcaption>
                  <strong>{data.image.title}</strong>
                  <span>
                    {data.image.center}
                    {data.image.date ? ` · ${shortDate(data.image.date)}` : ''}
                  </span>
                  {imageHref ? (
                    <a href={imageHref} rel="noreferrer" target="_blank">
                      View in the NASA Image Library ↗
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            ) : null}

            {extras.map((extra) => (
              <section className="nasa-extra" key={extra.label}>
                <span className="eyebrow">{extra.label}</span>
                <p>{extra.text}</p>
                <a href={extra.href} rel="noreferrer" target="_blank">
                  {extra.linkLabel} ↗
                </a>
              </section>
            ))}
          </div>

          <footer className="nasa-dialog__foot">
            Snapshot of public NASA open data, fetched {nasaArchiveDate}. Every
            feed has a fallback, so the mission runs even when NASA is offline.
          </footer>
        </div>
      </dialog>
    </>
  )
}
