import type { Grade } from './types'

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function formatSeconds(ms: number): string {
  return `${Math.max(0, Math.round(ms / 1000))}s`
}

export function gradeLabel(grade: Grade): string {
  if (grade === 'S') return 'Flawless'
  if (grade === 'A') return 'Excellent'
  if (grade === 'B') return 'Passed'
  return 'Failed'
}
