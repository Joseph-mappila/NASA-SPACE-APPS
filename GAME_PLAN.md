# 🚀 Junior Astronaut Mission Trainer — Game Design & Architecture Plan
*NASA SpaceApps Hackathon | React Web Game*

---

## 🎯 Concept Overview

A **narrative-driven, choice-based survival game** set across a Lunar and Mars outpost mission. Players take the role of a junior astronaut cadet navigating real space missions, making life-or-death decisions, and learning about authentic space science — all powered by real NASA data.

---

## 🌌 Narrative & Setting

### The Story Arc
> *"The year is 2047. You are a newly certified Junior Astronaut aboard the Artemis Outpost on the Moon, awaiting transfer to the new Ares Colony on Mars. Your mission: survive your first solo rotation and prove you're ready for deep space."*

### Three Acts
| Act | Location | Theme |
|---|---|---|
| **Act 1: Orientation** | Lunar Outpost (Artemis Base) | Learn the basics, explore your habitat |
| **Act 2: The Journey** | Transit Ship (Lunar → Mars) | Survive a solar storm, manage ship systems |
| **Act 3: Mars Colony** | Ares Outpost (Mars) | Establish the colony, face Martian conditions |

---

## 🛠️ Tech Stack

```
Frontend Framework:   React (Vite)
State Management:     Zustand (lightweight, game-state perfect)
Routing:              React Router v6
Styling:              CSS Modules + CSS Variables (space aesthetic)
Animation:            Framer Motion (cinematic transitions)
Audio:                Howler.js (ambient space sounds)
Canvas/Minigames:     HTML5 Canvas API
Build Tool:           Vite
```

---

## 🌐 NASA API Integrations

### 1. APOD — Astronomy Picture of the Day
- **Endpoint:** `https://api.nasa.gov/planetary/apod`
- **Use:** Dynamically fetched **background images** for each scene
- **Mechanic:** Each new "day" in-game loads a real NASA space photo as the background
- **Fallback:** NASA Image Library for themed searches (moon, mars, galaxy)

### 2. Mars Rover Photos API
- **Endpoint:** `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`
- **Use:** Real Mars surface photos as **Act 3 environment backgrounds**
- **Mechanic:** Photos fetched by sol (Martian day) — ties "in-game day" to real Curiosity sols

### 3. InSight Weather Data (Historical Archive)
- **Data Source:** Archived JSON from InSight mission (sol-based)
- **Use:** Actual atmospheric pressure, temperature, and wind data from Mars
- **Mechanic:** Randomly sample a historical sol → real weather conditions affect gameplay decisions
  - *"Sol 400: Temperature: -78°C, Wind: 12 m/s"* → triggers a dust storm scenario

### 4. NASA Image & Video Library
- **Endpoint:** `https://images-api.nasa.gov/search?q={query}`
- **Use:** Dynamic character/item art for NPCs, equipment
- **Queries:** "astronaut spacesuit", "lunar rover", "space station interior"

### 5. Earth Polychromatic Imaging Camera (EPIC)
- **Use:** Show beautiful Earth-from-space imagery in Act 1 (looking back at Earth from the Moon)

---

## 🎮 Core Gameplay Systems

### 1. 📖 Dialogue & Decision Engine
- Visual novel-style dialogue system with branching choices
- Each choice has **consequence flags** (health, oxygen, morale, mission score)
- NPCs: Commander Chen, Dr. Patel (medic), HAL-Jr (AI assistant)
- Dialogue tree stored as JSON → easy to extend

```
DialogueNode {
  id: string
  speaker: "player" | "commander" | "hal" | "medic"
  text: string
  portrait: string        // character sprite
  background: string      // scene identifier
  choices?: Choice[]
  effects?: Effect[]      // { stat: "oxygen", delta: -10 }
  nextId?: string         // if no choices
}
```

### 2. 📊 Survival Stats Dashboard
Four core stats displayed as a HUD panel:

