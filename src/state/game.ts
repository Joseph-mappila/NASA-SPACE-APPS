export type Phase =
  | 'gate'
  | 'prologue'
  | 'name'
  | 'briefing'
  | 'mission-one-brief'
  | 'mission-one'
  | 'mission-one-result'
  | 'mission-two-brief'
  | 'mission-two'
  | 'mission-two-result'
  | 'continuation'

export type MissionResult = 'pending' | 'success' | 'failed'

export type GameState = {
  phase: Phase
  playerName: string
  soundEnabled: boolean
  power: number
  oxygen: number
  waterFood: number
  crewHealth: number
  missionOne: MissionResult
  missionTwo: MissionResult
  shieldTiles: number
  reclaimedWater: number
}

export type GameAction =
  | { type: 'BEGIN'; soundEnabled: boolean }
  | { type: 'FINISH_PROLOGUE' }
  | { type: 'SET_NAME'; name: string }
  | { type: 'ADVANCE'; phase: Phase }
  | { type: 'FINISH_MISSION_ONE'; success: boolean }
  | { type: 'FINISH_MISSION_TWO'; success: boolean }
  | { type: 'RESTART' }
  | { type: 'TOGGLE_SOUND' }

export const initialGameState: GameState = {
  phase: 'gate',
  playerName: '',
  soundEnabled: true,
  power: 52,
  oxygen: 100,
  waterFood: 85,
  crewHealth: 100,
  missionOne: 'pending',
  missionTwo: 'pending',
  shieldTiles: 0,
  reclaimedWater: 0,
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'BEGIN':
      return { ...state, phase: 'prologue', soundEnabled: action.soundEnabled }
    case 'FINISH_PROLOGUE':
      return { ...state, phase: 'name' }
    case 'SET_NAME':
      return { ...state, playerName: action.name.trim(), phase: 'briefing' }
    case 'ADVANCE':
      return { ...state, phase: action.phase }
    case 'FINISH_MISSION_ONE':
      return {
        ...state,
        missionOne: action.success ? 'success' : 'failed',
        power: action.success ? 100 : 52,
        phase: 'mission-one-result',
      }
    case 'FINISH_MISSION_TWO':
      return {
        ...state,
        missionTwo: action.success ? 'success' : 'failed',
        waterFood: action.success ? 100 : state.waterFood,
        reclaimedWater: action.success ? 15 : 0,
        shieldTiles: action.success ? 6 : 0,
        phase: 'mission-two-result',
      }
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled }
    case 'RESTART':
      return initialGameState
  }
}
