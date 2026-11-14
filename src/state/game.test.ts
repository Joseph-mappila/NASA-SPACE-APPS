import { describe, expect, it } from 'vitest'
import { gameReducer, initialGameState } from './game'

describe('gameReducer', () => {
  it('stores a trimmed player name and opens the briefing', () => {
    const state = gameReducer(initialGameState, { type: 'SET_NAME', name: '  Nova  ' })

    expect(state.playerName).toBe('Nova')
    expect(state.phase).toBe('briefing')
  })

  it('carries Mission 1 success into the power resource', () => {
    const state = gameReducer(initialGameState, { type: 'FINISH_MISSION_ONE', success: true })

    expect(state.missionOne).toBe('success')
    expect(state.power).toBe(100)
    expect(state.phase).toBe('mission-one-result')
  })

  it('keeps power capped when Mission 1 fails', () => {
    const state = gameReducer(initialGameState, { type: 'FINISH_MISSION_ONE', success: false })

    expect(state.missionOne).toBe('failed')
    expect(state.power).toBe(52)
  })

  it('adds only the documented Mission 2 resources on success', () => {
    const state = gameReducer(initialGameState, { type: 'FINISH_MISSION_TWO', success: true })

    expect(state.missionTwo).toBe('success')
    expect(state.waterFood).toBe(100)
    expect(state.reclaimedWater).toBe(15)
    expect(state.shieldTiles).toBe(6)
  })

  it('adds no Mission 2 resources after failure', () => {
    const state = gameReducer(initialGameState, { type: 'FINISH_MISSION_TWO', success: false })

    expect(state.missionTwo).toBe('failed')
    expect(state.waterFood).toBe(85)
    expect(state.reclaimedWater).toBe(0)
    expect(state.shieldTiles).toBe(0)
  })
})
