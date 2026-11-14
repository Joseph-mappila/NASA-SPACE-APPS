import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import styles from './EVARepair.module.css';

const TIME_LIMIT = 60; // seconds

// Generate random wire puzzle (n pairs of connectors)
function generatePuzzle(n = 4) {
  const colors = ['#00d4ff', '#00ff88', '#f5a623', '#e63946', '#7c3aed', '#ff6b35'];
  const pairs  = colors.slice(0, n).map((color, i) => ({ id: i, color }));
  // Left connectors in order, right connectors shuffled
  const left  = [...pairs];
  const right = [...pairs].sort(() => Math.random() - 0.5);
  return { left, right, n };
}

export default function EVARepair() {
  const resolveMinigame = useGameStore((s) => s.resolveMinigame);

  const [puzzle]       = useState(() => generatePuzzle(4));
  const [timeLeft,     setTimeLeft]     = useState(TIME_LIMIT);
  const [connections,  setConnections]  = useState({});   // { leftId: rightId }
  const [dragging,     setDragging]     = useState(null); // { id, color }
  const [gameOver,     setGameOver]     = useState(false);
  const [solved,       setSolved]       = useState(false);
  const timerRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleFail();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFail() {
    if (gameOver) return;
    setGameOver(true);
    clearInterval(timerRef.current);
    setTimeout(() => resolveMinigame('fail', [{ stat: 'oxygen', delta: -20 }, { stat: 'health', delta: -15 }]), 1200);
  }

  function handleDragStart(connector) {
    setDragging(connector);
  }

  function handleDrop(rightConnector) {
    if (!dragging || gameOver) return;
    const newConns = { ...connections, [dragging.id]: rightConnector.id };
    setConnections(newConns);
    setDragging(null);

    // Check win condition
    const allCorrect = puzzle.left.every((l) => newConns[l.id] === l.id);
    if (allCorrect) {
      clearInterval(timerRef.current);
      setSolved(true);
      setGameOver(true);
      const bonus = Math.floor(timeLeft / 10) * 10;
      setTimeout(() => resolveMinigame('success', [
        { stat: 'oxygen', delta: 15 },
        { stat: 'score',  delta: 100 + bonus },
      ]), 1200);
    }
  }

  const timePct = (timeLeft / TIME_LIMIT) * 100;
  const timerColor = timeLeft > 30 ? 'var(--color-plasma)' : timeLeft > 15 ? 'var(--color-alert)' : 'var(--color-danger)';

  return (
    <div className={styles.root}>
      <div className={`${styles.panel} glass-panel`}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={`font-mono ${styles.title}`}>⚠️ EVA SUIT REPAIR</h2>
            <p className={styles.subtitle}>Match wire connectors — left to right — before oxygen depletes!</p>
          </div>
          {/* Timer */}
          <div className={styles.timer}>
            <span className={`font-mono ${styles.timerNum}`} style={{ color: timerColor }}>
              {String(timeLeft).padStart(2, '0')}s
            </span>
            <div className={styles.timerTrack}>
              <motion.div
                className={styles.timerFill}
                style={{ background: timerColor }}
                animate={{ width: `${timePct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Puzzle */}
        <div className={styles.puzzle}>
          {/* Left connectors (draggable) */}
          <div className={styles.connectors}>
            {puzzle.left.map((conn) => (
              <motion.div
                key={conn.id}
                id={`left-connector-${conn.id}`}
                className={`${styles.connector} ${connections[conn.id] === conn.id ? styles.connectorSolved : ''}`}
                style={{ borderColor: conn.color, background: connections[conn.id] !== undefined ? (connections[conn.id] === conn.id ? conn.color + '33' : 'rgba(230,57,70,0.2)') : 'transparent' }}
                draggable
                onDragStart={() => handleDragStart(conn)}
                whileHover={{ scale: 1.05, x: 4 }}
                whileDrag={{ opacity: 0.6, scale: 0.95 }}
              >
                <div className={styles.connectorDot} style={{ background: conn.color }} />
                <span className={`font-mono ${styles.connectorLabel}`} style={{ color: conn.color }}>
                  WIRE-{String.fromCharCode(65 + conn.id)}
                </span>
                <div className={styles.connectorTail} style={{ background: conn.color }} />
              </motion.div>
            ))}
          </div>

          {/* Center status */}
          <div className={styles.centerArea}>
            {solved ? (
              <motion.div
                className={styles.successBadge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                ✅
              </motion.div>
            ) : (
              <div className={styles.circuitIcon}>⚡</div>
            )}
          </div>

          {/* Right connectors (drop targets) */}
          <div className={styles.connectors}>
            {puzzle.right.map((conn) => {
              const isConnected = Object.values(connections).includes(conn.id);
              const isCorrect   = Object.entries(connections).some(([lId, rId]) => Number(lId) === conn.id && rId === conn.id);
              return (
                <motion.div
                  key={conn.id}
                  id={`right-connector-${conn.id}`}
                  className={`${styles.connector} ${styles.connectorRight} ${isConnected ? (isCorrect ? styles.connectorSolved : styles.connectorWrong) : ''}`}
                  style={{ borderColor: conn.color }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(conn)}
                  whileHover={{ scale: 1.05, x: -4 }}
                >
                  <div className={styles.connectorTail} style={{ background: conn.color }} />
                  <span className={`font-mono ${styles.connectorLabel}`} style={{ color: conn.color }}>
                    PORT-{String.fromCharCode(65 + conn.id)}
                  </span>
                  <div className={styles.connectorDot} style={{ background: conn.color }} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Instruction */}
        <p className={`font-mono ${styles.hint}`}>Drag WIRE-X and drop onto the matching PORT-X</p>
      </div>
    </div>
  );
}