| Stat | Icon | Description |
|---|---|---|
| **Oxygen** 💨 | Blue bar | Depletes during EVA; manage carefully |
| **Health** ❤️ | Red bar | Radiation, injuries reduce this |
| **Morale** 😊 | Yellow bar | Bad decisions tank morale |
| **Mission Score** 🏆 | Green | Cumulative from good choices |

### 3. 🌦️ Dynamic Weather Events
Real InSight data drives random weather events:
- **Dust Storm** (high wind speed): Reduces visibility → limits EVA options
- **Extreme Cold** (< -100°C): Equipment failure risk → repair minigame triggers
- **High Pressure** event: Atmospheric anomaly → science opportunity choice

### 4. 🎯 Minigames (5 Total)

#### Minigame 1: 🔧 EVA Suit Repair
- **Trigger:** Micrometeorite damage scenario
- **Mechanic:** Match-the-wires / puzzle connector mini-canvas game
- **Time Limit:** 60 seconds
- **Fail State:** Oxygen leak → health penalty

#### Minigame 2: 🌱 Oxygen Garden Tending
- **Trigger:** CO₂ scrubber offline
- **Mechanic:** Drag-and-drop nutrients to plant panels; keep them in the green zone
- **Science hook:** Real info about how plants produce O₂ in space habitats

#### Minigame 3: 🧭 Lunar/Mars Navigation
- **Trigger:** Rover route planning for supply run
- **Mechanic:** Top-down grid maze using real terrain elevation hazards
- **Data hook:** Moon Trek terrain data for puzzle generation

#### Minigame 4: ☀️ Solar Panel Alignment
- **Trigger:** Power outage during storm
- **Mechanic:** Rotate panel segments to maximize energy (angle puzzle)
- **Science hook:** Real solar irradiance values at Mars (590 W/m²) vs Moon

#### Minigame 5: 🔬 Sample Analysis Lab
- **Trigger:** Mars rock discovery
- **Mechanic:** Identify mineral composition by spectral color matching
- **Science hook:** Ties into actual Curiosity mission rock types (basalt, olivine)

---

## 🗺️ Scene Architecture

```
src/
├── components/
│   ├── DialogueBox/          # Dialogue + choice UI
│   ├── HUD/                  # Stats bars overlay
│   ├── SceneBackground/      # NASA image fetcher + display
│   ├── WeatherAlert/         # Animated weather event banner
│   ├── CharacterPortrait/    # Animated sprite panel
│   └── Minigames/
│       ├── EVARepair/
│       ├── OxygenGarden/
│       ├── Navigation/
│       ├── SolarPanel/
│       └── SampleLab/
├── scenes/                   # JSON dialogue tree files
│   ├── act1_lunar/
│   ├── act2_transit/
│   └── act3_mars/
├── hooks/
│   ├── useNASAImages.js      # APOD + Image Library fetching
│   ├── useMarsWeather.js     # Historical InSight data
│   └── useGameState.js       # Zustand game store
├── store/
│   └── gameStore.js          # Zustand store (stats, progress, flags)
├── data/
│   ├── insight_weather.json  # Cached InSight historical data
│   ├── science_facts.json    # Educational facts shown between scenes
│   └── achievements.json
├── assets/
│   ├── audio/                # Ambient: space hum, comms crackle, alarms
│   ├── sprites/              # Character portraits (SVG/pixel art)
│   └── ui/
└── App.jsx
```

---

## 📱 UI/UX Design Language

### Visual Theme: "RETRO-FUTURISTIC SPACE OPS"
- **Color Palette:**
  - Deep Space Black: `#0a0a1a`
  - NASA Blue: `#1b4f8a`
  - Martian Red: `#c1440e`
  - Lunar Silver: `#b8c4cc`
  - Plasma Green (HUD): `#00ff88`
  - Alert Amber: `#f5a623`
