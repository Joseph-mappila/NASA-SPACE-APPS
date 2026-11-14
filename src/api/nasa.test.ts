import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchLatestEarthImage, fetchSpaceWeather } from './nasa'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('NASA DONKI client', () => {
  it('maps recent notices into readable space-weather events', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          messageType: 'FLR',
          messageID: '20261101-FLR-001',
          messageIssueTime: '2026-11-01T12:30:00Z',
          messageBody:
            'An M1.2 solar flare peaked at 12:15 UTC.  A coronal mass ejection was not observed.',
          messageURL: 'https://example.test/flare',
        },
        {
          messageType: 'CME',
          messageID: '20261102-CME-001',
          messageIssueTime: '2026-11-02T08:00:00Z',
          messageBody: 'A coronal mass ejection left the Sun at 640 km/s.',
        },
      ],
    })
    vi.stubGlobal('fetch', fetchMock)

    const events = await fetchSpaceWeather(30)

    expect(events).toHaveLength(2)
    expect(events[0].label).toBe('Coronal mass ejection')
    expect(events[1].label).toBe('Solar flare')
    expect(events[1].summary).toContain('M1.2')
    expect(events[1].summary).not.toContain('  ')
    expect(events[0].url).toBeNull()

    const requestedUrl = String(fetchMock.mock.calls[0][0])
    expect(requestedUrl).toContain('/DONKI/notifications')
    expect(requestedUrl).toContain('api_key=')
    expect(requestedUrl).toContain('type=all')
  })

  it('shows the newest relevant events and strips CCMC boilerplate', async () => {
    const notice = (
      messageType: string,
      messageIssueTime: string,
      body: string,
    ) => ({
      messageType,
      messageID: `${messageType}-${messageIssueTime}`,
      messageIssueTime,
      messageBody: body,
    })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          notice(
            'FLR',
            '2026-11-01T00:00:00Z',
            '## Summary:\n\nAn old flare.',
          ),
          notice(
            'CME',
            '2026-11-04T00:00:00Z',
            '## Community Coordinated Modeling Center\n## Disclaimer: research data\n\n## Summary:\n\nA fast coronal mass ejection left the Sun at 720 km/s.',
          ),
          notice(
            'RBE',
            '2026-11-05T00:00:00Z',
            '## Summary:\n\nRadiation belt enhancement.',
          ),
          notice(
            'GST',
            '2026-11-03T00:00:00Z',
            '## Summary:\n\nA geomagnetic storm reached G2.',
          ),
        ],
      }),
    )

    const events = await fetchSpaceWeather()

    expect(events.map((event) => event.type)).toEqual(['CME', 'GST', 'FLR'])
    expect(events[0].summary).toBe(
      'A fast coronal mass ejection left the Sun at 720 km/s.',
    )
    expect(events[0].summary).not.toContain('Community Coordinated')
  })

  it('limits the feed so the briefing stays compact', async () => {
    const notice = {
      messageType: 'GST',
      messageID: 'storm',
      messageIssueTime: '2026-11-03T00:00:00Z',
      messageBody: 'Geomagnetic storm conditions observed.',
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [notice, notice, notice, notice, notice],
      }),
    )

    const events = await fetchSpaceWeather()
    expect(events).toHaveLength(3)
    expect(events[0].label).toBe('Geomagnetic storm')
  })

  it('throws when NASA rejects the request so the UI can fall back', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({}),
      }),
    )

    await expect(fetchSpaceWeather()).rejects.toThrow('HTTP 503')
  })
})

describe('NASA EPIC client', () => {
  it('builds the archive URL for the newest Earth image', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          image: 'epic_1b_20261109000000',
          date: '2026-11-09 00:00:00',
          caption: 'Older view',
        },
        {
          image: 'epic_1b_20261114001209',
          date: '2026-11-14 00:12:09',
          caption: 'Earth from DSCOVR',
        },
      ],
    })
    vi.stubGlobal('fetch', fetchMock)

    const image = await fetchLatestEarthImage()

    expect(image).not.toBeNull()
    expect(image?.url).toBe(
      'https://epic.gsfc.nasa.gov/archive/natural/2026/11/14/jpg/epic_1b_20261114001209.jpg',
    )
    expect(image?.caption).toBe('Earth from DSCOVR')
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      'https://epic.gsfc.nasa.gov/api/natural',
    )
  })

  it('returns null when EPIC has no images', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      }),
    )

    await expect(fetchLatestEarthImage()).resolves.toBeNull()
  })
})
