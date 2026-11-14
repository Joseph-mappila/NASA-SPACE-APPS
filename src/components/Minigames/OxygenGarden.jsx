import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import styles from './OxygenGarden.module.css';

const PLANTS = [
  { id: 0, name: 'Wheat Seedling',   emoji: '🌾', needs: ['N', 'P'] },
  { id: 1, name: 'Lettuce',          emoji: '🥬', needs: ['N', 'K'] },
  { id: 2, name: 'Algae Panel A',    emoji: '🌿', needs: ['P', 'K'] },
  { id: 3, name: 'Tomato Plant',     emoji: '🍅', needs: ['N', 'P', 'K'] },
];

const NUTRIENTS = [
  { id: 'N', label: 'Nitrogen',    color: '#00d4ff', emoji: '💧' },
  { id: 'P', label: 'Phosphorus',  color: '#f5a623', emoji: '🟠' },
  { id: 'K', label: 'Potassium',   color: '#00ff88', emoji: '🟢' },
];

const TIME_LIMIT = 45;

export default function OxygenGarden() {
  const resolveMinigame = useGameStore((s) => s.resolveMinigame);

  const [timeLeft,  setTimeLeft]  = useState(TIME_LIMIT);
  const [fed,       setFed]       = useState({});  // { plantId: [nutrientIds] }
  const [dragging,  setDragging]  = useState(null);
  const [gameOver,  setGameOver]  = useState(false);
  const [flash,     setFlash]     = useState(null); // { plantId, ok }

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); handleEnd(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEnd(success) {
    if (gameOver) return;
    setGameOver(true);
    if (success) {
      resolveMinigame('success', [{ stat: 'oxygen', delta: 15 }, { stat: 'score', delta: 120 }]);
    } else {
      resolveMinigame('fail', [{ stat: 'oxygen', delta: -10 }, { stat: 'health', delta: -5 }]);
    }
  }

  function dropNutrient(plantId) {
    if (!dragging || gameOver) return;
    setFed((prev) => {
      const existing = prev[plantId] || [];
      if (existing.includes(dragging.id)) return prev;
      const updated = { ...prev, [plantId]: [...existing, dragging.id] };

      // Flash feedback
      const plant = PLANTS.find((p) => p.id === plantId);
      const isCorrect = plant.needs.includes(dragging.id);
      setFlash({ plantId, ok: isCorrect });
      setTimeout(() => setFlash(null), 600);

      // Check win: all plants have all needed nutrients fed correctly
      const allDone = PLANTS.every((p) =>
        p.needs.every((n) => (updated[p.id] || []).includes(n))
      );
      if (allDone) setTimeout(() => handleEnd(true), 600);

      return updated;
    });
    setDragging(null);
  }

  const timePct  = (timeLeft / TIME_LIMIT) * 100;
  const scrubberPct = Math.min(100, Math.round(
    (Object.values(fed).flat().length / PLANTS.reduce((s, p) => s + p.needs.length, 0)) * 100
  ));

  return (
    <div className={styles.root}>
      <div className={`${styles.panel} glass-panel`}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={`font-mono ${styles.title}`}>🌱 OXYGEN GARDEN</h2>
            <p className={styles.subtitle}>Drag nutrients to plants that need them. Restore CO₂ scrubber to 100%!</p>
          </div>
          <div className={styles.timerBlock}>
            <span className={`font-mono ${styles.timerNum}`}
              style={{ color: timeLeft < 15 ? 'var(--color-danger)' : 'var(--color-plasma)' }}
            >{timeLeft}s</span>
          </div>
        </div>

        {/* Scrubber progress */}
        <div className={styles.scrubberRow}>
          <span className={`font-mono ${styles.scrubberLabel}`}>CO₂ SCRUBBER</span>
          <div className={styles.scrubberTrack}>
            <motion.div
              className={styles.scrubberFill}
              animate={{ width: `${scrubberPct}%`, background: scrubberPct > 80 ? '#00ff88' : scrubberPct > 50 ? '#f5a623' : '#e63946' }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className={`font-mono ${styles.scrubberPct}`}>{scrubberPct}%</span>
        </div>

        {/* Plants grid */}
        <div className={styles.plantsGrid}>
          {PLANTS.map((plant) => {
            const fedNutrients = fed[plant.id] || [];
            const isFlash      = flash?.plantId === plant.id;
            return (
              <motion.div
                key={plant.id}
                id={`plant-${plant.id}`}
                className={`${styles.plant} ${isFlash ? (flash.ok ? styles.plantOk : styles.plantBad) : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dropNutrient(plant.id)}
                animate={isFlash ? { scale: [1, 1.05, 1] } : {}}
              >
                <span className={styles.plantEmoji}>{plant.emoji}</span>
                <span className={styles.plantName}>{plant.name}</span>
                <div className={styles.plantNeeds}>
                  {plant.needs.map((n) => {
                    const nutrient = NUTRIENTS.find((nu) => nu.id === n);
                    const isFed    = fedNutrients.includes(n);
                    return (
                      <div
                        key={n}
                        className={`${styles.needChip} ${isFed ? styles.needFed : ''}`}
                        style={{ borderColor: nutrient.color, background: isFed ? nutrient.color + '33' : 'transparent' }}
                      >
                        <span style={{ color: isFed ? nutrient.color : 'rgba(255,255,255,0.3)' }}>{nutrient.emoji} {n}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nutrient sources (drag these) */}
        <div className={styles.nutrients}>
          <span className={`font-mono ${styles.nutrientsLabel}`}>AVAILABLE NUTRIENTS — DRAG TO PLANTS</span>
          <div className={styles.nutrientRow}>
            {NUTRIENTS.map((n) => (
              <motion.div
                key={n.id}
                id={`nutrient-${n.id}`}
                className={styles.nutrient}
                style={{ borderColor: n.color }}
                draggable
                onDragStart={() => setDragging(n)}
                onDragEnd={() => setDragging(null)}
                whileHover={{ scale: 1.08, y: -4 }}
                whileDrag={{ opacity: 0.5, scale: 0.9 }}
              >
                <span className={styles.nutrientEmoji}>{n.emoji}</span>
                <span className={`font-mono ${styles.nutrientId}`} style={{ color: n.color }}>{n.id}</span>
                <span className={styles.nutrientName}>{n.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
