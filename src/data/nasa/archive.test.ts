import { describe, expect, it } from 'vitest'
import type { MissionId } from '../../game/types'
import {
  missionArchive,
  nasaArchive,
  nasaArchiveDate,
  safeUrl,
} from './archive'

const HTTPS = /^https:\/\//

function expectHttps(url: string | null | undefined) {
  expect(url).toMatch(HTTPS)
  expect(safeUrl(url)).not.toBeNull()
}

describe('NASA snapshot', () => {
  it('records when it was fetched and which key built it', () => {
    expect(nasaArchiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isNaN(new Date(nasaArchiveDate).getTime())).toBe(false)
    expect(['personal key', 'DEMO_KEY']).toContain(nasaArchive.keyedWith)
  })

  it('covers every mission with a TechPort project and a library photo', () => {
    for (const id of [1, 2, 3, 4, 5, 6, 7, 8] as MissionId[]) {
      const entry = missionArchive(id)
      expect(entry, `mission ${id}`).not.toBeNull()
      expect(entry?.project, `mission ${id} project`).toBeDefined()
      expect(entry?.image, `mission ${id} image`).toBeDefined()
      expect(entry?.project?.title.length).toBeGreaterThan(0)
      expect(entry?.project?.description.length).toBeGreaterThan(0)
      expect(entry?.image?.title.length).toBeGreaterThan(0)
      expectHttps(entry?.project?.url)
      expectHttps(entry?.image?.url)
      expectHttps(entry?.image?.pageUrl)
    }
  })

  it('keeps the storm reference physically plausible', () => {
    const storm = nasaArchive.storm
    expect(storm).not.toBeNull()
    expect(storm?.event.speedKms).toBeGreaterThan(0)
    expect(storm?.event.halfAngle).toBeGreaterThan(0)
    expect(storm?.event.halfAngle).toBeLessThanOrEqual(180)
    expectHttps(storm?.event.link)
    if (storm?.latestKp) {
      expect(storm.latestKp.kp).toBeGreaterThanOrEqual(0)
      expect(storm.latestKp.kp).toBeLessThanOrEqual(9)
    }
  })

  it('has EPIC frames and a true-colour Worldview image', () => {
    const earth = nasaArchive.earth
    expect(earth).not.toBeNull()
    expect(earth?.frames.length).toBeGreaterThan(0)
    expect(earth?.frames.length).toBeLessThanOrEqual(6)
    for (const frame of earth?.frames ?? []) {
      expectHttps(frame.url)
      expect(frame.url).toMatch(/\/jpg\/.+\.jpg$/)
      expect(frame.time).toMatch(/^\d{2}:\d{2}$/)
    }
    expectHttps(earth?.pageUrl)

    const earthView = nasaArchive.earthView
    expect(earthView).not.toBeNull()
    expect(earthView?.region.length).toBeGreaterThan(0)
    expect(earthView?.caption.length).toBeGreaterThan(0)
    expectHttps(earthView?.url)
    expectHttps(earthView?.pageUrl)
  })

  it('describes close approaches', () => {
    const approaches = nasaArchive.sky?.approaches ?? []
    expect(approaches.length).toBeGreaterThan(0)
    for (const approach of approaches) {
      expect(approach.name.length).toBeGreaterThan(0)
      expect(approach.distanceLunar).toBeGreaterThan(0)
      expect(approach.velocityKms).toBeGreaterThan(0)
    }
  })

  it('has a seven-day solar series and a pointing solution', () => {
    const solar = nasaArchive.solar
    expect(solar).not.toBeNull()
    expect(solar?.days.length).toBe(7)
    for (const day of solar?.days ?? []) {
      expect(day.kwh).toBeGreaterThan(0)
      expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    expect(solar?.averageKwh).toBeGreaterThan(0)

    const pointing = nasaArchive.pointing
    expect(pointing).not.toBeNull()
    expect(pointing?.azimuth).toBeGreaterThanOrEqual(0)
    expect(pointing?.azimuth).toBeLessThan(360)
    expect(pointing?.elevation).toBeGreaterThanOrEqual(-90)
    expect(pointing?.elevation).toBeLessThanOrEqual(90)
  })

  it('keeps the last InSight sol readable', () => {
    const mars = nasaArchive.mars
    expect(mars).not.toBeNull()
    expect(mars?.sol).toBeGreaterThan(0)
    expect(typeof mars?.airTempC).toBe('number')
    expect(typeof mars?.pressurePa).toBe('number')
  })
})

describe('safeUrl', () => {
  it('accepts only absolute HTTPS URLs', () => {
    expect(safeUrl('https://images.nasa.gov/details/PIA25136')).toBe(
      'https://images.nasa.gov/details/PIA25136',
    )
    expect(safeUrl('http://api.nasa.gov/x')).toBeNull()
    expect(safeUrl('javascript:alert(1)')).toBeNull()
    expect(safeUrl('data:text/html,hi')).toBeNull()
    expect(safeUrl('/relative/path')).toBeNull()
    expect(safeUrl('')).toBeNull()
    expect(safeUrl(null)).toBeNull()
    expect(safeUrl(undefined)).toBeNull()
  })
})

describe('missionArchive', () => {
  it('returns null for a mission that has no snapshot entry', () => {
    expect(missionArchive(9 as unknown as MissionId)).toBeNull()
  })

  it('returns a fresh object without leaking the raw snapshot', () => {
    const first = missionArchive(1)
    const second = missionArchive(1)
    expect(first).toEqual(second)
    expect(first).not.toBe(second)
  })
})
