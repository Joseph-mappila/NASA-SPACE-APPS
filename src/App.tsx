import { type FormEvent, useEffect, useReducer, useState } from 'react'
import { briefingStatus } from './data/content'
import { MissionOne } from './components/MissionOne'
import { MissionTwo } from './components/MissionTwo'
import { playLightningSound, Prologue } from './components/Prologue'
import { gameReducer, initialGameState, type GameState, type Phase } from './state/game'

const phaseOrder: Phase[] = [
  'briefing',
  'mission-one-brief',
  'mission-one',
  'mission-one-result',
  'mission-two-brief',
  'mission-two',
  'mission-two-result',
  'continuation',
]

function StatusHud({ state }: { state: GameState }) {
  const resources = [
    { label: 'Power', value: state.power, code: 'PWR' },
    { label: 'Oxygen', value: state.oxygen, code: 'O₂' },
    { label: 'Water / Food', value: state.waterFood, code: 'H₂O' },
    { label: 'Crew health', value: state.crewHealth, code: '15' },
  ]
  const phaseIndex = Math.max(0, phaseOrder.indexOf(state.phase))

  return (
    <aside className="status-hud" aria-label="Luna outpost status">
      <div className="status-hud__brand">
        <i aria-hidden="true" />
        <span><strong>LUNA</strong><small>Day 57</small></span>
      </div>
      <div className="status-hud__resources">
        {resources.map((resource) => (
          <div className="hud-resource" key={resource.label}>
            <b>{resource.code}</b>
            <span>
              <small>{resource.label}</small>
              <i><em style={{ transform: `scaleX(${resource.value / 100})` }} /></i>
            </span>
            <strong>{resource.value}%</strong>
          </div>
        ))}
      </div>
      <div className="status-hud__progress" aria-label={`Chapter ${phaseIndex + 1} of ${phaseOrder.length}`}>
        <span>{String(phaseIndex + 1).padStart(2, '0')}</span>
        <i><b style={{ transform: `scaleX(${(phaseIndex + 1) / phaseOrder.length})` }} /></i>
      </div>
    </aside>
  )
}

function Gate({ onBegin }: { onBegin: (soundEnabled: boolean) => void }) {
  const [soundEnabled, setSoundEnabled] = useState(true)

  return (
    <main className="gate">
      <div className="gate__orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="gate__content">
        <span className="eyebrow">CurioCET · An interactive science story</span>
        <h1>Every giant leap<br />began with a question.</h1>
        <p>Scroll through our journey from lightning to lunar exploration—then help keep NASA’s Luna outpost running.</p>
        <div className="gate__actions">
          <button className="primary-button" onClick={() => onBegin(soundEnabled)} type="button">
            Begin journey
          </button>
          <button
            aria-pressed={soundEnabled}
            className="sound-toggle"
            onClick={() => setSoundEnabled((enabled) => !enabled)}
            type="button"
          >
            <span aria-hidden="true">{soundEnabled ? '◖))' : '◖×'}</span>
            Sound {soundEnabled ? 'on' : 'off'}
          </button>
        </div>
        <small className="gate__note">Includes lightning flashes and a thunder sound. Motion follows your scroll.</small>
      </div>
      <div className="gate__moon" aria-hidden="true">
        <i /><i /><i />
      </div>
    </main>
  )
}

export function NameEntry({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    const cleanName = name.trim()
    if (cleanName.length < 2) {
      setError('Enter at least two characters so HAL knows what to call you.')
      return
    }
    onSubmit(cleanName)
  }

  return (
    <main className="entry-screen">
      <div className="entry-screen__stars" aria-hidden="true" />
      <section className="entry-card">
        <span className="eyebrow">Luna communications link</span>
        <h1>Mission Control,<br />identify yourself.</h1>
        <p>HAL needs a name for the Day 57 mission log.</p>
        <form onSubmit={submit}>
          <label htmlFor="player-name">Your first name or callsign</label>
          <input
            aria-describedby={error ? 'name-error' : undefined}
            autoComplete="off"
            autoFocus
            id="player-name"
            maxLength={24}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
            placeholder="e.g. Nova"
            value={name}
          />
          {error && <span className="form-error" id="name-error">{error}</span>}
          <button className="primary-button" type="submit">Open Luna link</button>
        </form>
        <small>Your name stays in this browser session and is not stored.</small>
      </section>
    </main>
  )
}

