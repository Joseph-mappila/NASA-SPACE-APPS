import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { NasaArchiveDialog } from './NasaArchiveDialog'
import { NasaDebrief } from './NasaDebrief'
import { missionArchive } from '../data/nasa/archive'
import { MISSIONS } from '../game/content'

// jsdom does not implement the dialog modality methods; the component already
// falls back to the `open` attribute, but stubbing them exercises the same path
// a real browser takes.
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.setAttribute('open', '')
    }
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute('open')
    }
  }
})

afterAll(() => {
  delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal
  delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close
})

afterEach(() => {
  cleanup()
})

describe('NASA archive dialog', () => {
  it('renders a header button instead of inline content', () => {
    const { container } = render(<NasaArchiveDialog mission={MISSIONS[1]} />)
    expect(screen.getByRole('button', { name: /NASA archive/i })).toBeInTheDocument()
    expect(container.querySelector('dialog')).not.toHaveAttribute('open')
  })

  it('opens with the real project, photo, and links for mission 1', () => {
    const data = missionArchive(1)
    render(<NasaArchiveDialog mission={MISSIONS[1]} />)

    fireEvent.click(screen.getByRole('button', { name: /NASA archive/i }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('open')
    expect(within(dialog).getByText(data!.project!.title)).toBeInTheDocument()
    expect(within(dialog).getByText('TRL 5')).toBeInTheDocument()
    expect(within(dialog).getByText(data!.image!.title)).toBeInTheDocument()

    const projectLink = within(dialog).getByRole('link', {
      name: /Open in NASA TechPort/i,
    })
    expect(projectLink).toHaveAttribute('href', data!.project!.url)
    expect(projectLink).toHaveAttribute('rel', 'noreferrer')

    const imageLink = within(dialog).getByRole('link', {
      name: /View in the NASA Image Library/i,
    })
    expect(imageLink).toHaveAttribute('href', data!.image!.pageUrl)
  })

  it('adds the mission-specific NASA context', () => {
    render(<NasaArchiveDialog mission={MISSIONS[1]} />)
    fireEvent.click(screen.getByRole('button', { name: /NASA archive/i }))
    expect(screen.getByText(/NASA POWER · real sunlight/i)).toBeInTheDocument()
  })

  it('closes from the close button', () => {
    render(<NasaArchiveDialog mission={MISSIONS[2]} />)
    fireEvent.click(screen.getByRole('button', { name: /NASA archive/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('open')

    fireEvent.click(screen.getByRole('button', { name: /Close NASA archive/i }))
    expect(dialog).not.toHaveAttribute('open')
  })

  it('hides a photo that fails to load and keeps the project', () => {
    render(<NasaArchiveDialog mission={MISSIONS[2]} />)
    fireEvent.click(screen.getByRole('button', { name: /NASA archive/i }))
    const dialog = screen.getByRole('dialog')

    const image = within(dialog).getByRole('img')
    fireEvent.error(image)

    expect(within(dialog).queryByRole('img')).not.toBeInTheDocument()
    expect(
      within(dialog).getByText(missionArchive(2)!.project!.title),
    ).toBeInTheDocument()
  })
})

describe('NASA science debrief', () => {
  it('shows every snapshot section with real values', () => {
    const { container } = render(<NasaDebrief />)

    expect(
      screen.getByRole('heading', { name: /Earth, seen from deep space/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /What passes Earth this week/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Real sunlight, real power budget/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Where Earth really is/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Meanwhile, on Mars/i }),
    ).toBeInTheDocument()

    expect(screen.getByText('182.6°')).toBeInTheDocument()
    expect(screen.getByText('azimuth')).toBeInTheDocument()
    expect(screen.getByText('-62.4°C')).toBeInTheDocument()
    expect(screen.getByText(/fetched/i)).toBeInTheDocument()

    const frames = container.querySelectorAll('.nasa-epic__frame')
    expect(frames.length).toBeGreaterThan(0)
    for (const frame of frames) {
      expect(frame.getAttribute('src')).toContain('/thumbs/')
      expect(frame.getAttribute('src')).toMatch(/^https:\/\//)
    }
  })

  it('renders the close-approach list and the solar chart', () => {
    const { container } = render(<NasaDebrief />)
    expect(container.querySelectorAll('.nasa-sky li').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.nasa-solar__bar').length).toBe(7)
    expect(container.querySelectorAll('.nasa-readouts > div').length).toBe(5)
  })
})
