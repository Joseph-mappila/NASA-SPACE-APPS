#!/usr/bin/env node
// Builds src/data/nasa/archive.json from public NASA APIs.
//
// The game reads the committed snapshot at runtime, so a missing network or an
// exhausted DEMO_KEY can never break a mission. Run this by hand when you want
// fresher data:
//
//   npm run nasa:sync
//
// The script is deliberately forgiving: if one feed fails it keeps the previous
// value from archive.json and reports a warning. Only the sections that succeed
// are replaced, so a partial outage cannot wipe good data.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT_FILE = path.join(ROOT, 'src/data/nasa/archive.json')
const TIMEOUT_MS = 20_000
const DAY = 24 * 60 * 60 * 1000

const SOURCES = {
  techport: 'https://api.nasa.gov/techport/api/projects',
  images: 'https://images-api.nasa.gov',
  donki: 'https://api.nasa.gov/DONKI',
  epic: 'https://epic.gsfc.nasa.gov',
  neows: 'https://api.nasa.gov/neo/rest/v1',
  power: 'https://power.larc.nasa.gov',
  horizons: 'https://ssd.jpl.nasa.gov/api/horizons.api',
  worldview: 'https://wvs.earthdata.nasa.gov',
}

// Curated TechPort records, one per mission. These are real NASA projects that
// match the science each mission teaches.
const MISSION_PROJECTS = {
  1: 32733, // Electrodynamic Dust Shield for Lunar/ISS Experiment
  2: 93127, // Trash Compaction and Processing System
  3: 94753, // Smart Elastomer Seal with Remote Monitoring
  4: 11551, // Water Walls life support / radiation shielding
  5: 13611, // Rapid Cycle Amine (RCA) Swing Bed
  6: 91334, // Lunar Plant Growth Experiment (LPX)
  7: 116390, // ISRU Hydrogen Oxygen Production
  8: 157472, // LunaNet Network Layer Services
}

// Image Library queries. The first landscape still that resolves to an asset
// wins; the search index is stable enough that this is deterministic in
// practice, and the chosen ids are recorded in the snapshot for review.
const MISSION_IMAGES = {
  1: 'electrodynamic dust shield',
  2: 'orbital syngas commodity augmentation reactor',
  3: 'gateway airlock',
  4: 'radiation shielding garment',
  5: 'carbon dioxide removal amine',
  6: 'advanced plant habitat',
  7: 'lunar regolith oxygen',
  8: 'deep space network antenna',
}

const POWER_SITE = {
  name: 'Atacama Desert, Chile',
  note: 'A dry, high-altitude Earth analog for lunar solar testing.',
  latitude: -23.0,
  longitude: -70.24,
}

const HORIZONS_SITE = {
  name: 'Shackleton crater rim',
  latitude: 89.9,
  longitude: 0,
}

// A curated regional view from NASA GIBS/Worldview. The global snapshot
// endpoint returned partial-coverage imagery during testing, but this
// 2:1 region renders cleanly and shows dust, water, and sunlight together —
// the three things the outpost manages every day.
const WORLDVIEW_VIEW = {
  region: 'Eastern Mediterranean and the Nile Delta',
  bbox: '22,21,46,33',
  caption:
    'MODIS Terra over the eastern Mediterranean, the Nile Delta, and the Sahara.',
  minBytes: 20_000,
}

function log(message) {
  process.stdout.write(`${message}\n`)
}

