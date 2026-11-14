import { useEffect, useState, type FormEvent } from 'react'
import { audio } from '../audio/engine'
import commanderImage from '../images/commander_chen.webp'

type NameEntryProps = {
  onSubmit: (name: string) => void
}

export function NameEntry({ onSubmit }: NameEntryProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    audio.beep(1240, 0.07, 0.028)
  }, [])

  function submit(event: FormEvent) {
    event.preventDefault()
    const clean = name.trim()
    if (clean.length < 2) {
      setError('HAL needs at least two characters for the mission log.')
      return
    }
    onSubmit(clean)
  }

  return (
    <main className="screen name-screen">
      <div className="name-screen__stars" />
      <div className="name-screen__planet" />
      <div className="grain" />

      <section className="name-card panel">
        <div className="name-card__portrait">
          <img
            alt="Commander Chen, Luna outpost crew"
            src={commanderImage}
          />
          <span>CREW LINK · CDR CHEN</span>
        </div>

        <div className="name-card__body">
          <span className="eyebrow">Luna communications · incoming</span>
          <h1 className="display">Mission Control,<br />identify yourself.</h1>
          <p>
            <strong>HAL:</strong> I am ready to open the Day 57 mission log.
            What should I call you, Captain?
          </p>

          <form onSubmit={submit}>
            <label htmlFor="callsign">Your first name or callsign</label>
            <div className="name-card__field">
              <span aria-hidden="true">&gt;</span>
              <input
                aria-describedby={error ? 'name-error' : undefined}
                autoComplete="off"
                autoFocus
                id="callsign"
                maxLength={24}
                onChange={(event) => {
                  setName(event.target.value)
                  setError('')
                }}
                placeholder="e.g. Nova"
                value={name}
              />
            </div>
            {error ? (
              <span className="form-error" id="name-error" role="alert">
                {error}
              </span>
            ) : null}
            <button className="btn btn--primary btn--wide" type="submit">
              Open the Luna link
            </button>
          </form>

          <small>
            Your name stays in this browser. No account, no tracking.
          </small>
        </div>
      </section>

      <div className="name-screen__footer">
        <span>CurioCET presents</span>
        <strong>LUNA · OUTPOST 57</strong>
      </div>
    </main>
  )
}
