import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import styles from './Navigation.module.css';

// 6x6 Grid Configuration
const GRID_SIZE = 6;
const START_POS = { x: 0, y: 0 };
const GOAL_POS  = { x: 5, y: 5 };

// Hazard tiles (craters, boulder fields, sand dunes)
const HAZARDS = [
  { x: 1, y: 1, type: 'crater',  icon: '🕳️', name: 'Impact Crater' },
  { x: 2, y: 3, type: 'boulder', icon: '🪨', name: 'Boulder Field' },
  { x: 3, y: 1, type: 'crater',  icon: '🕳️', name: 'Deep Fissure' },
  { x: 4, y: 2, type: 'dune',    icon: '⛰️', name: 'Steep Ridge' },
  { x: 1, y: 4, type: 'dune',    icon: '⛰️', name: 'Sand Dune' },
  { x: 3, y: 4, type: 'boulder', icon: '🪨', name: 'Jagged Rocks' },
];

// Mineral sample caches for bonus points
const SAMPLES = [
  { id: 1, x: 0, y: 3, name: 'Hematite Core', icon: '💎' },
  { id: 2, x: 3, y: 2, name: 'Olivine Crystal', icon: '💎' },
  { id: 3, x: 5, y: 2, name: 'Ancient Clay', icon: '💎' },
];

