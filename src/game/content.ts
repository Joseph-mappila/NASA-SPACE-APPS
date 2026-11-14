import type { MissionDefinition, MissionId } from './types'

export const MISSIONS: Record<MissionId, MissionDefinition> = {
  1: {
    id: 1,
    day: 57,
    time: '08:00',
    code: 'EDS-01',
    title: 'Solar Panel Dust Shield',
    subtitle: 'Electrodynamic Dust Shield',
    limitMs: 75_000,
    objective: 'Tune the electric wave and clear the dust from Block A.',
    brief:
      'Lunar dust is sharp, sticky, and charged with electricity. It is blocking sunlight from the solar panels. The dust shield uses a moving electric wave to make the dust hop off without touching the glass.',
    science:
      'NASA tests the Electrodynamic Dust Shield with clear indium tin oxide electrodes. A traveling electric wave pushes charged dust away. Too much voltage can arc across the grid and damage the panel.',
    risk: 'Block A stays at 52% power. The outpost may run low on battery during the solar storm.',
    steps: [
      'Set the wave frequency to 42–58 Hz.',
      'Set the phase voltage to 60–80%.',
      'Press Engage, then sweep the electric wave over every dust clump.',
    ],
    controls: ['Drag the two sliders', 'Sweep across the solar panel'],
    glossary: [
      { term: 'EDS', meaning: 'A no-contact way to move dust with electric fields.' },
      { term: 'Arcing', meaning: 'Electricity jumping where it should not, which can damage the panel.' },
    ],
  },
  2: {
    id: 2,
    day: 57,
    time: '10:30',
    code: 'TCPS-02',
    title: 'Trash to Shield Tiles',
    subtitle: 'Trash Compaction and Processing System',
    limitMs: 95_000,
    objective: 'Turn today’s trash into water and six radiation-shield tiles.',
    brief:
      'We cannot throw trash outside on the Moon. The TCPS heats and squeezes it. That drives out water and presses the dry waste into hard tiles the crew can use for radiation shielding.',
    science:
      'NASA’s TCPS heats and compresses mixed trash. It lowers water activity below 0.5, which stops mold and bacteria from growing. The finished tile is less than one-eighth of the original trash volume.',
    risk: 'No tiles are made for the storm shelter, and the outpost loses water.',
    steps: [
      'Open the bag and remove sharp metal and sealed containers.',
      'Set the heater and chamber pressure into the green bands.',
      'Press the tile and watch water activity drop below 0.5.',
    ],
    controls: ['Click unsafe items to remove them', 'Drag the heat and pressure sliders', 'Hold to press the tile'],
    glossary: [
      { term: 'Water activity', meaning: 'How much water is free for germs to use. Below 0.5 is safe for storage.' },
      { term: 'TCPS', meaning: 'NASA’s Trash Compaction and Processing System.' },
    ],
  },
  3: {
    id: 3,
    day: 57,
    time: '13:30',
    code: 'AIR-03',
    title: 'Airlock Leak Hunt',
    subtitle: 'Pressure-Decay Seal Check',
    limitMs: 80_000,
    objective: 'Find the leaking hatch and hold cabin pressure at 8.2 psia.',
    brief:
      'A tiny grain of Moon dust can get stuck in an airlock seal. Air then leaks out into space. Run a pressure test, find the bad hatch, and fix the rubber O-ring.',
    science:
      'NASA crews watch how fast pressure drops in each hatch. A faster drop means a leak. Then they inspect the rubber O-ring with a borescope and clean the groove before reseating it.',
    risk: 'The leak keeps draining oxygen through Day 58.',
    steps: [
      'Run a pressure-decay test on the inner hatch.',
      'Run the same test on the outer hatch.',
      'Clean the dirty seal, reseat the O-ring, and hold the pump.',
    ],
    controls: ['Click a hatch to test it', 'Drag across the dust spots', 'Hold to repressurize'],
    glossary: [
      { term: 'psia', meaning: 'Pounds per square inch of pressure, measured against space vacuum.' },
      { term: 'O-ring', meaning: 'A rubber ring that seals two metal parts together.' },
    ],
  },
  4: {
    id: 4,
    day: 57,
    time: '16:00',
    code: 'SPE-04',
    title: 'Solar Storm Shelter',
    subtitle: 'Radiation Shielding and Power Load',
    limitMs: 105_000,
    objective: 'Shield the crew below 250 mSv and keep power under 4.5 kW.',
    brief:
      'A solar particle event is hitting the Moon. Fast protons can hurt the crew. Water, food, and waste tiles are full of hydrogen, which slows the protons down.',
    science:
      'NASA uses about 20 g/cm² of shielding around a storm shelter. Water and polyethylene work well because hydrogen stops protons. Computers that are not needed are switched off to prevent radiation errors.',
    risk: 'Crew radiation dose goes above the limit, and the storm may damage the lab sensors.',
    steps: [
      'Place water, food, and tile units on the bunk grid.',
      'Cover at least the required share of bunks with 20 g/cm².',
      'Switch off non-essential breakers to stay under 4.5 kW.',
    ],
    controls: ['Pick a shield unit, then click bunks', 'Click breakers to turn them off'],
    glossary: [
      { term: 'mSv', meaning: 'Millisievert, a unit of radiation dose.' },
      { term: 'g/cm²', meaning: 'How much mass sits over each square centimeter. More mass means more shielding.' },
    ],
  },
  5: {
    id: 5,
    day: 58,
    time: '07:00',
    code: 'ECLSS-05',
    title: 'CO₂ Scrubber Rescue',
    subtitle: 'Rapid Cycling Amine Beds',
    limitMs: 95_000,
    objective: 'Find the wet scrubber bed and bring CO₂ below 3.0 mmHg.',
    brief:
      'The air has too much carbon dioxide. One of the three scrubber beds is full of water and cannot trap CO₂. Open the valves in the right order so cabin air does not escape into space.',
    science:
      'NASA’s amine scrubber beds catch CO₂ and release it to space vacuum. Water blocks the amine. The safe limit is a 1-hour average below 3.0 mmHg.',
    risk: 'CO₂ stays high, the crew thinks more slowly, and later mission clocks are cut by 25%.',
    steps: [
      'Inspect all three beds and find the wet one.',
      'Close the cabin and bed valves before opening vacuum.',
      'Swap the bad bed, close vacuum, then reopen the valves.',
      'Bleed every bubble from the coolant loop.',
    ],
    controls: ['Click each bed to inspect', 'Click valves in order', 'Click bubbles'],
    glossary: [
      { term: 'Amine', meaning: 'A material that grabs CO₂ from the air.' },
      { term: 'ORU', meaning: 'Orbital Replacement Unit, a part that can be swapped out.' },
    ],
  },
  6: {
    id: 6,
    day: 58,
    time: '09:30',
    code: 'BLiSS-06',
    title: 'Greenhouse Rescue',
    subtitle: 'Plant Chamber Balance',
    limitMs: 100_000,
    objective: 'Balance the greenhouse so the plants make oxygen again.',
    brief:
      'The plants are wilting. Their air, food, and pH are out of balance. Fix all three and the greenhouse will help clean the cabin air while the oxygen factory warms up.',
    science:
      'NASA’s Advanced Plant Habitat grows plants in a sealed chamber with red and blue LEDs. Crops need CO₂, nutrients, and a pH near 5.5–6.0. Outside that range, nutrients lock up and photosynthesis stops.',
    risk: 'The plants stop making oxygen, so cabin oxygen keeps falling.',
    steps: [
      'Set chamber CO₂ to 1,000–1,200 ppm.',
      'Set the nutrient mix into its green band.',
      'Set pH to 5.5–6.0 and hold until the plants recover.',
    ],
    controls: ['Drag the three sliders', 'Watch plant health'],
    glossary: [
      { term: 'ppm', meaning: 'Parts per million, a way to measure a gas in the air.' },
      { term: 'pH', meaning: 'How acidic or basic water is. Most crops like 5.5–6.0.' },
    ],
  },
  7: {
    id: 7,
    day: 58,
    time: '13:30',
    code: 'ISRU-07',
    title: 'Oxygen From Moon Dust',
    subtitle: 'ROxygen Hydrogen Reduction',
    limitMs: 110_000,
    objective: 'Clear the hopper and make oxygen from ilmenite at 950 °C.',
    brief:
      'The outpost needs a big refill of oxygen. This machine pulls oxygen out of Moon dirt. Clear the blocked feed, heat the reactor, and balance the hydrogen loop.',
    science:
      'NASA’s ROxygen reactor heats ilmenite (FeTiO₃) with hydrogen near 950 °C. This makes water. Electricity then splits the water into oxygen for the crew and hydrogen to use again.',
    risk: 'No new oxygen is made. If the airlock or greenhouse also failed, the crew may have to evacuate.',
    steps: [
      'Drag the vibration probe over every clump.',
      'Heat the reactor bed to 900–1,000 °C.',
      'Balance hydrogen flow and electrolyzer current at 45–55%.',
    ],
    controls: ['Drag the probe over the hopper', 'Drag the three sliders'],
    glossary: [
      { term: 'Ilmenite', meaning: 'A Moon mineral that contains iron, titanium, and oxygen.' },
      { term: 'Electrolysis', meaning: 'Using electricity to split water into oxygen and hydrogen.' },
    ],
  },
  8: {
    id: 8,
    day: 58,
    time: '17:00',
    code: 'LUNA-08',
    title: 'Phone Home',
    subtitle: 'LunaNet Antenna and Data Queue',
    limitMs: 85_000,
    objective: 'Point the dish, lock the signal, and send life-support data first.',
    brief:
      'Houston needs our life-support data before the lunar night. The dish is off target. Aim it, lock the signal, then put the most important data first in the queue.',
    science:
      'LunaNet uses a narrow Ka-band beam at 23/27 GHz. The dish must point very accurately. Delay-Tolerant Networking stores data until a link is ready and sends critical life-support telemetry first.',
    risk: 'Houston loses the safety check and orders the crew to leave the outpost.',
    steps: [
      'Move the azimuth and elevation sliders to peak the signal.',
      'Hold the lock for two seconds.',
      'Queue ECLSS, then crew, then navigation, then science.',
    ],
    controls: ['Drag the two antenna sliders', 'Click packets in priority order'],
    glossary: [
      { term: 'Ka-band', meaning: 'A high-frequency radio band used for fast data links.' },
      { term: 'DTN', meaning: 'Delay-Tolerant Networking, a way to store and forward data across unreliable links.' },
    ],
  },
}

