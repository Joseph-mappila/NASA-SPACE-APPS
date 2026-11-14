export const MINIGAME_CATALOG = [
  {
    id: 'evaRepair',
    icon: '⚡',
    title: 'EVA Suit Repair',
    blurb: 'Match the four wire pairs before the suit oxygen reserve runs out.',
    duration: '60 seconds',
    skill: 'Circuits and colour matching',
  },
  {
    id: 'oxygenGarden',
    icon: '🌱',
    title: 'Oxygen Garden',
    blurb: 'Feed each crop the nutrients it needs to bring the CO₂ scrubber back online.',
    duration: '45 seconds',
    skill: 'Plant nutrients and life support',
  },
  {
    id: 'solarPanel',
    icon: '☀️',
    title: 'Solar Panel Alignment',
    blurb: 'Rotate three solar wings onto the Sun vector and restore full power.',
    duration: '45 seconds',
    skill: 'Angles, degrees, and solar power',
  },
] as const

export type MinigameId = (typeof MINIGAME_CATALOG)[number]['id']

export type MinigameResult = 'success' | 'fail'

export function getMinigame(id: MinigameId) {
  const minigame = MINIGAME_CATALOG.find((entry) => entry.id === id)
  if (!minigame) throw new Error(`Unknown minigame: ${id}`)
  return minigame
}
