import { useEffect, useRef, type RefObject } from 'react'

export const INTRO_SCENE_COUNT = 9

export function useSceneProgress(
  progressRef: RefObject<number>,
  sceneIndex: number,
  active: boolean,
  animate: (local: number) => void,
): void {
  const animateRef = useRef(animate)
  animateRef.current = animate

  useEffect(() => {
    if (!active) return
    let frame = 0
    const tick = () => {
      const progress = progressRef.current
      const start = sceneIndex / INTRO_SCENE_COUNT
      const end = (sceneIndex + 1) / INTRO_SCENE_COUNT
      const local = Math.min(
        1,
        Math.max(0, (progress - start) / (end - start)),
      )
      animateRef.current(local)
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [active, progressRef, sceneIndex])
}
