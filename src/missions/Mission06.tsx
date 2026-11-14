import { useEffect, useRef, useState } from 'react'
import { Slider } from './shared/Controls'
import type { MissionComponentProps } from './types'

const TARGETS = {
  co2: [1000, 1200] as [number, number],
  nutrient: [60, 80] as [number, number],
  ph: [5.5, 6.0] as [number, number],
}

export function Mission06({ onSolve }: MissionComponentProps) {
  const [co2, setCo2] = useState(760)
  const [nutrient, setNutrient] = useState(38)
  const [ph, setPh] = useState(4.8)
  const [health, setHealth] = useState(12)
  const solved = useRef(false)

  const inBand = (value: number, target: [number, number]) =>
    value >= target[0] && value <= target[1]

  const co2Ok = inBand(co2, TARGETS.co2)
  const nutrientOk = inBand(nutrient, TARGETS.nutrient)
  const phOk = inBand(ph, TARGETS.ph)
  const allOk = co2Ok && nutrientOk && phOk
  const lockout = ph < 5.5 || ph > 6.0

  useEffect(() => {
    const id = window.setInterval(() => {
      setHealth((current) =>
        Math.min(100, Math.max(0, current + (allOk ? 4 : -3))),
      )
    }, 300)
    return () => window.clearInterval(id)
  }, [allOk])

  useEffect(() => {
    if (health < 100 || solved.current) return
    solved.current = true
    onSolve({
      accuracy: 100,
      notes: [
        'Greenhouse pH stable at 5.8.',
        'Nutrient mix in the target band at 70%.',
        'Photosynthesis running. Cabin oxygen decline halted.',
      ],
    })
  }, [health, onSolve])

  const leafState =
    health >= 100
      ? 'Crop recovered'
      : health > 55
        ? 'New growth'
        : health > 20
          ? 'Recovering'
          : 'Wilting'

  return (
    <div className="mission-workspace bliss">
      <div className="mission-column mission-column--wide">
        <div className="greenhouse-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Advanced Plant Habitat · crop bay</span>
            <span className={allOk ? 'status status--good' : 'status status--warn'}>
              {lockout ? 'Nutrient lockout' : allOk ? 'Photosynthesis stable' : leafState}
            </span>
          </div>

          <div className="growth-chamber">
            <div className="growth-chamber__lights">
              <i />
              <i />
              <i />
            </div>
            <div className="plants">
              {Array.from({ length: 7 }, (_, index) => (
                <div
                  className="plant"
                  key={index}
                  style={{
                    height: `${18 + (health / 100) * (100 + index * 6)}px`,
                    opacity: 0.3 + (health / 100) * 0.7,
                    animationDelay: `${index * 90}ms`,
                  }}
                >
                  <span />
                  <i />
                  <b />
                </div>
              ))}
            </div>
            <div className="growth-chamber__floor" />
            <div className="growth-chamber__readout">
              <span>Plant health</span>
              <strong>{Math.round(health)}%</strong>
            </div>
            {health > 40 ? <div className="oxygen-bubbles" /> : null}
          </div>

          <div className="stability-track">
            <i style={{ width: `${health}%` }} />
          </div>

          <div className="readout-row">
            <div className="readout">
              <span>Leaf state</span>
              <strong className={health > 55 ? 'is-good' : ''}>{leafState}</strong>
            </div>
            <div className="readout">
              <span>CO₂ uptake</span>
              <strong className={co2Ok ? 'is-good' : ''}>
                {co2Ok ? 'normal' : 'low'}
              </strong>
            </div>
            <div className="readout">
              <span>pH lockout</span>
              <strong className={!lockout ? 'is-good' : ''}>
                {lockout ? 'active' : 'clear'}
              </strong>
            </div>
          </div>

          <p aria-live="polite" className="console-message">
            {lockout
              ? 'pH is outside 5.5–6.0. Iron and magnesium are locking out. Adjust the buffer.'
              : allOk
                ? 'All three bands are green. Hold the balance until the crop recovers.'
                : 'Bring CO₂, nutrient mix, and pH into their green bands at the same time.'}
          </p>
        </div>
      </div>

      <div className="mission-column">
        <div className="nutrient-panel panel">
          <span className="eyebrow">Chamber controls</span>

          <Slider
            label="CO₂ chamber"
            max={1600}
            min={600}
            onChange={setCo2}
            step={10}
            target={TARGETS.co2}
            unit=" ppm"
            value={co2}
          />

          <Slider
            label="Nutrient mix"
            max={100}
            min={0}
            onChange={setNutrient}
            target={TARGETS.nutrient}
            unit="%"
            value={nutrient}
          />

          <Slider
            label="pH buffer"
            max={7.5}
            min={4.5}
            onChange={setPh}
            step={0.1}
            target={TARGETS.ph}
            unit=""
            value={ph}
            format={(value) => value.toFixed(1)}
          />

          <div className="nutrient-grid">
            {[
              ['CO₂', co2Ok, `${co2} ppm`],
              ['Nutrients', nutrientOk, `${nutrient}%`],
              ['pH', phOk, ph.toFixed(1)],
            ].map(([label, ok, value]) => (
              <span className={ok ? 'is-good' : ''} key={String(label)}>
                <b>{label}</b>
                {value}
              </span>
            ))}
          </div>
        </div>

        <div className="science-note panel">
          <span className="eyebrow">Why it matters</span>
          <p>
            The plants pull carbon dioxide out of the cabin and add oxygen. If the crop
            stays healthy, it buys the crew time while the scrubbers and oxygen reactor
            come back online.
          </p>
        </div>
      </div>
    </div>
  )
}
