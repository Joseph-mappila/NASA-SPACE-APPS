# LUNA — Outpost 57

A browser game about running a Moon outpost through a solar storm.
Play now at: <https://github.com/Joseph-mappila/NASA-SPACE-APPS>

Outpost 57 is a fictional NASA outpost on the Moon. Fifteen astronauts depend on
it for power, air, water, food, and a radio link home. The player commands the
outpost for two days and eight missions while a solar storm passes over the
site. Built for ages 7–12, playable on a phone, tablet, or laptop.

## What does it do, and how does it work?

The player enters a callsign and takes eight missions in order. Each mission is
an interactive console: sliders, breakers, valves, a drag target, or a priority
queue. Every mission has its own countdown, from 25 seconds to 1 minute 10
seconds, which starts when the player presses Begin and does not stop.

Results carry forward. A failed dust shield leaves the battery at 52% and causes
a brownout in a later mission; a failed CO₂ scrubber cuts the clocks of the next
three missions by 25%. At the end, the outpost is either sustained, locked down,
or evacuated, depending on how many missions passed and whether any resource
reached zero.

The whole game runs in the browser. React holds the game state, localStorage
keeps the save, and the audio mixes a looping ambient track, short scene clips,
and Web Audio tones and noise. There is no server, no account, and no database.

## What benefits does it have?

- Teaches real lunar engineering through play: dust levitation, trash
  compaction, pressure seals, radiation shielding, CO₂ scrubbing, plant growth,
  oxygen from regolith, and radio pointing.
- Practises decisions under time pressure. Shielding costs mass and power; life
  support costs battery. Every choice has a visible cost.
- Shows consequences instead of resetting them, so a bad call matters in the
  next mission.
- Gives instant feedback through gauges, messages, and the final ending.
- Needs no install, account, or sign-in, and shows no ads.
- Works with touch or keyboard, on small screens and desktops.

## What is the intended impact?

- Make Moon missions feel understandable and doable for a young player.
- Connect the game to hardware NASA is testing now, so the science is not
  abstract.
- Encourage curiosity about engineering and space careers.

## What tools, languages, and software did you use?

- React 19 and TypeScript
- Vite 7
- GSAP ScrollTrigger for the opening sequence
- Web Audio API for generated sound effects and scene ambience
- Hand-written SVG for the scenes and CSS for the interface
- Vitest and Testing Library
- NASA public APIs: DONKI, EPIC, TechPort, Image and Video Library, POWER, JPL
  Horizons, NeoWs, InSight, and Worldview (GIBS)
- GitHub Actions and GitHub Pages

No special hardware is needed: the game runs in any modern browser on a laptop,
tablet, or phone. There is no game engine, no backend, and no database. The three
supplied character and environment illustrations are the only images bundled with
the project; NASA photos load from NASA's image servers.

## How is the project creative?

- The opening sequence is drawn in SVG and animated by scroll position. There is
  no video.
- Sound is layered: a looping ambient track, short clips for each scene, and
  Web Audio tones and noise synthesized live for storms, engines, and alarms.
- Each mission is a custom-built console rather than a multiple-choice question.
- Real NASA records sit beside the fiction: every briefing has an archive with a
  real project and photograph, and the ending compares the story with real
  Earth, asteroid, solar, Mars, and antenna data.
- Failure is part of the story. Consequences accumulate across missions instead
  of resetting at the next screen.

## What factors did you consider?

- **Age 7–12:** short instructions, large controls, plain language, and no
  reading-heavy failure text.
- **Accessibility:** keyboard controls, visible focus, and support for
  `prefers-reduced-motion`.
- **Time:** clocks long enough to think and short enough to feel urgent.
- **Fairness:** every failure has a visible cause and a later consequence.
- **Accuracy:** values follow public NASA material such as NASA-STD-3001 and the
  Moon-to-Mars architecture.
- **Performance and cost:** static files, no backend, and no API key needed to
  play.
- **Connection:** most NASA material ships with the game; one live feed adds
  current solar activity.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle in dist/
