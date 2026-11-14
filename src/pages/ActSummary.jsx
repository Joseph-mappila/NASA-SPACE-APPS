import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';
import styles from './ActSummary.module.css';

export default function ActSummary() {
  const navigate  = useNavigate();
  const stats     = useGameStore((s) => s.stats);
  const name      = useGameStore((s) => s.playerName);
  const unlocked  = useGameStore((s) => s.unlockedAchievements);
  const resetGame = useGameStore((s) => s.resetGame);

  const grade = stats.score >= 600 ? 'S' : stats.score >= 400 ? 'A' : stats.score >= 200 ? 'B' : 'C';
  const gradeColor = { S: '#00ff88', A: '#00d4ff', B: '#f5a623', C: '#e63946' }[grade];

  return (
    <div className={styles.root}>
      <div className="starfield" />

      <motion.div
        className={`${styles.panel} glass-panel`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerBadge}>ACT 1 COMPLETE</span>
          <h1 className={styles.title}>Mission Report</h1>
          <p className={styles.subtitle}>Well done, {name}. Here's how you performed.</p>
        </div>

        {/* Grade */}
        <motion.div
          className={styles.gradeBlock}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
        >
          <span className={styles.gradeLabel}>PERFORMANCE GRADE</span>
          <span className={styles.grade} style={{ color: gradeColor }}>{grade}</span>
        </motion.div>

        {/* Stats grid */}
        <div className={styles.statsGrid}>
          {[
            { label: 'Mission Score',     value: stats.score, unit: 'pts', color: 'var(--color-plasma)' },
            { label: 'Final Oxygen',      value: `${stats.oxygen}%`, unit: '', color: 'var(--stat-oxygen)' },
            { label: 'Health Remaining',  value: `${stats.health}%`, unit: '', color: 'var(--stat-health)' },
            { label: 'Crew Morale',       value: `${stats.morale}%`, unit: '', color: 'var(--stat-morale)' },
          ].map(({ label, value, unit, color }, i) => (
            <motion.div
              key={label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <span className={styles.statLabel}>{label}</span>
              <span className={`font-mono ${styles.statValue}`} style={{ color }}>
                {value}{unit}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        {unlocked.length > 0 && (
          <div className={styles.achievementsSection}>
            <span className={`font-mono ${styles.sectionLabel}`}>ACHIEVEMENTS UNLOCKED</span>
            <div className={styles.achievementsList}>
              {unlocked.map((id, i) => {
                const ach = ACHIEVEMENTS[id];
                if (!ach) return null;
                return (
                  <motion.div
                    key={id}
                    className={styles.achievement}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <span className={styles.achievementEmoji}>{ach.emoji}</span>
                    <div>
                      <span className={styles.achievementTitle}>{ach.title}</span>
                      <span className={styles.achievementDesc}>{ach.desc}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button
            id="summary-replay-btn"
            className="btn btn-ghost"
            onClick={() => { resetGame(); navigate('/game'); }}
          >
            🔄 Replay Act 1
          </button>
          <button
            id="summary-codex-btn"
            className="btn btn-plasma"
            onClick={() => navigate('/codex')}
          >
            📚 Mission Codex
          </button>
          <button
            id="summary-menu-btn"
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            🚀 Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  );
}
