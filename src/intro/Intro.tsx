import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { audio } from '../audio/engine'
import EffectsCanvas, { type EffectsHandle } from './EffectsCanvas'
import {
  CarScene,
  FireScene,
  ForgeScene,
  PlaneScene,
  RocketScene,
  ShipScene,
  StormScene,
  WheelScene,
} from './Scenes'
import { INTRO_SCENE_COUNT } from './useSceneProgress'

gsap.registerPlugin(ScrollTrigger)

type IntroProps = {
  soundEnabled: boolean
  onToggleSound: () => void
  onComplete: () => void
}

/**
 * These are the author's own lines from story.txt, in order. Do not rewrite,
 * tighten, or add labels. The welcome briefing (lines 19-26) belongs to the
 * Day 57 screen, not the intro.
 */
const CAPTIONS: readonly (readonly string[])[] = [
  [
    'Lightning, a phenomenon we now consider with fascination and understanding was once a source of great fear to humans.',
    "They couldn't understand what caused the big flash across the sky, and the big bang that followed it.",
    'It was nothing like they had seen before, never known before.',
    'They attributed it to gods, they worshipped nature begging for forgiveness for their sins.',
  ],
  [
    'Suddenly the lightning hit a tree and engulfed it in fire, and they were fascinated by it. Scared by it.',
    'But curiosity pulled them forward and eventually they learnt to use it, they learnt to hunt with it.',
  ],
  [
    'They found that the rocks in their sorroundings were not the same, some were brittle, some however were shiny and sonorous.',
    'They used these and found that with fire they could be moulded into weapons, into structures far stronger than anything they had thought of before.',
  ],
  ['The rest, as they say, is history.', 'From simple wheel driven carts'],
  ['to cars,'],
  ['to ships'],
  ['and to planes.'],
  [
    'And finally to rockets, we finally managed to leave the little speck of dust we were confined to in this galaxy.',
  ],
]

const SCENE_AUDIO = [
  'storm',
  'fire',
  'forge',
  'cart',
  'engine',
  'ocean',
  'plane',
  'rocket',
  'space',
] as const

const SCENE_CLIPS = [
  null,
  null,
  null,
  'cart',
  'car',
  'ship',
  'airplane',
  'rocket',
  null,
] as const

