# LUNA — Outpost 57

A browser-based, kid-oriented NASA science adventure. Scroll through a cinematic
history of human curiosity, then take command of a fictional lunar outpost and
keep fifteen astronauts alive through a solar storm.

Built with React 19, TypeScript, Vite, GSAP ScrollTrigger, and the Web Audio API.
No game engine, no backend, and no external art beyond the three supplied
illustrations.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle in dist/
npm run preview   # serve the production build
npm test          # reducer, consequences, save/load, mission render smoke tests
npm run typecheck
```

## How it plays

1. **Landing** — sound check and a short briefing.
2. **Scroll intro** — nine scroll-linked scenes: storm, fire, forge, wheel,
   car, ship, plane, rocket, starfield, then the title.
3. **Callsign** — HAL asks for the player's name. It stays in `localStorage`.
4. **Day 57** — missions 1–4 prepare the outpost for a Solar Particle Event.
5. **Day 58** — missions 5–8 recover life support, food, oxygen, and the link
   to Houston.
6. **Ending** — sustained, lockdown, or evacuation, depending on the run.

Every mission runs on its own clock. Reaching zero is a hard failure, there is
no retry, and the result carries forward into later missions. Grades are S/A/B/F
with a local best time per mission.

## Missions

| # | Mission | Real science |
| --- | --- | --- |
| 1 | Block A Solar Array | Electrodynamic Dust Shield, ITO electrodes, dielectrophoresis |
| 2 | Habitat Waste Processing | Trash Compaction and Processing System, water recovery, polyethylene tiles |
| 3 | Exploration Airlock | Differential pressure decay, 8.2 psia boundary, O-ring regolith |
| 4 | Solar Particle Event | Hydrogen-rich shielding, 250 mSv limit, load shedding |
| 5 | Life Support Revitalization | Rapid Cycling Amine beds, valve sequencing, coolant bleed |
| 6 | Bioregenerative Plant Module | CO₂ enrichment, nitrate/potassium/magnesium, pH 5.5–6.0 |
| 7 | Surface ISRU Plant | ROxygen hydrogen reduction of ilmenite near 950 °C |
| 8 | LunaNet Relay Dish | Ka-band pointing, 0.2° error, Delay-Tolerant Networking priority |

## Structure

```
src/
  App.tsx                 phase routing
  audio/engine.ts         procedural Web Audio (no audio files)
  components/Hud.tsx      brand bar + resource meters
  game/                   types, content, reducer, saves, formatting
  intro/                  GSAP scroll stage, SVG scenes, canvas effects
  missions/               eight minigames + shared controls
  screens/                landing, name, briefs, runner, result, ending
  styles/                 tokens, base, intro, game, missions
```

## Science note

LUNA is fiction. NASA does not operate a crewed lunar outpost, and this project
does not imply NASA endorsement. The mechanics and values are drawn from public
NASA material including NASA-STD-3001, the Moon-to-Mars architecture, EDS, TCPS,
ROxygen ISRU, and LunaNet. No NASA insignia or photography is used.
