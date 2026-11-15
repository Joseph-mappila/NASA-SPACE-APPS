import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { audio } from '../../audio/engine'

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  target?: [number, number]
  onChange: (value: number) => void
  disabled?: boolean
  format?: (value: number) => string
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  target,
  onChange,
  disabled = false,
  format,
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100
  const targetLeft = target ? ((target[0] - min) / (max - min)) * 100 : 0
  const targetWidth = target ? ((target[1] - target[0]) / (max - min)) * 100 : 0
  const inTarget = target ? value >= target[0] && value <= target[1] : true
  const lastTick = useRef(0)

  return (
    <label
      className={`slider ${inTarget ? 'is-target' : ''} ${disabled ? 'is-disabled' : ''}`}
      style={
        {
          '--slider-value': `${percent}%`,
          '--target-left': `${targetLeft}%`,
          '--target-width': `${targetWidth}%`,
        } as CSSProperties
      }
    >
      <span className="slider__head">
        <span>{label}</span>
        <strong>
          {format ? format(value) : Math.round(value)}
          {unit}
        </strong>
      </span>
      <span className="slider__track">
        {target ? <i className="slider__target" /> : null}
        <i className="slider__fill" />
        <input
          aria-label={label}
          disabled={disabled}
          max={max}
          min={min}
          onChange={(event) => {
            const now = performance.now()
            if (now - lastTick.current > 60) {
              lastTick.current = now
              audio.tick()
            }
            onChange(Number(event.target.value))
          }}
          step={step}
          type="range"
          value={value}
        />
      </span>
      {target ? (
        <span className="slider__limits">
          <small>{min}{unit}</small>
          <small className="slider__target-label">
            target {target[0]}–{target[1]}{unit}
          </small>
          <small>{max}{unit}</small>
        </span>
      ) : null}
    </label>
  )
}

type GaugeProps = {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  tone?: 'cyan' | 'amber' | 'red' | 'green'
  danger?: boolean
}

export function Gauge({
  label,
  value,
  min,
  max,
  unit = '',
  tone = 'cyan',
  danger = false,
}: GaugeProps) {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  return (
    <div className={`gauge gauge--${tone} ${danger ? 'is-danger' : ''}`}>
      <div
        className="gauge__ring"
        style={{ '--gauge-percent': `${percent * 3.6}deg` } as CSSProperties}
      >
        <div className="gauge__face">
          <strong>{Math.round(value)}{unit}</strong>
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
}

type HoldButtonProps = {
  label: string
  holdingLabel?: string
  durationMs?: number
  onComplete: () => void
  onCancel?: () => void
  disabled?: boolean
  className?: string
}

export function HoldButton({
  label,
  holdingLabel = 'Holding…',
  durationMs = 2400,
  onComplete,
  onCancel,
  disabled = false,
  className = '',
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0)
  const timer = useRef<number | null>(null)
  const startedAt = useRef(0)
  const completed = useRef(false)

  const stop = (cancelled: boolean) => {
    if (timer.current !== null) {
      window.clearInterval(timer.current)
      timer.current = null
    }
    if (cancelled && !completed.current) {
      setProgress(0)
      onCancel?.()
    }
  }

  const start = () => {
    if (disabled || timer.current !== null) return
    completed.current = false
    startedAt.current = performance.now()
    audio.servo()
    timer.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt.current
      const next = Math.min(1, elapsed / durationMs)
      setProgress(next)
      if (next >= 1) {
        completed.current = true
        stop(false)
        onComplete()
      }
    }, 40)
  }

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current)
    }
  }, [])

  return (
    <button
      className={`hold-button ${className}`}
      disabled={disabled}
      onPointerCancel={() => stop(true)}
      onPointerDown={start}
      onPointerLeave={() => stop(true)}
      onPointerUp={() => stop(true)}
      style={{ '--hold': `${progress * 100}%` } as CSSProperties}
      type="button"
    >
      <i />
      <span>{progress > 0 ? holdingLabel : label}</span>
    </button>
  )
}

export function Toggle({
  label,
  detail,
  active,
  onChange,
  tone = 'cyan',
}: {
  label: string
  detail?: string
  active: boolean
  onChange: (active: boolean) => void
  tone?: 'cyan' | 'amber' | 'red' | 'green'
}) {
  return (
    <button
      aria-pressed={active}
      className={`toggle toggle--${tone} ${active ? 'is-on' : ''}`}
      onClick={() => {
        audio.click()
        onChange(!active)
      }}
      type="button"
    >
      <i />
      <span>
        <strong>{label}</strong>
        {detail ? <small>{detail}</small> : null}
      </span>
      <b>{active ? 'ON' : 'OFF'}</b>
    </button>
  )
}

export function PanelTitle({
  children,
  aside,
}: {
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <div className="panel-title">
      <span className="eyebrow">{children}</span>
      {aside ? <span>{aside}</span> : null}
    </div>
  )
}

export function MeterBar({
  value,
  tone = 'cyan',
  label,
}: {
  value: number
  tone?: 'cyan' | 'amber' | 'red' | 'green'
  label?: string
}) {
  return (
    <div
      className={`meter-bar meter-bar--${tone}`}
      style={{ '--meter': `${Math.min(100, Math.max(0, value))}%` } as CSSProperties}
    >
      <i />
      {label ? <span>{label}</span> : null}
    </div>
  )
}
