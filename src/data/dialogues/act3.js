// ══════════════════════════════════════════
// Act 3 Dialogue Tree — Ares Outpost (Mars)
// Junior Astronaut Mission Trainer
// ══════════════════════════════════════════

const act3Dialogues = {

  // ── Mars Touchdown ────────────────────────────────────────────────
  'act3_intro': {
    id:       'act3_intro',
    speaker:  'system',
    text:     'ELYSIUM PLANITIA, MARS — 2047\nTouchdown confirmed. Gravity: 0.38g. Atmospheric pressure: 782 Pa.',
    glossary: {
      'Elysium Planitia': {
        simple: 'A broad, smooth plain near the Martian equator, ideal for safe landing and surface operations.',
        deep: 'Elysium Planitia is the second largest volcanic region on Mars. NASA selected it for the InSight lander because its flat, smooth basalt plains offered optimal landing safety and solar power conditions.',
        source: 'NASA InSight Mission — Landing Site',
      },
    },
    next:     'act3_chen_welcome',
    bg:       'mars_surface',
  },

  'act3_chen_welcome': {
    id:      'act3_chen_welcome',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Look out that portal, Cadet. Red dunes as far as the eye can see under a salmon-pink sky. We are standing on Mars. You\'ve completed lunar training and deep space transit — now we build.',
    choices: [
      { label: 'It\'s an honor to stand on Mars, Commander.', next: 'act3_chen_ready', effects: [{ stat: 'morale', delta: 15 }] },
      { label: 'How does 0.38g gravity feel compared to the Moon?', next: 'act3_chen_gravity', effects: [{ stat: 'score', delta: 25 }] },
      { label: 'What is our immediate outpost priority?', next: 'act3_chen_priority', effects: [{ stat: 'score', delta: 35 }] },
    ],
    bg: 'mars_surface',
  },

  'act3_chen_ready': {
    id:      'act3_chen_ready',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'The honor is earned. Ares Outpost Base Module 1 is pressurized and waiting 800 meters northeast. We need to unload vital supplies from the descent lander before Martian sunset.',
    next:    'act3_patel_brief',
    bg:      'mars_surface',
  },

  'act3_chen_gravity': {
    id:      'act3_chen_gravity',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Mars gravity (0.38g) is more than double the Moon (0.16g). You\'ll feel solid on your boots, but lifting cargo is still noticeably easier. Just watch your momentum.',
    next:    'act3_patel_brief',
    effects: [{ stat: 'score', delta: 30 }],
    bg:      'mars_surface',
  },

  'act3_chen_priority': {
    id:      'act3_chen_priority',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Power and habitat linkage. InSight atmospheric sensors show our local pressure is 782 Pa — less than 1% of Earth. Without our pressurized dome, boiling fluids and sub-zero cold would be fatal within seconds.',
    glossary: {
      'InSight': {
        simple: 'A NASA robotic lander that monitored daily Martian weather, seismic activity, and interior heat flow.',
        deep: 'Operating at Elysium Planitia from 2018 to 2022, InSight\'s TWINS weather package gathered over four continuous Earth years of wind, atmospheric pressure, and temperature data.',
        source: 'NASA — InSight Mars Lander',
      },
    },
    next:    'act3_patel_brief',
    effects: [{ stat: 'score', delta: 40 }],
    bg:      'mars_surface',
  },

  // ── Medical & Environmental Check ────────────────────────────────
  'act3_patel_brief': {
    id:      'act3_patel_brief',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Cadet, initial airlock suits check. Martian soil contains toxic chlorine perchlorates — ensure suit de-dusting blowers are calibrated at the habitat entrance. We cannot allow dust inside our living quarters.',
    glossary: {
      'perchlorates': {
        simple: 'Toxic, chlorine-rich chemical salts common in Martian soil that are harmful to thyroid and lung health.',
        deep: 'Discovered by NASA\'s Phoenix and Curiosity missions, perchlorates make unwashed Martian dust dangerous to inhale. However, perchlorates can also be broken down into oxygen and used in rocket propellants.',
        source: 'NASA — Mars Soil Geochemistry',
      },
    },
    choices: [
      { label: 'Calibrate electrostatic de-dusting protocols.', next: 'act3_dust_calibrated', effects: [{ stat: 'health', delta: 10 }, { stat: 'score', delta: 40 }] },
      { label: 'Check the MOXIE oxygen generation system.', next: 'act3_moxie_check', effects: [{ stat: 'oxygen', delta: 15 }] },
    ],
    unlock:  'codex_mars_temperature',
    bg:      'mars_surface',
  },

  'act3_dust_calibrated': {
    id:      'act3_dust_calibrated',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Electrostatic scrubbers verified. Fine Martian dust is statically charged and clings to everything. Proper mitigation saves lung health and mechanical seals.',
    next:    'act3_hal_alert',
    effects: [{ stat: 'score', delta: 30 }],
    unlock:  'codex_mars_dust',
    bg:      'mars_surface',
  },

  'act3_moxie_check': {
    id:      'act3_moxie_check',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'MOXIE unit running at 100% efficiency. Extracting breathable O₂ directly from atmospheric carbon dioxide (CO₂ → O₂ + CO). Habitat reserves filling.',
    glossary: {
      'MOXIE': {
        simple: 'A NASA instrument that produces breathable oxygen by electrochemically splitting Martian atmospheric carbon dioxide.',
        deep: 'Tested aboard the Perseverance rover, MOXIE (Mars Oxygen ISRU Experiment) proved that future human missions can generate their breathing air and rocket oxidizer locally instead of shipping it from Earth.',
        source: 'NASA — MOXIE Experiment on Perseverance',
      },
    },
    next:    'act3_hal_alert',
    effects: [{ stat: 'oxygen', delta: 10 }],
    bg:      'mars_surface',
  },

  // ── Crisis: Approaching Dust Storm ───────────────────────────────
  'act3_hal_alert': {
    id:      'act3_hal_alert',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'WARNING: InSight atmospheric sensor network reports a barometric drop to 680 Pa. Wind speed spiking to 28 m/s. A regional Martian dust storm is bearing down on our landing coordinates!',
    next:    'act3_chen_orders',
    bg:      'mars_surface',
  },

  'act3_chen_orders': {
    id:      'act3_chen_orders',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'The descent lander still holds our auxiliary power cells and core mineral survey caches. We can\'t leave them out in the storm! Cadet, you\'re taking the pressurized rover. Navigate the route to the habitat before visibility hits zero!',
    choices: [
      { label: 'I\'ll chart the safest route and retrieve the gear!', next: 'act3_rover_launch', effects: [{ stat: 'morale', delta: 10 }] },
      { label: 'What are the main terrain hazards out there?', next: 'act3_hazard_intel', effects: [{ stat: 'score', delta: 30 }] },
    ],
    bg: 'mars_surface',
  },

  'act3_hazard_intel': {
    id:      'act3_hazard_intel',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Watch for impact craters with loose regolith, basalt boulder fields that can puncture tires, and steep sand dunes. Also, keep sensors active for geological mineral caches on your path!',
    glossary: {
      'regolith': {
        simple: 'Loose surface dust and rock fragments covering bedrock, shaped by billions of years of meteorite impacts.',
        deep: 'Unlike Earth soil, Martian regolith contains no organic matter. It is extremely fine, abrasive, and easily lifted by wind storms into atmospheric dust hazes.',
        source: 'NASA — Martian Surface Geology',
      },
      'basalt': {
        simple: 'Dark, heavy volcanic rock formed from cooled lava that covers much of the Martian crust.',
        deep: 'Most of the Martian plains, including Elysium Planitia, consist of basaltic lava flows similar to oceanic crust and Hawaiian volcanic rocks on Earth.',
        source: 'NASA — Mars Volcanism',
      },
    },
    next:    'act3_rover_launch',
    effects: [{ stat: 'score', delta: 40 }],
    bg:      'mars_surface',
  },

  // ── Trigger Minigame: Rover Navigation ───────────────────────────
  'act3_rover_launch': {
    id:        'act3_rover_launch',
    speaker:   'system',
    text:      'MINIGAME: Martian Rover Navigation\nPlot your route across the 6x6 grid from Lander (🚀) to Ares Habitat (🏕️). Avoid craters & boulders!',
    minigame:  'navigation',
    next:      'act3_rover_success',
    onSuccess: 'act3_rover_success',
    onFail:    'act3_rover_fail',
    bg:        'mars_surface',
  },

  // ── Post-Minigame Success ────────────────────────────────────────
  'act3_rover_success': {
    id:      'act3_rover_success',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Rover docked at Habitat Bay 2! All power modules secured and mineral samples logged into the science database. Superb driving through that dust front, Cadet!',
    next:    'act3_habitat_secure',
    effects: [{ stat: 'score', delta: 160 }, { stat: 'morale', delta: 20 }],
    unlock:  'achievement_storm_survivor',
    bg:      'lunar_interior', // habitat interior
  },

  'act3_rover_fail': {
    id:      'act3_rover_fail',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Rover battery stalled out on a dune ridge. Dr. Patel and I deployed the emergency winch to tow you in just as the storm hit. Hull took minor damage, but you\'re alive.',
    next:    'act3_habitat_secure',
    effects: [{ stat: 'health', delta: -15 }, { stat: 'morale', delta: -10 }],
    bg:      'lunar_interior',
  },

  // ── Storm Outside Habitat ────────────────────────────────────────
  'act3_habitat_secure': {
    id:      'act3_habitat_secure',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Ares Outpost Habitat locked and fully pressurized. External dust storm winds howling at 32 m/s outside our reinforced quartz domes. Internal life support: 100% stable.',
    choices: [
      { label: 'Look through the observation dome at the storm.', next: 'act3_watch_storm', effects: [{ stat: 'morale', delta: 10 }, { stat: 'score', delta: 30 }] },
      { label: 'Review our science survey results.', next: 'act3_review_science', effects: [{ stat: 'score', delta: 50 }] },
    ],
    bg: 'lunar_interior',
  },

  'act3_watch_storm': {
    id:      'act3_watch_storm',
    speaker: 'medic',
    name:    'Dr. Patel',
    text:    'Listen to that wind. Centuries ago, humanity looked up at Mars as just a red speck of light in the night sky. Now, we are warm and thriving inside its very sands.',
    next:    'act3_graduation',
    effects: [{ stat: 'morale', delta: 15 }],
    bg:      'lunar_interior',
  },

  'act3_review_science': {
    id:      'act3_review_science',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'Hematite, olivine, and hydrated sulfate clays identified in our retrieved samples. This confirms ancient groundwater chemistry at Elysium Planitia billions of years ago!',
    glossary: {
      'Hematite': {
        simple: 'An iron-oxide mineral often called "grey hematite" that typically crystallizes in the presence of liquid water.',
        deep: 'When the Opportunity rover discovered spherical hematite deposits ("blueberries") at Meridiani Planum, it provided the first conclusive proof of prolonged liquid water on ancient Mars.',
        source: 'NASA — Mars Exploration Rovers',
      },
      'olivine': {
        simple: 'A greenish magnesium-iron silicate volcanic mineral that rapidly weathers away when exposed to water.',
        deep: 'The presence of unweathered olivine proves that certain regions of Mars have remained cold and hyper-arid for billions of years since volcanism ceased.',
        source: 'NASA — Mars Reconnaissance Orbiter (CRISM)',
      },
    },
    next:    'act3_graduation',
    effects: [{ stat: 'score', delta: 60 }],
    unlock:  'achievement_rock_star',
    bg:      'lunar_interior',
  },

  // ── Mission Graduation & Finale ──────────────────────────────────
  'act3_graduation': {
    id:      'act3_graduation',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'Cadet {playerName}, attention! Earth Mission Control and the Artemis-Ares Joint Command have reviewed your full mission log. You managed life support on the Moon, survived solar storm radiation in deep space, and conquered the Martian surface.',
    next:    'act3_promotion',
    effects: [{ stat: 'score', delta: 100 }],
    bg:      'lunar_interior',
  },

  'act3_promotion': {
    id:      'act3_promotion',
    speaker: 'commander',
    name:    'Commander Chen',
    text:    'You are no longer a Junior Astronaut. By authority of NASA Expedition Command, I hereby promote you to Senior Deep Space Mission Specialist! Welcome home to Mars.',
    next:    'act3_end',
    effects: [{ stat: 'score', delta: 200 }, { stat: 'morale', delta: 25 }],
    unlock:  'achievement_mission_commander',
    bg:      'lunar_interior',
  },

  // ── Act 3 End (Grand Finale) ─────────────────────────────────────
  'act3_end': {
    id:      'act3_end',
    speaker: 'hal',
    name:    'HAL-Jr',
    text:    'MISSION COMPLETE: Junior Astronaut Mission Trainer concluded. All primary objectives accomplished. Generating final expedition dossier.',
    next:    null,
    isActEnd: true,
    act:     3,
    bg:      'mars_surface',
  },
};

export default act3Dialogues;
