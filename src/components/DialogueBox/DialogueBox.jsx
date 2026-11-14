import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import styles from './DialogueBox.module.css';

// ════════════════════════════════════════════════════════════════════
// Character speaker configurations & avatar paths.
// Teammates: Drop character portrait files into public/avatars/
// (e.g. commander.png, hal.png, medic.png, cadet.png, system.png).
// They will automatically display here in place of the placeholder.
// ════════════════════════════════════════════════════════════════════
export const SPEAKER_CONFIG = {
  commander: {
    color: 'var(--color-cyan)',
    label: 'CMD',
    role: 'Expedition Commander',
    icon: '🧑‍🚀',
    avatar: '/avatars/commander.png',
  },
  hal: {
    color: 'var(--color-plasma)',
    label: 'HAL',
    role: 'AI Assistant',
    icon: '🤖',
    avatar: '/avatars/hal.png',
  },
  medic: {
    color: 'var(--color-alert)',
    label: 'MED',
    role: 'Chief Medical Officer',
    icon: '👩‍⚕️',
    avatar: '/avatars/medic.png',
  },
  player: {
    color: 'white',
    label: 'YOU',
    role: 'Junior Astronaut',
    icon: '🚀',
    avatar: '/avatars/cadet.png',
  },
  system: {
    color: 'var(--color-mars-glow)',
    label: 'SYS',
    role: 'Station Comms',
    icon: '📡',
    avatar: '/avatars/system.png',
  },
};

function TypewriterText({ text, speed = 24, onDone, isSkipped }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (isSkipped) {
      setDisplayed(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
        onDoneRef.current?.();
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed, isSkipped]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor-blink" style={{ opacity: 0.6 }}>▌</span>}
    </span>
  );
}

export default function DialogueBox({ node, playerName, onChoice, onNext }) {
  const [textDone, setTextDone] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const score = useGameStore((s) => s.stats.score);
  const speakerKey = node.speaker || 'system';
  const speakerCfg = SPEAKER_CONFIG[speakerKey] || SPEAKER_CONFIG.system;

  const scoreAdjective = score >= 500 ? 'exceptional' : score >= 300 ? 'commendable' : 'acceptable';
  const displayText = (node.text || '')
    .replace('{playerName}', playerName)
    .replace('{score_adjective}', scoreAdjective);

  const hasChoices = node.choices?.length > 0;
  const avatarSrc = node.avatar || speakerCfg.avatar;

  // Reset states when dialogue node changes
  useEffect(() => {
    setTextDone(false);
    setIsSkipped(false);
    setImgError(false);
  }, [node.id]);

  function handleBoxClick() {
    if (!textDone) {
      setIsSkipped(true);
    }
  }

  return (
    <motion.div
      className={`${styles.root} glass-panel`}
      onClick={handleBoxClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.layoutRow}>
        {/* ── Character Avatar / Placeholder Section ── */}
        <div
          className={styles.avatarFrame}
          style={{ borderColor: speakerCfg.color, color: speakerCfg.color }}
          title={node.name || speakerCfg.role}
        >
          {!imgError && avatarSrc ? (
            <img
              src={avatarSrc}
              alt={node.name || speakerCfg.label}
              className={styles.avatarImg}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <span className={styles.avatarIcon}>{speakerCfg.icon}</span>
              <span className={styles.avatarTag}>{speakerCfg.label}</span>
            </div>
          )}
          {/* Futuristic Corner Brackets */}
          <div className={styles.avatarCornerTL} style={{ borderColor: speakerCfg.color }} />
          <div className={styles.avatarCornerBR} style={{ borderColor: speakerCfg.color }} />
        </div>

        {/* ── Dialogue Content ── */}
        <div className={styles.contentCol}>
          {/* Speaker header */}
          <div className={styles.header}>
            <div
              className={`font-mono ${styles.speakerTag}`}
              style={{ color: speakerCfg.color, borderColor: speakerCfg.color }}
            >
              {speakerCfg.label}
            </div>
            {node.name && (
              <span className={styles.speakerName} style={{ color: speakerCfg.color }}>
                {node.name}
              </span>
            )}
            <span className={styles.speakerRole}>// {speakerCfg.role}</span>
            <div className={styles.headerLine} style={{ background: speakerCfg.color }} />
          </div>

          {/* Dialogue text */}
          <div className={styles.textArea}>
            <p className={styles.text}>
              <TypewriterText
                text={displayText}
                speed={node.speaker === 'system' ? 18 : 24}
                isSkipped={isSkipped}
                onDone={() => setTextDone(true)}
              />
            </p>
          </div>

          {/* Choices or Next Button */}
          <AnimatePresence>
            {textDone && (
              <motion.div
                className={styles.actions}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                {hasChoices ? (
                  <div className={styles.choices}>
                    {node.choices.map((choice, i) => (
                      <motion.button
                        key={choice.next || i}
                        id={`choice-btn-${i}`}
                        className={`${styles.choiceBtn} btn btn-ghost`}
                        onClick={() => onChoice(choice)}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 4, borderColor: 'rgba(0, 212, 255, 0.5)' }}
                      >
                        <span className={styles.choiceArrow}>▶</span>
                        {choice.label}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <button
                    id="dialogue-next-btn"
                    className="btn btn-ghost"
                    onClick={onNext}
                    style={{ alignSelf: 'flex-end', fontSize: '0.85rem' }}
                  >
                    Continue ▶
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
