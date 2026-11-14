import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { CODEX_ENTRIES } from '../data/achievements';
import soundEngine from '../utils/audio';
import styles from './Codex.module.css';

export default function Codex() {
  const navigate       = useNavigate();
  const unlockedIds    = useGameStore((s) => s.unlockedCodexEntries);
  const [selected, setSelected] = useState(null);

  const allEntries = Object.values(CODEX_ENTRIES);
  const entry      = selected ? CODEX_ENTRIES[selected] : null;

  return (
    <div className={styles.root}>
      <div className="starfield" />

      <div className={styles.layout}>
        {/* Sidebar */}
        <div className={`${styles.sidebar} glass-panel`}>
          <div className={styles.sidebarHeader}>
            <button
              id="codex-back-btn"
              className="btn btn-ghost"
              onClick={() => {
                soundEngine.playClick();
                navigate(-1);
              }}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              ← Back
            </button>
            <h1 className={`font-mono ${styles.codexTitle}`}>📚 MISSION CODEX</h1>
            <p className={styles.codexSub}>{unlockedIds.length} / {allEntries.length} entries unlocked</p>
          </div>

          <div className={styles.entryList}>
            {allEntries.map((e) => {
              const isUnlocked = unlockedIds.includes(e.id);
              return (
                <motion.button
                  key={e.id}
                  id={`codex-entry-${e.id}`}
                  className={`${styles.entryItem} ${selected === e.id ? styles.entryActive : ''} ${!isUnlocked ? styles.entryLocked : ''}`}
                  onClick={() => {
                    if (isUnlocked) {
                      soundEngine.playClick();
                      setSelected(e.id);
                    }
                  }}
                  whileHover={isUnlocked ? { x: 4 } : {}}
                >
                  <span className={styles.entryEmoji}>{isUnlocked ? e.emoji : '🔒'}</span>
                  <span className={styles.entryTitle}>{isUnlocked ? e.title : '???'}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className={`${styles.detail} glass-panel`}>
          <AnimatePresence mode="wait">
            {entry ? (
              <motion.div
                key={entry.id}
                className={styles.entryDetail}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className={styles.detailEmoji}>{entry.emoji}</span>
                <h2 className={styles.detailTitle}>{entry.title}</h2>
                <p className={styles.detailBody}>{entry.body}</p>
                <div className={styles.detailSource}>
                  <span className={`font-mono ${styles.sourceLabel}`}>SOURCE</span>
                  <span className={styles.sourceValue}>{entry.source}</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className={styles.emptyIcon}>📡</span>
                <p className={styles.emptyText}>Select an unlocked entry to read the science behind your mission.</p>
                {unlockedIds.length === 0 && (
                  <p className={styles.emptyHint}>Play the game to unlock entries!</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
