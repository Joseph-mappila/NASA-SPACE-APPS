import { useState } from 'react'
import { Scrollama, Step, type StepCallback } from 'react-scrollama'
import { ResourceRibbon, type Resources } from './components/ResourceRibbon'
import { ShelterRouting } from './components/ShelterRouting'
import { SourceDrawer } from './components/SourceDrawer'
import { scenes } from './data/story'

type Sacrifice = 'food' | 'lifeSupport' | 'rescue'

const initialResources: Resources = {
  power: 72,
  lifeSupport: 88,
  food: 76,
  rescue: 82,
}

const decisions: Array<{
  id: Sacrifice
  title: string
  detail: string
  cost: string
}> = [
  {
    id: 'food',
    title: 'Pause greenhouse lights',
    detail: 'Free power immediately. Mature crops lose growing time.',
    cost: '−18 Food',
  },
  {
    id: 'lifeSupport',
    title: 'Reduce recycler output',
    detail: 'Keep the greenhouse lit. The crew uses reserve water and air.',
    cost: '−15 Life support',
  },
  {
    id: 'rescue',
    title: 'Lower the rescue beacon',
    detail: 'Protect habitat systems. The incoming rover receives a weaker signal.',
    cost: '−18 Rescue',
  },
]

function App() {
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [resources, setResources] = useState(initialResources)
  const [sacrifice, setSacrifice] = useState<Sacrifice | null>(null)
  const [procedureComplete, setProcedureComplete] = useState(false)

  const scene = scenes[currentStep] ?? scenes[0]
  const decision = decisions.find((item) => item.id === sacrifice)

  function selectSacrifice(next: Sacrifice) {
    if (procedureComplete) return
    setSacrifice(next)
    setResources({
      ...initialResources,
      power: 90,
      [next]: next === 'lifeSupport' ? initialResources[next] - 15 : initialResources[next] - 18,
    })
  }

  function completeProcedure() {
    setProcedureComplete(true)
    setResources((current) => ({
      ...current,
      power: 64,
      lifeSupport: Math.min(100, current.lifeSupport + 5),
    }))
  }

  function restart() {
    setCurrentStep(0)
    setResources(initialResources)
    setSacrifice(null)
    setProcedureComplete(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!started) {
    return (
      <main className="landing">
        <div className="landing__sky" aria-hidden="true" />
        <div className="landing__planet" aria-hidden="true" />
        <section className="landing__content">
          <span className="kicker">A junior astronaut mission story</span>
          <h1>Aster Outpost</h1>
          <p>Three sols from rescue. One outpost. Every decision leaves a mark.</p>
          <button className="primary-button" onClick={() => setStarted(true)} type="button">
            Begin transmission
          </button>
          <span className="landing__note">Prototype vertical slice · NASA Space Apps 2026</span>
        </section>
      </main>
    )
  }

  return (
    <main className="experience">
      <ResourceRibbon resources={resources} />

      <section className={`visual-stage visual-stage--${scene.tone}`} aria-live="polite">
        <div className="visual-stage__stars" aria-hidden="true" />
        <div className="visual-stage__sun" aria-hidden="true" />
        <div className="visual-stage__mars" aria-hidden="true" />
        <div className="visual-stage__habitat" aria-hidden="true">
          <span className="habitat__dome" />
          <span className="habitat__hall" />
          <span className="habitat__array" />
          <span className="habitat__beacon" />
        </div>
        <div className="visual-stage__storm" aria-hidden="true" />

        <div className="visual-stage__caption">
          <span>{scene.eyebrow}</span>
          <h2>{scene.title}</h2>
        </div>
      </section>

      <div className="story-scroll">
        <Scrollama<number>
          offset={0.55}
          onStepEnter={({ data }: StepCallback<number>) => setCurrentStep(data)}
        >
          {scenes.map((item, index) => (
            <Step data={index} key={item.title}>
              <section className={`story-step story-step--${item.tone}`}>
                <div className="story-card">
                  <span className="kicker">{item.eyebrow}</span>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>

                  {index === 2 && <SourceDrawer />}

                  {index === 3 && (
                    <div className="decision-grid" aria-label="Choose which system to pause">
                      {decisions.map((item) => (
                        <button
                          className={`decision-card ${sacrifice === item.id ? 'is-selected' : ''}`}
                          key={item.id}
                          onClick={() => selectSacrifice(item.id)}
                          type="button"
                        >
                          <strong>{item.title}</strong>
                          <span>{item.detail}</span>
                          <em>{item.cost}</em>
                        </button>
                      ))}
                    </div>
                  )}

                  {index === 4 && (
                    <ShelterRouting unlocked={sacrifice !== null} onComplete={completeProcedure} />
                  )}

                  {index === 5 && (
                    <div className="outcome">
                      {procedureComplete ? (
                        <>
                          <span className="outcome__badge">Crew safe</span>
                          <p>
                            You protected shelter circulation, monitoring, and emergency communications.
                            {decision ? ` ${decision.title} was the sacrifice that made it possible.` : ''}
                          </p>
                          <SourceDrawer />
                          <button className="secondary-button" onClick={restart} type="button">
                            Replay the training
                          </button>
                        </>
                      ) : (
                        <p>Complete the shelter procedure above to reveal the mission outcome.</p>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </Step>
          ))}
        </Scrollama>
      </div>
    </main>
  )
}

export default App

