export type MissionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Grade = 'S' | 'A' | 'B' | 'F'

export type Screen =
  | 'landing'
  | 'intro'
  | 'name'
  | 'day-brief'
  | 'mission-brief'
  | 'mission'
  | 'result'
  | 'ending'

export type Day = 57 | 58

export type Resources = {
  power: number
  oxygen: number
  waterFood: number
  crewHealth: number
}

export type Flags = {
  oxygenLeak: boolean
  co2Penalty: boolean
  brownout: boolean
  shieldTiles: number
  waterRecovered: number
  shelterCoverage: number
  lunanetLocked: boolean
  abort: boolean
}

export type MissionMetrics = {
  accuracy?: number
  waterRecovered?: number
  shieldTiles?: number
  shelterCoverage?: number
  breakerLoad?: number
  signalLocked?: boolean
  packetsPrioritized?: boolean
  notes?: string[]
}

export type MissionOutcome = {
  mission: MissionId
  status: 'passed' | 'failed'
  grade: Grade
  timeUsedMs: number
  timeLimitMs: number
  metrics: MissionMetrics
  reason?: string
}

export type MissionDefinition = {
  id: MissionId
  day: Day
  time: string
  code: string
  title: string
  subtitle: string
  limitMs: number
  brief: string
  science: string
  risk: string
  objective: string
  steps: string[]
  controls: string[]
  glossary: Array<{ term: string; meaning: string }>
}

export type GameState = {
  version: 1
  screen: Screen
  day: Day
  playerName: string
  soundEnabled: boolean
  currentMission: MissionId | null
  lastMission: MissionId | null
  resources: Resources
  flags: Flags
  outcomes: Partial<Record<MissionId, MissionOutcome>>
  bestTimes: Partial<Record<MissionId, number>>
}

export type GameAction =
  | { type: 'BEGIN' }
  | { type: 'FINISH_INTRO' }
  | { type: 'SET_NAME'; name: string }
  | { type: 'OPEN_DAY'; day: Day }
  | { type: 'OPEN_BRIEF'; mission: MissionId }
  | { type: 'START_MISSION' }
  | { type: 'COMPLETE_MISSION'; outcome: MissionOutcome }
  | { type: 'CONTINUE_FROM_RESULT' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'RESTART' }

export const MISSION_IDS: MissionId[] = [1, 2, 3, 4, 5, 6, 7, 8]

export function isMissionId(value: number): value is MissionId {
  return value >= 1 && value <= 8 && Number.isInteger(value)
}
