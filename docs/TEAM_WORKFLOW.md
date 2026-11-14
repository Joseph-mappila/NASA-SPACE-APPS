# Team Workflow and Hack-Day Board

## First meeting — 30 minutes maximum

Decide:

- final working title;
- astronaut name and role;
- one crop;
- four resource labels;
- chapter owners;
- visual style sentence and palette;
- NASA sources;
- deployment owner;
- Git branching and review rules.

Do not spend this meeting polishing dialogue or debating stretch goals.

## Suggested ownership

### Integration lead

- Creates the Vite project and repository rules.
- Owns shared types, app shell, merges, deployment.
- Prevents duplicate libraries and conflicting architecture.

### Scrollytelling developer

- Implements fixed stage, steps, transitions, navigation, responsive behavior.
- Builds the reusable chapter component.

### Gameplay developer

- Implements persistent state and minigame interface.
- Builds Chapter 2 first, then the other interactions.

### Narrative lead

- Writes all final story and dialogue.
- Maintains age-appropriate language and pacing.
- Approves every text change.

### Science/data lead

- Selects NASA records and crop study facts.
- Creates local fixtures and source drawers.
- Reviews every scientific claim and citation.

### Visual/QA/pitch lead

- Maintains reference sheet and image consistency.
- Owns optimization, audio, accessibility testing, credits, demo, and pitch.

## Branching

Recommended:

```text
main                 always deployable
feature/story-shell
feature/game-state
feature/shelter-game
feature/greenhouse-game
feature/blackout-game
feature/content-art
```

- Pull/rebase from `main` before handing work off.
- Keep commits small and named by outcome.
- One reviewer for shared architecture or resource-rule changes.
- Never force-push a branch another teammate is using.

## Shared contracts to freeze early

Before parallel work, agree on:

- `GameState`;
- chapter/slide data shape;
- minigame result shape;
- asset naming;
- NASA citation shape;
- CSS tokens for colors, spacing, typography, and z-index.

## Asset naming

```text
public/
  art/
    cover/
    prologue/
    chapter-1/
    chapter-2/
    chapter-3/
    endings/
  audio/
  nasa/
  data/
```

Use lowercase kebab-case filenames. Do not commit files named `final-final-2.png`.

## Checkpoints

### Checkpoint A — architecture

- App runs locally.
- Public deployment works.
- Placeholder story scrolls.
- Resource state survives chapter transitions.

### Checkpoint B — vertical slice

- Chapter 2 is playable end to end.
- It includes choice, minigame, consequence, and NASA source.
- Phone and desktop both work.

### Checkpoint C — content complete

- All three chapters use placeholders or final art.
- Ending reflects persistent state.
- No missing citations.

### Checkpoint D — feature freeze

- No new features.
- Only critical fixes, polish, accessibility, performance, and submission work.

## Daily communication

Use a short check-in every 2–3 hours:

```text
Done:
Next:
Blocked:
Files/contracts changed:
```

If blocked for more than 20 minutes, ask the integration lead or pair with someone. Do not silently redesign a shared system.

## Quality gates

Before merge:

- build passes;
- no API keys;
- no unlicensed asset;
- no scientific claim without a source note;
- keyboard/touch path still works;
- existing chapter remains playable;
- image sizes are reasonable;
- console has no repeated errors.

## Submission responsibilities

Reserve one person and several hours for:

- project title and summary;
- problem/solution description;
- NASA data explanation;
- source and asset references;
- public final-project link;
- ≤30-second demo or ≤7-slide deck;
- English text/captions;
- pitch rehearsal and backup recording.

