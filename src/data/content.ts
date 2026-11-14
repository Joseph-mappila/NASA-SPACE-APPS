export const prologueBeats = [
  {
    id: 'lightning',
    label: 'Before we understood the sky',
    title: 'We feared the flash.',
    text: 'Lightning was once a source of great fear. People could not understand the flash across the sky or the bang that followed.',
  },
  {
    id: 'fire',
    label: 'Then lightning struck a tree',
    title: 'Curiosity pulled us closer.',
    text: 'Fire was frightening and fascinating. Eventually, people learned to use it and keep it alive.',
  },
  {
    id: 'forge',
    label: 'The rocks were not all the same',
    title: 'Fire helped shape metal.',
    text: 'Some rocks were brittle. Others were shiny and sonorous. With fire, metal could be moulded into stronger tools and structures.',
  },
  {
    id: 'cart',
    label: 'The wheel changed distance',
    title: 'We began to move.',
    text: 'Simple wheel-driven carts carried people and ideas farther than before.',
  },
  {
    id: 'car',
    label: 'Engines joined the wheel',
    title: 'Roads connected us.',
    text: 'Cars turned the wheel faster and carried us across the land.',
  },
  {
    id: 'ship',
    label: 'Across the water',
    title: 'Ships crossed horizons.',
    text: 'Curiosity moved from roads to oceans.',
  },
  {
    id: 'plane',
    label: 'Into the air',
    title: 'Planes lifted us.',
    text: 'The sky became another path forward.',
  },
  {
    id: 'rocket',
    label: 'Beyond our world',
    title: 'Rockets carried us away.',
    text: 'We finally managed to leave the little speck of dust we were confined to in this galaxy.',
  },
] as const

export const briefingStatus = [
  { key: 'oxygen', label: 'Oxygen', detail: 'Normal · PIO₂ 150 mmHg' },
  { key: 'water', label: 'Water', detail: 'Normal' },
  { key: 'power', label: 'Power', detail: 'Moderate · 52%' },
  { key: 'food', label: 'Food', detail: 'Normal' },
] as const

export const missionSources = {
  eds: {
    label: 'NASA · Electrodynamic Dust Shield',
    href: 'https://www.nasa.gov/centers-and-facilities/kennedy/nasa-technology-helps-guard-against-lunar-dust/',
  },
  tcps: {
    label: 'NASA · Trash Compaction Processing System',
    href: 'https://www.nasa.gov/ames/space-biosciences/bioengineering-branch/the-trash-compaction-processing-system/',
  },
} as const
