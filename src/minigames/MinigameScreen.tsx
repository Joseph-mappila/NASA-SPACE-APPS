import { useEffect } from 'react'
import { audio } from '../audio/engine'
import { getMinigame, type MinigameId } from './catalog'
import { EVARepair } from './EVARepair'
import { OxygenGarden } from './OxygenGarden'
import { SolarPanel } from './SolarPanel'

type MinigameScreenProps = {
  id: MinigameId
  onExit: () => void
}

export function MinigameScreen({ id, onExit }: MinigameScreenProps) {
  const minigame = getMinigame(id)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onExit])

  function exit() {
    audio.click()
    onExit()
  }

  return (
    <main className="screen minigame-screen">
      <div className="minigame-screen__glow" aria-hidden="true" />
      <div className="minigame-screen__stars" aria-hidden="true" />
      <div className="grain" />
      <div className="scanlines" />

      <div className="minigame-screen__inner">
        <header className="minigame-topbar">
          <button className="btn btn--small minigame-back" onClick={exit} type="button">
            <span aria-hidden="true">←</span> Back to the callsign
          </button>
          <div className="minigame-topbar__meta">
            <span className="eyebrow">Training simulation</span>
            <span className="chip chip--cyan">No effect on the mission</span>
          </div>
        </header>

        <section className="panel minigame-panel">
          <div className="minigame-heading">
            <div>
              <span className="eyebrow">
                <span aria-hidden="true">{minigame.icon} </span>
                {minigame.skill}
              </span>
              <h1 className="display">{minigame.title}</h1>
              <p>{minigame.blurb}</p>
            </div>
            <span className="chip">{minigame.duration}</span>
          </div>

          {id === 'evaRepair' ? <EVARepair /> : null}
          {id === 'oxygenGarden' ? <OxygenGarden /> : null}
          {id === 'solarPanel' ? <SolarPanel /> : null}
        </section>

        <footer className="minigame-footer">
          <span>Practice run · your outpost save and mission clock are untouched.</span>
          <span>Press Esc to return</span>
        </footer>
      </div>
    </main>
  )
}
