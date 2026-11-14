import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { fetchRandomAPOD } from '../api/nasa';
import styles from './MainMenu.module.css';

const TAGLINES = [
  'Your mission begins now.',
  'The Moon is just the first step.',
  '384,400 km from home.',
  'Survive. Learn. Explore.',
];

export default function MainMenu() {
  const navigate   = useNavigate();
  const resetGame  = useGameStore((s) => s.resetGame);
  const setName    = useGameStore((s) => s.setPlayerName);

  const [bgImage,   setBgImage]   = useState(null);
  const [bgLoaded,  setBgLoaded]  = useState(false);
  const [tagline,   setTagline]   = useState(TAGLINES[0]);
  const [nameInput, setNameInput] = useState('');
  const [showName,  setShowName]  = useState(false);
  const taglineIdx = useRef(0);

  // Rotate taglines
  useEffect(() => {
    const id = setInterval(() => {
      taglineIdx.current = (taglineIdx.current + 1) % TAGLINES.length;
      setTagline(TAGLINES[taglineIdx.current]);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Fetch NASA background
  useEffect(() => {
    fetchRandomAPOD(10).then((images) => {
      const spaceImages = images.filter((i) => i.url);
      if (spaceImages.length) setBgImage(spaceImages[Math.floor(Math.random() * spaceImages.length)]);
    });
  }, []);

  function handleStart() {
    if (!showName) { setShowName(true); return; }
    if (!nameInput.trim()) return;
    resetGame();
    setName(nameInput.trim() || 'Cadet');
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
            { label: 'Acts',         value: '1' },
            { label: 'Minigames',    value: '3' },
            { label: 'NASA APIs',    value: '4' },
            { label: 'Decisions',    value: '20+' },
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

          <button
            id="open-codex-btn"
            className="btn btn-ghost"
            onClick={() => navigate('/codex')}
            style={{ marginTop: 12 }}
          >
            📚 Mission Codex
          </button>
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
    </div>
  );
}
