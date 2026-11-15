# LUNA — Outpost 57

A browser-based, kid-oriented NASA science adventure. Scroll through a cinematic
history of human curiosity, then take command of a fictional lunar outpost and
keep fifteen astronauts alive through a solar storm.

Built with React 19, TypeScript, Vite, GSAP ScrollTrigger, and the Web Audio API.
No game engine and no backend. The only external media are the three supplied
illustrations, the looping ambient music track, and the optional live NASA
space-weather and Earth-photo feeds.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle in dist/
npm run preview   # serve the production build
npm test          # reducer, consequences, save/load, mission and minigame tests
npm run typecheck
```

### Optional NASA API key

The Day 58 briefing can show live space-weather notices from NASA's DONKI
database. Mission 8's Phone Home briefing also shows the latest full-disk Earth
photo from NASA EPIC (a keyless endpoint). DONKI works without configuration by
falling back to NASA's shared `DEMO_KEY`, but that key is rate-limited. For a
smoother experience, copy `.env.example` to `.env.local` and add a free key from
<https://api.nasa.gov>:

```bash
VITE_NASA_API_KEY=your_key_here
```

Vite reads this variable at build or dev-server start, so restart `npm run dev`
after changing it. If the feed is unavailable, the mission continues using the
outpost's fixed telemetry.

## How it plays

1. **Landing** — sound check and a short briefing.
2. **Scroll intro** — nine scroll-linked scenes: storm, fire, forge, wheel,
   car, ship, plane, rocket, starfield, then the title.
3. **Callsign** — HAL asks for the player's name. It stays in `localStorage`.
   After the first completed run, this screen also offers three optional
   training minigames. They never change the story save, mission clock, or
   ending.
4. **Day 57** — missions 1–4 prepare the outpost for a Solar Particle Event.
5. **Day 58** — missions 5–8 recover life support, food, oxygen, and the link
   to Houston. The briefing also shows live NASA DONKI space-weather notices.
6. **Ending** — sustained, lockdown, or evacuation, depending on the run.

Every mission runs on its own clock. Reaching zero is a hard failure, there is
no retry, and the result carries forward into later missions. Grades are S/A/B/F
with a local best time per mission.

A failed CO₂ scrubber cuts the clocks of missions 6–8 by 25%, and a storm
brownout cuts mission 5 by 10%.

## Missions

| # | Mission | Real science | Clock |
| --- | --- | --- | --- |
| 1 | Block A Solar Array | Electrodynamic Dust Shield, ITO electrodes, dielectrophoresis | 40 s |
| 2 | Habitat Waste Processing | Trash Compaction and Processing System, water recovery, polyethylene tiles | 25 s |
| 3 | Exploration Airlock | Differential pressure decay, 8.2 psia boundary, O-ring regolith | 40 s |
| 4 | Solar Particle Event | Hydrogen-rich shielding, 250 mSv limit, load shedding | 1:10 |
| 5 | Life Support Revitalization | Rapid Cycling Amine beds, valve sequencing, coolant bleed | 40 s |
| 6 | Bioregenerative Plant Module | CO₂ enrichment, nitrate/potassium/magnesium, pH 5.5–6.0 | 30 s |
| 7 | Surface ISRU Plant | ROxygen hydrogen reduction of ilmenite near 950 °C | 50 s |
| 8 | LunaNet Relay Dish | Ka-band pointing, 0.2° error, Delay-Tolerant Networking priority | 50 s |

## Structure

```
src/
  App.tsx                 phase routing + optional training mode
  api/nasa.ts             NASA DONKI + EPIC clients with DEMO_KEY fallback
  audio/engine.ts         ambient music loop + procedural Web Audio effects
  components/             HUD, live space-weather panel, live Earth photo
  game/                   types, content, reducer, saves, formatting
  intro/                  GSAP scroll stage, SVG scenes, canvas effects
  minigames/              three standalone training games and catalog
  missions/               eight story missions + shared controls
  screens/                landing, name, briefs, runner, result, ending
  styles/                 tokens, base, intro, game, missions, minigames
```

## Science note

LUNA is fiction. NASA does not operate a crewed lunar outpost, and this project
does not imply NASA endorsement. The mechanics and values are drawn from public
NASA material including NASA-STD-3001, the Moon-to-Mars architecture, EDS, TCPS,
ROxygen ISRU, and LunaNet. No NASA insignia or photography is used.
