import { useEffect, useRef, useState } from 'react'
import { Slider } from './shared/Controls'
import type { MissionComponentProps } from './types'

const TARGETS = {
  co2: [1000, 1200] as [number, number],
  nitrate: [60, 80] as [number, number],
  potassium: [50, 70] as [number, number],
  magnesium: [40, 60] as [number, number],
  ph: [5.5, 6.0] as [number, number],
}

export function Mission06({ onSolve }: MissionComponentProps) {
  const [co2, setCo2] = useState(820)
  const [nitrate, setNitrate] = useState(34)
  const [potassium, setPotassium] = useState(38)
  const [magnesium, setMagnesium] = useState(28)
  const [ph, setPh] = useState(4.9)
  const [stability, setStability] = useState(0)
  const solved = useRef(false)

  const inBand = (value: number, target: [number, number]) =>
    value >= target[0] && value <= target[1]

  const co2Ok = inBand(co2, TARGETS.co2)
  const nitrateOk = inBand(nitrate, TARGETS.nitrate)
  const potassiumOk = inBand(potassium, TARGETS.potassium)
  const magnesiumOk = inBand(magnesium, TARGETS.magnesium)
  const phOk = inBand(ph, TARGETS.ph)
  const allOk = co2Ok && nitrateOk && potassiumOk && magnesiumOk && phOk
  const lockout = ph < 5.5 || ph > 6.0

  useEffect(() => {
    const id = window.setInterval(() => {
      setStability((current) =>
        Math.min(100, Math.max(0, current + (allOk ? 5 : -3))),
      )
    }, 260)
    return () => window.clearInterval(id)
  }, [allOk])

  useEffect(() => {
    if (stability < 100 || solved.current) return
    solved.current = true
    onSolve({
      accuracy: 100,
      notes: [
        'Greenhouse pH stable at 5.8.',
        'Nitrate, potassium, and magnesium in the target bands.',
        'Photosynthesis running. Cabin oxygen decline halted.',
      ],
    })
  }, [stability, onSolve])

  return (
    <div className="mission-workspace bliss">
      <div className="mission-column mission-column--wide">
        <div className="greenhouse-panel panel">
          <div className="panel-title">
            <span className="eyebrow">Bioregenerative plant module</span>
            <span className={allOk ? 'status status--good' : 'status status--warn'}>
              {lockout ? 'Nutrient lockout' : allOk ? 'Photosynthesis stable' : 'Balancing'}
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
                    height: `${18 + (stability / 100) * (100 + index * 6)}px`,
                    opacity: 0.3 + (stability / 100) * 0.7,
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
              <span>Stability</span>
              <strong>{Math.round(stability)}%</strong>
            </div>
            {stability > 40 ? <div className="oxygen-bubbles" /> : null}
          </div>

          <div className="stability-track">
            <i style={{ width: `${stability}%` }} />
          </div>
          <p className="console-message">
            {lockout
              ? 'pH is outside 5.5–6.0. Iron and magnesium are locking out. Adjust the buffer.'
              : allOk
                ? 'All bands are green. Hold the balance until the crop stabilizes.'
                : 'Bring every control into its target band at the same time.'}
          </p>
        </div>
      </div>

      <div className="mission-column">
        <div className="nutrient-panel panel">
          <span className="eyebrow">Nutrient dosing</span>
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
            label="Nitrate NO₃⁻"
            max={100}
            min={0}
            onChange={setNitrate}
            target={TARGETS.nitrate}
            unit="%"
            value={nitrate}
          />
          <Slider
            label="Potassium K⁺"
            max={100}
            min={0}
            onChange={setPotassium}
            target={TARGETS.potassium}
            unit="%"
            value={potassium}
          />
          <Slider
            label="Magnesium Mg²⁺"
            max={100}
            min={0}
            onChange={setMagnesium}
            target={TARGETS.magnesium}
            unit="%"
            value={magnesium}
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
              ['CO₂', co2Ok],
              ['NO₃⁻', nitrateOk],
              ['K⁺', potassiumOk],
              ['Mg²⁺', magnesiumOk],
              ['pH', phOk],
            ].map(([label, ok]) => (
              <span className={ok ? 'is-good' : ''} key={String(label)}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
