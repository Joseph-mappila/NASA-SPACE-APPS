import { useEffect, useRef, useState } from 'react'

type MissionTimerProps = {
  seconds: number
  stopped: boolean
  onExpire: () => void
}

export function MissionTimer({ seconds, stopped, onExpire }: MissionTimerProps) {
  const [remaining, setRemaining] = useState(seconds)
  const expireRef = useRef(onExpire)
  const expiredRef = useRef(false)
  expireRef.current = onExpire

  useEffect(() => {
    if (stopped) return
    const startedAt = performance.now()
    const interval = window.setInterval(() => {
      const next = Math.max(0, seconds - Math.floor((performance.now() - startedAt) / 1000))
      setRemaining(next)
      if (next === 0 && !expiredRef.current) {
        expiredRef.current = true
        window.clearInterval(interval)
        expireRef.current()
      }
    }, 250)
    return () => window.clearInterval(interval)
  }, [seconds, stopped])

  const urgent = remaining <= Math.min(20, Math.ceil(seconds * 0.25))
  const minutes = Math.floor(remaining / 60)
  const displaySeconds = String(remaining % 60).padStart(2, '0')

  return (
    <div className={`mission-timer ${urgent ? 'is-urgent' : ''}`} aria-live={urgent ? 'assertive' : 'off'}>
      <span>Mission clock</span>
      <strong>{minutes}:{displaySeconds}</strong>
      <i aria-hidden="true"><b style={{ transform: `scaleX(${remaining / seconds})` }} /></i>
    </div>
  )
}
