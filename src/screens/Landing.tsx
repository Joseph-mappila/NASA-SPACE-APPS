import starterImage from '../images/starter_img.webp'

type LandingProps = {
  soundEnabled: boolean
  onBegin: () => void
  onToggleSound: () => void
}

export function Landing({
  soundEnabled,
  onBegin,
  onToggleSound,
}: LandingProps) {
  return (
    <main className="screen landing">
      <img
        alt="A comic illustration of NASA's Luna outpost on the Moon"
        className="landing__image"
        src={starterImage}
      />
      <div className="landing__veil" />
      <div className="landing__grid" />
      <div className="grain" />

      <header className="landing__top">
        <span className="eyebrow">CurioCET · Interactive science story</span>
        <button
          aria-pressed={soundEnabled}
          className="landing__sound"
          onClick={onToggleSound}
          type="button"
        >
          <span aria-hidden="true">{soundEnabled ? '◖))' : '◖×'}</span>
          Sound {soundEnabled ? 'on' : 'off'}
        </button>
      </header>

      <section className="landing__content">
        <span className="landing__kicker">A NASA outpost science adventure</span>
        <h1 className="landing__title">LUNA</h1>
        <span className="landing__subtitle">OUTPOST 57</span>
        <p className="landing__lede">
          Every giant leap began with a question. Travel from the first lightning
          strike to a working outpost on the Moon — then keep fifteen astronauts
          alive when the sky turns against them.
        </p>

        <div className="landing__actions">
          <button className="btn btn--primary landing__begin" onClick={onBegin} type="button">
            Begin the journey
          </button>
          <span className="landing__age">Ages 7–12 · 8 missions · 15 crew</span>
        </div>

        <div className="landing__facts">
          <div>
            <span>01</span>
            <strong>Scroll through history</strong>
            <small>Lightning, fire, metal, wheels, cars, ships, planes, rockets.</small>
          </div>
          <div>
            <span>02</span>
            <strong>Run the outpost</strong>
            <small>Real NASA science, real consequences, no retries.</small>
          </div>
          <div>
            <span>03</span>
            <strong>Keep them alive</strong>
            <small>Power, oxygen, water, and crew health all matter.</small>
          </div>
        </div>
      </section>

      <footer className="landing__footer">
        <span>Best with sound · Headphones recommended</span>
        <span>CurioCET · Fictional NASA outpost</span>
      </footer>
    </main>
  )
}
