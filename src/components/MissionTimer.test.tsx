// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MissionTimer } from './MissionTimer'

describe('MissionTimer', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('expires exactly once when the mission clock reaches zero', () => {
    vi.useFakeTimers()
    const onExpire = vi.fn()

    render(<MissionTimer seconds={3} stopped={false} onExpire={onExpire} />)
    act(() => vi.advanceTimersByTime(3500))

    expect(screen.getByText('0:00')).toBeInTheDocument()
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('does not count down after mission completion', () => {
    vi.useFakeTimers()
    const onExpire = vi.fn()

    render(<MissionTimer seconds={3} stopped onExpire={onExpire} />)
    act(() => vi.advanceTimersByTime(5000))

    expect(screen.getByText('0:03')).toBeInTheDocument()
    expect(onExpire).not.toHaveBeenCalled()
  })
})
