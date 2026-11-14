import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { CODEX_ENTRIES } from '../data/achievements';
import { MASTER_GLOSSARY } from '../data/glossary';
import soundEngine from '../utils/audio';
import styles from './Codex.module.css';

export default function Codex() {
  const navigate          = useNavigate();
  const unlockedIds       = useGameStore((s) => s.unlockedCodexEntries);
  const seenGlossaryTerms = useGameStore((s) => s.seenGlossaryTerms || []);

  const [activeTab, setActiveTab] = useState('glossary'); // 'glossary' | 'codex'
  const [selectedCodex, setSelectedCodex] = useState(null);
  const [selectedTerm, setSelectedTerm]   = useState(Object.keys(MASTER_GLOSSARY)[0]);

  const allCodexEntries = Object.values(CODEX_ENTRIES);
  const allTerms = Object.values(MASTER_GLOSSARY);

  const currentCodex = selectedCodex ? CODEX_ENTRIES[selectedCodex] : null;
  const currentTerm  = selectedTerm ? MASTER_GLOSSARY[selectedTerm] : null;

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

            {/* Mode Tabs */}
            <div className={styles.tabRow}>
              <button
                className={`${styles.tabBtn} ${activeTab === 'glossary' ? styles.tabActive : ''}`}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('glossary');
                }}
              >
                📖 Dictionary ({allTerms.length})
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === 'codex' ? styles.tabActive : ''}`}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('codex');
                }}
              >
                🔬 Dossiers ({unlockedIds.length}/{allCodexEntries.length})
              </button>
            </div>

            <p className={styles.codexSub}>
              {activeTab === 'glossary'
                ? `${seenGlossaryTerms.length} of ${allTerms.length} terms decoded in dialogue`
                : `${unlockedIds.length} of ${allCodexEntries.length} science dossiers unlocked`}
            </p>
          </div>

          <div className={styles.entryList}>
            {activeTab === 'glossary' ? (
              allTerms.map((t) => {
                const isSeen = seenGlossaryTerms.includes(t.term);
                return (
                  <motion.button
                    key={t.term}
                    id={`glossary-entry-${t.term}`}
                    className={`${styles.entryItem} ${selectedTerm === t.term ? styles.entryActive : ''}`}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedTerm(t.term);
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <span className={styles.entryEmoji}>{t.emoji}</span>
                    <span className={styles.entryTitle}>{t.term}</span>
                    {isSeen && <span title="Decoded in dialogue" style={{ fontSize: '0.75rem', color: '#00ff88' }}>✓</span>}
                  </motion.button>
                );
              })
            ) : (
              allCodexEntries.map((e) => {
                const isUnlocked = unlockedIds.includes(e.id);
                return (
                  <motion.button
                    key={e.id}
                    id={`codex-entry-${e.id}`}
                    className={`${styles.entryItem} ${selectedCodex === e.id ? styles.entryActive : ''} ${!isUnlocked ? styles.entryLocked : ''}`}
                    onClick={() => {
                      if (isUnlocked) {
                        soundEngine.playClick();
                        setSelectedCodex(e.id);
                      }
                    }}
                    whileHover={isUnlocked ? { x: 4 } : {}}
                  >
                    <span className={styles.entryEmoji}>{isUnlocked ? e.emoji : '🔒'}</span>
                    <span className={styles.entryTitle}>{isUnlocked ? e.title : '???'}</span>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className={`${styles.detail} glass-panel`}>
          <AnimatePresence mode="wait">
            {activeTab === 'glossary' ? (
              currentTerm ? (
                <motion.div
                  key={currentTerm.term}
                  className={styles.entryDetail}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className={styles.detailEmoji}>{currentTerm.emoji}</span>
                  <div className={styles.metaRow}>
                    <h2 className={styles.detailTitle} style={{ margin: 0 }}>{currentTerm.term}</h2>
                    <span className={styles.tagBadge}>{currentTerm.category}</span>
                    <span className={styles.tagBadge}>Act {currentTerm.act}</span>
                    {seenGlossaryTerms.includes(currentTerm.term) && (
                      <span className={`${styles.tagBadge} ${styles.tagBadgeSeen}`}>✓ Decoded in Dialogue</span>
                    )}
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <h4 className="font-mono" style={{ color: 'var(--color-plasma)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: 6 }}>
                      QUICK DEFINITION
                    </h4>
                    <p className={styles.detailBody} style={{ fontSize: '1.05rem', color: '#ffffff' }}>
                      {currentTerm.simple}
                    </p>
                  </div>

                  {currentTerm.deep && (
                    <div style={{ marginTop: 8, padding: 16, background: 'rgba(0, 212, 255, 0.05)', borderRadius: 12, border: '1px solid rgba(0, 212, 255, 0.15)' }}>
                      <h4 className="font-mono" style={{ color: 'var(--color-cyan)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: 6 }}>
                        DEEP SPACE SCIENCE
                      </h4>
                      <p className={styles.detailBody} style={{ margin: 0 }}>
                        {currentTerm.deep}
                      </p>
                    </div>
                  )}

                  <div className={styles.detailSource}>
                    <span className={`font-mono ${styles.sourceLabel}`}>OFFICIAL NASA SOURCE</span>
                    <span className={styles.sourceValue}>{currentTerm.source}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-glossary"
                  className={styles.emptyState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className={styles.emptyIcon}>📖</span>
                  <p className={styles.emptyText}>Select a space term to study its authentic scientific definition and NASA background.</p>
                </motion.div>
              )
            ) : (
              currentCodex ? (
                <motion.div
                  key={currentCodex.id}
                  className={styles.entryDetail}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className={styles.detailEmoji}>{currentCodex.emoji}</span>
                  <h2 className={styles.detailTitle}>{currentCodex.title}</h2>
                  <p className={styles.detailBody}>{currentCodex.body}</p>
                  <div className={styles.detailSource}>
                    <span className={`font-mono ${styles.sourceLabel}`}>SOURCE</span>
                    <span className={styles.sourceValue}>{currentCodex.source}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-codex"
                  className={styles.emptyState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className={styles.emptyIcon}>📡</span>
                  <p className={styles.emptyText}>Select an unlocked dossier to read the science behind your mission.</p>
                  {unlockedIds.length === 0 && (
                    <p className={styles.emptyHint}>Play through the mission acts to unlock classified dossiers!</p>
                  )}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
