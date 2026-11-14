import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore }   from '../store/gameStore';
import { fetchNASAImages, fetchMarsRoverPhotos, fetchEPICImage } from '../api/nasa';
import { useMarsWeather } from '../api/marsWeather';
import { getDialogueNode } from '../data/dialogues';
import HUD                from '../components/HUD/HUD';
import DialogueBox        from '../components/DialogueBox/DialogueBox';
import WeatherAlert       from '../components/WeatherAlert/WeatherAlert';
import MinigameRouter     from '../components/Minigames/MinigameRouter';
import soundEngine        from '../utils/audio';
import styles             from './GameScreen.module.css';

// Scene → NASA image query map
// Every scene key used in dialogues OR the simulator must have an entry here.
const SCENE_QUERIES = {
  // ── Act 1: Lunar ──
  moon:             { type: 'library', query: 'lunar surface moon astronaut apollo' },
  lunar_surface:    { type: 'library', query: 'lunar surface moon astronaut apollo' },
  lunar_interior:   { type: 'library', query: 'space station interior nasa habitat' },
  hydroponics:      { type: 'library', query: 'plant growth space nasa veggie' },
  oxygen_garden:    { type: 'library', query: 'plant growth space nasa veggie' },
  earth_view:       { type: 'epic' },

  // ── Act 2: Deep Space Transit ──
  deep_space:       { type: 'library', query: 'deep space stars hubble nebula galaxy' },
  transit_interior: { type: 'library', query: 'orion spacecraft interior nasa capsule' },

  // ── Act 3: Mars ──
  mars_surface:     { type: 'mars' },
  mars_colony:      { type: 'library', query: 'mars surface red planet nasa landscape' },

  // ── Default fallback ──
  default:          { type: 'library', query: 'nasa space stars cosmos' },
};

// High-reliability verified NASA asset URLs for instant fallback
const FALLBACK_SCENE_IMAGES = {
  moon:             'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~medium.jpg',
  lunar_surface:    'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~medium.jpg',
  lunar_interior:   'https://images-assets.nasa.gov/image/KSC-03pd2029/KSC-03pd2029~medium.jpg',
  hydroponics:      'https://images-assets.nasa.gov/image/KSC-20180307-PH_CSH01_0015/KSC-20180307-PH_CSH01_0015~medium.jpg',
  oxygen_garden:    'https://images-assets.nasa.gov/image/KSC-20180307-PH_CSH01_0015/KSC-20180307-PH_CSH01_0015~medium.jpg',
  earth_view:       'https://images-assets.nasa.gov/image/as17-148-22742/as17-148-22742~medium.jpg',
  deep_space:       'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001955/GSFC_20171208_Archive_e001955~medium.jpg',
  transit_interior: 'https://images-assets.nasa.gov/image/KSC-03pd2029/KSC-03pd2029~medium.jpg',
  mars_surface:     'https://images-assets.nasa.gov/image/PIA16018/PIA16018~medium.jpg',
  mars_colony:      'https://images-assets.nasa.gov/image/PIA16018/PIA16018~medium.jpg',
  default:          'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001955/GSFC_20171208_Archive_e001955~medium.jpg',
};