export function Intro({ soundEnabled, onToggleSound, onComplete }: IntroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const sceneRef = useRef(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const effectsRef = useRef<EffectsHandle>(null)
  const [sceneIndex, setSceneIndex] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          progressRef.current = progress
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${progress})`
          }
          const next = Math.min(
            INTRO_SCENE_COUNT - 1,
            Math.max(0, Math.floor(progress * INTRO_SCENE_COUNT)),
          )
          sceneRef.current = next
          setSceneIndex((previous) => (previous === next ? previous : next))
        },
      })
    }, section)

    return () => context.revert()
  }, [])

  // Browsers only allow an AudioContext to start inside a real user gesture.
  // Scrolling does not count, so unlock on any pointer/key/wheel input.
  useEffect(() => {
    if (!soundEnabled) return
    const unlock = () => audio.enable()
    const options: AddEventListenerOptions = { passive: true }
    window.addEventListener('pointerdown', unlock, options)
    window.addEventListener('touchstart', unlock, options)
    window.addEventListener('keydown', unlock)
    window.addEventListener('wheel', unlock, options)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('wheel', unlock)
    }
  }, [soundEnabled])

  useEffect(() => {
    sceneRef.current = sceneIndex
    if (!soundEnabled) {
      audio.setEnabled(false)
      audio.setScene(null)
      audio.setSceneClip(null)
      return
    }
    audio.setEnabled(true)
    audio.setScene(SCENE_AUDIO[sceneIndex])
    audio.setSceneClip(SCENE_CLIPS[sceneIndex])

    const timers: number[] = []

    if (sceneIndex === 0) {
      const strike = () => {
        effectsRef.current?.strike()
        timers.push(window.setTimeout(() => audio.playClip('lightning'), 90))
      }
      timers.push(window.setTimeout(strike, 420))
      const scheduleNext = () => {
        timers.push(
          window.setTimeout(() => {
            strike()
            scheduleNext()
          }, 3400 + Math.random() * 1600),
        )
      }
      scheduleNext()
    }

    if (sceneIndex === 5) audio.horn()
    if (sceneIndex === 7) audio.rocketIgnition()

    return () => {
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [sceneIndex, soundEnabled])

  useEffect(() => {
    return () => {
      audio.setScene(null)
      audio.setSceneClip(null)
    }
  }, [])

  const finish = () => {
    audio.whoosh()
    audio.setScene(null)
    onComplete()
  }

  const isTitle = sceneIndex === INTRO_SCENE_COUNT - 1
  const caption = CAPTIONS[Math.min(sceneIndex, CAPTIONS.length - 1)]
  const isShort = caption.join(' ').length < 30

  return (
    <section
      aria-label="Intro"
      className="intro"
      ref={sectionRef}
    >
      <div className="intro__pin" ref={stageRef}>
        <div className="intro__grade" />
        <div className="intro__scenes">
          <StormScene active={sceneIndex === 0} index={0} progressRef={progressRef} />
          <FireScene active={sceneIndex === 1} index={1} progressRef={progressRef} />
          <ForgeScene
            active={sceneIndex === 2}
            index={2}
            onImpact={() => {
              audio.hammer()
              effectsRef.current?.sparkBurst()
            }}
            progressRef={progressRef}
          />
          <WheelScene active={sceneIndex === 3} index={3} progressRef={progressRef} />
          <CarScene active={sceneIndex === 4} index={4} progressRef={progressRef} />
          <ShipScene active={sceneIndex === 5} index={5} progressRef={progressRef} />
          <PlaneScene active={sceneIndex === 6} index={6} progressRef={progressRef} />
          <RocketScene active={sceneIndex === 7} index={7} progressRef={progressRef} />
        </div>

        <EffectsCanvas progressRef={progressRef} ref={effectsRef} sceneRef={sceneRef} />
        <div className="intro__vignette" />
        <div className="intro__grain grain" />
        <div className="intro__letterbox intro__letterbox--top" />
        <div className="intro__letterbox intro__letterbox--bottom" />

        <header className="intro__bar">
          <span className="intro__brand">
            LUNA <i>OUTPOST 57</i>
          </span>
          <span className="intro__counter">
            {String(sceneIndex + 1).padStart(2, '0')} / 09
          </span>
          <div className="intro__tools">
            <button
              aria-pressed={soundEnabled}
              className="intro__tool"
              onClick={onToggleSound}
              type="button"
            >
              {soundEnabled ? 'Sound on' : 'Sound off'}
            </button>
            <button className="intro__tool" onClick={finish} type="button">
              Skip intro
            </button>
          </div>
        </header>

        {!isTitle ? (
          <div
            className={`intro__caption ${isShort ? 'intro__caption--short' : ''}`}
            key={sceneIndex}
          >
            {caption.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        <div
          className={`intro__title ${isTitle ? 'is-active' : ''}`}
          aria-hidden={!isTitle}
        >
          <p className="intro__closing">
            Throughout all this, one thing remained consistent, the curiosity of
            mankind that set them apart.
          </p>
          <span className="intro__presents">Which is why CurioCET presents:</span>
          <h1>LUNA</h1>
          <button
            className="btn btn--primary intro__enter"
            disabled={!isTitle}
            onClick={finish}
            tabIndex={isTitle ? 0 : -1}
            type="button"
          >
            Enter Mission Control
          </button>
        </div>

        <div className="intro__footer">
          <div className="intro__progress">
            <div className="intro__progress-fill" ref={progressBarRef} />
          </div>
        </div>

        {!isTitle ? (
          <div aria-hidden="true" className="intro__scroll-cue">
            <i />
            <span>Scroll</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
