import { useEffect, useState } from 'react'
import { missionSources } from '../data/content'
import { MissionTimer } from './MissionTimer'

export const MISSION_ONE_SECONDS = 50

type MissionOneProps = {
  onFinish: (success: boolean) => void
}

export function MissionOne({ onFinish }: MissionOneProps) {
  const [frequency, setFrequency] = useState(28)
  const [voltage, setVoltage] = useState(35)
  const [dustCleared, setDustCleared] = useState(0)
  const [brushStep, setBrushStep] = useState(0)
  const [message, setMessage] = useState('Find the band where the grains begin to lift.')
  const [finished, setFinished] = useState(false)
  const tuningSafe = frequency >= 48 && frequency <= 62 && voltage >= 54 && voltage <= 68
  const arcing = voltage > 82
  const brushing = dustCleared >= 100

  useEffect(() => {
    if (!tuningSafe || brushing || finished) return
    const interval = window.setInterval(() => {
      setDustCleared((value) => Math.min(100, value + 5))
    }, 450)
    return () => window.clearInterval(interval)
  }, [brushing, finished, tuningSafe])

  useEffect(() => {
    if (arcing) {
      setMessage('Arc warning. Reduce the voltage before the grid is damaged.')
    } else if (tuningSafe) {
      setMessage('Wave matched. Charged dust is travelling toward the edge.')
    } else if (frequency < 48 || voltage < 54) {
      setMessage('The wave is too weak. The dust is still clinging to the glass.')
    } else {
      setMessage('The signal is unstable. Bring both controls into the safe band.')
    }
  }, [arcing, frequency, tuningSafe, voltage])

  useEffect(() => {
    if (dustCleared === 100) {
      setMessage('The glass is clear. Brush the four bezel clumps from left to right.')
    }
  }, [dustCleared])

  function brush(index: number) {
    if (finished || !brushing) return
    if (index !== brushStep) {
      setMessage(index < brushStep ? 'That section is already clear.' : 'Use slow, one-direction strokes from left to right.')
      return
    }
    const next = brushStep + 1
    setBrushStep(next)
    setMessage(next === 4 ? 'Array clear. Full rated output restored.' : `Bezel clump ${next} cleared. Keep moving right.`)
    if (next === 4) {
      setFinished(true)
      window.setTimeout(() => onFinish(true), 650)
    }
  }

  function fail() {
    setFinished(true)
    onFinish(false)
  }

  return (
    <main className="mission-page mission-one">
      <header className="mission-heading">
        <div>
          <span className="eyebrow">Mission 01 · Block A solar array</span>
          <h1>Move the dust. Protect the glass.</h1>
        </div>
        <MissionTimer seconds={MISSION_ONE_SECONDS} stopped={finished} onExpire={fail} />
      </header>

      <div className="mission-layout">
        <section className="mission-console" aria-labelledby="eds-console-title">
          <div className="console-title">
            <div>
              <span>EDS control</span>
              <h2 id="eds-console-title">{brushing ? 'Clear the outer bezel' : 'Tune the travelling wave'}</h2>
            </div>
            <strong>{brushing ? `${brushStep}/4 clumps` : `${dustCleared}% clear`}</strong>
          </div>

          <div className={`solar-array ${tuningSafe ? 'is-lifting' : ''} ${arcing ? 'is-arcing' : ''}`}>
            <div className="solar-grid">
              {Array.from({ length: 28 }, (_, index) => (
                <i key={index} style={{ opacity: Math.max(0.08, 1 - dustCleared / 100 + (index % 4) * 0.04) }} />
              ))}
            </div>
            <div className="electric-wave" aria-hidden="true" />
            <div className="bezel-clumps" aria-label="Outer bezel dust clumps">
              {Array.from({ length: 4 }, (_, index) => (
                <button
                  aria-label={`Clear bezel clump ${index + 1}`}
                  className={index < brushStep ? 'is-cleared' : index === brushStep ? 'is-next' : ''}
                  disabled={!brushing || finished}
                  key={index}
                  onClick={() => brush(index)}
                  type="button"
                />
              ))}
            </div>
          </div>

          {!brushing && (
            <div className="control-pair">
              <label>
                <span><b>Wave frequency</b><output>{frequency} Hz</output></span>
                <input
                  disabled={finished}
                  max="90"
                  min="20"
                  onChange={(event) => setFrequency(Number(event.target.value))}
                  type="range"
                  value={frequency}
                />
                <small>Lift band detected between 48 and 62 Hz</small>
              </label>
              <label>
                <span><b>Phase voltage</b><output>{voltage}%</output></span>
                <input
                  disabled={finished}
                  max="100"
                  min="20"
                  onChange={(event) => setVoltage(Number(event.target.value))}
                  type="range"
                  value={voltage}
                />
                <small>Too low leaves dust stuck. Too high can arc.</small>
              </label>
            </div>
          )}

          <p className={`console-message ${arcing ? 'is-warning' : ''}`} aria-live="polite">{message}</p>
        </section>

        <aside className="science-panel">
          <span className="eyebrow">How it works</span>
          <h2>An electric wave does the cleaning.</h2>
          <p>
            Lunar dust is made of sharp, charged grains. Dry brushing can scratch solar coverglass.
            The EDS sends a travelling electric wave across transparent electrodes to lift dust away.
          </p>
          <div className="science-rule">
            <strong>Mission rule</strong>
            <span>Brush only the outer bezel—never the solar cells.</span>
          </div>
          <a href={missionSources.eds.href} rel="noreferrer" target="_blank">{missionSources.eds.label}</a>
        </aside>
      </div>
    </main>
  )
}