async function readKey() {
  if (process.env.NASA_API_KEY?.trim()) return process.env.NASA_API_KEY.trim()
  if (process.env.VITE_NASA_API_KEY?.trim()) return process.env.VITE_NASA_API_KEY.trim()
  try {
    const env = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
    const match = env.match(/^\s*VITE_NASA_API_KEY\s*=\s*(.+)\s*$/m)
    if (match?.[1]) return match[1].trim().replace(/^["']|["']$/g, '')
  } catch {
    // No local key file: fall through to DEMO_KEY.
  }
  log('! No API key found; falling back to DEMO_KEY (heavily rate limited).')
  return 'DEMO_KEY'
}

async function readPrevious() {
  try {
    return JSON.parse(await fs.readFile(OUT_FILE, 'utf8'))
  } catch {
    return null
  }
}

async function getJson(url, key) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const separator = url.includes('?') ? '&' : '?'
    const withKey = key ? `${url}${separator}api_key=${encodeURIComponent(key)}` : url
    const response = await fetch(withKey, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

async function getText(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.text()
  } finally {
    clearTimeout(timer)
  }
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

function stripHtml(value) {
  if (typeof value !== 'string') return ''
  return decodeEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

function trimText(value, limit) {
  const text = String(value ?? '').trim()
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  const space = cut.lastIndexOf(' ')
  return `${(space > limit * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`
}

function isoDate(date) {
  return date.toISOString().slice(0, 10)
}

function daysAgo(days) {
  return new Date(Date.now() - days * DAY)
}

function upgradeToHttps(url) {
  return typeof url === 'string' ? url.replace(/^http:\/\//i, 'https://') : url
}

// ---------------------------------------------------------------------------
// TechPort
// ---------------------------------------------------------------------------

async function fetchProject(id, key) {
  const payload = await getJson(`${SOURCES.techport}/${id}`, key)
  const project = payload?.project
  if (!project?.title) throw new Error(`TechPort project ${id} had no title`)
  return {
    id: project.projectId ?? id,
    title: stripHtml(project.title),
    trl: Number.isFinite(project.trlCurrent) ? project.trlCurrent : null,
    status: stripHtml(project.status) || null,
    program: stripHtml(project.program?.title) || stripHtml(project.program?.acronym) || null,
    description: trimText(stripHtml(project.description), 260),
    url: `https://techport.nasa.gov/project/${project.projectId ?? id}`,
  }
}

// ---------------------------------------------------------------------------
// NASA Image and Video Library
// ---------------------------------------------------------------------------

function pickAsset(hrefs) {
  const wanted = ['~medium.jpg', '~large.jpg', '~small.jpg', '~orig.jpg']
  for (const suffix of wanted) {
    const hit = hrefs.find((href) => href.toLowerCase().endsWith(suffix))
    if (hit) return upgradeToHttps(hit)
  }
  return upgradeToHttps(hrefs.find((href) => /\.(jpe?g|png)$/i.test(href)))
}

async function fetchLibraryImage(query) {
  const search = await getJson(
    `${SOURCES.images}/search?q=${encodeURIComponent(query)}&media_type=image&page_size=8`,
  )
  const items = search?.collection?.items ?? []
  for (const item of items) {
    const data = item?.data?.[0]
    const nasaId = data?.nasa_id
    if (!nasaId) continue
    let asset
    try {
      asset = await getJson(`${SOURCES.images}/asset/${encodeURIComponent(nasaId)}`)
    } catch {
      continue
    }
    const hrefs = (asset?.collection?.items ?? [])
      .map((entry) => entry?.href)
      .filter(Boolean)
    const url = pickAsset(hrefs)
    if (!url) continue
    return {
      nasaId,
      title: stripHtml(data.title) || 'NASA archive image',
      url,
      pageUrl: `https://images.nasa.gov/details/${encodeURIComponent(nasaId)}`,
      center: stripHtml(data.center) || 'NASA',
      date: typeof data.date_created === 'string' ? data.date_created.slice(0, 10) : null,
      description: trimText(stripHtml(data.description), 180),
    }
  }
  throw new Error(`No usable image for "${query}"`)
}

// ---------------------------------------------------------------------------
// DONKI space weather
// ---------------------------------------------------------------------------

async function fetchStorm(key) {
  const end = new Date()
  const start = daysAgo(55)
  const window = `startDate=${isoDate(start)}&endDate=${isoDate(end)}`

  const cme = await getJson(`${SOURCES.donki}/CME?${window}`, key)
  const events = (Array.isArray(cme) ? cme : [])
    .filter((entry) => Array.isArray(entry?.cmeAnalyses) && entry.cmeAnalyses.length > 0)
    .map((entry) => {
      const analysis =
        entry.cmeAnalyses.find((item) => item.isMostAccurate) ?? entry.cmeAnalyses[0]
      return {
        id: entry.activityID,
        startTime: entry.startTime,
        speedKms: Number.isFinite(analysis?.speed) ? Math.round(analysis.speed) : null,
        halfAngle: Number.isFinite(analysis?.halfAngle) ? Math.round(analysis.halfAngle) : null,
        link: entry.link ?? null,
        note: trimText(stripHtml(entry.note), 150),
      }
    })
    .filter((entry) => entry.speedKms)

  // Prefer the fastest recent eruption: it reads better as a storm reference.
  const recent = events.slice(-12)
  const fastest = recent.sort((a, b) => (b.speedKms ?? 0) - (a.speedKms ?? 0))[0]
  if (!fastest) throw new Error('DONKI returned no CME with a speed')

  let latestKp = null
  try {
    const gst = await getJson(`${SOURCES.donki}/GST?${window}`, key)
    const rows = (Array.isArray(gst) ? gst : [])
      .flatMap((entry) =>
        (entry?.allKpIndex ?? []).map((kp) => ({
          kp: Number(kp.kpIndex),
          observedTime: kp.observedTime,
          link: entry.link ?? null,
        })),
      )
      .filter((row) => Number.isFinite(row.kp))
      .sort((a, b) => String(b.observedTime).localeCompare(String(a.observedTime)))
    latestKp = rows[0] ?? null
  } catch (error) {
    log(`  ! DONKI GST unavailable (${error.message})`)
  }

  return {
    windowDays: 55,
    event: fastest,
    latestKp,
    fetchedAt: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// EPIC Earth frames
// ---------------------------------------------------------------------------

async function fetchEarthFrames() {
  const payload = await getJson(`${SOURCES.epic}/api/natural`)
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error('EPIC returned no frames')
  }
  const entries = payload
    .filter((entry) => entry?.image && entry?.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
  const latest = entries.at(-1)
  const [datePart] = String(latest.date).split(' ')
  const [year, month, day] = datePart.split('-')
  if (!year || !month || !day) throw new Error('EPIC frame had an unreadable date')

  // Keep a short, evenly spaced set of frames from the same day so the ending
  // can cross-fade a real Earth rotation without downloading a whole day.
  const sameDay = entries.filter((entry) => String(entry.date).startsWith(datePart))
  const stride = Math.max(1, Math.floor(sameDay.length / 6))
  const frames = sameDay
    .filter((_, index) => index % stride === 0)
    .slice(0, 6)
    .map((entry) => ({
      url: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${entry.image}.jpg`,
      thumbUrl: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/thumbs/${entry.image}.jpg`,
      time: String(entry.date).slice(11, 16),
    }))

  return {
    date: datePart,
    caption: trimText(stripHtml(latest.caption), 160),
    frames,
    pageUrl: 'https://epic.gsfc.nasa.gov/',
  }
}

// ---------------------------------------------------------------------------
// GIBS / Worldview regional true-colour view
// ---------------------------------------------------------------------------

async function fetchEarthView(date) {
  const query = new URLSearchParams({
    REQUEST: 'GetSnapshot',
    TIME: date,
    BBOX: WORLDVIEW_VIEW.bbox,
    CRS: 'EPSG:4326',
    LAYERS: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    FORMAT: 'image/jpeg',
    WIDTH: '960',
    HEIGHT: '480',
  })
  const url = `${SOURCES.worldview}/api/v1/snapshot?${query}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let type = ''
  let bytes = 0
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    type = response.headers.get('content-type') ?? ''
    if (!type.startsWith('image/')) {
      throw new Error(`unexpected content type "${type}"`)
    }
    bytes = (await response.arrayBuffer()).byteLength
  } finally {
    clearTimeout(timer)
  }
  if (bytes < WORLDVIEW_VIEW.minBytes) {
    throw new Error(`image looked empty (${bytes} bytes)`)
  }

  return {
    date,
    region: WORLDVIEW_VIEW.region,
    caption: WORLDVIEW_VIEW.caption,
    url,
    pageUrl: `https://worldview.earthdata.nasa.gov/?v=${WORLDVIEW_VIEW.bbox}&t=${date}`,
  }
}

// ---------------------------------------------------------------------------
// NeoWs close approaches
// ---------------------------------------------------------------------------

async function fetchSky(key) {
  const start = new Date()
  const end = new Date(Date.now() + 7 * DAY)
  const feed = await getJson(
    `${SOURCES.neows}/feed?start_date=${isoDate(start)}&end_date=${isoDate(end)}`,
    key,
  )
  const rows = Object.values(feed?.near_earth_objects ?? {})
    .flat()
    .map((object) => {
      const approach = object?.close_approach_data?.[0]
      const diameter = object?.estimated_diameter?.meters
      return {
        name: stripHtml(object?.name) || 'Near-Earth object',
        date: approach?.close_approach_date ?? null,
        distanceLunar: Number(approach?.miss_distance?.lunar),
        distanceKm: Number(approach?.miss_distance?.kilometers),
        velocityKms: Number(approach?.relative_velocity?.kilometers_per_second),
        diameterM: Number.isFinite(diameter?.estimated_diameter_max)
          ? Math.round(diameter.estimated_diameter_max)
          : null,
        hazardous: Boolean(object?.is_potentially_hazardous_asteroid),
        url: object?.nasa_jpl_url ? upgradeToHttps(object.nasa_jpl_url) : null,
      }
    })
    .filter((row) => Number.isFinite(row.distanceLunar))
    .sort((a, b) => a.distanceLunar - b.distanceLunar)
    .slice(0, 4)

  return { approaches: rows }
}

// ---------------------------------------------------------------------------
// POWER solar irradiance
// ---------------------------------------------------------------------------

async function fetchSolar() {
  const end = new Date()
  const start = daysAgo(30)
  const query = new URLSearchParams({
    parameters: 'ALLSKY_SFC_SW_DWN',
    community: 'RE',
    longitude: String(POWER_SITE.longitude),
    latitude: String(POWER_SITE.latitude),
    start: isoDate(start).replace(/-/g, ''),
    end: isoDate(end).replace(/-/g, ''),
    format: 'JSON',
  })
  const payload = await getJson(`${SOURCES.power}/api/temporal/daily/point?${query}`)
  const series = payload?.properties?.parameter?.ALLSKY_SFC_SW_DWN ?? {}
  const days = Object.entries(series)
    .map(([rawDate, value]) => ({
      date: `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`,
      kwh: Number(value),
    }))
    .filter((row) => Number.isFinite(row.kwh) && row.kwh > 0)
    .slice(-7)
  if (days.length === 0) throw new Error('POWER returned no usable days')
  const average = days.reduce((sum, row) => sum + row.kwh, 0) / days.length
  return {
    site: POWER_SITE.name,
    note: POWER_SITE.note,
    latitude: POWER_SITE.latitude,
    longitude: POWER_SITE.longitude,
    days,
    averageKwh: Math.round(average * 100) / 100,
  }
}

// ---------------------------------------------------------------------------
// JPL Horizons pointing
// ---------------------------------------------------------------------------

async function fetchPointing() {
  const now = new Date()
  const start = `${isoDate(now)} 00:00`
  const stop = `${isoDate(now)} 03:00`
  const params = new URLSearchParams({
    format: 'text',
    COMMAND: "'399'",
    CENTER: "'coord@301'",
    COORD_TYPE: "'GEODETIC'",
    SITE_COORD: `'${HORIZONS_SITE.longitude},${HORIZONS_SITE.latitude},0'`,
    START_TIME: `'${start}'`,
    STOP_TIME: `'${stop}'`,
    STEP_SIZE: "'1 h'",
    QUANTITIES: "'4'",
    OBJ_DATA: "'NO'",
    MAKE_EPHEM: "'YES'",
    EPHEM_TYPE: "'OBSERVER'",
  })
  const text = await getText(`${SOURCES.horizons}?${params}`)
  const block = text.slice(text.indexOf('$$SOE') + 5, text.indexOf('$$EOE'))
  const first = block
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0)
  if (!first) throw new Error('Horizons returned no observer rows')
  const parts = first.split(/\s{2,}/)
  const azimuth = Number(parts.at(-2))
  const elevation = Number(parts.at(-1))
  if (!Number.isFinite(azimuth) || !Number.isFinite(elevation)) {
    throw new Error('Horizons row did not parse')
  }
  return {
    site: HORIZONS_SITE.name,
    latitude: HORIZONS_SITE.latitude,
    longitude: HORIZONS_SITE.longitude,
    date: start,
    azimuth: Math.round(azimuth * 10) / 10,
    elevation: Math.round(elevation * 100) / 100,
  }
}

// ---------------------------------------------------------------------------
// InSight Mars weather (static archive)
// ---------------------------------------------------------------------------

async function fetchMars(key) {
  const payload = await getJson(
    `https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0`,
    key,
  )
  const sols = (payload?.sol_keys ?? []).filter((sol) => payload[sol])
  const sol = sols.at(-1)
  const row = sol ? payload[sol] : null
  if (!row) throw new Error('InSight returned no sols')
  return {
    sol: Number(sol),
    airTempC: Number.isFinite(row.AT?.av) ? Math.round(row.AT.av * 10) / 10 : null,
    windMps: Number.isFinite(row.HWS?.av) ? Math.round(row.HWS.av * 10) / 10 : null,
    pressurePa: Number.isFinite(row.PRE?.av) ? Math.round(row.PRE.av) : null,
    lastUtc: typeof row.Last_UTC === 'string' ? row.Last_UTC.slice(0, 10) : null,
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const key = await readKey()
  const previous = await readPrevious()
  const next = {
    generatedAt: isoDate(new Date()),
    keyedWith: key === 'DEMO_KEY' ? 'DEMO_KEY' : 'personal key',
    sources: SOURCES,
    missions: previous?.missions ?? {},
    storm: previous?.storm ?? null,
    earth: previous?.earth ?? null,
    sky: previous?.sky ?? null,
    solar: previous?.solar ?? null,
    pointing: previous?.pointing ?? null,
    mars: previous?.mars ?? null,
    earthView: previous?.earthView ?? null,
  }

  let refreshed = 0
  const step = async (label, run) => {
    try {
      const value = await run()
      log(`✓ ${label}`)
      refreshed += 1
      return value
    } catch (error) {
      log(`✗ ${label}: ${error.message}${previous ? ' (kept previous snapshot)' : ''}`)
      return undefined
    }
  }

  log('Fetching NASA data…')

  for (const [id, projectId] of Object.entries(MISSION_PROJECTS)) {
    const project = await step(`TechPort ${projectId} (mission ${id})`, () =>
      fetchProject(projectId, key),
    )
    if (!project) continue
    next.missions[id] = { ...(next.missions[id] ?? {}), project }
  }

  for (const [id, query] of Object.entries(MISSION_IMAGES)) {
    const image = await step(`Image Library "${query}" (mission ${id})`, () =>
      fetchLibraryImage(query),
    )
    if (!image) continue
    next.missions[id] = { ...(next.missions[id] ?? {}), image }
  }

  const storm = await step('DONKI storm reference', () => fetchStorm(key))
  if (storm) next.storm = storm

  const earth = await step('EPIC Earth frames', () => fetchEarthFrames())
  if (earth) next.earth = earth

  const earthView = await step('Worldview true-colour view', () =>
    fetchEarthView(earth?.date ?? isoDate(new Date())),
  )
  if (earthView) next.earthView = earthView

  const sky = await step('NeoWs close approaches', () => fetchSky(key))
  if (sky) next.sky = sky

  const solar = await step('POWER solar irradiance', () => fetchSolar())
  if (solar) next.solar = solar

  const pointing = await step('Horizons Moon→Earth pointing', () => fetchPointing())
  if (pointing) next.pointing = pointing

  const mars = await step('InSight Mars weather archive', () => fetchMars(key))
  if (mars) next.mars = mars

  if (refreshed === 0) {
    log('\nNothing could be refreshed. archive.json was left untouched.')
    process.exitCode = 1
    return
  }

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true })
  const temp = `${OUT_FILE}.tmp`
  await fs.writeFile(temp, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  await fs.rename(temp, OUT_FILE)

  const bytes = Buffer.byteLength(JSON.stringify(next))
  log(`\nWrote ${path.relative(ROOT, OUT_FILE)} (${(bytes / 1024).toFixed(1)} kB).`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
