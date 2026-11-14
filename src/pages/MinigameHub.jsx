import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MinigameRouter from '../components/Minigames/MinigameRouter';
import { useGameStore } from '../store/gameStore';
import soundEngine from '../utils/audio';
import styles from './MinigameHub.module.css';

const MINIGAMES = [
  {
    id: 'evaRepair',
    number: '01',
    act: 'ACT I · LUNAR SURFACE',
    title: 'EVA Circuit Repair',
    description: 'Match four suit circuit couplings before the emergency oxygen reserve runs out.',
    skill: 'Pattern matching',
    duration: '60 sec',
    accent: '#00d4ff',
    visual: 'circuit',
  },
  {
    id: 'oxygenGarden',
    number: '02',
    act: 'ACT I · LUNAR HABITAT',
    title: 'Oxygen Garden',
    description: 'Balance plant nutrients and restore the habitat carbon-dioxide scrubber.',
    skill: 'Resource balancing',
    duration: '45 sec',
    accent: '#00ff88',
    visual: 'garden',
  },
  {
    id: 'solarPanel',
    number: '03',
    act: 'ACT II · MARS TRANSIT',
    title: 'Solar Wing Alignment',
    description: 'Rotate three photovoltaic arrays until each one locks onto its Sun vector.',
    skill: 'Angles and geometry',
    duration: '45 sec',
    accent: '#f5a623',
    visual: 'solar',
  },
  {
    id: 'navigation',
    number: '04',
    act: 'ACT III · MARS SURFACE',
    title: 'Rover Navigation',
    description: 'Plot a safe route to Ares Habitat while managing battery and collecting samples.',
    skill: 'Path planning',
    duration: 'Open',
    accent: '#ff6b35',
    visual: 'rover',
  },
];

export default function MinigameHub() {
  const navigate = useNavigate();
  const launchMinigame = useGameStore((state) => state.launchMinigame);
  const clearMinigame = useGameStore((state) => state.clearMinigame);
  const minigameResult = useGameStore((state) => state.minigameResult);
  const stats = useGameStore((state) => state.stats);
  const [selectedGame, setSelectedGame] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    clearMinigame();
    return clearMinigame;
  }, [clearMinigame]);

  function openGame(id) {
    soundEngine.playClick();
    clearMinigame();
    launchMinigame(id);
    setSelectedGame(id);
    setAttempt((value) => value + 1);
  }

  function returnToDeck() {
    soundEngine.playClick();
    clearMinigame();
    setSelectedGame(null);
  }

  if (selectedGame) {
    const game = MINIGAMES.find((item) => item.id === selectedGame);
    return (
      <main className={styles.runner}>
        <header className={styles.runnerBar}>
          <button className={styles.backButton} onClick={returnToDeck} type="button">
            <span aria-hidden="true">←</span> Minigame Deck
          </button>
          <div className={styles.runnerIdentity}>
            <span>{game.act}</span>
            <strong>{game.title}</strong>
          </div>
          <button className={styles.replayButton} onClick={() => openGame(selectedGame)} type="button">
            Restart simulation
          </button>
        </header>

        <section className={styles.gameStage} aria-label={`${game.title} simulation`}>
          <MinigameRouter id={selectedGame} key={`${selectedGame}-${attempt}`} />
        </section>

        {minigameResult && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={`${styles.resultToast} ${minigameResult === 'success' ? styles.resultSuccess : styles.resultFail}`}
            initial={{ opacity: 0, y: 20 }}
          >
            <div>
              <span>Simulation {minigameResult === 'success' ? 'complete' : 'ended'}</span>
              <strong>{minigameResult === 'success' ? 'Procedure successful' : 'Review and try again'}</strong>
            </div>
            <button onClick={() => openGame(selectedGame)} type="button">Play again</button>
            <button onClick={returnToDeck} type="button">All minigames</button>
          </motion.div>
        )}
      </main>
    );
  }

  return (
    <main className={styles.root}>
      <div className="starfield" />
      <div className={styles.orbit} aria-hidden="true"><i /><i /></div>

      <header className={styles.topbar}>
        <button className={styles.backButton} onClick={() => navigate('/')} type="button">
          <span aria-hidden="true">←</span> Mission home
        </button>
        <div className={styles.systemStatus}>
          <i aria-hidden="true" />
          Training systems online
        </div>
      </header>

      <section className={styles.intro}>
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}>
          <span className={styles.kicker}>Independent training access</span>
          <h1>Minigame<br />Deck</h1>
          <p>
            Practice any mission procedure without starting the campaign.
            Results affect this training session only.
          </p>
        </motion.div>

        <div className={styles.sessionReadout}>
          <span>Session telemetry</span>
          <div><b>{stats.score}</b><small>Score</small></div>
          <div><b>{stats.oxygen}%</b><small>Oxygen</small></div>
          <div><b>{stats.health}%</b><small>Health</small></div>
        </div>
      </section>

      <section className={styles.grid} aria-label="Available minigames">
        {MINIGAMES.map((game, index) => (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            key={game.id}
            style={{ '--accent': game.accent }}
            transition={{ delay: 0.08 * index }}
          >
            <div className={styles.cardTopline}>
              <span>{game.number}</span>
              <b>{game.act}</b>
            </div>
            <div className={`${styles.cardVisual} ${styles[`visual_${game.visual}`]}`} aria-hidden="true">
              {game.visual === 'circuit' && <><i /><i /><i /><i /></>}
              {game.visual === 'garden' && <><i /><i /><i /></>}
              {game.visual === 'solar' && <><i /><i /><i /></>}
              {game.visual === 'rover' && <><i /><span /><b /></>}
            </div>
            <div className={styles.cardCopy}>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
            </div>
            <dl>
              <div><dt>Skill</dt><dd>{game.skill}</dd></div>
              <div><dt>Limit</dt><dd>{game.duration}</dd></div>
            </dl>
            <button onClick={() => openGame(game.id)} type="button">
              Launch simulation <span aria-hidden="true">↗</span>
            </button>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
