import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { initialGameState } from '../game/state'
import type { GameState } from '../game/types'
import { Mission01 } from './Mission01'
import { Mission02 } from './Mission02'
import { Mission03 } from './Mission03'
import { Mission04 } from './Mission04'
import { Mission05 } from './Mission05'
import { Mission06 } from './Mission06'
import { Mission07 } from './Mission07'
import { Mission08 } from './Mission08'

const state: GameState = {
  ...initialGameState,
  screen: 'mission',
  playerName: 'Nova',
  flags: { ...initialGameState.flags, shieldTiles: 6 },
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('mission components', () => {
  const onSolve = () => undefined
  const onFail = () => undefined

  it('renders mission 1', () => {
    const { container } = render(
      <Mission01 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    expect(container.querySelector('.solar-panel')).toBeInTheDocument()
  })

  it('renders mission 2 with a waste bag inspection', () => {
    const { container } = render(
      <Mission02 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    expect(container.querySelectorAll('.waste-card')).toHaveLength(6)
  })

  it('reorders the waste bag between runs', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const first = render(
      <Mission02 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    const firstLabel = first.container.querySelector('.waste-card strong')?.textContent
    first.unmount()

    random.mockReturnValue(0.9999)
    const second = render(
      <Mission02 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    const secondLabel = second.container.querySelector('.waste-card strong')?.textContent

    expect(firstLabel).not.toBe(secondLabel)
  })

  it('renders mission 3', () => {
    const { container } = render(
      <Mission03 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    expect(container.querySelectorAll('.hatch')).toHaveLength(2)
  })

  it('renders mission 4 with five shelter zones', () => {
    const { container } = render(
      <Mission04 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    expect(container.querySelectorAll('.shelter-zone')).toHaveLength(5)
  })

  it('renders mission 5 with three scrubber beds', () => {
    const { container } = render(
      <Mission05 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    expect(container.querySelectorAll('.scrubber-bed')).toHaveLength(3)
  })

  it('renders mission 6 with three chamber sliders', () => {
    const { container } = render(
      <Mission06 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    expect(container.querySelectorAll('.slider')).toHaveLength(3)
  })

  it('renders mission 7 with the reactor core', () => {
    const { container } = render(
      <Mission07 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    expect(container.querySelector('.reactor-core')).toBeInTheDocument()
    expect(container.querySelectorAll('.hopper__clump')).toHaveLength(7)
  })

  it('renders mission 8 with four DTN packets', () => {
    const { container } = render(
      <Mission08 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    expect(container.querySelectorAll('.packet')).toHaveLength(4)
    expect(container.querySelector('.sky-plot')).toBeInTheDocument()
    expect(container.querySelectorAll('.slider')).toHaveLength(2)
  })

  it('places the mission 8 satellite in a fresh part of the sky', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const first = render(
      <Mission08 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    const firstTarget = first.container.querySelector<HTMLElement>('.sky-plot__target')
    const firstLeft = firstTarget?.style.left
    first.unmount()

    random.mockReturnValue(0.9999)
    const second = render(
      <Mission08 onFail={onFail} onSolve={onSolve} state={state} />,
    )
    const secondTarget = second.container.querySelector<HTMLElement>('.sky-plot__target')
    const secondLeft = secondTarget?.style.left ?? ''

    expect(firstLeft).toBe('50%')
    expect(Number.parseFloat(secondLeft)).toBeGreaterThan(80)
    expect(secondLeft).not.toBe(firstLeft)
  })
})
