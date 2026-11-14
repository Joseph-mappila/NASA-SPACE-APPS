import { useCallback, useEffect, useRef, useState } from 'react'

export function useMinigameTimer(
  limit: number,
  finished: boolean,
  onExpire: () => void,
) {
  const [timeLeft, setTimeLeft] = useState(limit)
  const expireRef = useRef(onExpire)
  expireRef.current = onExpire

  useEffect(() => {
    if (finished) return
    const id = window.setInterval(() => {
      setTimeLeft((seconds) => Math.max(0, seconds - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [finished])

  useEffect(() => {
    if (!finished && timeLeft === 0) expireRef.current()
  }, [finished, timeLeft])

  const reset = useCallback(() => setTimeLeft(limit), [limit])
  const penalize = useCallback((seconds: number) => {
    setTimeLeft((current) => Math.max(0, current - seconds))
  }, [])

  return { timeLeft, reset, penalize }
}

export function formatMinigameTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}
