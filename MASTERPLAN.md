# Junior Astronaut Mission Trainer — Master Plan

Working title: **Aster Outpost**

## Product in one sentence

An illustrated, scroll-driven Mars survival story in which children make real mission trade-offs, perform short tactile minigames, and see how their decisions change power, life support, food, and rescue readiness.

## Why this direction

- Achievable and polishable by six beginners in 48 hours.
- Mobile-first and requires no download or account.
- Story provides an emotional hook; minigames provide interaction.
- A persistent resource model answers the challenge instead of becoming a passive picture book.
- NASA data changes events and mechanics rather than appearing as decoration.

## Target experience

- Audience: ages 7–12.
- Runtime: 8–10 minutes.
- Format: browser-based scrollytelling with three interactive chapters.
- Tone: hopeful, curious, tense without being frightening.
- Failure model: training rewind, never a graphic death.
- Primary input: scroll, click/tap, drag; keyboard alternatives required.

## Non-negotiable game loop

Every chapter follows the same sequence:

1. **Story** — 20–40 seconds of illustrated narrative.
2. **Alert** — one outpost system develops a problem.
3. **Choose** — the player decides what resource or objective to sacrifice.
4. **Act** — a 30–60 second tactile minigame executes the choice.
5. **Consequence** — persistent resources and the illustration change.
6. **Learn** — one plain-language explanation and its NASA source.

A minigame without a trade-off is not sufficient. A choice without a physical interaction is not sufficient.

## Story skeleton

The player is a Junior Mission Controller helping an astronaut keep **Aster Outpost** alive on Mars until a rescue rover arrives in three sols. Final prose, character voice, and dialogue are owned by the narrative lead.

### Prologue — The signal

- Establish Mars, the isolated outpost, the astronaut, and the delayed rescue.
- Give the player their Mission Control role.
- Introduce four compact indicators: Power, Life Support, Food, Rescue.

### Chapter 1 — The Greenhouse Thirst

- Crisis: reduced water-recycler output.
- Choice: protect drinking/life-support reserves or irrigate more crops.
- Interaction: adjust a few irrigation valves using moisture feedback.
- Persistent consequence: life-support reserve versus projected food yield.
- NASA basis: OSDR lettuce/pepper studies and ECLSS educational material.

### Chapter 2 — Shelter Mode

- Crisis: an archived NASA space-weather event triggers a warning.
- Choice: shed greenhouse, science, or communications loads.
- Interaction: reroute limited power, secure the hatch, and prepare the physically shielded shelter.
- Persistent consequence: crew safety versus food/science/communications.
- NASA basis: DONKI event metadata and radiation-shelter principles.

### Chapter 3 — The Darkest Hour

- Crisis: dust-reduced generation plus an electrical fault causes a partial blackout.
- Choice: prioritize oxygen recycling, greenhouse heat, or the rescue beacon.
- Interaction: use a flashlight effect to trace labeled cables and repair the correct breaker.
- Persistent consequence: the repaired amount of power and its allocation determine the ending.
- NASA basis: Mars surface conditions, solar-power constraints, and load shedding.

### Epilogue — What survived

- Rescue arrives.
- Show one illustrated outcome assembled from the player’s resource state.
- Summarize the causal chain: decision → sacrifice → mission result.
- Award a Junior Mission Controller patch and offer replay.

## Scientific guardrails

- Do not imply that plants replace engineered life support.
- Do not show crops growing from seed to harvest in three sols; crops are already mature.
- Do not depict a Mars dust storm with Earth-hurricane force.
- Do not treat a DONKI event as a direct Mars radiation-dose forecast.
- Radiation protection is physical shielding; there is no energy-shield button.
- A solar storm does not simply require retracting solar panels.
- Every numeric rule is labeled as a simplified educational model.

## NASA integration

### Integral sources

1. **NASA DONKI** — archived CME/SEP metadata drives Chapter 2’s event card and warning conditions.
2. **NASA OSDR OSD-268 / OSD-772** — greenhouse facts and crop constraints inform Chapter 1.
3. **NASA/JPL Mars resources** — location, dust, surface imagery, and environmental context inform Chapter 3 and visual material.