function Briefing({ name, onContinue }: { name: string; onContinue: () => void }) {
  return (
    <main className="briefing">
      <div className="briefing__horizon" aria-hidden="true"><div className="habitat"><i /><i /><i /></div></div>
      <section className="briefing-card">
        <span className="eyebrow">HAL · 07:55 lunar standard time</span>
        <h1>Good morning,<br />Captain {name}.</h1>
        <p>We are currently on Day 57 of Mission Luna. Current systems are all operational.</p>
        <div className="briefing-status">
          {briefingStatus.map((item) => (
            <div key={item.key}><span>{item.label}</span><strong>{item.detail}</strong></div>
          ))}
        </div>
        <div className="alert-strip"><i aria-hidden="true" /> Solar Particle Event expected in 8 hours.</div>
        <dl className="briefing-facts">
          <div><dt>Crew</dt><dd>15/15 alive and well. No casualties to report.</dd></div>
          <div><dt>Comms</dt><dd>Earth link intact. No incoming messages.</dd></div>
        </dl>
        <div className="objective-list">
          <span>Pending objectives</span>
          <ol><li>Clean solar panels on Block A</li><li>Complete waste disposal</li></ol>
        </div>
        <button className="primary-button" onClick={onContinue} type="button">Begin first objective</button>
      </section>
    </main>
  )
}

type MissionBriefProps = {
  number: string
  eyebrow: string
  title: string
  science: string
  steps: string[]
  risk: string
  onStart: () => void
}

function MissionBrief({ number, eyebrow, title, science, steps, risk, onStart }: MissionBriefProps) {
  return (
    <main className="mission-brief">
      <div className="mission-brief__number" aria-hidden="true">{number}</div>
      <section>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{science}</p>
        <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <div className="risk-card"><strong>If time expires</strong><span>{risk}</span></div>
        <p className="timer-note">The mission clock begins after you select Start.</p>
        <button className="primary-button" onClick={onStart} type="button">Start timed mission</button>
      </section>
    </main>
  )
}

function ResultScreen({
  success,
  mission,
  onContinue,
}: {
  success: boolean
  mission: 1 | 2
  onContinue: () => void
}) {
  const content = mission === 1
    ? success
      ? { title: 'Block A is at full output.', detail: 'The outpost batteries can now charge to 100% before the flare arrives.', metric: 'Power 100%' }
      : { title: 'Block A remains dust-limited.', detail: 'Power stays capped at 52%, creating a brownout risk during storm shelter operations.', metric: 'Power 52%' }
    : success
      ? { title: 'Water and tiles recovered.', detail: 'Luna gains 15% Water and six dense tiles for the storm shelter.', metric: '+15% Water · 6 tiles' }
      : { title: 'The waste cycle is incomplete.', detail: 'No water or shield tiles were recovered. Later missions will begin with fewer resources.', metric: '0 Water · 0 tiles' }

  return (
    <main className={`result-screen ${success ? 'is-success' : 'is-failure'}`}>
      <section>
        <span className="result-screen__signal">{success ? 'Objective complete' : 'Mission time expired'}</span>
        <h1>{content.title}</h1>
        <p>{content.detail}</p>
        <strong className="result-metric">{content.metric}</strong>
        <button className="primary-button" onClick={onContinue} type="button">
          {mission === 1 ? 'Continue to waste processing' : 'Review mission status'}
        </button>
      </section>
    </main>
  )
}

