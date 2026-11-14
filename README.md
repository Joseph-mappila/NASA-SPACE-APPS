# 🚀 Junior Astronaut Mission Trainer
**NASA SpaceApps Hackathon | Interactive Space Survival Game**

> *"The year is 2047. You are a newly certified Junior Astronaut. Survive your first rotation at Artemis Lunar Outpost — and prove you're ready for Mars."*

A **narrative-driven, choice-based survival game** powered by real NASA data. Players make decisions as a junior astronaut, complete minigames, and discover real space science — all in the browser.

---

## 📄 Documentation

- **[`GAME_PLAN.md`](./GAME_PLAN.md)** — Full game design document: narrative arc, NASA API integration, minigame specs, 2-day sprint plan, and team division of work.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 📖 Branching dialogue engine with 20+ decision nodes | ✅ |
| 🌌 Real NASA APOD + Mars Rover photo backgrounds | ✅ |
| 🌦️ Dynamic Mars weather from InSight archived data | ✅ |
| 📊 HUD — Oxygen, Health, Morale, Mission Score | ✅ |
| 🕹️ Minigame: EVA Suit Repair (wire matching) | ✅ |
| 🌱 Minigame: Oxygen Garden (nutrient drag & drop) | ✅ |
| 📚 Science Codex — unlock real NASA facts | ✅ |
| 🏆 Achievement system | ✅ |
| 🎬 Act Summary / Mission Report card | ✅ |
| 🛸 Solar Panel & Navigation minigames | 🔜 |
| 🔴 Act 2 & 3 (Transit Ship + Mars Colony) | 🔜 |

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| [React](https://react.dev/) | ^18 | UI framework |
| [Vite](https://vitejs.dev/) | ^5 | Build tool & dev server |
| [React Router](https://reactrouter.com/) | ^6 | Client-side routing |
| [Zustand](https://zustand-demo.pmnd.rs/) | ^4 | Lightweight game state |
| [Framer Motion](https://www.framer.com/motion/) | ^11 | Animations & transitions |
| [Howler.js](https://howlerjs.com/) | ^2 | Audio (ambient sounds) |

---

## ⚙️ Prerequisites

Make sure you have these installed before starting:

| Tool | Min Version | Check | Install |
|------|-------------|-------|---------|
| **Node.js** | v18+ | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | `npm --version` | Included with Node.js |
| **Git** | any | `git --version` | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Joseph-mappila/NASA-SPACE-APPS.git
cd NASA-SPACE-APPS
```

### 2. Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`:
- React, React DOM, React Router
- Zustand (game state)
- Framer Motion (animations)
- Howler.js (audio)
- Vite + ESLint (dev tooling)

### 3. Configure the NASA API Key

The game uses NASA's public APIs. The `DEMO_KEY` works out of the box but is **rate-limited to 30 requests/hour**.

> 🔑 **Recommended:** Register a free key at **[api.nasa.gov](https://api.nasa.gov/)** for 1,000 requests/hour.

Create a `.env` file in the project root:

```bash
# Copy the example (or create manually)
cp .env .env.local
```

Then edit `.env.local`:

```env
VITE_NASA_API_KEY=your_key_here
```

> ⚠️ **Never commit your `.env.local` to Git** — it's already in `.gitignore`.

### 4. Start the Development Server

```bash
npm run dev
```

The app opens at: **[http://localhost:5173](http://localhost:5173)**

> Hot reload is enabled — changes save and reflect instantly.

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build optimized production bundle → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## 🗂️ Project Structure

```
NASA-SPACE-APPS/
├── public/                   # Static assets (favicon, etc.)
├── src/
│   ├── api/
│   │   ├── nasa.js           # NASA API utility functions
│   │   └── marsWeather.js    # Mars weather hook + InSight data
│   ├── store/
│   │   └── gameStore.js      # Zustand game state store
│   ├── data/
│   │   ├── dialogues/
│   │   │   └── act1.js       # Act 1 dialogue tree (JSON-style)
│   │   └── achievements.js   # Achievements + Codex entries data
│   ├── pages/
│   │   ├── MainMenu.jsx      # Title screen
│   │   ├── GameScreen.jsx    # Main game orchestrator
│   │   ├── ActSummary.jsx    # End-of-act report card
│   │   └── Codex.jsx         # Science Codex browser
│   ├── components/
│   │   ├── HUD/              # Stat bars overlay (O₂/Health/Morale/Score)
│   │   ├── DialogueBox/      # Typewriter dialogue + choice buttons
│   │   ├── WeatherAlert/     # Mars weather event banner
│   │   └── Minigames/
│   │       ├── EVARepair.jsx       # Wire-matching minigame ✅
│   │       ├── OxygenGarden.jsx    # Nutrient drag-and-drop ✅
│   │       └── MinigameRouter.jsx  # Maps minigame IDs → components
│   ├── App.jsx               # Router setup
│   ├── main.jsx              # React entry point
│   └── index.css             # Global design system + CSS tokens
├── .env                      # NASA API key (DEMO_KEY default)
├── .gitignore
├── GAME_PLAN.md              # Full game design document
├── README.md
├── index.html                # HTML entry + Google Fonts
├── package.json
└── vite.config.js
```

---

## 🌐 NASA APIs Used

| API | Endpoint | Used For |
|-----|----------|---------|
| **APOD** | `api.nasa.gov/planetary/apod` | Daily space image backgrounds |
| **Mars Rover Photos** | `api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos` | Act 3 real Mars surface photos |
| **NASA Image Library** | `images-api.nasa.gov/search` | Scene backgrounds by keyword |
| **EPIC** | `api.nasa.gov/EPIC/api/natural` | Earth-from-Moon imagery (Act 1) |
| **InSight Weather** | Historical archive (embedded) | Dynamic Martian weather events |

> All NASA content is public domain per [NASA Media Guidelines](https://www.nasa.gov/multimedia/guidelines/index.html).

---

## 👥 Team & Branch Strategy

```
main          ← stable, demo-ready only
└── dev       ← integration branch (PRs merge here first)
    ├── feat/act2-dialogue       ← Act 2 story + dialogue tree
    ├── feat/act3-mars           ← Act 3 Mars colony + dialogue
    ├── feat/minigame-solar      ← Solar Panel Alignment minigame
    ├── feat/minigame-nav        ← Navigation / Rover routing minigame
    └── feat/ui-polish           ← Animations, audio, visual polish
```

### How to add a new minigame

1. Create `src/components/Minigames/YourMinigame.jsx`
2. Register it in `src/components/Minigames/MinigameRouter.jsx`:
   ```js
   import YourMinigame from './YourMinigame';
   const MINIGAME_MAP = {
     ...
     yourMinigame: YourMinigame,
   };
   ```
3. Trigger it from a dialogue node in `src/data/dialogues/act1.js`:
   ```js
   'your_node': {
     id: 'your_node',
     speaker: 'system',
     text: 'MINIGAME: Your Minigame',
     minigame: 'yourMinigame',  // ← matches the key above
   }
   ```

### How to add a new dialogue node

Edit `src/data/dialogues/act1.js` and add an entry:
```js
'my_new_node': {
  id:      'my_new_node',
  speaker: 'commander',       // 'commander' | 'hal' | 'medic' | 'system'
  name:    'Commander Chen',
  text:    'Your dialogue text here.',
  choices: [
    { label: 'Choice A', next: 'some_node_id', effects: [{ stat: 'score', delta: 50 }] },
    { label: 'Choice B', next: 'other_node_id', effects: [] },
  ],
  bg: 'lunar_interior',
}
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended — free)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Then set `VITE_NASA_API_KEY` in your Vercel project's Environment Variables dashboard.

### Deploy to GitHub Pages

```bash
# Add gh-pages package
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

Add `base: '/NASA-SPACE-APPS/'` to `vite.config.js` for GitHub Pages subdirectory hosting.

---

## 🤝 Contributing

1. **Branch** off `dev` using the naming convention above
2. **Commit** with descriptive messages (emoji prefix encouraged 🚀)
3. **Pull Request** into `dev`, not `main`
4. Keep `main` clean — only merge `dev` → `main` when demo-ready

---

## 🏅 NASA SpaceApps Attribution

Built for **NASA SpaceApps Hackathon 2026** by Team [your team name].  
Powered by NASA Open APIs — [api.nasa.gov](https://api.nasa.gov/)
