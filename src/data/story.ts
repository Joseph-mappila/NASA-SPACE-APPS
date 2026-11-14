export type Scene = {
  eyebrow: string
  title: string
  text: string
  tone: 'arrival' | 'quiet' | 'warning' | 'decision' | 'shelter' | 'result'
}

export const scenes: Scene[] = [
  {
    eyebrow: 'Aster Outpost · Sol 143',
    title: 'A quiet morning on Mars',
    text: 'Commander Imani is three sols from rescue. Until then, every watt and every drop must be chosen with care.',
    tone: 'arrival',
  },
  {
    eyebrow: 'Chapter 2 · Shelter Mode',
    title: 'The Sun sends a warning',
    text: 'Mission Control receives an archived space-weather alert. The outpost shelter is strong, but its air, radio, and monitors still need power.',
    tone: 'quiet',
  },
  {
    eyebrow: 'NASA DONKI · Archived event',
    title: 'Energetic particles detected',
    text: 'A real event recorded on May 10, 2024 becomes today’s training scenario. It is a warning to prepare—not a direct forecast for Mars.',
    tone: 'warning',
  },
  {
    eyebrow: 'Mission decision',
    title: 'Four watts are missing',
    text: 'The shelter needs more battery power. Choose one outpost system to pause. The astronaut can stay safe, but something else must wait.',
    tone: 'decision',
  },
  {
    eyebrow: 'Emergency procedure',
    title: 'Route power to the shelter',
    text: 'Connect each circuit. Ventilation, monitoring, and emergency communications all matter while Commander Imani waits inside.',
    tone: 'shelter',
  },
  {
    eyebrow: 'After the storm',
    title: 'Every safe mission has a cost',
    text: 'The shelter remained stable. Mission Control records what was protected, what was sacrificed, and why the decision worked.',
    tone: 'result',
  },
]

