import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainMenu     from './pages/MainMenu';
import GameScreen   from './pages/GameScreen';
import ActSummary   from './pages/ActSummary';
import Codex        from './pages/Codex';
import MinigameHub  from './pages/MinigameHub';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<MainMenu />} />
        <Route path="/game"     element={<GameScreen />} />
        <Route path="/summary"  element={<ActSummary />} />
        <Route path="/codex"    element={<Codex />} />
        <Route path="/minigames" element={<MinigameHub />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
