import React from 'react';
import { motion } from 'framer-motion';
import styles from './HUD.module.css';

const STATS_CONFIG = [
  { key: 'oxygen', label: 'O₂',     color: 'var(--stat-oxygen)', icon: '💨' },
  { key: 'health', label: 'HEALTH', color: 'var(--stat-health)', icon: '❤️' },
  { key: 'morale', label: 'MORALE', color: 'var(--stat-morale)', icon: '😊' },
];

function StatBar({ config, value }) {
  const pct    = Math.max(0, Math.min(100, value));
  const isCrit = pct <= 20;
  const isLow  = pct <= 40;

  return (
    <div className={styles.stat} title={`${config.label}: ${pct}%`}>
      <span className={styles.statIcon}>{config.icon}</span>
      <div className={styles.statBody}>
        <div className={styles.statMeta}>
          <span className={`font-mono ${styles.statLabel}`}>{config.label}</span>
          <span
            className={`font-mono ${styles.statValue}`}
            style={{ color: isCrit ? 'var(--color-danger)' : isLow ? 'var(--color-alert)' : config.color }}
          >
            {pct}%
          </span>
        </div>
        <div className={styles.statTrack}>
          <motion.div
            className={styles.statFill}
            style={{ backgroundColor: isCrit ? 'var(--color-danger)' : isLow ? 'var(--color-alert)' : config.color }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
      </div>
    </div>
  );
}

export default function HUD({ stats, playerName, onCodex }) {
  return (
    <div className={`${styles.hud} hud-flicker glass-panel`} role="status" aria-label="Mission HUD">
      {/* Player */}
      <div className={styles.player}>
        <span className={styles.playerAvatar}>🧑‍🚀</span>
        <div>
          <span className={`font-mono ${styles.playerLabel}`}>CADET</span>
          <span className={styles.playerName}>{playerName}</span>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Stat bars */}
      {STATS_CONFIG.map((cfg) => (
        <StatBar key={cfg.key} config={cfg} value={stats[cfg.key] ?? 100} />
      ))}

      {/* Divider */}
      <div className={styles.divider} />

      {/* Score */}
      <div className={styles.score}>
        <span className={`font-mono ${styles.scoreLabel}`}>MISSION SCORE</span>
        <motion.span
          className={`font-mono ${styles.scoreValue}`}
          key={stats.score}
          initial={{ scale: 1.2, color: '#ffffff' }}
          animate={{ scale: 1, color: 'var(--color-plasma)' }}
          transition={{ duration: 0.3 }}
        >
          {String(stats.score).padStart(5, '0')}
        </motion.span>
      </div>

      {/* Codex button */}
      <button
        id="hud-codex-btn"
        className={`btn btn-ghost ${styles.codexBtn}`}
        onClick={onCodex}
        title="Open Mission Codex"
      >
        📚
      </button>
    </div>
  );
}