export default function Navigation() {
  const resolveMinigame = useGameStore((s) => s.resolveMinigame);

  const [roverPos, setRoverPos]       = useState(START_POS);
  const [battery, setBattery]         = useState(100);
  const [collected, setCollected]     = useState([]);
  const [path, setPath]               = useState([{ x: 0, y: 0 }]);
  const [gameOver, setGameOver]       = useState(false);
  const [outcome, setOutcome]         = useState(null); // 'success' | 'fail'
  const [alertMsg, setAlertMsg]       = useState(null);

  // Check victory / defeat
  useEffect(() => {
    if (gameOver) return;

    // Check goal reached
    if (roverPos.x === GOAL_POS.x && roverPos.y === GOAL_POS.y) {
      handleEnd(true);
      return;
    }

    // Check battery depleted
    if (battery <= 0) {
      handleEnd(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roverPos, battery, gameOver]);

  function handleEnd(success) {
    if (gameOver) return;
    setGameOver(true);
    setOutcome(success ? 'success' : 'fail');

    const sampleBonus = collected.length * 50;

    setTimeout(() => {
      if (success) {
        resolveMinigame('success', [
          { stat: 'score',  delta: 140 + sampleBonus },
          { stat: 'morale', delta: 15 },
        ]);
      } else {
        resolveMinigame('fail', [
          { stat: 'health', delta: -15 },
          { stat: 'morale', delta: -10 },
        ]);
      }
    }, 1000);
  }

  function moveRover(dx, dy) {
    if (gameOver) return;

    const newX = roverPos.x + dx;
    const newY = roverPos.y + dy;

    // Boundaries
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
      return;
    }

    // Check hazard collision
    const hazard = HAZARDS.find((h) => h.x === newX && h.y === newY);
    let batteryCost = 5;

    if (hazard) {
      batteryCost = 15;
      setAlertMsg(`⚠️ Rover hit ${hazard.name}! Heavy energy drain (-15%)`);
      setTimeout(() => setAlertMsg(null), 2500);
    }

    // Check sample collection
    const sample = SAMPLES.find((s) => s.x === newX && s.y === newY);
    if (sample && !collected.includes(sample.id)) {
      setCollected((prev) => [...prev, sample.id]);
      setAlertMsg(`💎 Collected ${sample.name}! (+50 pts)`);
      setTimeout(() => setAlertMsg(null), 2000);
    }

    setRoverPos({ x: newX, y: newY });
    setPath((prev) => [...prev, { x: newX, y: newY }]);
    setBattery((prev) => Math.max(0, prev - batteryCost));
  }

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (['ArrowUp', 'KeyW'].includes(e.code))    { e.preventDefault(); moveRover(0, -1); }
      if (['ArrowDown', 'KeyS'].includes(e.code))  { e.preventDefault(); moveRover(0, 1); }
      if (['ArrowLeft', 'KeyA'].includes(e.code))  { e.preventDefault(); moveRover(-1, 0); }
      if (['ArrowRight', 'KeyD'].includes(e.code)) { e.preventDefault(); moveRover(1, 0); }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roverPos, gameOver]);

  return (
    <div className={styles.root}>
      <div className={`${styles.panel} glass-panel`}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={`font-mono ${styles.title}`}>🧭 MARTIAN ROVER NAVIGATION</h2>
            <p className={styles.subtitle}>
              Navigate the pressurized rover from the Lander (🚀) to Ares Habitat (🏕️). Avoid craters & collect minerals!
            </p>
          </div>
          {/* Battery Status */}
          <div className={styles.batteryBlock}>
            <span className={`font-mono ${styles.batteryLabel}`}>ROVER BATTERY</span>
            <div className={styles.batteryTrack}>
              <motion.div
                className={styles.batteryFill}
                style={{
                  width: `${battery}%`,
                  background: battery > 45 ? '#00ff88' : battery > 20 ? '#f5a623' : '#e63946',
                }}
                animate={{ width: `${battery}%` }}
              />
            </div>
            <span className={`font-mono ${styles.batteryNum}`} style={{ color: battery > 25 ? 'var(--color-plasma)' : 'var(--color-danger)' }}>
              {battery}%
            </span>
          </div>
        </div>

        {/* Outcome or Hazard Banner */}
        {outcome && (
          <motion.div
            className={`${styles.outcomeBanner} ${outcome === 'fail' ? styles.outcomeFail : ''}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {outcome === 'success'
              ? `✅ ROVER DOCKED SAFELY AT ARES BASE! (${collected.length} SAMPLES RETRIEVED)`
              : '⚠️ ROVER BATTERY DEPLETED IN THE DUNES — RESCUE CREW DISPATCHED'}
          </motion.div>
        )}
        {!outcome && alertMsg && (
          <div className={styles.alertBanner}>
            {alertMsg}
          </div>
        )}

        {/* Main Grid View */}
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);

              const isRover    = roverPos.x === x && roverPos.y === y;
              const isStart    = START_POS.x === x && START_POS.y === y;
              const isGoal     = GOAL_POS.x === x && GOAL_POS.y === y;
              const hazard     = HAZARDS.find((h) => h.x === x && h.y === y);
              const sample     = SAMPLES.find((s) => s.x === x && s.y === y);
              const isSampleTaken = sample && collected.includes(sample.id);
              const isVisited  = path.some((p) => p.x === x && p.y === y);

              // Click adjacent tile to move
              const isAdjacent = Math.abs(x - roverPos.x) + Math.abs(y - roverPos.y) === 1;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`${styles.cell} ${isVisited ? styles.cellVisited : ''} ${isAdjacent && !gameOver ? styles.cellAdjacent : ''}`}
                  onClick={() => isAdjacent && moveRover(x - roverPos.x, y - roverPos.y)}
                >
                  {/* Rover */}
                  {isRover ? (
                    <motion.span
                      className={styles.roverIcon}
                      layoutId="rover"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    >
                      🚜
                    </motion.span>
                  ) : isGoal ? (
                    <span className={styles.cellIcon} title="Ares Outpost Habitat">🏕️</span>
                  ) : isStart ? (
                    <span className={styles.cellIcon} title="Landing Craft">🚀</span>
                  ) : hazard ? (
                    <span className={styles.cellIcon} title={hazard.name}>{hazard.icon}</span>
                  ) : sample && !isSampleTaken ? (
                    <span className={styles.sampleIcon} title={sample.name}>💎</span>
                  ) : null}

                  {/* Coordinates label */}
                  <span className={styles.coordLabel}>{x},{y}</span>
                </div>
              );
            })}
          </div>

          {/* D-Pad Controls */}
          <div className={styles.controlsCol}>
            <span className={`font-mono ${styles.ctrlTitle}`}>DIRECTIONAL THRUSTERS</span>
            <div className={styles.dpad}>
              <div />
              <button
                className={`${styles.dpadBtn} btn btn-ghost`}
                onClick={() => moveRover(0, -1)}
                disabled={gameOver || roverPos.y === 0}
              >
                ▲
              </button>
              <div />

              <button
                className={`${styles.dpadBtn} btn btn-ghost`}
                onClick={() => moveRover(-1, 0)}
                disabled={gameOver || roverPos.x === 0}
              >
                ◀
              </button>
              <div className={styles.dpadCenter}>NAV</div>
              <button
                className={`${styles.dpadBtn} btn btn-ghost`}
                onClick={() => moveRover(1, 0)}
                disabled={gameOver || roverPos.x === GRID_SIZE - 1}
              >
                ▶
              </button>

              <div />
              <button
                className={`${styles.dpadBtn} btn btn-ghost`}
                onClick={() => moveRover(0, 1)}
                disabled={gameOver || roverPos.y === GRID_SIZE - 1}
              >
                ▼
              </button>
              <div />
            </div>

            {/* Samples summary */}
            <div className={styles.samplesBox}>
              <span className={`font-mono ${styles.samplesTitle}`}>GEOLOGICAL SAMPLES</span>
              <div className={styles.sampleChips}>
                {SAMPLES.map((s) => (
                  <span
                    key={s.id}
                    className={`${styles.sampleChip} ${collected.includes(s.id) ? styles.sampleAcquired : ''}`}
                  >
                    {collected.includes(s.id) ? '✅' : '⚪'} {s.name}
                  </span>
                ))}
              </div>
            </div>

            <p className={`font-mono ${styles.hint}`}>Use keyboard [W,A,S,D] or Arrow Keys</p>
          </div>
        </div>
      </div>
    </div>
  );
}