npm run preview   # serve the production build
npm test          # game logic, missions, minigames, and NASA data tests
npm run typecheck
```

## Missions in order

| # | Day and time | Mission | What the player does | Real science | Clock |
| --- | --- | --- | --- | --- | --- |
| 1 | Day 57, 08:00 | Solar Panel Dust Shield | Tune the electric wave, set the voltage, and sweep the panel clean | Electrodynamic Dust Shield, ITO electrodes, dielectrophoresis | 40 s |
| 2 | Day 57, 10:30 | Trash to Shield Tiles | Remove unsafe items, set heat and pressure, hold the press | Trash Compaction and Processing System, water recovery, polyethylene tiles | 25 s |
| 3 | Day 57, 13:30 | Airlock Leak Hunt | Test both hatches, clean the dirty seal, reseat the O-ring, hold pressure | Differential pressure decay, 8.2 psia boundary | 40 s |
| 4 | Day 57, 16:00 | Solar Storm Shelter | Cover the bunks with water, food, and tile units, then shed non-essential power | Hydrogen-rich shielding, 250 mSv limit, 20 g/cm² | 1:10 |
| 5 | Day 58, 07:00 | CO₂ Scrubber Rescue | Find the wet amine bed, close the valves, swap the bed, bleed the coolant | Rapid Cycling Amine beds, valve sequencing | 40 s |
| 6 | Day 58, 09:30 | Greenhouse Rescue | Hold CO₂, nutrients, and pH in band until the crop recovers | Advanced Plant Habitat, CELSS | 30 s |
| 7 | Day 58, 13:30 | Oxygen From Moon Dust | Clear the hopper, heat the reactor to 950 °C, balance hydrogen | ROxygen hydrogen reduction of ilmenite | 50 s |
| 8 | Day 58, 17:00 | Phone Home | Point the dish, hold the lock, queue data by priority | Ka-band pointing, Delay-Tolerant Networking | 50 s |

Grades are S, A, B, or F, with a local best time for each mission.

### What failure costs

| Failure | Effect later |
| --- | --- |
| Mission 1 | Power stays at 52%, and Mission 4 sets a brownout that shortens Mission 5's clock |
| Mission 2 | No shield tiles and 5 less water, so the shelter must cover 80% of bunks instead of 93% |
| Mission 3 | Oxygen leaks through Missions 4–7 |
| Mission 4 | Crew health drops 20 and power drops 15; the outpost enters a brownout |
| Mission 5 | Missions 6–8 lose 25% of their clocks |
| Mission 6 | Oxygen drops 12 and water drops 10 as the plants stop producing |
| Mission 7 | Oxygen drops 15, or to zero if the airlock still leaks |
| Mission 8 | Houston cannot certify the outpost, and the crew is ordered home |

The run ends as **Outpost Luna Sustained**, **Safe-Haven Lockdown**, or **Outpost
Abandoned**. Abandonment follows any resource reaching zero, an abort, or fewer
than four passed missions. Otherwise, six or more passes with every resource above
50 gives a sustained outpost; anything else is a lockdown.

## Where NASA data is used

### Live during play

| Where | What | API |
| --- | --- | --- |
| Day 58 briefing | The three newest space-weather notices | DONKI notifications |
| Mission 8 briefing | The latest full-disk Earth photo | EPIC |

### From a committed snapshot

`src/data/nasa/archive.json` is generated by `npm run nasa:sync` and committed
with the code.

| Where it appears | What it shows | API |
| --- | --- | --- |
| Every mission briefing → **NASA archive** | A real technology project with TRL, programme, description, and link | TechPort |
| Every mission briefing → **NASA archive** | A real photograph with centre, date, and archive link | Image and Video Library |
| Mission 1 archive | Seven days of measured sunlight at a lunar-analog site | POWER |
| Mission 4 archive and Day 58 panel | A real coronal mass ejection and the latest Kp index | DONKI |
| Mission 8 archive | Earth's real azimuth and elevation above Shackleton crater | JPL Horizons |
| Ending → **Science debrief** | A timelapse of one real Earth day | EPIC |
| Ending → **Science debrief** | A true-colour regional satellite view of Earth | Worldview (GIBS) |
| Ending → **Science debrief** | Asteroid close approaches for the coming week | NeoWs |
| Ending → **Science debrief** | The last sol of weather from InSight | InSight Mars Weather |
| Ending → **Science debrief** | Seven days of solar irradiance | POWER |

### Mission archive projects

| Mission | TechPort project |
| --- | --- |
| 1 · Solar Panel Dust Shield | 32733 · Electrodynamic Dust Shield for Lunar/ISS Experiment |
| 2 · Trash to Shield Tiles | 93127 · Trash Compaction and Processing System |
| 3 · Airlock Leak Hunt | 94753 · Smart Elastomer Seal with Remote Monitoring |
| 4 · Solar Storm Shelter | 11551 · Water Walls life support architecture |
| 5 · CO₂ Scrubber Rescue | 13611 · Rapid Cycle Amine (RCA) Swing Bed |
| 6 · Greenhouse Rescue | 91334 · Lunar Plant Growth Experiment (LPX) |
| 7 · Oxygen From Moon Dust | 116390 · ISRU Hydrogen Oxygen Production |
| 8 · Phone Home | 157472 · LunaNet Network Layer Services |

### Refresh the snapshot

```bash
npm run nasa:sync
```

The script reads `VITE_NASA_API_KEY` from `.env.local`, or uses `DEMO_KEY`, and
rewrites `src/data/nasa/archive.json`. A feed that fails keeps its previous
section.

### API key

A free key from <https://api.nasa.gov> raises the limit from the shared
`DEMO_KEY` to 1,000 requests per hour. Copy `.env.example` to `.env.local`:

```bash
VITE_NASA_API_KEY=your_key_here
```

Restart `npm run dev` after changing it. The snapshot script reads the same
variable.

## Credits

Made by CurioCET. NASA photography and data are credited beside
each item, and no NASA insignia is used.

LUNA is a fictional outpost. NASA does not operate a crewed lunar outpost, and
this project is not affiliated with or endorsed by NASA.
