import type { MinigameResult } from './catalog'

type MinigameOutcomeProps = {
  result: MinigameResult
  successText: string
  failText: string
  onRestart: () => void
}

export function MinigameOutcome({
  result,
  successText,
  failText,
  onRestart,
}: MinigameOutcomeProps) {
  const passed = result === 'success'

  return (
    <div
      className={`minigame-outcome ${passed ? 'is-pass' : 'is-fail'}`}
      role="status"
    >
      <span aria-hidden="true" className="minigame-outcome__mark">
        {passed ? '✓' : '!'}
      </span>
      <div>
        <strong>{passed ? 'Simulation passed' : 'Simulation failed'}</strong>
        <p>{passed ? successText : failText}</p>
      </div>
      <button className="btn btn--small" onClick={onRestart} type="button">
        Run again
      </button>
    </div>
  )
}
