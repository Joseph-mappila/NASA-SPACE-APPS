# Visual and Motion Guide

## Goal

Create the feeling of a carefully illustrated children’s science story, not a dashboard and not a collection of unrelated game-jam assets.

## Visual principles

- Consistency beats detail.
- Large imagery, short text, generous empty space.
- One dominant focal point per frame.
- Interactive controls look like part of the same habitat.
- Science sources are available without interrupting the story.
- Motion clarifies state; it is never decorative noise.

## Art bible to freeze before bulk generation

Define and save:

```text
illustration medium/style description
Mars terrain and sky palette
habitat exterior/interior layout
astronaut reference sheet
suit colors and markings
crop appearance
lighting direction
camera distance and lens feeling
aspect ratio
negative constraints
```

Do not prompt for a living artist’s style.

## Asset budget

- 1 cover image.
- 1 prologue image.
- 2 images or states per chapter.
- 1 epilogue image with small state variations.
- Total target: 8–10 coherent illustrations.

Prefer changing lighting, overlays, particles, and crops on an existing scene over generating a completely different location for every sentence.

## Image-generation workflow

1. Produce the character/suit reference first.
2. Produce one canonical habitat exterior and one interior control area.
3. Lock palette, aspect ratio, and visual language.
4. Use image/reference conditioning for each scene.
5. Check hands, tools, cables, suit hardware, text-like artifacts, and room continuity.
6. Remove all generated lettering and logos.
7. Export high-quality source, then optimize local WebP/AVIF versions.
8. Record tool, prompt owner, date, and usage terms in `ATTRIBUTIONS.md`.

## Scrollytelling method

The visual stage stays fixed while scroll steps change state:

```text
fixed full-viewport image stage
absolute stacked images
active image opacity: 1
inactive image opacity: 0
long scroll steps trigger active scene
sticky chapter label and compact resource ribbon
```

Use 500–900 ms crossfades. Add only slight pan/scale/parallax so children can still follow the image.

Respect `prefers-reduced-motion`: replace parallax and large movement with simple fades.

## Typography

- Use at most two font families.
- Story display font: warm and distinctive but highly legible.
- UI/body font: clean sans-serif with broad language support.
- Keep story text as HTML, never inside images.
- Avoid all-caps paragraphs.
- Minimum comfortable mobile body size: approximately 18 px.
- Maintain strong contrast over every image using controlled gradients or text cards.

Choose fonts only after checking their licenses and add them to `ATTRIBUTIONS.md`.

## Minigame styling

Do not use unrelated pixel-art panels if the story is painterly.

Preferred structure:

- illustrated close-up background;
- SVG controls on top;
- subtle outlines and large hit areas;
- physical labels, warning markings, and simple animation;
- the same palette and typography as the story.

The three interactions may share control components:

- valve/knob;
- cable/socket;
- breaker/button;
- gauge/progress indicator.

## NASA background shuffle

Use a curated local set rather than arbitrary API results.

- Select once per session, not on every chapter.
- Add a dark overlay so the opening remains readable.
- Show image credit/source in an accessible details control.
- Do not use NASA logos.
- Avoid identifiable people and third-party media unless rights are clear.

## Audio

- One quiet ambience layer.
- Short UI and system sounds.
- Optional narration.
- Alarm sounds remain gentle enough for children.
- All critical audio has a visual equivalent.
- Provide master mute and separate narration/effects controls if time allows.

## Visual QA checklist

- [ ] Astronaut, suit, habitat, and crop remain visually consistent.
- [ ] No generated text, logos, extra fingers, impossible tools, or changing room geometry.
- [ ] Interactive controls are clearly distinguishable.
- [ ] Text remains readable on phone and desktop.
- [ ] Cropping works at common aspect ratios.
- [ ] Reduced-motion mode remains understandable.
- [ ] Every NASA image displays appropriate credit.
- [ ] Final assets are compressed and preload responsibly.

