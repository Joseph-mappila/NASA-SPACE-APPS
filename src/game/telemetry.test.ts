import { describe, expect, it } from 'vitest'
import { buildTelemetry } from './telemetry'
import { initialGameState } from './state'
import type { GameState, MissionOutcome } from './types'

function state(overrides: Partial<GameState> = {}): GameState {
  return {
    ...initialGameState,
    ...overrides,
    resources: { ...initialGameState.resources, ...overrides.resources },
    flags: { ...initialGameState.flags, ...overrides.flags },
    outcomes: { ...overrides.outcomes },
  }
}

function outcome(mission: MissionOutcome['mission'], passed: boolean): MissionOutcome {
  return {
    mission,
    status: passed ? 'passed' : 'failed',
    grade: passed ? 'A' : 'F',
    timeUsedMs: 1000,
    timeLimitMs: 60_000,
    metrics: {},
  }
}

describe('telemetry', () => {
  it('presents Day 57 oxygen, CO2, water, and power in real units', () => {
    const telemetry = buildTelemetry(state())

    expect(telemetry.ppO2).toBe(145)
    expect(telemetry.ppCO2).toBe(1.8)
    expect(telemetry.waterReserve).toBe(1020)
    expect(telemetry.waterDays).toBe(27)
    expect(telemetry.foodDays).toBe(26)
    expect(telemetry.powerAvailable).toBeCloseTo(4.16)
    expect(telemetry.pressure).toBeCloseTo(8.2)
  })

  it('matches the Day 58 briefing after the overnight drop', () => {
    const telemetry = buildTelemetry(
      state({
        day: 58,
        resources: { ...initialGameState.resources, oxygen: 97 },
      }),
    )

    expect(telemetry.ppO2).toBe(141)
    expect(telemetry.ppCO2).toBe(3.4)
  })

  it('drops CO2 after the scrubber bed is replaced', () => {
    const telemetry = buildTelemetry(
      state({
        day: 58,
        resources: { ...initialGameState.resources, oxygen: 97 },
        outcomes: { 5: outcome(5, true) },
      }),
    )

    expect(telemetry.ppCO2).toBe(1.8)
  })

  it('shows hypercapnia after a failed scrubber mission', () => {
    const telemetry = buildTelemetry(
      state({
        day: 58,
        flags: { ...initialGameState.flags, co2Penalty: true },
      }),
    )

    expect(telemetry.ppCO2).toBe(4.6)
    expect(telemetry.primary.find((reading) => reading.id === 'co2')?.tone).toBe('bad')
  })

  it('shows a leak in cabin pressure', () => {
    const telemetry = buildTelemetry(
      state({ flags: { ...initialGameState.flags, oxygenLeak: true } }),
    )

    expect(telemetry.pressure).toBeCloseTo(7.8)
  })

  it('reports a radiation overexposure when shelter coverage is short', () => {
    const telemetry = buildTelemetry(
      state({
        flags: { ...initialGameState.flags, shelterCoverage: 80, shieldTiles: 6 },
        outcomes: { 4: outcome(4, false) },
      }),
    )

    expect(telemetry.radiation).toBe(268)
    expect(
      telemetry.secondary.find((reading) => reading.id === 'radiation')?.tone,
    ).toBe('bad')
  })

  it('reports a safe dose when the shelter is certified', () => {
    const telemetry = buildTelemetry(
      state({
        flags: { ...initialGameState.flags, shelterCoverage: 100 },
        outcomes: { 4: outcome(4, true) },
      }),
    )

    expect(telemetry.radiation).toBe(42)
  })
})
