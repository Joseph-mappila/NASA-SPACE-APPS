// ══════════════════════════════════════════
// Act 2 Dialogue Tree — Deep Space Transit
// Junior Astronaut Mission Trainer
// ══════════════════════════════════════════

const act2Dialogues = {

  // ── Intro & Transit Briefing ──────────────────────────────────────
  'act2_intro': {
    id:       'act2_intro',
    speaker:  'system',
    text:     'ARES TRANSIT SHIP — EN ROUTE TO MARS\nDay 42 of 180. Distance to Earth: 38,000,000 km.',
    next:     'act2_hal_greeting',
    bg:       'deep_space',
  },

  'act2_hal_greeting': {
    id:      'act2_hal_greeting',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Good morning, Cadet. We have officially crossed the orbital midpoint of our Hohmann transfer trajectory. Earth is now a pale blue dot in our rear sensors.',
    next:    'act2_chen_welcome',
    unlock:  'codex_ares_transit',
    bg:      'transit_interior',
  },

  'act2_chen_welcome': {
    id:      'act2_chen_welcome',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Cadet, your lunar rotation was impressive, but deep space transit is a different beast. No magnetosphere. No quick rescue. How are you holding up with the zero-g routine?',
    choices: [
      { label: 'Focused and ready for duty, Commander.', next: 'act2_chen_ready', effects: [{ stat: 'morale', delta: 5 }] },
      { label: 'The quiet out here is surreal.', next: 'act2_chen_philosophical', effects: [{ stat: 'morale', delta: 10 }] },
      { label: 'What is our primary risk right now?', next: 'act2_chen_threats', effects: [{ stat: 'score', delta: 25 }] },
    ],
    bg: 'transit_interior',
  },

  'act2_chen_ready': {
    id:      'act2_chen_ready',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Good. Discipline keeps crews alive on 6-month voyages. Dr. Patel is running bone density checks in the medical bay, while HAL-Jr monitors solar irradiance.',
    next:    'act2_patel_checkin',
    bg:      'transit_interior',
  },

  'act2_chen_philosophical': {
    id:      'act2_chen_philosophical',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Carl Sagan called it our cosmic perspective. Looking back at Earth from 38 million kilometers away changes every astronaut who has ever made this voyage.',
    next:    'act2_patel_checkin',
    effects: [{ stat: 'morale', delta: 10 }, { stat: 'score', delta: 30 }],
    bg:      'deep_space',
  },

  'act2_chen_threats': {
    id:      'act2_chen_threats',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Solar radiation and power loss. As we travel away from the Sun toward Mars, solar irradiance drops from 1,361 W/m² to under 600 W/m². We need every single photon our arrays can harvest.',
    next:    'act2_patel_checkin',
    effects: [{ stat: 'score', delta: 40 }],
    bg:      'transit_interior',
  },

  // ── Medical & Life Support Check ─────────────────────────────────
  'act2_patel_checkin': {
    id:      'act2_patel_checkin',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Cadet, routine dosimeter check. Cosmic ray background levels are within allowable safety limits, but space weather stations near Venus are reporting elevated solar flare activity.',
    choices: [
      { label: 'Should we run pre-flare drills?', next: 'act2_flare_drill', effects: [{ stat: 'score', delta: 35 }] },
      { label: 'How much protection does our shelter give?', next: 'act2_shelter_info', effects: [] },
    ],
    bg: 'transit_interior',
  },

  'act2_flare_drill': {
    id:      'act2_flare_drill',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Proactive thinking. In a Coronal Mass Ejection, high-energy protons can arrive in under 30 minutes. The storm shelter is surrounded by our water reclamation tanks — water is an excellent hydrogen-rich radiation shield.',
    next:    'act2_alarm_trigger',
    effects: [{ stat: 'score', delta: 30 }, { stat: 'morale', delta: 5 }],
    unlock:  'codex_solar_radiation',
    bg:      'transit_interior',
  },

  'act2_shelter_info': {
    id:      'act2_shelter_info',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'The central storm shelter reduces radiation by 70%. It is cramped, but safe. Let us hope we don\'t have to spend three days crammed inside it.',
    next:    'act2_alarm_trigger',
    unlock:  'codex_solar_radiation',
    bg:      'transit_interior',
  },

  // ── Crisis: Solar Particle Event Alert ───────────────────────────
  'act2_alarm_trigger': {
    id:      'act2_alarm_trigger',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'PRIORITY ALERT: Solar Dynamics Observatory confirms an X-3.8 Class Solar Flare erupting along our orbital plane. Coronal mass ejection arriving in 90 seconds. Radiation flux rising.',
    next:    'act2_emergency_decision',
    bg:      'deep_space',
  },

  'act2_emergency_decision': {
    id:      'act2_emergency_decision',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'All crew, scramble to storm shelters! Cadet, you have the bridge console. We need to decide how to allocate auxiliary reserve power during the flare.',
    choices: [
      { label: 'Divert power to electromagnetic shielding.', next: 'act2_route_shields', effects: [{ stat: 'health', delta: 10 }, { stat: 'score', delta: 50 }] },
      { label: 'Keep life support and O₂ scrubbers at max.', next: 'act2_route_lifesupport', effects: [{ stat: 'oxygen', delta: 10 }] },
      { label: 'Lock down non-essential systems and feather solar arrays.', next: 'act2_route_feather', effects: [{ stat: 'score', delta: 75 }] },
    ],
    bg: 'transit_interior',
  },

  'act2_route_shields': {
    id:      'act2_route_shields',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Electromagnetic deflection grid active. Crew radiation exposure minimized. However, the charged particle wave has caused electromagnetic torque on array gimbals. Solar panels desynchronized!',
    next:    'act2_solar_prep',
    effects: [{ stat: 'health', delta: 5 }],
    bg:      'transit_interior',
  },

  'act2_route_lifesupport': {
    id:      'act2_route_lifesupport',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Air quality stable in the shelter. But particle wave impact just knocked our solar array orientation offline. Batteries are discharging rapidly!',
    next:    'act2_solar_prep',
    effects: [{ stat: 'oxygen', delta: 5 }],
    bg:      'transit_interior',
  },

  'act2_route_feather': {
    id:      'act2_route_feather',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Smart maneuver! Feathering protected the photovoltaic cells from physical impact. Now we must re-acquire the Sun vector before our capacitors drain to zero.',
    next:    'act2_solar_prep',
    effects: [{ stat: 'score', delta: 50 }],
    bg:      'transit_interior',
  },

  // ── Trigger Minigame: Solar Panel Alignment ──────────────────────
  'act2_solar_prep': {
    id:        'act2_solar_prep',
    speaker:   'system',
    text:      'EMERGENCY MINIGAME: Solar Panel Alignment\nRe-align Array Wings Alpha, Beta, and Gamma to the Sun vector before auxiliary batteries fail!',
    minigame:  'solarPanel',
    next:      'act2_solar_success',
    onSuccess: 'act2_solar_success',
    onFail:    'act2_solar_fail',
    bg:        'deep_space',
  },

  // ── Post-Minigame Success ────────────────────────────────────────
  'act2_solar_success': {
    id:      'act2_solar_success',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'All solar array wings locked at 100% efficiency. Ship bus voltage stabilized. Auxiliary capacitors charging. Storm intensity subsiding.',
    next:    'act2_chen_praise',
    effects: [{ stat: 'score', delta: 150 }, { stat: 'morale', delta: 15 }],
    unlock:  'achievement_power_saver',
    bg:      'transit_interior',
  },

  'act2_chen_praise': {
    id:      'act2_chen_praise',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Outstanding calm under fire, Cadet. If you hadn\'t recovered that array alignment, we\'d be coasting cold for the next two months. You just saved this mission.',
    next:    'act2_mars_approach',
    effects: [{ stat: 'morale', delta: 10 }, { stat: 'score', delta: 50 }],
    bg:      'transit_interior',
  },

  // ── Post-Minigame Fail ───────────────────────────────────────────
  'act2_solar_fail': {
    id:      'act2_solar_fail',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Batteries dipped into emergency reserves. HAL-Jr had to dump life support to non-critical quarters to keep navigation alive. We survived, but it was too close for comfort.',
    next:    'act2_mars_approach',
    effects: [{ stat: 'health', delta: -15 }, { stat: 'morale', delta: -15 }],
    bg:      'transit_interior',
  },

  // ── Approaching Mars & Act 2 Climax ──────────────────────────────
  'act2_mars_approach': {
    id:      'act2_mars_approach',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Day 178 of transit. Optical telemetry lock achieved: Mars is filling the forward viewport. Olympus Mons and Valles Marineris clearly visible.',
    choices: [
      { label: 'Look through the forward observation dome.', next: 'act2_view_mars', effects: [{ stat: 'morale', delta: 15 }, { stat: 'score', delta: 40 }] },
      { label: 'Review Mars descent checklist with Commander.', next: 'act2_prep_descent', effects: [{ stat: 'score', delta: 60 }] },
    ],
    bg: 'mars_surface',
  },

  'act2_view_mars': {
    id:      'act2_view_mars',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'There she is: the Red Planet. Iron oxide rust in the dust, thin carbon dioxide skies, and the home of the Ares Outpost. We made it across the void, Cadet.',
    next:    'act2_end',
    effects: [{ stat: 'morale', delta: 10 }],
    bg:      'mars_surface',
  },

  'act2_prep_descent': {
    id:      'act2_prep_descent',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Aerocapture burns scheduled. Heat shields checked. Prepare for atmospheric entry into Elysium Planitia. Next stop: Martian soil.',
    next:    'act2_end',
    effects: [{ stat: 'score', delta: 50 }],
    bg:      'mars_surface',
  },

  // ── Act 2 End ────────────────────────────────────────────────────
  'act2_end': {
    id:      'act2_end',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Transit phase concluded. You have proven yourself ready for deep space operations, Cadet {playerName}. Ares Outpost Control has granted landing clearance!',
    next:    null,
    isActEnd: true,
    act:     2,
    bg:      'mars_surface',
  },
};

export default act2Dialogues;
