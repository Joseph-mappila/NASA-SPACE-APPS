import { describe, expect, it } from 'vitest'
import {
  gameReducer,
  getEndingId,
  hasZeroResource,
  initialGameState,
  missionLimitFor,
  passedCount,
  requiredShelterCoverage,
} from './state'
import { MISSIONS } from './content'
import type {
  GameState,
  MissionId,
  MissionMetrics,
  MissionOutcome,
} from './types'

function outcome(
  mission: MissionId,
  status: 'passed' | 'failed' = 'passed',
  metrics: MissionMetrics = {},
  timeUsedMs = 30_000,
): MissionOutcome {
  return {
    mission,
    status,
    grade: status === 'passed' ? 'A' : 'F',
    timeUsedMs,
    timeLimitMs: MISSIONS[mission].limitMs,
    metrics,
  }
}

function complete(
  state: GameState,
  mission: MissionId,
  status: 'passed' | 'failed' = 'passed',
  metrics: MissionMetrics = {},
  timeUsedMs = 30_000,
): GameState {
  return gameReducer(state, {
    type: 'COMPLETE_MISSION',
    outcome: outcome(mission, status, metrics, timeUsedMs),
  })
}

function passedThrough(count: MissionId): GameState {
  let state: GameState = { ...initialGameState, screen: 'mission' }
  for (let id = 1 as MissionId; id <= count; id = (id + 1) as MissionId) {
    state = complete(state, id)
  }
  return state
}

describe('game reducer', () => {
  it('opens the story intro, then accepts a name and starts Day 57', () => {
    const intro = gameReducer(initialGameState, { type: 'BEGIN' })
    expect(intro.screen).toBe('intro')

    const named = gameReducer(intro, { type: 'FINISH_INTRO' })
    expect(named.screen).toBe('name')

    const started = gameReducer(named, { type: 'SET_NAME', name: '  Nova  ' })
    expect(started.screen).toBe('day-brief')
    expect(started.day).toBe(57)
    expect(started.playerName).toBe('Nova')
  })

  it('rejects callsigns shorter than two characters', () => {
    const state = gameReducer(initialGameState, { type: 'SET_NAME', name: 'x' })
    expect(state.screen).toBe('landing')
    expect(state.playerName).toBe('')
  })

  it('moves Day 57 straight into Day 58 after mission 4', () => {
    const day57 = gameReducer(initialGameState, { type: 'SET_NAME', name: 'Nova' })
    const result = complete(day57, 4)
    expect(result.screen).toBe('result')

    const next = gameReducer(result, { type: 'CONTINUE_FROM_RESULT' })
    expect(next.screen).toBe('day-brief')
    expect(next.day).toBe(58)
    expect(next.currentMission).toBeNull()
  })

  it('chains mission briefs in order and ends after mission 8', () => {
    const result = complete(
      { ...initialGameState, screen: 'mission', currentMission: 7 },
      7,
    )
    const next = gameReducer(result, { type: 'CONTINUE_FROM_RESULT' })
    expect(next.screen).toBe('mission-brief')
    expect(next.currentMission).toBe(8)

    const ended = complete(
      { ...next, screen: 'mission', currentMission: 8 },
      8,
    )
    const ending = gameReducer(ended, { type: 'CONTINUE_FROM_RESULT' })
    expect(ending.screen).toBe('ending')
  })

  it('records the best time only for successful missions', () => {
    let state = complete(
      { ...initialGameState, screen: 'mission' },
      1,
      'passed',
      {},
      44_000,
    )
    expect(state.bestTimes[1]).toBe(44_000)

    state = {
      ...state,
      screen: 'mission',
      currentMission: 1,
      lastMission: null,
    }
    const slower = complete(state, 1, 'passed', {}, 58_000)
    expect(slower.bestTimes[1]).toBe(44_000)

    const failed = complete(
      { ...state, screen: 'mission', currentMission: 1 },
      1,
      'failed',
      {},
      10_000,
    )
    expect(failed.bestTimes[1]).toBe(44_000)
  })
})

