# LUNA

A kid-oriented science adventure about operating NASA's fictional Luna outpost.

## Current vertical slice

The experience follows the canonical lunar story from humanity's first encounters with lightning
and fire to spaceflight, then places the player in Mission Luna on Day 57. It includes:

- an all-vector, scroll-driven prologue with optional sound;
- player name entry and HAL's outpost briefing;
- timed Electrodynamic Dust Shield and waste-processing missions;
- persistent Power, Oxygen, Water/Food, and Crew Health resources;
- pass/fail consequences that carry into the continuation screen.

The primary audience is ages 7–12. Controls support pointer, touch, and keyboard input, with a
reduced-motion presentation for players who request it.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run typecheck
npm test
npm run build
```

## Canon

- [`src/story.txt`](src/story.txt)
- [`src/missions.md`](src/missions.md)

The older Mars documents in `docs/` are retained as historical reference only and are not used by
the Luna runtime.
