declare module 'react-scrollama' {
  import type { ReactElement, ReactNode } from 'react'

  export interface StepCallback<T = unknown> {
    data: T
    direction: 'up' | 'down'
    entry: IntersectionObserverEntry
    element: HTMLElement
  }

  interface ScrollamaProps<T = unknown> {
    children: ReactNode
    offset?: number | string
    threshold?: number
    onStepEnter?: (callback: StepCallback<T>) => void
    onStepExit?: (callback: StepCallback<T>) => void
    onStepProgress?: (callback: StepCallback<T> & { progress: number }) => void
    debug?: boolean
  }

  interface StepProps<T = unknown> {
    children: ReactElement
    data: T
  }

  export function Scrollama<T = unknown>(props: ScrollamaProps<T>): ReactElement
  export function Step<T = unknown>(props: StepProps<T>): ReactElement
}