describe('mission consequences', () => {
  it('mission 1 restores full power on success and leaves it capped on failure', () => {
    const pass = complete({ ...initialGameState, screen: 'mission' }, 1)
    expect(pass.resources.power).toBe(100)

    const fail = complete(
      { ...initialGameState, screen: 'mission' },
      1,
      'failed',
    )
    expect(fail.resources.power).toBe(52)
  })

  it('mission 2 converts waste into water and shield tiles', () => {
    const pass = complete(
      { ...initialGameState, screen: 'mission' },
      2,
      'passed',
      { shieldTiles: 6, waterRecovered: 15 },
    )
    expect(pass.flags.shieldTiles).toBe(6)
    expect(pass.resources.waterFood).toBe(100)

    const fail = complete(
      { ...initialGameState, screen: 'mission' },
      2,
      'failed',
    )
    expect(fail.flags.shieldTiles).toBe(0)
    expect(fail.resources.waterFood).toBe(80)
  })

  it('mission 3 failure starts an oxygen leak and costs oxygen', () => {
    const fail = complete(
      { ...initialGameState, screen: 'mission' },
      3,
      'failed',
    )
    expect(fail.flags.oxygenLeak).toBe(true)
    expect(fail.resources.oxygen).toBe(92)
  })

  it('mission 3 success clears the leak', () => {
    const withLeak: GameState = {
      ...initialGameState,
      screen: 'mission',
      flags: { ...initialGameState.flags, oxygenLeak: true },
    }
    const pass = complete(withLeak, 3)
    expect(pass.flags.oxygenLeak).toBe(false)
  })

  it('mission 4 failure drains crew health, power, and causes a brownout', () => {
    const fail = complete(
      { ...initialGameState, screen: 'mission' },
      4,
      'failed',
      { shelterCoverage: 40 },
    )
    expect(fail.flags.brownout).toBe(true)
    expect(fail.resources.crewHealth).toBe(80)
    expect(fail.resources.power).toBe(37)
  })

  it('mission 5 failure cuts the clock for missions 6–8 by 25%', () => {
    const fail = complete(
      { ...initialGameState, screen: 'mission' },
      5,
      'failed',
    )
    expect(fail.flags.co2Penalty).toBe(true)
    expect(missionLimitFor(fail, 6)).toBe(Math.round(MISSIONS[6].limitMs * 0.75))
    expect(missionLimitFor(fail, 5)).toBe(MISSIONS[5].limitMs)
  })

  it('mission 7 refills oxygen on success', () => {
    const before: GameState = {
      ...initialGameState,
      screen: 'mission',
      resources: { ...initialGameState.resources, oxygen: 40 },
    }
    const pass = complete(before, 7)
    expect(pass.resources.oxygen).toBe(70)
  })

  it('mission 8 failure triggers the abort ending', () => {
    const fail = complete(
      { ...initialGameState, screen: 'mission' },
      8,
      'failed',
    )
    expect(fail.flags.abort).toBe(true)
    expect(getEndingId(fail)).toBe('abandoned')
  })

  it('applies the airlock leak drain across missions 4 through 7', () => {
    const state: GameState = {
      ...initialGameState,
      screen: 'mission',
      resources: { ...initialGameState.resources, oxygen: 92 },
      flags: { ...initialGameState.flags, oxygenLeak: true },
    }
    const result = complete(state, 4)
    expect(result.resources.oxygen).toBe(89)
  })
})

describe('endings and shelter rules', () => {
  it('counts passed missions', () => {
    expect(passedCount(passedThrough(3))).toBe(3)
  })

  it('detects a zeroed resource', () => {
    expect(
      hasZeroResource({
        ...initialGameState,
        resources: { ...initialGameState.resources, oxygen: 0 },
      }),
    ).toBe(true)
  })

  it('certifies the outpost at six or more passed missions', () => {
    const state = passedThrough(7)
    expect(getEndingId(state)).toBe('sustained')
  })

  it('falls back to a lockdown between four and five passes', () => {
    const state = passedThrough(5)
    expect(getEndingId(state)).toBe('lockdown')
  })

  it('abandons the outpost below four passes', () => {
    const state = passedThrough(3)
    expect(getEndingId(state)).toBe('abandoned')
  })

  it('requires more shelter coverage when tile shielding is available', () => {
    expect(requiredShelterCoverage(initialGameState)).toBe(80)
    expect(
      requiredShelterCoverage({
        ...initialGameState,
        flags: { ...initialGameState.flags, shieldTiles: 6 },
      }),
    ).toBe(93)
  })
})
