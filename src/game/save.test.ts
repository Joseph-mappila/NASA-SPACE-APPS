import { beforeEach, describe, expect, it } from 'vitest'
import { clearSave, loadGame, saveGame } from './save'
import { initialGameState } from './state'
import type { GameState } from './types'

const KEY = 'luna.outpost57.save.v1'

function sample(): GameState {
  return {
    ...initialGameState,
    screen: 'day-brief',
    playerName: 'Nova',
    day: 58,
    resources: { power: 88, oxygen: 64, waterFood: 73, crewHealth: 95 },
    flags: {
      ...initialGameState.flags,
      oxygenLeak: true,
      shieldTiles: 6,
    },
  }
}

describe('save system', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips a game state through localStorage', () => {
    const state = sample()
    saveGame(state)
    const loaded = loadGame()
    expect(loaded).not.toBeNull()
    expect(loaded?.playerName).toBe('Nova')
    expect(loaded?.day).toBe(58)
    expect(loaded?.resources.oxygen).toBe(64)
    expect(loaded?.flags.oxygenLeak).toBe(true)
  })

  it('round-trips the completed-once marker used by the minigame launcher', () => {
    saveGame({ ...sample(), completedOnce: true })
    expect(loadGame()?.completedOnce).toBe(true)
  })

  it('treats an old save on the ending screen as completed', () => {
    const legacy = { ...sample(), screen: 'ending' as const }
    delete (legacy as Partial<GameState>).completedOnce
    saveGame(legacy)
    expect(loadGame()?.completedOnce).toBe(true)
  })

  it('does not resume a mission that was mid-timer', () => {
    saveGame({ ...sample(), screen: 'mission', currentMission: 3 })
    const loaded = loadGame()
    expect(loaded?.screen).toBe('mission-brief')
    expect(loaded?.currentMission).toBe(3)
  })

  it('returns null when nothing is stored', () => {
    expect(loadGame()).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    localStorage.setItem(KEY, '{not-json')
    expect(loadGame()).toBeNull()
  })

  it('returns null for an unknown save version', () => {
    saveGame({ ...sample(), version: 1 })
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}')
    localStorage.setItem(KEY, JSON.stringify({ ...raw, version: 2 }))
    expect(loadGame()).toBeNull()
  })

  it('sends a save without a valid callsign back to the landing screen', () => {
    saveGame({ ...sample(), screen: 'day-brief', playerName: '' })
    const loaded = loadGame()
    expect(loaded?.screen).toBe('landing')
  })

  it('clears a save on request', () => {
    saveGame(sample())
    clearSave()
    expect(loadGame()).toBeNull()
  })
})
