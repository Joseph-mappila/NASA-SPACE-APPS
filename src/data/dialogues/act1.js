// ══════════════════════════════════════════
// Act 1 Dialogue Tree — Lunar Outpost
// Junior Astronaut Mission Trainer
// ══════════════════════════════════════════

const act1Dialogues = {

  // ── Intro ─────────────────────────────────────────────────────────
  'intro': {
    id:       'intro',
    speaker:  'system',
    text:     'ARTEMIS LUNAR OUTPOST — 2047\nSol-Equivalent Day 1 of your rotation.',
    next:     'intro_2',
    bg:       'lunar_surface',
  },

  'intro_2': {
    id:      'intro_2',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Welcome aboard, Cadet. I am HAL-Jr, your AI mission assistant. All vitals nominal. Commander Chen is waiting in the briefing room.',
    next:    'chen_welcome',
    bg:      'lunar_interior',
  },

  'chen_welcome': {
    id:      'chen_welcome',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Cadet! Good to have you on board. This is your first solo rotation at Artemis Base. I\'ll be observing your decisions. You\'ll be handling today\'s EVA prep and monitoring the outpost systems.',
    choices: [
      { label: 'Ready, Commander!',       next: 'chen_ready',    effects: [{ stat: 'morale', delta: 5 }] },
      { label: 'What if something goes wrong?', next: 'chen_worry',  effects: [] },
      { label: 'Tell me about the outpost.', next: 'chen_outpost', effects: [{ stat: 'score', delta: 25 }] },
    ],
    bg: 'lunar_interior',
  },

  'chen_ready': {
    id:      'chen_ready',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'That\'s the attitude! First things first — check the Oxygen Garden. Dr. Patel says CO₂ scrubbers were at 94% efficiency this morning. Any drop below 90% and you\'ll need to intervene.',
    next:    'oxygen_check',
    bg:      'lunar_interior',
  },

  'chen_worry': {
    id:      'chen_worry',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'That\'s a healthy instinct, Cadet. All good astronauts plan for failure. You have HAL-Jr, Dr. Patel, and me in your comm. Trust the training. Trust the systems.',
    next:    'oxygen_check',
    effects: [{ stat: 'morale', delta: 10 }],
    bg:      'lunar_interior',
  },

  'chen_outpost': {
    id:      'chen_outpost',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Artemis Base: 12 modules, crew of 6, located at the lunar south pole. We harvest water ice from permanently shadowed craters. Solar arrays provide 48kW. The Moon has no atmosphere — a micrometeorite hit is our most common emergency.',
    next:    'oxygen_check',
    effects: [{ stat: 'score', delta: 50 }],
    unlock:  'codex_artemis_base',
    bg:      'lunar_interior',
  },

  // ── Oxygen Check ─────────────────────────────────────────────────
  'oxygen_check': {
    id:      'oxygen_check',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Cadet, Oxygen Garden reading: CO₂ scrubber at 87%. This is below threshold. Immediate attention required.',
    choices: [
      { label: 'Rush to fix it immediately.',    next: 'oxygen_minigame',   effects: [{ stat: 'oxygen', delta: -5 }] },
      { label: 'Ask HAL-Jr for guidance first.', next: 'hal_oxygen_guide',  effects: [] },
      { label: 'Alert Dr. Patel instead.',       next: 'patel_oxygen',      effects: [{ stat: 'morale', delta: -5 }] },
    ],
    bg: 'oxygen_garden',
    weatherDependent: false,
  },

  'hal_oxygen_guide': {
    id:      'hal_oxygen_guide',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'The plants in Module 4 need nutrient replenishment. Nitrogen and phosphorus levels are low. Use the dispenser to bring them back to green zone. You have approximately 12 minutes before scrubber drops to critical.',
    next:    'oxygen_minigame',
    effects: [{ stat: 'score', delta: 25 }],
    unlock:  'codex_oxygen_garden',
    bg:      'oxygen_garden',
  },

  'patel_oxygen': {
    id:      'patel_oxygen',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'On it, Cadet. Though — next time, handle what\'s in your area of responsibility first. I\'m in the lab. By the time I get there, it could drop to critical. I\'ll guide you remotely instead.',
    next:    'oxygen_minigame',
    bg:      'oxygen_garden',
  },

  // ── Trigger Minigame ─────────────────────────────────────────────
  'oxygen_minigame': {
    id:        'oxygen_minigame',
    speaker:   'system',
    text:      'MINIGAME: Oxygen Garden\nReplenish nutrients to bring CO₂ scrubber back to green.',
    minigame:  'oxygenGarden',
    bg:        'oxygen_garden',
  },

  // ── Post-Minigame (success path) ─────────────────────────────────
  'oxygen_success': {
    id:      'oxygen_success',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Excellent work, Cadet. CO₂ scrubber restored to 96% efficiency. Crew oxygen levels: stable.',
    next:    'eva_prep',
    effects: [{ stat: 'oxygen', delta: 10 }, { stat: 'score', delta: 100 }],
    unlock:  'achievement_green_thumb',
    bg:      'lunar_interior',
  },

  // ── Post-Minigame (fail path) ─────────────────────────────────────
  'oxygen_fail': {
    id:      'oxygen_fail',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Cadet, scrubber hit critical. I\'ve taken manual control from the lab. No permanent damage, but we need to review your plant care protocol. Health: slight O₂ deficiency recorded.',
    next:    'eva_prep',
    effects: [{ stat: 'health', delta: -10 }, { stat: 'morale', delta: -10 }],
    bg:      'lunar_interior',
  },

  // ── EVA Preparation ──────────────────────────────────────────────
  'eva_prep': {
    id:      'eva_prep',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Good work on life support. Now: suit up for your first EVA. You\'ll be collecting regolith samples near the south crater rim. Check your suit seals carefully — the Moon has zero atmosphere.',
    choices: [
      { label: 'Double-check every seal.',      next: 'eva_careful',    effects: [{ stat: 'score', delta: 50 }] },
      { label: 'Quick check — I\'ve got this.', next: 'eva_reckless',   effects: [{ stat: 'health', delta: -15 }] },
      { label: 'Ask about the regolith mission.', next: 'eva_science',  effects: [{ stat: 'score', delta: 75 }] },
    ],
    bg: 'lunar_surface',
  },

  'eva_careful': {
    id:      'eva_careful',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'That\'s proper procedure. All seals green. Pressurizing. You\'re go for EVA, Cadet. Good hunting out there.',
    next:    'eva_outside',
    effects: [],
    bg:      'lunar_surface',
  },

  'eva_reckless': {
    id:      'eva_reckless',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'WARNING: Suit seal integrity at Sector 7-B: 92%. Recommended minimum is 98%. Micrometeorite vulnerability elevated. Continuing with EVA is not advised.',
    choices: [
      { label: 'Abort and re-check the seals.', next: 'eva_careful',  effects: [{ stat: 'health', delta: 10 }] },
      { label: 'Proceed anyway — 92% is fine.', next: 'eva_incident', effects: [{ stat: 'health', delta: -20 }] },
    ],
    bg: 'lunar_surface',
  },

  'eva_science': {
    id:      'eva_science',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Lunar regolith is incredibly abrasive — it\'s sharp at the microscopic level because there\'s no wind erosion on the Moon. The Apollo astronauts found it clogged everything. We\'re collecting samples to study ice mixing in the south pole craters — potential water source for future missions!',
    next:    'eva_careful',
    effects: [{ stat: 'score', delta: 75 }],
    unlock:  'codex_lunar_regolith',
    bg:      'lunar_surface',
  },

  'eva_incident': {
    id:      'eva_incident',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Micrometeorite impact detected on Sector 7-B. Suit breach — minor air loss. Initiating emergency seal protocol. EVA REPAIR MINIGAME REQUIRED.',
    next:    'eva_repair_minigame',
    effects: [{ stat: 'health', delta: -15 }, { stat: 'oxygen', delta: -20 }],
    bg:      'lunar_surface',
  },

  // ── EVA Repair Minigame ──────────────────────────────────────────
  'eva_repair_minigame': {
    id:       'eva_repair_minigame',
    speaker:  'system',
    text:     'MINIGAME: EVA Suit Repair\nMatch the wire connectors before oxygen drops to zero!',
    minigame: 'evaRepair',
    bg:       'lunar_surface',
  },

  'eva_repair_success': {
    id:      'eva_repair_success',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Incredible work under pressure, Cadet. Suit integrity restored. Complete your sample collection and return to base.',
    next:    'eva_outside',
    effects: [{ stat: 'score', delta: 150 }, { stat: 'health', delta: 5 }],
    unlock:  'achievement_first_eva',
    bg:      'lunar_surface',
  },

  'eva_repair_fail': {
    id:      'eva_repair_fail',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Abort EVA. I\'m sending the rescue rover. This is what emergency protocols are for — no shame, Cadet. We train for exactly this.',
    next:    'act1_end',
    effects: [{ stat: 'health', delta: -25 }, { stat: 'morale', delta: -15 }],
    bg:      'lunar_surface',
  },

  // ── EVA Success ──────────────────────────────────────────────────
  'eva_outside': {
    id:      'eva_outside',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'EVA in progress. You can see the Earth from here — 384,400 km away. Regolith samples collected: 3 of 5. Interesting: Sector C shows higher ice concentration than expected.',
    choices: [
      { label: 'Collect extra samples from Sector C.', next: 'eva_extra_samples', effects: [{ stat: 'score', delta: 100 }] },
      { label: 'Stick to the original plan.',          next: 'eva_return',        effects: [] },
    ],
    unlock: 'achievement_homesick',
    bg:     'lunar_surface',
  },

  'eva_extra_samples': {
    id:      'eva_extra_samples',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Excellent initiative! This ice data could be critical for Artemis water production. Dr. Chen is going to be pleased. That\'s a potential research paper right there, Cadet.',
    next:    'eva_return',
    effects: [{ stat: 'score', delta: 100 }, { stat: 'morale', delta: 10 }],
    unlock:  'codex_lunar_ice',
    bg:      'lunar_surface',
  },

  'eva_return': {
    id:      'eva_return',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Outstanding EVA, Cadet. Time to head back to the airlock. Solar flare warning — not dangerous at our latitude but a reminder: deep space is not forgiving.',
    next:    'act1_end',
    effects: [{ stat: 'oxygen', delta: -10 }],
    bg:      'lunar_surface',
  },

  // ── Act 1 End ────────────────────────────────────────────────────
  'act1_end': {
    id:      'act1_end',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Day 1 complete, Cadet. You\'ve demonstrated {score_adjective} decision-making. Earth Control has approved your transfer to the Ares Transit Ship. Next stop: Mars. Get some rest.',
    next:    null, // triggers Act 1 Summary screen
    isActEnd: true,
    act:     1,
    bg:      'lunar_interior',
  },
};

export default act1Dialogues;
