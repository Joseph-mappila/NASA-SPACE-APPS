import { initialGameState } from './state'
import type { GameState, Screen } from './types'

const SAVE_KEY = 'luna.outpost57.save.v1'

const SCREENS: Screen[] = [
  'landing',
  'intro',
  'name',
  'day-brief',
  'mission-brief',
  'mission',
  'result',
  'ending',
]

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be disabled or full. The run still works without a save.
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // Ignore unavailable storage.
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const saved = parsed as Partial<GameState>
    if (saved.version !== 1) return null
    if (!saved.screen || !SCREENS.includes(saved.screen)) return null
    if (typeof saved.playerName !== 'string') return null

    let screen = saved.screen
    if (screen === 'mission') screen = 'mission-brief'
    if (screen !== 'landing' && screen !== 'intro' && saved.playerName.length < 2) {
      screen = 'landing'
    }

    return {
      ...initialGameState,
      ...saved,
      screen,
      version: 1,
      resources: { ...initialGameState.resources, ...saved.resources },
      flags: { ...initialGameState.flags, ...saved.flags },
      outcomes: { ...saved.outcomes },
      bestTimes: { ...saved.bestTimes },
    }
  } catch {
    return null
  }
}
