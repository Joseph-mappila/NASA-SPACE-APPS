// Typed access to the committed NASA snapshot.
//
// `scripts/nasa-snapshot.mjs` writes `archive.json`; nothing here touches the
// network. That keeps the game deterministic and offline-safe: if a NASA feed
// is down, the snapshot is simply older, and every component below degrades to
// hiding its section.

import type { MissionId } from '../../game/types'
import raw from './archive.json'

export type NasaProject = {
  id: number
  title: string
  trl: number | null
  status: string | null
  program: string | null
  description: string
  url: string
}

export type NasaImage = {
  nasaId: string
  title: string
  url: string
  pageUrl: string
  center: string
  date: string | null
  description: string
}

export type MissionNasaArchive = {
  project?: NasaProject
  image?: NasaImage
}

export type StormEvent = {
  id: string
  startTime: string
  speedKms: number | null
  halfAngle: number | null
  link: string | null
  note: string
}

export type StormArchive = {
  windowDays: number
  event: StormEvent
  latestKp: { kp: number; observedTime: string; link: string | null } | null
  fetchedAt: string
}

export type EarthFrame = { url: string; thumbUrl: string; time: string }

export type EarthArchive = {
  date: string
  caption: string
  frames: EarthFrame[]
  pageUrl: string
}

export type Approach = {
  name: string
  date: string | null
  distanceLunar: number
  distanceKm: number
  velocityKms: number
  diameterM: number | null
  hazardous: boolean
  url: string | null
}

export type SkyArchive = { approaches: Approach[] }

export type SolarArchive = {
  site: string
  note: string
  latitude: number
  longitude: number
  days: Array<{ date: string; kwh: number }>
  averageKwh: number
}

export type PointingArchive = {
  site: string
  latitude: number
  longitude: number
  date: string
  azimuth: number
  elevation: number
}

export type MarsArchive = {
  sol: number
  airTempC: number | null
  windMps: number | null
  pressurePa: number | null
  lastUtc: string | null
}

export type EarthViewArchive = {
  date: string
  region: string
  caption: string
  url: string
  pageUrl: string
}

export type NasaArchive = {
  generatedAt: string
  keyedWith: string
  sources: Record<string, string>
  missions: Record<string, MissionNasaArchive>
  storm: StormArchive | null
  earth: EarthArchive | null
  sky: SkyArchive | null
  solar: SolarArchive | null
  pointing: PointingArchive | null
  mars: MarsArchive | null
  earthView: EarthViewArchive | null
}

const archive = raw as unknown as NasaArchive

/** Only allow external links that use HTTPS; anything else is dropped. */
export function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? parsed.toString() : null
  } catch {
    return null
  }
}

export function missionArchive(id: MissionId): MissionNasaArchive | null {
  const entry = archive.missions?.[String(id)]
  if (!entry) return null
  const project = entry.project && safeUrl(entry.project.url) ? entry.project : undefined
  const image = entry.image && safeUrl(entry.image.url) ? entry.image : undefined
  if (!project && !image) return null
  return { project, image }
}

export const nasaArchive = archive
export const nasaArchiveDate = archive.generatedAt