### Reliability rule

- Discover and download source records during development.
- Commit a small attributed JSON snapshot used by the game.
- Optionally refresh from NASA when available.
- Never make the judge’s demo depend on a live API.
- Never commit API keys.

## Visual direction

- One coherent illustrated style; do not mix painterly scenes with unrelated pixel art.
- Approximately 8–10 final illustrations.
- Generated art may provide backgrounds, but UI, labels, meters, and interactive parts remain HTML/SVG.
- Use a fixed full-screen visual stage with scroll-triggered crossfades and subtle parallax.
- Minigames appear as close-up views within the same world and palette.
- Use a curated, attributed local NASA-image collection for optional randomized loading/cover backgrounds. Random NASA images are atmosphere, not core data integration.

## Technical direction

- Vite + React + TypeScript.
- `react-scrollama` for scroll steps, following the general MIT-licensed methodology of A Solar Tale.
- CSS/SCSS for fixed visual layers, opacity transitions, typography, and responsive layout.
- SVG/HTML for controls and minigames; Canvas only where it materially helps, such as the flashlight mask.
- Local chapter JSON and a single typed persistent game state.
- No backend, authentication, database, multiplayer, 3D engine, or live-only dependency.

## Vertical slice first

Before producing final art for all chapters, complete **Chapter 2 — Shelter Mode** end to end with placeholders:

- one scrolling story transition;
- one meaningful choice;
- one playable minigame;
- persistent resource change;
- one consequence scene;
- one NASA “Why?” drawer;
- responsive phone and desktop layouts;
- a deployed public URL.

If this is not playable by the first major checkpoint, cut features rather than adding people or systems.

## Six-person ownership

1. **Integration lead** — repository, app architecture, review, deployment.
2. **Scrollytelling developer** — Scrollama flow, transitions, responsive layout.
3. **Gameplay developer** — shared state and three minigames.
4. **Narrative lead** — original prose, dialogue, pacing, child readability.
5. **Science/data lead** — NASA records, simplified rules, citations, accuracy.
6. **Visual/QA/pitch lead** — art consistency, audio, accessibility tests, demo and submission.

Pair ownership is encouraged, but every file/feature has one final decision-maker.

## 48-hour checkpoints

### Hours 0–2

- Freeze story skeleton, resources, art direction, and roles.
- Create repository, Vite app, deployment, and placeholder data contract.

### Hours 2–8

- Complete and deploy the Chapter 2 vertical slice.
- Test scroll behavior and minigame on desktop and phone.

### Hours 8–16

- Add Chapters 1 and 3 using the same chapter template.
- Connect all decisions to the persistent resource model.

### Hours 16–26

- Replace placeholders with final coherent illustrations.
- Add NASA source drawers, credits, alt text, and narration/captions.

### Hours 26–34

- Add transitions, audio, reduced motion, keyboard alternatives, and outcome variants.
- Balance with at least three fresh playtesters.

### Hours 34–40

- Feature freeze.
- Fix only critical usability, science, responsiveness, and deployment defects.

### Hours 40–48

- Record a ≤30-second public demo.
- Complete project-page fields, citations, README, and pitch.
- Rehearse with a network-independent backup.

## Explicit cuts

- No free exploration or 2.5D hub.
- No first-person movement.
- No branching campaign; only resource-dependent presentation changes.
- No more than three minigames.
- No inventory, crafting, accounts, leaderboards, or chatbot.
- No live procedural image feed.
- No final story text baked into images.
- No strict timer in the default child mode.

## Definition of done

- A child can complete the experience without adult explanation.
- At least one choice visibly sacrifices one goal to protect another.
- NASA data/resource use is visible, cited, and mechanically relevant.
- Every drag action has a click/tap or keyboard alternative.
- The entire experience works on a phone and desktop.
- The deployed game still works if NASA APIs are unavailable.
- A judge can understand the story, decision, action, consequence, and NASA source within 60 seconds.

