import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { fetchRandomAPOD, fetchNASAImages } from '../api/nasa';
import soundEngine from '../utils/audio';
import styles from './MainMenu.module.css';

const TAGLINES = [
  'Your mission begins now.',
  'The Moon is just the first step.',
  '384,400 km from home.',
  'Survive. Learn. Explore.',
];

const FALLBACK_MAIN_BG = {
  url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001955/GSFC_20171208_Archive_e001955~medium.jpg',
  title: 'Deep Space Hubble',
};

export default function MainMenu() {
  const navigate   = useNavigate();
  const resetGame  = useGameStore((s) => s.resetGame);
  const setName    = useGameStore((s) => s.setPlayerName);
  const startAct   = useGameStore((s) => s.startAct);

  const [bgImage,   setBgImage]   = useState(null);
  const [bgLoaded,  setBgLoaded]  = useState(false);
  const [tagline,   setTagline]   = useState(TAGLINES[0]);
  const [nameInput, setNameInput] = useState('');
  const [showName,  setShowName]  = useState(false);
  const [showSim,   setShowSim]   = useState(false);
  const taglineIdx = useRef(0);

  // Rotate taglines
  useEffect(() => {
    const id = setInterval(() => {
      taglineIdx.current = (taglineIdx.current + 1) % TAGLINES.length;
      setTagline(TAGLINES[taglineIdx.current]);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Fetch NASA background with bulletproof multi-tier fallback
  useEffect(() => {
    fetchRandomAPOD(10)
      .then((images) => {
        const spaceImages = images.filter((i) => i.url);
        if (spaceImages.length) {
          setBgImage(spaceImages[Math.floor(Math.random() * spaceImages.length)]);
        } else {
          return fetchNASAImages('deep space nebula hubble galaxy', 6).then((imgs) => {
            if (imgs && imgs.length) {
              const img = imgs[Math.floor(Math.random() * imgs.length)];
              setBgImage({ url: img.url, title: img.title || 'Deep Space' });
            } else {
              setBgImage(FALLBACK_MAIN_BG);
            }
          });
        }
      })
      .catch(() => {
        setBgImage(FALLBACK_MAIN_BG);
      });
  }, []);

  function handleStart() {
    soundEngine.playClick();
    if (!showName) { setShowName(true); return; }
    if (!nameInput.trim()) return;
    resetGame();
    setName(nameInput.trim() || 'Cadet');
    navigate('/game');
  }

  function launchSimAct(act, scene, dialogue) {
    soundEngine.playClick();
    resetGame();
    setName(nameInput.trim() || 'Cadet');
    startAct(act, scene, dialogue);
    setShowSim(false);
    navigate('/game');
  }

  return (
    <div className={styles.root}>
      {/* NASA Background */}
      {bgImage && (
        <motion.div
          className={styles.bg}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: bgLoaded ? 0.35 : 0, scale: 1 }}
          transition={{ duration: 2 }}
        >
          <img
            src={bgImage.url}
            alt={bgImage.title}
            onLoad={() => setBgLoaded(true)}
            onError={() => {
              if (bgImage.url !== FALLBACK_MAIN_BG.url) {
                setBgImage(FALLBACK_MAIN_BG);
              }
            }}
            className={styles.bgImg}
          />
        </motion.div>
      )}

      {/* Starfield (always visible) */}
      <div className="starfield" />

      {/* Content */}
      <div className={styles.content}>
        {/* NASA Badge */}
        <motion.div
          className={styles.nasaBadge}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="font-mono" style={{ color: 'var(--color-lunar)', fontSize: '0.65rem', letterSpacing: '0.15em' }}>
            NASA SPACEAPPS HACKATHON
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          className={styles.titleBlock}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className={styles.title}>
            <span className={styles.titleJunior}>JUNIOR</span>
            <span className={styles.titleMain}>ASTRONAUT</span>
            <span className={styles.titleSub}>MISSION TRAINER</span>
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={tagline}
              className={styles.tagline}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.5 }}
            >
              {tagline}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Mission Stats Row */}
        <motion.div
          className={styles.statsRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { label: 'Acts',         value: '3' },
            { label: 'Minigames',    value: '4' },
            { label: 'NASA APIs',    value: '5' },
            { label: 'Dictionary',   value: '24' },
            { label: 'Decisions',    value: '30+' },
          ].map(({ label, value }) => (
            <div key={label} className={styles.statChip}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <AnimatePresence mode="wait">
            {showName ? (
              <motion.div
                key="name-input"
                className={styles.nameForm}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <label className={`font-mono ${styles.nameLabel}`}>ENTER YOUR CADET NAME</label>
                <input
                  id="cadet-name-input"
                  type="text"
                  className={styles.nameInput}
                  placeholder="e.g. Alex"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  autoFocus
                  maxLength={20}
                />
                <button
                  id="begin-mission-btn"
                  className="btn btn-primary"
                  onClick={handleStart}
                  disabled={!nameInput.trim()}
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  🚀 BEGIN MISSION
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="start-btn"
                id="launch-mission-btn"
                className="btn btn-primary"
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{ padding: '16px 48px', fontSize: '1.1rem', letterSpacing: '0.08em' }}
              >
                🚀 LAUNCH MISSION
              </motion.button>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              id="open-sim-btn"
              className="btn btn-ghost"
              onClick={() => {
                soundEngine.playClick();
                setShowSim(true);
              }}
            >
              🧪 Training Lab & Simulator
            </button>

            <button
              id="open-codex-btn"
              className="btn btn-ghost"
              onClick={() => {
                soundEngine.playClick();
                navigate('/codex');
              }}
            >
              📚 Mission Codex
            </button>
          </div>
        </motion.div>

        {/* NASA image credit */}
        {bgImage && (
          <motion.p
            className={styles.imageCredit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2 }}
          >
            Image: {bgImage.title} — NASA APOD
          </motion.p>
        )}
      </div>

      {/* ── Training Lab & Simulator Modal ── */}
      <AnimatePresence>
        {showSim && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSim(false)}
          >
            <motion.div
              className={`${styles.modalContent} glass-panel`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h2 className={`font-mono ${styles.modalTitle}`}>🧪 MISSION SIMULATOR & LAB</h2>
                  <p className={styles.modalSub}>Direct access for testing, grading & demonstrations</p>
                </div>
                <button
                  className={styles.modalCloseBtn}
                  onClick={() => setShowSim(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Campaign Acts */}
                <div className={styles.simSection}>
                  <h3 className={`font-mono ${styles.simSectionTitle}`}>🛰️ CAMPAIGN ACTS</h3>
                  <div className={styles.simGrid}>
                    <button
                      className={styles.simCard}
                      onClick={() => launchSimAct(1, 'moon', 'intro')}
                    >
                      <span className={styles.simIcon}>🌕</span>
                      <div className={styles.simInfo}>
                        <span className={styles.simName}>Act 1: Artemis Lunar Outpost</span>
                        <span className={styles.simDesc}>Shackleton crater base, vacuum physics & life support</span>
                      </div>
                      <span className={styles.simArrow}>▶</span>
                    </button>

                    <button
                      className={styles.simCard}
                      onClick={() => launchSimAct(2, 'deep_space', 'act2_intro')}
                    >
                      <span className={styles.simIcon}>🚀</span>
                      <div className={styles.simInfo}>
                        <span className={styles.simName}>Act 2: Mars Deep Space Transit</span>
                        <span className={styles.simDesc}>Ares ship, Hohmann transfer & solar particle crisis</span>
                      </div>
                      <span className={styles.simArrow}>▶</span>
                    </button>

                    <button
                      className={styles.simCard}
                      onClick={() => launchSimAct(3, 'mars_surface', 'act3_intro')}
                    >
                      <span className={styles.simIcon}>🔴</span>
                      <div className={styles.simInfo}>
                        <span className={styles.simName}>Act 3: Ares Mars Colony</span>
                        <span className={styles.simDesc}>Touchdown, dust storm alerts & mission graduation</span>
                      </div>
                      <span className={styles.simArrow}>▶</span>
                    </button>
                  </div>
                </div>

                {/* Minigames */}
                <div className={styles.simSection}>
                  <h3 className={`font-mono ${styles.simSectionTitle}`}>⚡ SURVIVAL MINIGAMES</h3>
                  <div className={styles.simGrid}>
                    <button
                      className={styles.simCard}
                      onClick={() => launchSimAct(1, 'lunar_surface', 'eva_repair_minigame')}
                    >
                      <span className={styles.simIcon}>🔌</span>
                      <div className={styles.simInfo}>
                        <span className={styles.simName}>EVA Wire Repair</span>
                        <span className={styles.simDesc}>Match 4 circuit couplings under lunar emergency timer</span>
                      </div>
                      <span className={styles.simArrow}>▶</span>
                    </button>

                    <button
                      className={styles.simCard}
                      onClick={() => launchSimAct(1, 'hydroponics', 'oxygen_minigame')}
                    >
                      <span className={styles.simIcon}>🌱</span>
                      <div className={styles.simInfo}>
                        <span className={styles.simName}>Oxygen Hydroponics</span>
                        <span className={styles.simDesc}>Feed nutrient balance & stabilize habitat CO₂ scrubber</span>
                      </div>
                      <span className={styles.simArrow}>▶</span>
                    </button>

                    <button
                      className={styles.simCard}
                      onClick={() => launchSimAct(2, 'deep_space', 'act2_solar_prep')}
                    >
                      <span className={styles.simIcon}>☀️</span>
                      <div className={styles.simInfo}>
                        <span className={styles.simName}>Solar Wing Alignment</span>
                        <span className={styles.simDesc}>Align 3 photovoltaic arrays with Sun angle vector</span>
                      </div>
                      <span className={styles.simArrow}>▶</span>
                    </button>

                    <button
                      className={styles.simCard}
                      onClick={() => launchSimAct(3, 'mars_surface', 'act3_rover_launch')}
                    >
                      <span className={styles.simIcon}>🚜</span>
                      <div className={styles.simInfo}>
                        <span className={styles.simName}>Martian Rover Navigation</span>
                        <span className={styles.simDesc}>Navigate 6x6 grid, avoid craters & collect minerals</span>
                      </div>
                      <span className={styles.simArrow}>▶</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
