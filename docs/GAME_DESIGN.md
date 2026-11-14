# Game Design Specification

## Design pillars

1. **Story makes the science matter.**
2. **Every crisis contains a real trade-off.**
3. **The player physically performs the procedure.**
4. **Consequences remain visible in later chapters.**
5. **Failure teaches and rewinds; it does not punish.**

## Player fantasy

“I am a junior mission controller. My decisions and actions can keep a Mars outpost alive.”

## Persistent state

Use a normalized 0–100 scale for presentation. Exact tuning is gameplay abstraction, not a claim about real mission units.

```text
power       Current usable energy reserve
lifeSupport Water/air-system resilience
food        Projected crop/food reserve
rescue      Beacon and rescue-readiness state
```

Also store:

```text
chapter choices
minigame performance
NASA event/source IDs used
accessibility preferences
```

## Choice model

Before each minigame, present no more than three actions. Each action must show a preview:

```text
Route power to shelter
+ Crew safety
- Greenhouse lighting
```

Avoid hidden “correct” answers. At least two approaches should keep the mission viable while producing different sacrifices.

## Minigame contract

Every minigame receives:

```text
chapter context
chosen strategy
accessibility settings
```

It returns:

```text
completion: success | assisted | retry
efficiency: 0–1
mistakes: number
duration: seconds
```

Minigame performance changes efficiency, not whether the child is allowed to continue.

## Chapter 1 interaction — irrigation valves

### Goal

Allocate limited recycled water between crew reserve and mature greenhouse crops.

### Input

- Click/tap plus/minus controls on three valves.
- Optional drag interaction for direct valve movement.
- Arrow-key alternative.

### Feedback

- Water-flow animation.
- Plant moisture indicators.
- Immediate projected outcome preview.

### Learning outcome

Fresh food production consumes water and power; keeping every crop healthy may reduce the safety margin for the crew.

## Chapter 2 interaction — shelter routing

### Goal

Prepare a physically shielded shelter while operating under limited battery power.

### Input

- Select loads to disconnect.
- Click source and destination sockets to reroute power.
- Secure the hatch with either a circular gesture or a hold button.

### Feedback

- Live load total.
- Shelter circulation/communications indicators.
- Greenhouse/laboratory lights visibly switch off.

### Learning outcome

Protecting astronauts during a radiation event can require sacrificing science, communications, or crop lighting.

## Chapter 3 interaction — dark-circuit repair

### Goal

Trace the correct circuit in a partially dark habitat, repair it, then allocate recovered power.

### Input

- Pointer/touch flashlight.
- Focusable circuit nodes for keyboard users.
- Click/tap damaged breaker, then choose the replacement.

### Feedback

- Flashlight reveals cable labels and warning symbols.
- Incorrect selections explain rather than simply deduct points.
- Restored systems illuminate in the story scene.

### Learning outcome

During a power shortage, restoring generation is only half the problem; mission control must still prioritize critical loads.

## Cadet accessibility defaults

- No hard countdown.
- Large targets and generous snapping.
- Pause and replay.
- One instruction at a time.
- Symbols plus labels.
- Audio never carries unique information.
- Reduced-motion setting.
- Keyboard and touch alternatives.
- Optional narration with captions.

## Ending logic

Do not create many branches. Select an ending emphasis from persistent state:

- **Safe but sparse:** high life support, low food/science.
- **Garden preserved:** high food, thinner power margin.
- **Signal secured:** high rescue readiness, sacrificed greenhouse/science.
- **Balanced command:** all critical values above the target.

All successful endings celebrate the child’s reasoning and explain the trade-off.

## Balance rules

- No chapter can make later success mathematically impossible.
- A single mistake cannot erase the entire run.
- “Perfect everything” should be difficult or impossible.
- The safest choice should not always produce the highest final score.
- Playtest explanations, not just completion rates: ask the child why they made the choice.

