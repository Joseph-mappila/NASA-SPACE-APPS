import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NameEntry } from '../screens/NameEntry'
import { EVARepair } from './EVARepair'
import { MinigameScreen } from './MinigameScreen'
import { OxygenGarden } from './OxygenGarden'
import { SolarPanel } from './SolarPanel'

afterEach(() => {
  cleanup()
})

describe('completed-run minigame launcher', () => {
  it('stays hidden until the story has been completed once', () => {
    const { rerender } = render(
      <NameEntry
        completedOnce={false}
        onPlayMinigame={() => undefined}
        onSubmit={() => undefined}
      />,
    )

    expect(screen.queryByText(/Or you can also play these minigames/i)).toBeNull()

    rerender(
      <NameEntry
        completedOnce
        onPlayMinigame={() => undefined}
        onSubmit={() => undefined}
      />,
    )

    expect(
      screen.getByText(/Or you can also play these minigames/i),
    ).toBeTruthy()
  })

  it('opens the selected training game', () => {
    const onPlayMinigame = vi.fn()
    render(
      <NameEntry
        completedOnce
        onPlayMinigame={onPlayMinigame}
        onSubmit={() => undefined}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Solar Panel Alignment/i }))
    expect(onPlayMinigame).toHaveBeenCalledWith('solarPanel')
  })

  it('returns to the callsign screen from a minigame', () => {
    const onExit = vi.fn()
    render(<MinigameScreen id="evaRepair" onExit={onExit} />)

    fireEvent.click(
      screen.getByRole('button', { name: /Back to the callsign/i }),
    )
    expect(onExit).toHaveBeenCalledOnce()
  })
})

describe('ported minigames', () => {
  it('solves the EVA suit repair by matching every wire to the same port', () => {
    render(<EVARepair />)

    for (const letter of ['A', 'B', 'C', 'D']) {
      fireEvent.click(screen.getByRole('button', { name: `Wire ${letter}` }))
      fireEvent.click(screen.getByRole('button', { name: `Port ${letter}` }))
    }

    expect(screen.getByText('Simulation passed')).toBeTruthy()
  })

  it('solves the oxygen garden by feeding each crop its required nutrients', () => {
    render(<OxygenGarden />)

    const nutrient = (name: string) =>
      screen.getByRole('button', { name: new RegExp(name) })
    const plant = (name: string) =>
      screen.getByRole('button', { name: new RegExp(name) })

    fireEvent.click(nutrient('Nitrogen'))
    fireEvent.click(plant('Wheat seedling'))
    fireEvent.click(plant('Lettuce'))
    fireEvent.click(plant('Tomato plant'))

    fireEvent.click(nutrient('Phosphorus'))
    fireEvent.click(plant('Wheat seedling'))
    fireEvent.click(plant('Algae panel'))
    fireEvent.click(plant('Tomato plant'))

    fireEvent.click(nutrient('Potassium'))
    fireEvent.click(plant('Lettuce'))
    fireEvent.click(plant('Algae panel'))
    fireEvent.click(plant('Tomato plant'))

    expect(screen.getByText('Simulation passed')).toBeTruthy()
  })

  it('solves the solar panel alignment with the coarse and fine controls', () => {
    render(<SolarPanel />)

    const turn = (wing: string, degrees: number, direction: string) =>
      fireEvent.click(
        screen.getByRole('button', {
          name: `Rotate ${wing} ${degrees} degrees ${direction}`,
        }),
      )

    turn('ALPHA', 30, 'clockwise')
    turn('ALPHA', 30, 'clockwise')

    turn('BETA', 30, 'clockwise')
    turn('BETA', 30, 'clockwise')
    turn('BETA', 30, 'clockwise')

    turn('GAMMA', 30, 'clockwise')
    turn('GAMMA', 30, 'clockwise')
    turn('GAMMA', 30, 'clockwise')
    turn('GAMMA', 5, 'clockwise')
    turn('GAMMA', 5, 'clockwise')

    expect(screen.getByText('Simulation passed')).toBeTruthy()
  })
})
