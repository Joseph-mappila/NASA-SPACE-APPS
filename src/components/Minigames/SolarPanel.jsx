import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import styles from './SolarPanel.module.css';

// 3 Solar Arrays with target angles
const ARRAYS = [
  { id: 'alpha', name: 'Array Wing Alpha', target: 60,  color: '#00d4ff' },
  { id: 'beta',  name: 'Array Wing Beta',  target: 180, color: '#f5a623' },
  { id: 'gamma', name: 'Array Wing Gamma', target: 300, color: '#00ff88' },
];

const TOLERANCE = 8; // degrees ± within target to count as aligned
const TIME_LIMIT = 45; // seconds

export default function SolarPanel() {
  const resolveMinigame = useGameStore((s) => s.resolveMinigame);

  const [angles, setAngles] = useState({
    alpha: 0,
    beta: 90,
    gamma: 200,
  });
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [gameOver, setGameOver] = useState(false);
  const [outcome, setOutcome] = useState(null); // 'success' | 'fail'

  const timerRef = useRef(null);

  // Check alignment helper
  const isAligned = (current, target) => {
    const diff = Math.abs((((current - target) % 360) + 540) % 360 - 180);
    return diff <= TOLERANCE;
  };

  // Calculate efficiency for each wing (0% - 100%)
  const getEfficiency = (current, target) => {
    const diff = Math.abs((((current - target) % 360) + 540) % 360 - 180);
    if (diff <= TOLERANCE) return 100;
    const eff = Math.max(0, 100 - (diff - TOLERANCE) * 1.5);
    return Math.round(eff);
  };

  const alphaEff = getEfficiency(angles.alpha, ARRAYS[0].target);
  const betaEff  = getEfficiency(angles.beta,  ARRAYS[1].target);
  const gammaEff = getEfficiency(angles.gamma, ARRAYS[2].target);
  const totalPower = Math.round((alphaEff + betaEff + gammaEff) / 3);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleEnd(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check victory condition
  useEffect(() => {
    if (gameOver) return;
    const allAligned = ARRAYS.every((arr) => isAligned(angles[arr.id], arr.target));
    if (allAligned) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleEnd(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angles, gameOver]);

  function handleEnd(success) {
    if (gameOver) return;
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setOutcome(success ? 'success' : 'fail');

    setTimeout(() => {
      if (success) {
        resolveMinigame('success', [
          { stat: 'score',  delta: 120 },
          { stat: 'morale', delta: 10 },
        ]);
      } else {
        resolveMinigame('fail', [
          { stat: 'health', delta: -10 },
          { stat: 'morale', delta: -10 },
        ]);
      }
    }, 900);
  }

  function adjustAngle(id, delta) {
    if (gameOver) return;
    setAngles((prev) => {
      const nextAngle = (((prev[id] + delta) % 360) + 360) % 360;
      return { ...prev, [id]: nextAngle };
    });
  }

  const timePct = (timeLeft / TIME_LIMIT) * 100;
  const timerColor = timeLeft > 25 ? 'var(--color-plasma)' : timeLeft > 12 ? 'var(--color-alert)' : 'var(--color-danger)';

  return (
    <div className={styles.root}>
      <div className={`${styles.panel} glass-panel`}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={`font-mono ${styles.title}`}>☀️ SOLAR PANEL ALIGNMENT</h2>
            <p className={styles.subtitle}>
              Rotate all 3 array wings to match the Sun incident vector before auxiliary batteries fail!
            </p>
          </div>
          <div className={styles.timerBlock}>
            <span className={`font-mono ${styles.timerNum}`} style={{ color: timerColor }}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Outcome banner */}
        {outcome && (
          <motion.div
            className={`${styles.outcomeBanner} ${outcome === 'fail' ? styles.outcomeFail : ''}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {outcome === 'success'
              ? '✅ ALL SOLAR ARRAYS SYNCHRONIZED — 100% POWER RESTORED!'
              : '⚠️ AUXILIARY POWER DEPLETED — SWITCHING TO EMERGENCY RESERVES'}
          </motion.div>
        )}

        {/* Power Grid Summary */}
        <div className={styles.powerRow}>
          <div className={styles.powerLabelCol}>
            <span className={`font-mono ${styles.powerLabel}`}>TOTAL SHIP SOLAR POWER</span>
            <span className={`font-mono ${styles.powerSub}`}>IRRADIANCE: ~590 W/m² (DEEP SPACE MARS TRANSIT)</span>
          </div>
          <div className={styles.powerTrack}>
            <motion.div
              className={styles.powerFill}
              style={{
                width: `${totalPower}%`,
                background: totalPower >= 95 ? '#00ff88' : totalPower >= 60 ? '#00d4ff' : totalPower >= 35 ? '#f5a623' : '#e63946',
              }}
              animate={{ width: `${totalPower}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className={`font-mono ${styles.powerPct}`}>{totalPower}%</span>
        </div>

        {/* 3 Wings Grid */}
        <div className={styles.wingsGrid}>
          {ARRAYS.map((arr) => {
            const current = angles[arr.id];
            const aligned = isAligned(current, arr.target);
            const eff = getEfficiency(current, arr.target);

            return (
              <div
                key={arr.id}
                className={`${styles.wingCard} ${aligned ? styles.wingAligned : ''}`}
                style={{ borderColor: aligned ? arr.color : 'rgba(184, 196, 204, 0.15)' }}
              >
                {/* Wing Title & Status */}
                <div className={styles.wingHeader}>
                  <span className={styles.wingName} style={{ color: arr.color }}>{arr.name}</span>
                  <span className={`font-mono ${styles.wingStatus}`} style={{ color: aligned ? '#00ff88' : 'rgba(255,255,255,0.4)' }}>
                    {aligned ? 'LOCKED' : `${eff}%`}
                  </span>
                </div>

                {/* Compass / Dial Visual */}
                <div className={styles.dialContainer}>
                  {/* Sun Vector Target Indicator */}
                  <div
                    className={styles.targetIndicator}
                    style={{
                      transform: `rotate(${arr.target}deg)`,
                      borderColor: arr.color,
                    }}
                    title={`Target: ${arr.target}°`}
                  >
                    <span className={styles.sunIcon} style={{ color: arr.color }}>☀️</span>
                  </div>

                  {/* Rotating Array Wing Graphic */}
                  <motion.div
                    className={styles.rotatingArray}
                    style={{ borderColor: arr.color }}
                    animate={{ rotate: current }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  >
                    <div className={styles.solarCells} style={{ background: arr.color }} />
                    <div className={styles.panelCenterDot} style={{ background: arr.color }} />
                  </motion.div>
                </div>

                {/* Readout */}
                <div className={styles.angleReadout}>
                  <span className="font-mono">CURRENT: {current}°</span>
                  <span className="font-mono" style={{ color: arr.color, opacity: 0.8 }}>TARGET: {arr.target}°</span>
                </div>

                {/* Control Buttons */}
                <div className={styles.btnRow}>
                  <button
                    className={`${styles.ctrlBtn} btn btn-ghost`}
                    onClick={() => adjustAngle(arr.id, -30)}
                    disabled={gameOver}
                    title="Rotate -30°"
                  >
                    -30°
                  </button>
                  <button
                    className={`${styles.ctrlBtn} btn btn-ghost`}
                    onClick={() => adjustAngle(arr.id, -5)}
                    disabled={gameOver}
                    title="Fine tune -5°"
                  >
                    -5°
                  </button>
                  <button
                    className={`${styles.ctrlBtn} btn btn-ghost`}
                    onClick={() => adjustAngle(arr.id, 5)}
                    disabled={gameOver}
                    title="Fine tune +5°"
                  >
                    +5°
                  </button>
                  <button
                    className={`${styles.ctrlBtn} btn btn-ghost`}
                    onClick={() => adjustAngle(arr.id, 30)}
                    disabled={gameOver}
                    title="Rotate +30°"
                  >
                    +30°
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Science Footer Note */}
        <p className={`font-mono ${styles.scienceNote}`}>
          🔬 NASA FACT: As spacecraft travel away from Earth, solar power falls by the square of distance. Accurate solar array orientation is vital for life support survival.
        </p>
      </div>
    </div>
  );
}
