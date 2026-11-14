import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import soundEngine from '../../utils/audio';
import styles from './WeatherAlert.module.css';

const SEVERITY_STYLES = {
  critical: { border: 'var(--color-danger)',   bg: 'rgba(230, 57, 70, 0.15)'  },
  warning:  { border: 'var(--color-cyan)',      bg: 'rgba(0, 212, 255, 0.1)'   },
  caution:  { border: 'var(--color-alert)',     bg: 'rgba(245, 166, 35, 0.1)'  },
  info:     { border: 'var(--color-purple)',    bg: 'rgba(124, 58, 237, 0.1)'  },
};

export default function WeatherAlert({ event, weatherData, onDismiss }) {
  useEffect(() => {
    if (event?.severity === 'critical') {
      soundEngine.playAlarm();
    }
  }, [event]);

  if (!event) return null;
  const sev = SEVERITY_STYLES[event.severity] || SEVERITY_STYLES.info;

  return (
    <motion.div
      className={styles.root}
      style={{ borderColor: sev.border, background: sev.bg }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.inner}>
        <span className={styles.icon}>{event.icon}</span>
        <div className={styles.content}>
          <span
            className={`font-mono ${styles.label}`}
            style={{ color: sev.border }}
          >
            {event.label}
          </span>
          <p className={styles.desc}>{event.description}</p>

          {/* Dynamic telemetry chips (adapts to Moon, Transit, or Mars) */}
          {(weatherData?.chips || event.chips) && (
            <div className={styles.dataRow}>
              {(weatherData?.chips || event.chips).map((chip, i) => (
                <DataChip key={i} label={chip.label} value={chip.value} />
              ))}
            </div>
          )}
        </div>
        <button
          id="weather-dismiss-btn"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Dismiss weather alert"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

function DataChip({ label, value }) {
  return (
    <div className={styles.chip}>
      <span className={`font-mono ${styles.chipLabel}`}>{label}</span>
      <span className={`font-mono ${styles.chipValue}`}>{value}</span>
    </div>
  );
}
