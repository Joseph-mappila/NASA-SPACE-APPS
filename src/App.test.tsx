// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NameEntry } from './App'

afterEach(cleanup)

describe('NameEntry', () => {
  it('requires a meaningful name before opening the briefing', () => {
    const onSubmit = vi.fn()
    render(<NameEntry onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Luna link' }))

    expect(screen.getByText(/Enter at least two characters/)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a valid callsign', () => {
    const onSubmit = vi.fn()
    render(<NameEntry onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Your first name or callsign'), { target: { value: 'Nova' } })
    fireEvent.click(screen.getByRole('button', { name: 'Open Luna link' }))

    expect(onSubmit).toHaveBeenCalledWith('Nova')
  })
})
