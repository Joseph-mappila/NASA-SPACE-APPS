import type { GameState, MissionMetrics } from '../game/types'

export type MissionComponentProps = {
  state: GameState
  onSolve: (metrics: MissionMetrics) => void
  onFail: (reason: string) => void
}