export default function GameScreen() {
  const navigate = useNavigate();

  // Store
  const stats          = useGameStore((s) => s.stats);
  const playerName     = useGameStore((s) => s.playerName);
  const currentAct     = useGameStore((s) => s.currentAct);
  const currentScene   = useGameStore((s) => s.currentScene);
  const dialogueId     = useGameStore((s) => s.currentDialogueId);
  const activeMinigame = useGameStore((s) => s.activeMinigame);
  const lastMinigame   = useGameStore((s) => s.lastMinigame);
  const minigameResult = useGameStore((s) => s.minigameResult);
  const applyEffect    = useGameStore((s) => s.applyEffect);
  const setFlag        = useGameStore((s) => s.setFlag);
  const unlockCodex    = useGameStore((s) => s.unlockCodexEntry);
  const unlockAchieve  = useGameStore((s) => s.unlockAchievement);
  const navigateTo     = useGameStore((s) => s.navigateTo);
  const launchMinigame = useGameStore((s) => s.launchMinigame);

  const { weatherEvent, weatherData, refreshWeather } = useMarsWeather(currentAct);

  const [bgImage,       setBgImage]       = useState(null);
  const [bgTransition,  setBgTransition]  = useState(false);
  const [showWeather,   setShowWeather]   = useState(false);
  const [notification,  setNotification]  = useState(null);

  // Load background image for scene
  const loadBgForScene = useCallback(async (scene) => {
    setBgTransition(true);
    const cfg = SCENE_QUERIES[scene] || SCENE_QUERIES.default;

    let url = null;

    try {
      if (cfg.type === 'epic') {
        const epic = await fetchEPICImage();
        url = epic?.url || null;
        // EPIC sometimes fails (CORS, rate limit) — fall through to library
        if (!url) {
          const imgs = await fetchNASAImages('earth from space nasa', 3);
          url = imgs[0]?.url || null;
        }
      } else if (cfg.type === 'library') {
        const imgs = await fetchNASAImages(cfg.query, 5);
        url = imgs[0]?.url || null;
      } else if (cfg.type === 'mars') {
        // fetchMarsRoverPhotos now has its own multi-sol + Image Library fallback
        const photos = await fetchMarsRoverPhotos(4000, null);
        url = photos[0]?.url || null;
      }
    } catch {/* silent */}

    // Universal last-resort: NASA Image Library with a generic space query
    if (!url) {
      try {
        const imgs = await fetchNASAImages('nasa space cosmos stars', 5);
        url = imgs[0]?.url || null;
      } catch {/* silent */}
    }

    // Ultimate guaranteed fallback: Verified NASA asset for the scene
    if (!url) {
      url = FALLBACK_SCENE_IMAGES[scene] || FALLBACK_SCENE_IMAGES.default;
    }

    // Only update if we got something — don't blank out a working image
    if (url) setBgImage(url);
    setTimeout(() => setBgTransition(false), 400);
  }, []);

  useEffect(() => {
    loadBgForScene(currentScene);
  }, [currentScene, loadBgForScene]);

  // Show weather event banner 3s after mount
  useEffect(() => {
    if (weatherEvent) {
      const id = setTimeout(() => setShowWeather(true), 3000);
      return () => clearTimeout(id);
    }
  }, [weatherEvent]);

  // Apply weather event effects once
  useEffect(() => {
    if (weatherEvent?.statEffect) {
      applyEffect([weatherEvent.statEffect]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherEvent?.type]);

  // Current dialogue node
  const currentNode = getDialogueNode(currentAct, dialogueId);

  // Handle dialogue node changes
  useEffect(() => {
    if (!currentNode) return;
    if (currentNode.unlock?.startsWith('codex_')) unlockCodex(currentNode.unlock);
    if (currentNode.unlock?.startsWith('achievement_')) unlockAchieve(currentNode.unlock.replace('achievement_', ''));
    if (currentNode.minigame) launchMinigame(currentNode.minigame);
    if (currentNode.isActEnd) {
      setTimeout(() => navigate('/summary'), 1200);
    }
    if (currentNode.effects) applyEffect(currentNode.effects);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogueId]);

  // Minigame result → next dialogue
  useEffect(() => {
    if (!minigameResult) return;

    if (minigameResult === 'success') {
      soundEngine.playSuccess();
    } else {
      soundEngine.playFail();
    }

    const minigameKey = activeMinigame || lastMinigame || currentNode?.minigame;
    const successMap = {
      oxygenGarden: 'oxygen_success',
      evaRepair:    'eva_repair_success',
      solarPanel:   'act2_solar_success',
      navigation:   'act3_rover_success',
    };
    const failMap = {
      oxygenGarden: 'oxygen_fail',
      evaRepair:    'eva_repair_fail',
      solarPanel:   'act2_solar_fail',
      navigation:   'act3_rover_fail',
    };

    const nextNodeId =
      minigameResult === 'success'
        ? (currentNode?.onSuccess || (minigameKey && successMap[minigameKey]) || 'oxygen_success')
        : (currentNode?.onFail || (minigameKey && failMap[minigameKey]) || 'oxygen_fail');

    if (nextNodeId) {
      navigateTo(currentScene, nextNodeId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minigameResult]);

  function handleChoice(choice) {
    if (choice.effects) applyEffect(choice.effects);
    if (choice.flag)    setFlag(choice.flag);
    const targetNode = getDialogueNode(currentAct, choice.next);
    if (targetNode?.minigame) {
      launchMinigame(targetNode.minigame);
    }
    const nextScene = targetNode?.bg || currentScene;
    navigateTo(nextScene, choice.next);
  }

  function handleNext() {
    const targetKey = currentNode?.next || currentNode?.onSuccess;
    if (targetKey) {
      const targetNode = getDialogueNode(currentAct, targetKey);
      if (targetNode?.minigame) {
        launchMinigame(targetNode.minigame);
      }
      const nextScene = targetNode?.bg || currentScene;
      navigateTo(nextScene, targetKey);
    }
  }

  if (!currentNode) return null;

  const isMinigameActive = Boolean(activeMinigame || currentNode?.minigame);

  return (
    <div
      className={styles.root}
      style={weatherEvent?.bgTint ? { '--weather-tint': weatherEvent.bgTint } : {}}
    >
      {/* NASA Background Image */}
      <AnimatePresence>
        {bgImage && (
          <motion.div
            key={bgImage}
            className={styles.bg}
            initial={{ opacity: 0 }}
            animate={{ opacity: bgTransition ? 0 : 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={bgImage}
              alt="Scene background"
              className={styles.bgImg}
              onError={() => {
                const fallback = FALLBACK_SCENE_IMAGES[currentScene] || FALLBACK_SCENE_IMAGES.default;
                if (bgImage !== fallback) {
                  setBgImage(fallback);
                }
              }}
            />
            {weatherEvent && <div className={styles.weatherTint} style={{ background: weatherEvent.bgTint }} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div className={styles.vignette} />
      <div className="starfield" />

      {/* HUD */}
      <HUD stats={stats} playerName={playerName} onCodex={() => navigate('/codex')} />

      {/* Weather Alert Banner */}
      <AnimatePresence>
        {showWeather && weatherEvent && (
          <WeatherAlert
            event={weatherEvent}
            weatherData={weatherData}
            onDismiss={() => setShowWeather(false)}
          />
        )}
      </AnimatePresence>

      {/* Minigame Overlay */}
      <AnimatePresence>
        {activeMinigame && (
          <motion.div
            className={styles.minigameOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MinigameRouter id={activeMinigame} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue Box */}
      <AnimatePresence mode="wait">
        {!isMinigameActive && !currentNode?.isActEnd && (
          <DialogueBox
            key={currentNode.id}
            node={currentNode}
            playerName={playerName}
            onChoice={handleChoice}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={styles.toast}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
