import { MISSIONS } from './content'
import type {
  GameAction,
  GameState,
  MissionId,
  MissionOutcome,
  Resources,
} from './types'

export const initialGameState: GameState = {
  version: 1,
  screen: 'landing',
  day: 57,
  playerName: '',
  soundEnabled: true,
  currentMission: null,
  lastMission: null,
  resources: { power: 52, oxygen: 100, waterFood: 85, crewHealth: 100 },
  flags: {
    oxygenLeak: false,
    co2Penalty: false,
    brownout: false,
    shieldTiles: 0,
    waterRecovered: 0,
    shelterCoverage: 0,
    lunanetLocked: false,
    abort: false,
  },
  outcomes: {},
  bestTimes: {},
}

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Math.round(value)))

function withResources(
  resources: Resources,
  change: Partial<Resources>,
): Resources {
  return {
    power: clamp(resources.power + (change.power ?? 0)),
    oxygen: clamp(resources.oxygen + (change.oxygen ?? 0)),
    waterFood: clamp(resources.waterFood + (change.waterFood ?? 0)),
    crewHealth: clamp(resources.crewHealth + (change.crewHealth ?? 0)),
  }
}

export function missionLimitFor(state: GameState, mission: MissionId): number {
  let limit = MISSIONS[mission].limitMs
  if (state.flags.co2Penalty && mission >= 6) limit = Math.round(limit * 0.75)
  if (state.flags.brownout && mission === 5) limit = Math.round(limit * 0.9)
  return limit
}

export function requiredShelterCoverage(state: GameState): number {
  return state.flags.shieldTiles >= 6 ? 93 : 80
}

function applyMissionOutcome(
  state: GameState,
  outcome: MissionOutcome,
): GameState {
  const id = outcome.mission
  const passed = outcome.status === 'passed'
  const outcomes = { ...state.outcomes, [id]: outcome }
  const bestTimes = { ...state.bestTimes }
  const flags = { ...state.flags }
  let resources = { ...state.resources }

  if (passed) {
    const previous = bestTimes[id]
    bestTimes[id] = previous === undefined
      ? outcome.timeUsedMs
      : Math.min(previous, outcome.timeUsedMs)
  }

  switch (id) {
    case 1:
      resources.power = passed ? 100 : 52
      break
    case 2:
      if (passed) {
        resources = withResources(resources, { waterFood: 15 })
        flags.shieldTiles = outcome.metrics.shieldTiles ?? 6
        flags.waterRecovered = outcome.metrics.waterRecovered ?? 15
      } else {
        resources = withResources(resources, { waterFood: -5 })
        flags.shieldTiles = 0
        flags.waterRecovered = 0
      }
      break
    case 3:
      if (passed) {
        flags.oxygenLeak = false
      } else {
        flags.oxygenLeak = true
        resources = withResources(resources, { oxygen: -8 })
      }
      break
    case 4:
      flags.shelterCoverage = outcome.metrics.shelterCoverage ?? 0
      flags.brownout = outcomes[1]?.status === 'failed' || !passed
      if (!passed) {
        resources = withResources(resources, { crewHealth: -20, power: -15 })
      }
      break
    case 5:
      if (passed) {
        resources = withResources(resources, { oxygen: 5 })
      } else {
        flags.co2Penalty = true
        resources = withResources(resources, { crewHealth: -5 })
      }
      break
    case 6:
      if (passed) {
        resources = withResources(resources, { oxygen: 8, waterFood: 5 })
      } else {
        resources = withResources(resources, { oxygen: -12, waterFood: -10 })
      }
      break
    case 7:
      if (passed) {
        resources = withResources(resources, { oxygen: 30 })
      } else {
        resources = withResources(resources, { oxygen: -15 })
        if (flags.oxygenLeak) resources.oxygen = 0
      }
      break
    case 8:
      if (passed) {
        flags.lunanetLocked = true
      } else {
        flags.abort = true
        resources = withResources(resources, { crewHealth: -10 })
      }
      break
  }

  if (flags.oxygenLeak && id >= 4 && id <= 7) {
    resources = withResources(resources, { oxygen: -3 })
  }

  return {
    ...state,
    screen: 'result',
    lastMission: id,
    resources,
    flags,
    outcomes,
    bestTimes,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'BEGIN':
      return { ...state, screen: 'intro' }
    case 'FINISH_INTRO':
      return { ...state, screen: 'name' }
    case 'SET_NAME': {
      const name = action.name.trim().slice(0, 24)
      if (name.length < 2) return state
      return { ...state, playerName: name, screen: 'day-brief', day: 57 }
    }
    case 'OPEN_DAY':
      return {
        ...state,
        screen: 'day-brief',
        day: action.day,
        currentMission: null,
      }
    case 'OPEN_BRIEF':
      return {
        ...state,
        screen: 'mission-brief',
        currentMission: action.mission,
      }
    case 'START_MISSION':
      return state.currentMission === null
        ? state
        : { ...state, screen: 'mission' }
    case 'COMPLETE_MISSION':
      return applyMissionOutcome(state, action.outcome)
    case 'CONTINUE_FROM_RESULT': {
      const last = state.lastMission
      if (last === null) return state
      if (last === 4) {
        return {
          ...state,
          screen: 'day-brief',
          day: 58,
          currentMission: null,
          resources: withResources(state.resources, { oxygen: -3 }),
        }
      }
      if (last === 8) return { ...state, screen: 'ending' }
      return {
        ...state,
        screen: 'mission-brief',
        currentMission: (last + 1) as MissionId,
      }
    }
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled }
    case 'RESTART':
      return { ...initialGameState, soundEnabled: state.soundEnabled }
    default:
      return state
  }
}

export function passedCount(state: GameState): number {
  return Object.values(state.outcomes).filter(
    (outcome) => outcome?.status === 'passed',
  ).length
}

export function hasZeroResource(state: GameState): boolean {
  return Object.values(state.resources).some((value) => value <= 0)
}

export function getEndingId(
  state: GameState,
): 'sustained' | 'lockdown' | 'abandoned' {
  const passed = passedCount(state)
  const healthyResources = Object.values(state.resources).every(
    (value) => value > 50,
  )
  if (state.flags.abort || hasZeroResource(state) || passed < 4) {
    return 'abandoned'
  }
  if (passed >= 6 && healthyResources) return 'sustained'
  return 'lockdown'
}

export function nextMissionAtDayStart(state: GameState): MissionId {
  return state.day === 57 ? 1 : 5
}