function Continuation({ state, onReplay }: { state: GameState; onReplay: () => void }) {
  const bothPassed = state.missionOne === 'success' && state.missionTwo === 'success'

  return (
    <main className="continuation">
      <section className="continuation__intro">
        <span className="eyebrow">Day 57 · 13:00 · Mission log updated</span>
        <h1>{bothPassed ? 'Luna is ready for what comes next.' : 'Every choice changes what comes next.'}</h1>
        <p>
          Captain {state.playerName}, the Solar Particle Event is getting closer.
          Your work now shapes the crew’s options during the storm.
        </p>
      </section>
      <section className="consequence-grid">
        <article>
          <span>01 · Solar array</span>
          <strong>{state.power}% power</strong>
          <p>{state.missionOne === 'success' ? 'Batteries can reach full charge.' : 'A storm-time brownout is now a risk.'}</p>
        </article>
        <article>
          <span>02 · Waste processing</span>
          <strong>{state.shieldTiles} shield tiles</strong>
          <p>{state.missionTwo === 'success' ? 'Water and tiles are ready for later missions.' : 'The shelter and greenhouse will have fewer resources.'}</p>
        </article>
        <article className="consequence-grid__next">
          <span>Next · Airlock seal check</span>
          <strong>The story continues.</strong>
          <p>Missions 3–8 will carry these exact results forward.</p>
        </article>
      </section>
      <button className="primary-button" onClick={onReplay} type="button">Replay vertical slice</button>
    </main>
  )
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [state.phase])

  function advance(phase: Phase) {
    dispatch({ type: 'ADVANCE', phase })
  }

  if (state.phase === 'gate') {
    return (
      <Gate
        onBegin={(soundEnabled) => {
          if (soundEnabled) playLightningSound()
          dispatch({ type: 'BEGIN', soundEnabled })
        }}
      />
    )
  }

  if (state.phase === 'prologue') {
    return (
      <Prologue
        onComplete={() => dispatch({ type: 'FINISH_PROLOGUE' })}
        onToggleSound={() => dispatch({ type: 'TOGGLE_SOUND' })}
        soundEnabled={state.soundEnabled}
      />
    )
  }

  if (state.phase === 'name') {
    return <NameEntry onSubmit={(name) => dispatch({ type: 'SET_NAME', name })} />
  }

  if (state.phase === 'briefing') {
    return <Briefing name={state.playerName} onContinue={() => advance('mission-one-brief')} />
  }

  const shell = (content: React.ReactNode) => (
    <div className="game-shell">
      <StatusHud state={state} />
      {content}
    </div>
  )

  switch (state.phase) {
    case 'mission-one-brief':
      return shell(
        <MissionBrief
          eyebrow="Day 57 · 08:00 · T−8 hours to flare"
          number="01"
          onStart={() => advance('mission-one')}
          risk="Power remains capped at 52%, causing a bus brownout risk during Mission 4."
          science="Sharp, charged lunar dust can scratch solar coverglass. Use the Electrodynamic Dust Shield to lift it without touching the cells."
          steps={['Tune wave frequency and phase voltage until dust travels off the glass.', 'Clear clumped grains from the outer bezel in one direction.']}
          title="Block A Solar Array"
        />,
      )
    case 'mission-one':
      return shell(<MissionOne onFinish={(success) => dispatch({ type: 'FINISH_MISSION_ONE', success })} />)
    case 'mission-one-result':
      return shell(<ResultScreen mission={1} onContinue={() => advance('mission-two-brief')} success={state.missionOne === 'success'} />)
    case 'mission-two-brief':
      return shell(
        <MissionBrief
          eyebrow="Day 57 · 10:30 · T−5.5 hours to flare"
          number="02"
          onStart={() => advance('mission-two')}
          risk="No shield tiles are made, and water reserves remain low for the greenhouse."
          science="Luna cannot dump waste outside. The Trash Compaction and Processing System recovers trapped water and turns dry waste into dense tiles."
          steps={['Sort wet organic waste, polyethylene plastic, and metal foil.', 'Balance chamber heat and pressure while water moves to the condenser.']}
          title="Habitat Waste Processing"
        />,
      )
    case 'mission-two':
      return shell(<MissionTwo onFinish={(success) => dispatch({ type: 'FINISH_MISSION_TWO', success })} />)
    case 'mission-two-result':
      return shell(<ResultScreen mission={2} onContinue={() => advance('continuation')} success={state.missionTwo === 'success'} />)
    case 'continuation':
      return shell(<Continuation onReplay={() => dispatch({ type: 'RESTART' })} state={state} />)
    default:
      return null
  }
}

export default App

