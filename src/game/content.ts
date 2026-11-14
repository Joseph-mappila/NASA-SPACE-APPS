import type { MissionDefinition, MissionId } from './types'

export const MISSIONS: Record<MissionId, MissionDefinition> = {
  1: {
    id: 1,
    day: 57,
    time: '08:00',
    code: 'EDS-01',
    title: 'Block A Solar Array',
    subtitle: 'Electrodynamic Dust Shield',
    limitMs: 75_000,
    objective: 'Clear the charged lunar dust and bring Block A back to full power.',
    brief:
      'Lunar dust is not soft powder. It is sharp, glassy, and electrically charged, and it is coating Block A. Brushing it dry would scratch the cover glass. HAL has powered up the Electrodynamic Dust Shield: a wave of electric charge that makes the dust hop off the panel without touching it.',
    science:
      'NASA uses transparent indium tin oxide electrodes to send a traveling AC wave across solar cover glass. The wave creates a dielectrophoretic force. Too little voltage leaves dust stuck; too much voltage can arc across the grid and damage the panel.',
    risk: 'Power stays capped at 52%. The outpost enters the solar storm with weak batteries and a brownout risk in Mission 4.',
    steps: [
      'Tune the AC frequency and phase voltage until the dust begins to lift.',
      'Sweep the grounded brush over the remaining clumps without scratching the cells.',
    ],
    controls: ['Drag the two sliders', 'Click and drag across dust clumps'],
  },
  2: {
    id: 2,
    day: 57,
    time: '10:30',
    code: 'TCPS-02',
    title: 'Habitat Waste Processing',
    subtitle: 'Trash Compaction and Processing System',
    limitMs: 95_000,
    objective: 'Sort the waste stream, recover water, and press six radiation-shield tiles.',
    brief:
      'Nothing gets thrown outside on the Moon. The Trash Compaction and Processing System has to turn today’s waste into something useful: clean reclaimed water and dense polyethylene tiles that will help shield the crew during the solar storm.',
    science:
      'NASA’s TCPS heats and compresses mixed waste. Water is driven off and condensed, while dry waste becomes sterile tiles at about 375 kg per cubic meter. The chamber must stay in a narrow temperature and pressure band, or plastics give off toxic gases and the water flashes into a steam spike.',
    risk: 'No shield tiles are produced and water reserves fall, making the storm shelter and greenhouse harder.',
    steps: [
      'Sort organic waste, polyethylene plastic, and metal foil into the correct bins.',
      'Hold the chamber between 120–140 °C and 60–80 kPa.',
      'Run the compactor to recover water and press the tiles.',
    ],
    controls: ['Click the correct bin for each item', 'Drag the heat and pressure dials'],
  },
  3: {
    id: 3,
    day: 57,
    time: '13:30',
    code: 'AIR-03',
    title: 'Exploration Airlock',
    subtitle: 'Differential Pressure Seal Check',
    limitMs: 80_000,
    objective: 'Find the leaking seal, clear the regolith, and hold cabin pressure at 8.2 psia.',
    brief:
      'A grain of lunar dust can wedge into a rubber O-ring and open a leak straight to vacuum. The airlock is losing pressure, and the storm lockdown is only hours away. HAL needs you to find the bad seal before the crew suits up.',
    science:
      'The cabin sits at 8.2 psia. Across that boundary, even a microscopic gap lets gas expand into vacuum. NASA crews run a pressure-decay test to find the leaking hatch, then inspect the elastomer gasket with a borescope and reseat the O-ring.',
    risk: 'The leak continues through Day 58, steadily draining cabin oxygen.',
    steps: [
      'Scan the two hatches and find the seal that is losing pressure.',
      'Wipe away the trapped regolith fines.',
      'Reseat the O-ring and repressurize the airlock.',
    ],
    controls: ['Click a hatch to scan', 'Drag across the dust streaks', 'Hold the pump button'],
  },
  4: {
    id: 4,
    day: 57,
    time: '16:00',
    code: 'SPE-04',
    title: 'Solar Particle Event',
    subtitle: 'Storm Shelter and Load Shed',
    limitMs: 105_000,
    objective: 'Shield the crew below 250 mSv and keep the habitat inside its battery limit.',
    brief:
      'The solar flare has arrived. High-energy protons are hitting the Moon right now. Dense metal would shatter them into dangerous secondary neutrons, so the shelter is built from hydrogen-rich mass: water, food, and the waste tiles you pressed. Every bunk you can cover lowers the dose, and every unnecessary circuit has to go dark.',
    science:
      'NASA requires about 20 g/cm² of shielding plus 10 cm of water-equivalent mass around the storm core. Water and polyethylene stop protons through elastic collisions. Non-essential computers are shut down to prevent single-event upsets from flipping bits.',
    risk: 'Crew members suffer radiation fatigue, and a power brownout corrupts the scrubber sensors in Mission 5.',
    steps: [
      'Place water, food, and waste tiles on the 15 crew bunks.',
      'Turn off non-essential breakers until the habitat load is within the battery limit.',
    ],
    controls: ['Click a shielding unit, then a bunk', 'Click breakers to shed load'],
  },
  5: {
    id: 5,
    day: 58,
    time: '07:00',
    code: 'ECLSS-05',
    title: 'Life Support Revitalization',
    subtitle: 'Rapid Cycling Amine Scrubber',
    limitMs: 95_000,
    objective: 'Restore CO₂ removal below 3.0 mmHg and clear the coolant loop.',
    brief:
      'The storm is over, but the air is not clean. Carbon dioxide is at 3.4 mmHg and climbing. Moisture from the storm has fouled one of the amine scrubber beds, and air bubbles are trapped in the cooling loop. Open the wrong valve and you will vent breathable air into space.',
    science:
      'NASA’s Rapid Cycling Amine beds adsorb exhaled CO₂ and release it to vacuum. Condensed moisture blocks the amine and traps gas. The correct procedure closes the cabin isolation valves before opening the vacuum-desorb valve, then replaces the orbital replacement unit and bleeds the coolant loop.',
    risk: 'CO₂ rises above safe limits. Crew reaction time drops, and all remaining mission timers are cut by 25%.',
    steps: [
      'Read the three beds and identify the moisture-fouled unit.',
      'Close valves in the correct order and swap the scrubber unit.',
      'Bleed the air bubbles out of the coolant loop.',
    ],
    controls: ['Inspect the three beds', 'Click valves in sequence', 'Click bubbles to bleed them'],
  },
  6: {
    id: 6,
    day: 58,
    time: '09:30',
    code: 'BLiSS-06',
    title: 'Bioregenerative Plant Module',
    subtitle: 'Greenhouse Atmosphere and Nutrients',
    limitMs: 100_000,
    objective: 'Stabilize the greenhouse and stop the cabin oxygen decline.',
    brief:
      'The greenhouse cannot refill the whole outpost tank by itself, but it can stop the oxygen from falling while the ISRU reactor warms up. Right now the nutrient solution is out of balance and the plants are shutting down.',
    science:
      'Plants need nitrate, potassium, and magnesium at a pH between 5.5 and 6.0. Outside that window, iron and magnesium lock out chemically and chlorophyll production stops. The chamber also needs 1,000–1,200 ppm CO₂, routed from the scrubber, to drive photosynthesis.',
    risk: 'Photosynthesis stops. Cabin oxygen keeps falling toward the red zone before the ISRU reactor comes online.',
    steps: [
      'Set the scrubber-to-greenhouse CO₂ valve into the 1,000–1,200 ppm band.',
      'Dose nitrate, potassium, and magnesium into their target bands.',
      'Adjust pH to 5.8 and let the crops stabilize the air.',
    ],
    controls: ['Drag the five control sliders', 'Watch the plant response'],
  },
  7: {
    id: 7,
    day: 58,
    time: '13:30',
    code: 'ISRU-07',
    title: 'Surface ISRU Plant',
    subtitle: 'ROxygen Hydrogen Reduction',
    limitMs: 110_000,
    objective: 'Clear the hopper, reduce ilmenite at 950 °C, and refill the oxygen tanks.',
    brief:
      'This is the machine that makes oxygen from Moon dirt. The hopper is clogged with electrostatically clumped regolith, and the reactor is cold. Clear the feed, heat the ilmenite bed, and balance the hydrogen recycle before the reserve tanks run dry.',
    science:
      'NASA’s ROxygen reactor heats lunar ilmenite (FeTiO₃) with hydrogen near 950 °C. The reaction produces iron, titanium dioxide, and water. Electrolysis splits the water into oxygen for the outpost and hydrogen that returns to the reactor.',
    risk: 'No bulk oxygen is produced. If the airlock leak or greenhouse also failed, cabin oxygen can reach 0% and force evacuation.',
    steps: [
      'Drag the vibration probe over the hopper clumps.',
      'Ramp the reactor bed to 900–1,000 °C.',
      'Balance hydrogen recycle flow with electrolyzer current.',
    ],
    controls: ['Drag the probe over clumps', 'Drag the three reactor sliders'],
  },
  8: {
    id: 8,
    day: 58,
    time: '17:00',
    code: 'LUNA-08',
    title: 'LunaNet Relay Dish',
    subtitle: 'Ka-Band Pointing and DTN Lock',
    limitMs: 85_000,
    objective: 'Lock the Ka-band signal and send critical life-support telemetry to Houston.',
    brief:
      'Houston needs to certify Outpost Luna before the 14-day lunar night. The storm has filled the sky with radio noise, and the relay dish is drifting. Lock the narrow Ka-band beam, then tell the network what matters most.',
    science:
      'LunaNet’s Ka-band link uses a narrow beam at 23/27 GHz. Pointing error must stay below 0.2 degrees. Delay-Tolerant Networking lets the outpost queue data so critical ECLSS telemetry reaches Mission Control before routine science logs.',
    risk: 'Loss of signal during the mandatory safety check triggers an automated mission abort and crew evacuation.',
    steps: [
      'Drag the reticle onto the moving carrier signal and hold the lock.',
      'Put Critical ECLSS Telemetry ahead of routine science logs in the DTN queue.',
    ],
    controls: ['Drag the reticle onto the carrier', 'Click packets in priority order'],
  },
}

