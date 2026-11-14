// ══════════════════════════════════════════
// Game State Store — Zustand
// Junior Astronaut Mission Trainer
// ══════════════════════════════════════════
import { create } from 'zustand';

const INITIAL_STATS = {
  oxygen:  100,
  health:  100,
  morale:  75,
  score:   0,
};

export const useGameStore = create((set, get) => ({
  // ── Player State ──
  stats: { ...INITIAL_STATS },
  playerName: 'Cadet',
  currentAct: 1,          // 1 = Lunar, 2 = Transit, 3 = Mars
  currentScene: 'lunar_surface',
  currentDialogueId: 'intro',

  // ── Flags (track story decisions) ──
  flags: {},

  // ── Weather ──
  weatherEvent: null,       // null | { type, severity, label, description }
  currentWeatherData: null, // raw InSight-style data

  // ── NASA Image ──
  currentBgImage: null,     // { url, title, explanation }
  bgLoading: false,

  // ── Minigame ──
  activeMinigame: null,     // null | 'evaRepair' | 'oxygenGarden' | 'navigation' | 'solarPanel' | 'sampleLab'
  lastMinigame: null,       // stores most recent minigame id for transition routing
  minigameResult: null,     // null | 'success' | 'fail'

  // ── Achievements ──
  unlockedAchievements: [],

  // ── Codex ──
  unlockedCodexEntries: [],

  // ── Actions ──

  setPlayerName: (name) => set({ playerName: name }),

  applyEffect: (effects = []) => {
    set((state) => {
      const newStats = { ...state.stats };
      effects.forEach(({ stat, delta }) => {
        if (stat in newStats) {
          newStats[stat] = Math.max(0, Math.min(stat === 'score' ? Infinity : 100, newStats[stat] + delta));
        }
      });
      return { stats: newStats };
    });
  },

  setFlag: (key, value = true) => set((state) => ({
    flags: { ...state.flags, [key]: value },
  })),

  hasFlag: (key) => !!get().flags[key],

  navigateTo: (sceneId, dialogueId = 'intro') => set({
    currentScene: sceneId,
    currentDialogueId: dialogueId,
    activeMinigame: null,
    minigameResult: null,
  }),

  setAct: (act) => set({ currentAct: act }),

  startAct: (actNumber, sceneId, dialogueId) => set({
    currentAct: actNumber,
    currentScene: sceneId,
    currentDialogueId: dialogueId,
    activeMinigame: null,
    lastMinigame: null,
    minigameResult: null,
  }),

  setWeatherEvent: (event) => set({ weatherEvent: event }),

  setCurrentWeatherData: (data) => set({ currentWeatherData: data }),

  setBgImage: (imageData) => set({ currentBgImage: imageData, bgLoading: false }),

  setBgLoading: (loading) => set({ bgLoading: loading }),

  launchMinigame: (minigameId) => set({
    activeMinigame: minigameId,
    lastMinigame: minigameId,
    minigameResult: null,
  }),

  resolveMinigame: (result, effects = []) => {
    get().applyEffect(effects);
    set((state) => ({
      minigameResult: result,
      lastMinigame: state.activeMinigame || state.lastMinigame,
      activeMinigame: null,
    }));
  },

  unlockAchievement: (id) => set((state) => ({
    unlockedAchievements: state.unlockedAchievements.includes(id)
      ? state.unlockedAchievements
      : [...state.unlockedAchievements, id],
  })),

  unlockCodexEntry: (id) => set((state) => ({
    unlockedCodexEntries: state.unlockedCodexEntries.includes(id)
      ? state.unlockedCodexEntries
      : [...state.unlockedCodexEntries, id],
  })),

  resetGame: () => set({
    stats: { ...INITIAL_STATS },
    flags: {},
    currentAct: 1,
    currentScene: 'lunar_surface',
    currentDialogueId: 'intro',
    weatherEvent: null,
    activeMinigame: null,
    lastMinigame: null,
    minigameResult: null,
    unlockedAchievements: [],
    unlockedCodexEntries: [],
  }),
}));