export const DAY_BRIEFS = {
  57: {
    eyebrow: 'Day 57 · 07:00 · Mission Luna',
    title: 'Good morning',
    lines: [
      'We are on Day 57 of Mission Luna. All core systems are running.',
      'Oxygen is normal at ppO₂ 145 mmHg. Water is normal. Power is moderate at 52%. Food is normal.',
      'Alert: a solar particle event is expected in 8 hours.',
      'Crew: 15 of 15 are safe. Earth link is good. No new messages.',
    ],
    objectives: ['Clean the Block A solar panels', 'Process trash into shield tiles'],
  },
  58: {
    eyebrow: 'Day 58 · 07:00 · Post-storm status',
    title: 'The storm has passed',
    lines: [
      'The outpost is still standing. Now we need to fix the air.',
      'Overnight, oxygen dropped to ppO₂ 141 mmHg and CO₂ rose to 3.4 mmHg.',
      'The scrubbers need service. The greenhouse and oxygen reactor must help while they warm up.',
      'Crew: 15 of 15 on station. Earth link is good, but LunaNet certification is pending.',
    ],
    objectives: ['Restore the CO₂ scrubbers', 'Bring the greenhouse online', 'Refill oxygen with ISRU', 'Lock LunaNet for certification'],
  },
} satisfies Record<57 | 58, { eyebrow: string; title: string; lines: string[]; objectives: string[] }>

export const ENDINGS = {
  sustained: {
    id: 'sustained',
    title: 'Outpost Luna Sustained',
    eyebrow: 'Day 58 · 18:00 · Certification granted',
    body:
      'Houston certifies Outpost Luna for the 14-day lunar night. The lights stay on, the air stays clean, and the crew has enough water and food to keep working. The outpost survives because you made the right calls under pressure.',
  },
  lockdown: {
    id: 'lockdown',
    title: 'Safe-Haven Lockdown',
    eyebrow: 'Day 58 · 18:00 · Partial certification',
    body:
      'One critical system is offline. Science work stops, the crew starts strict rationing, and an uncrewed resupply lander is sent to Luna. The outpost survives, but the next mission has to wait.',
  },
  abandoned: {
    id: 'abandoned',
    title: 'Outpost Abandoned',
    eyebrow: 'Day 58 · 18:00 · Contingency abort',
    body:
      'A resource meter hit zero, or the outpost failed too many critical checks. The crew boards the Lunar Ascent Vehicle and leaves Outpost Luna behind. The Moon is quiet again.',
  },
} as const
