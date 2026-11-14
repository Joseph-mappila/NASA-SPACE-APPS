import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './DialogueBox.module.css';

const SPEAKER_STYLES = {
  commander: { color: 'var(--color-cyan)',     label: 'CMD' },
  hal:       { color: 'var(--color-plasma)',   label: 'HAL' },
  medic:     { color: 'var(--color-alert)',    label: 'MED' },
  player:    { color: 'white',                label: 'YOU' },
  system:    { color: 'var(--color-mars-glow)',label: 'SYS' },
};

function TypewriterText({ text, speed = 28, onDone }) {
  const [displayed, setDisplayed] = useState('');
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor-blink" style={{ opacity: 0.6 }}>▌</span>}
    </span>
  );
}

export default function DialogueBox({ node, playerName, onChoice, onNext }) {
  const [textDone, setTextDone] = useState(false);
  const speakerCfg = SPEAKER_STYLES[node.speaker] || SPEAKER_STYLES.system;
  const displayText = node.text.replace('{playerName}', playerName);
  const hasChoices  = node.choices?.length > 0;

  // Reset done state when node changes
  useEffect(() => setTextDone(false), [node.id]);

  return (
    <motion.div
      className={`${styles.root} glass-panel`}
      key={node.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35 }}
    >
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
        <div className={styles.headerLine} style={{ background: speakerCfg.color }} />
      </div>

      {/* Dialogue text */}
      <div className={styles.textArea}>
        <p className={styles.text}>
          <TypewriterText
            text={displayText}
            speed={node.speaker === 'system' ? 20 : 28}
            onDone={() => setTextDone(true)}
          />
        </p>
      </div>

      {/* Choices or Next */}
      <AnimatePresence>
        {textDone && (
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {hasChoices ? (
              <div className={styles.choices}>
                {node.choices.map((choice, i) => (
                  <motion.button
                    key={choice.next || i}
                    id={`choice-btn-${i}`}
                    className={`${styles.choiceBtn} btn btn-ghost`}
                    onClick={() => onChoice(choice)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
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
    </motion.div>
  );
}
