// ══════════════════════════════════════════
// Achievements & Codex Data
// Junior Astronaut Mission Trainer
// ══════════════════════════════════════════

export const ACHIEVEMENTS = {
  first_eva: {
    id:    'first_eva',
    emoji: '🧑‍🚀',
    title: 'First EVA',
    desc:  'Complete your first extravehicular activity.',
  },
  green_thumb: {
    id:    'green_thumb',
    emoji: '🌱',
    title: 'Green Thumb',
    desc:  'Keep all plants alive in the Oxygen Garden.',
  },
  homesick: {
    id:    'homesick',
    emoji: '🌍',
    title: 'Homesick',
    desc:  'Spot Earth from the lunar surface during your EVA.',
  },
  power_saver: {
    id:    'power_saver',
    emoji: '⚡',
    title: 'Power Saver',
    desc:  'Align solar panels in under 30 seconds.',
  },
  rock_star: {
    id:    'rock_star',
    emoji: '🔬',
    title: 'Rock Star',
    desc:  'Correctly identify all Mars mineral samples.',
  },
  mission_commander: {
    id:    'mission_commander',
    emoji: '🏅',
    title: 'Mission Commander',
    desc:  'Complete all acts with a score above 800.',
  },
  storm_survivor: {
    id:    'storm_survivor',
    emoji: '🌪️',
    title: 'Storm Survivor',
    desc:  'Successfully navigate a Martian dust storm.',
  },
};

export const CODEX_ENTRIES = {
  codex_artemis_base: {
    id:    'codex_artemis_base',
    emoji: '🏔️',
    title: 'Artemis Lunar Outpost',
    body:  'The Artemis Lunar Outpost is located at the lunar south pole — chosen for two reasons: near-permanent sunlight on the rim of Shackleton Crater provides solar power, and permanently shadowed craters nearby contain water ice that can be converted to oxygen and rocket fuel. The base consists of pressurized habitation modules delivered by the Space Launch System (SLS).',
    source: 'NASA Artemis Program',
  },
  codex_oxygen_garden: {
    id:    'codex_oxygen_garden',
    emoji: '🌱',
    title: 'Space Oxygen Gardens',
    body:  'Growing plants in space habitats isn\'t just about food — it\'s about air. Plants absorb CO₂ and release O₂ through photosynthesis. NASA\'s VEGGIE experiment on the ISS has successfully grown lettuce, kale, and flowers in microgravity. On a lunar or Mars outpost, bioregenerative life support systems using plants could reduce the need to ship compressed oxygen from Earth, making long-duration missions more sustainable.',
    source: 'NASA VEGGIE Project, ISS',
  },
  codex_lunar_regolith: {
    id:    'codex_lunar_regolith',
    emoji: '🪨',
    title: 'Lunar Regolith',
    body:  'Lunar soil — called regolith — is unlike any soil on Earth. Without wind or water to smooth it, lunar particles are jagged and abrasive at the microscopic level. Apollo astronauts found it clogged everything and even scratched helmet visors. Modern missions plan to use lunar regolith as a building material through 3D printing, sintering it into bricks for constructing permanent structures. It also contains helium-3, a potential future fusion fuel.',
    source: 'Apollo Mission Reports, NASA ISRU Program',
  },
  codex_lunar_ice: {
    id:    'codex_lunar_ice',
    emoji: '🧊',
    title: 'Lunar Water Ice',
    body:  'Water ice exists in permanently shadowed regions (PSRs) near the lunar poles, confirmed by NASA\'s LCROSS mission in 2009 when an impactor revealed water in the debris plume of Cabeus crater. This ice is ancient — billions of years old, delivered by comets and asteroids. For future missions, lunar ice is transformative: it can be split into hydrogen (H₂) and oxygen (O₂) for rocket propellant, making the Moon a potential "gas station" for deep space missions.',
    source: 'NASA LCROSS Mission, LRO Data',
  },
  codex_mars_dust: {
    id:    'codex_mars_dust',
    emoji: '🌪️',
    title: 'Martian Dust Storms',
    body:  'Mars experiences some of the solar system\'s most dramatic dust storms. Regional storms can engulf a hemisphere; global storms can cover the entire planet for months. The 2018 global dust storm ended NASA\'s Opportunity rover mission after blocking sunlight from its solar panels. Dust on Mars is electrically charged and can cling to surfaces. Mars dust is also toxic to humans — perchlorate compounds in Martian soil are hazardous if inhaled. Future colonists will need robust dust management systems.',
    source: 'NASA MER Mission, InSight Weather Data',
  },
  codex_mars_temperature: {
    id:    'codex_mars_temperature',
    emoji: '🌡️',
    title: 'Martian Temperature',
    body:  'Mars is cold — brutally so. Average surface temperature is about -60°C (-80°F), with winter nights at the poles reaching -125°C (-195°F). However, summer days near the equator can reach a relatively balmy 20°C (68°F) — but only briefly. The thin atmosphere (less than 1% of Earth\'s pressure) cannot retain heat well. The InSight lander recorded the first long-term Mars weather dataset, measuring temperature, pressure, and wind at Elysium Planitia from 2018 to 2022.',
    source: 'NASA InSight Mission (2018–2022)',
  },
};
