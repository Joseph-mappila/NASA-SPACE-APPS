// NASA Open API helpers.
//
// Get a free key at https://api.nasa.gov and put it in `.env.local`:
//   VITE_NASA_API_KEY=your_key_here
//
// Without a key the app falls back to NASA's shared DEMO_KEY. That still works
// for a handful of requests per hour, so the game never depends on having a
// personal key to build or run.

const configuredKey = import.meta.env.VITE_NASA_API_KEY as string | undefined

export const NASA_API_KEY =
  typeof configuredKey === 'string' && configuredKey.trim().length > 0
    ? configuredKey.trim()
    : 'DEMO_KEY'

export const usingNasaDemoKey = NASA_API_KEY === 'DEMO_KEY'

const NASA_BASE = 'https://api.nasa.gov'
const EPIC_BASE = 'https://epic.gsfc.nasa.gov'
const REQUEST_TIMEOUT_MS = 9_000

export type EarthImage = {
  url: string
  date: string
  caption: string
}

export type SpaceWeatherEvent = {
  id: string
  type: string
  label: string
  issued: string
  summary: string
  url: string | null
}

const EVENT_LABELS: Record<string, string> = {
  FLR: 'Solar flare',
  CME: 'Coronal mass ejection',
  GST: 'Geomagnetic storm',
  SEP: 'Solar energetic particles',
  IPS: 'Interplanetary shock',
  HSS: 'High-speed solar wind',
  RBE: 'Radiation belt enhancement',
  MPC: 'Magnetopause crossing',
}

type DonkiNotification = {
  messageType?: string
  messageID?: string
  messageIssueTime?: string
  messageBody?: string
  messageURL?: string
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

const RELEVANT_TYPES = ['FLR', 'CME', 'GST', 'SEP', 'IPS', 'HSS']

function cleanBody(body: string): string {
  // DONKI notice bodies begin with CCMC metadata and a disclaimer. Pull out the
  // Summary section when it is present so the briefing shows the actual event.
  const normalized = body.replace(/\r\n/g, '\n')
  const summary = normalized.match(/##\s*Summary:\s*([\s\S]*?)(?:\n##|$)/i)
  const source = summary?.[1] ?? normalized
  const flattened = source
    .split('\n')
    .map((line) => line.replace(/^#+\s*/, '').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (flattened.length <= 190) return flattened
  return `${flattened.slice(0, 187).trimEnd()}…`
}

function formatIssued(value: string | undefined): string {
  if (!value) return 'Date unavailable'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

type EpicEntry = {
  identifier?: string
  image?: string
  date?: string
  caption?: string
}

function withTimeout(signal?: AbortSignal) {
  const controller = new AbortController()
  const abortFromCaller = () => controller.abort()
  signal?.addEventListener('abort', abortFromCaller, { once: true })
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  )
  return {
    signal: controller.signal,
    done: () => {
      window.clearTimeout(timeoutId)
      signal?.removeEventListener('abort', abortFromCaller)
    },
  }
}

/**
 * Latest full-disk Earth photo from NASA's EPIC camera on DSCOVR.
 * The image files live on epic.gsfc.nasa.gov, so the API request only fetches
 * metadata and the browser loads the picture directly.
 */
export async function fetchLatestEarthImage(
  signal?: AbortSignal,
): Promise<EarthImage | null> {
  // EPIC's public endpoint is keyless and CORS-enabled. The api.nasa.gov
  // EPIC path now redirects away, so use the camera's own archive API.
  const request = withTimeout(signal)

  try {
    const response = await fetch(`${EPIC_BASE}/api/natural`, {
      signal: request.signal,
    })
    if (!response.ok) {
      throw new Error(`NASA EPIC returned HTTP ${response.status}`)
    }
    const payload: unknown = await response.json()
    if (!Array.isArray(payload) || payload.length === 0) return null

    const entries = (payload as EpicEntry[])
      .filter((entry) => entry.image && entry.date)
      .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
    const latest = entries.at(-1)
    if (!latest?.image || !latest.date) return null

    const [datePart] = latest.date.split(' ')
    const [year, month, day] = datePart.split('-')
    if (!year || !month || !day) return null

    return {
      url: `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/jpg/${latest.image}.jpg`,
      date: formatIssued(latest.date.replace(' ', 'T') + 'Z'),
      caption:
        latest.caption?.trim() ||
        'The full sunlit face of Earth, photographed from deep space.',
    }
  } finally {
    request.done()
  }
}

/**
 * Fetches recent space-weather notifications from NASA's DONKI database.
 * One request keeps DEMO_KEY usage small. Throws on network or HTTP errors so
 * the caller can show a calm fallback instead of a broken panel.
 */
export async function fetchSpaceWeather(
  days = 30,
  signal?: AbortSignal,
): Promise<SpaceWeatherEvent[]> {
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  const params = new URLSearchParams({
    startDate: isoDate(start),
    endDate: isoDate(end),
    type: 'all',
    api_key: NASA_API_KEY,
  })

  const request = withTimeout(signal)

  try {
    const response = await fetch(
      `${NASA_BASE}/DONKI/notifications?${params.toString()}`,
      { signal: request.signal },
    )
    if (!response.ok) {
      throw new Error(`NASA DONKI returned HTTP ${response.status}`)
    }
    const payload: unknown = await response.json()
    if (!Array.isArray(payload)) return []

    const entries = (payload as DonkiNotification[])
      .filter(
        (entry) =>
          entry &&
          typeof entry === 'object' &&
          typeof entry.messageIssueTime === 'string',
      )
      .sort((a, b) =>
        (b.messageIssueTime ?? '').localeCompare(a.messageIssueTime ?? ''),
      )
    const relevant = entries.filter((entry) =>
      RELEVANT_TYPES.includes(entry.messageType ?? ''),
    )
    const newest = (relevant.length > 0 ? relevant : entries).slice(0, 3)

    return newest.map((entry, index) => {
      const type = entry.messageType ?? 'NASA'
      return {
        id: entry.messageID ?? `${type}-${index}`,
        type,
        label: EVENT_LABELS[type] ?? 'Space weather notice',
        issued: formatIssued(entry.messageIssueTime),
        summary: cleanBody(entry.messageBody ?? 'No summary supplied.'),
        url: entry.messageURL ?? null,
      }
    })
  } finally {
    request.done()
  }
}