- **Typography:** `Space Grotesk` + `Share Tech Mono` (for HUD/data readouts)
- **Effects:** Scanlines overlay, CRT-style flicker on comms, particle dust effects for Mars scenes
- **Transitions:** Framer Motion page transitions with starfield wipe effect

### Key Screens
1. **Main Menu** — Animated starfield + rotating planet + mission briefing audio
2. **Scene View** — Full-bleed NASA image BG + dialogue box + HUD
3. **Minigame** — Canvas overlay with mission-critical urgency styling
4. **Codex** — Unlockable encyclopedia of space facts (engagement hook)
5. **Mission Summary** — End-of-act report card with score + badge earned

---

## 🏗️ Implementation Phases

### Phase 1 (Day 1) — Foundation
- [ ] Vite + React setup with routing
- [ ] NASA API hooks (APOD, Mars Photos, Image Library)
- [ ] Game store (Zustand) with stat system
- [ ] Basic dialogue engine with branching choices
- [ ] Dialogue JSON for Act 1 (5–8 nodes)

### Phase 2 (Day 2) — Core Experience
- [ ] HUD component with animated stat bars
- [ ] SceneBackground with NASA image loading + loading states
- [ ] Mars Weather integration + event triggering system
- [ ] Weather Alert UI component
- [ ] Character portrait system (3–4 characters)
- [ ] Act 1 complete + Act 2 dialogue

### Phase 3 (Day 3) — Minigames
- [ ] EVA Repair minigame (canvas)
- [ ] Oxygen Garden minigame
- [ ] At least 1 more minigame (Navigation or Solar Panel)
- [ ] Minigame → story integration (success/fail outcomes)

### Phase 4 (Day 4) — Polish & Act 3
- [ ] Act 3 Mars dialogue + scenarios
- [ ] Mission Summary / Report Card screen
- [ ] Science Codex with 10+ unlockable entries
- [ ] Ambient audio (Howler.js)
- [ ] Responsive polish + animations

### Phase 5 (Demo Day) — Hackathon Ready
- [ ] Video intro / splash screen
- [ ] Deploy on Netlify / Vercel
- [ ] README with NASA API attribution
- [ ] Demo mode: auto-play showcase for judges

---

## 🧠 Educational Integration (Judges Love This)

Each major decision or event surfaces a **"Mission Science"** tooltip:
- Dust storm → *"Mars dust storms can last months and cover the entire planet. The 2018 global storm ended the Opportunity rover mission."*
- O₂ management → *"The ISS uses electrolysis to split water into hydrogen and oxygen to replenish cabin air."*
- Solar panel → *"Mars receives ~590 W/m² of solar energy vs Earth's 1361 W/m²."*

A **Science Codex** (like a Pokédex for space knowledge) unlocks entries as the player progresses.

---

## 🏆 Scoring & Achievement System

| Achievement | Trigger |
|---|---|
| 🧑‍🚀 "First EVA" | Complete first extravehicular activity |
| 🌱 "Green Thumb" | Keep all plants alive in Oxygen Garden |
| ⚡ "Power Saver" | Align solar panels in under 30 seconds |
| 🔬 "Rock Star" | Correctly identify all Mars samples |
| 🌍 "Homesick" | View EPIC Earth image in Act 1 |
| 🏅 "Mission Commander" | Complete all 3 acts with 80%+ score |

---

## 🔑 NASA API Key Strategy

```
VITE_NASA_API_KEY=DEMO_KEY    # for dev
# Register at api.nasa.gov for 1,000 req/hr limit for the demo
```

Fallback strategy: pre-cache a set of NASA images locally (legally permitted under NASA's open media policy) so the demo never fails due to rate limits during judging.

---

## 🚀 Winning Differentiators for Judges

1. **Real NASA data** powering narrative events (not just decoration)
2. **Educational value** woven into every mechanic
3. **Junior-friendly** design (target audience: ages 10–16)
4. **Replayability** via branching choices + randomized weather
5. **Visual polish** that looks production-ready
6. **Expandable** — clearly documented JSON schema for more content