export const DAY_BRIEFS = {
  57: {
    eyebrow: 'Day 57 · 07:00 · Mission Luna',
    title: 'Good morning, Captain',
    lines: [
      'We are currently on Day 57 of Mission Luna. Current systems are all operational.',
      'Oxygen: Normal (PIO₂ 150 mmHg). Water: Normal. Power: Moderate (52%). Food: Normal.',
      'Alert: a Solar Particle Event is expected in 8 hours.',
      'Crew: 15/15 alive and well. Comms: Earth link intact. No incoming messages.',
    ],
    objectives: ['Clean solar panels on Block A', 'Complete waste disposal'],
  },
  58: {
    eyebrow: 'Day 58 · 07:00 · Post-storm status',
    title: 'The storm has passed. The outpost has not.',
    lines: [
      'Overnight storm exertion has pushed oxygen to Moderate (PIO₂ 141 mmHg) and CO₂ to 3.4 mmHg.',
      'The mechanical scrubbers need immediate servicing. The greenhouse must join the atmospheric loop while the ISRU oxygen reactor warms up.',
      'Crew: 15/15 on station. Comms: Earth link intact, but LunaNet certification is pending.',
    ],
    objectives: ['Restore life support', 'Bring the greenhouse online', 'Refill oxygen via ISRU', 'Lock LunaNet for certification'],
  },
} satisfies Record<57 | 58, { eyebrow: string; title: string; lines: string[]; objectives: string[] }>

export const ENDINGS = {
  sustained: {
    id: 'sustained',
    title: 'Outpost Luna Sustained',
    eyebrow: 'Day 58 · 18:00 · Certification granted',
    body:
      'Houston certifies Outpost Luna for the 14-day lunar night. The lights stay on, the air stays clean, and the crew has enough water and food to keep working. NASA’s first long-duration lunar outpost is still standing because you made the right calls under pressure.',
  },
  lockdown: {
    id: 'lockdown',
    title: 'Safe-Haven Lockdown',
    eyebrow: 'Day 58 · 18:00 · Partial certification',
    body:
      'One critical system is offline. Science work stops, the crew enters strict rationing, and an uncrewed resupply lander is redirected to Luna. The outpost survives, but the next mission will have to wait.',
  },
  abandoned: {
    id: 'abandoned',
    title: 'Outpost Abandoned',
    eyebrow: 'Day 58 · 18:00 · Contingency abort',
    body:
      'A resource meter hit zero, or the outpost failed too many critical checks. The crew boards the Lunar Ascent Vehicle and leaves Outpost Luna depressurized behind them. The Moon is quiet again.',
  },
} as const
