import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Intro } from './Intro'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('cinematic intro', () => {
  it('renders the scroll stage, scenes, and skip control', () => {
    const { container } = render(
      <Intro
        onComplete={() => undefined}
        onToggleSound={() => undefined}
        soundEnabled={false}
      />,
    )
    expect(screen.getByText('Skip intro')).toBeInTheDocument()
    expect(container.querySelector('.intro__scene--storm')).toBeInTheDocument()
    expect(container.querySelector('.intro__effects')).toBeInTheDocument()
    expect(container.querySelector('.intro__title h1')?.textContent).toBe('LUNA')
  })
})
