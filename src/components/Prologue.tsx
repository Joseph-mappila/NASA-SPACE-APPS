import { useEffect, useRef, useState } from 'react'
import { prologueBeats } from '../data/content'

type PrologueProps = {
  onComplete: () => void
  onToggleSound: () => void
  soundEnabled: boolean
}

const sceneCount = prologueBeats.length + 1

export function playLightningSound() {
  const AudioContextClass = window.AudioContext
  if (!AudioContextClass) return

  const context = new AudioContextClass()
  const duration = 2.4
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate)
  const samples = buffer.getChannelData(0)

  for (let index = 0; index < samples.length; index += 1) {
    const decay = Math.exp((-4 * index) / samples.length)
    samples[index] = (Math.random() * 2 - 1) * decay
  }

  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  source.buffer = buffer
  filter.type = 'lowpass'
  filter.frequency.value = 360
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.5, context.currentTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
  source.connect(filter).connect(gain).connect(context.destination)
  source.start()
  source.addEventListener('ended', () => void context.close())
}

export function Prologue({ onComplete, onToggleSound, soundEnabled }: PrologueProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current
      if (!section) return
      const bounds = section.getBoundingClientRect()
      const distance = section.offsetHeight - window.innerHeight
      setProgress(Math.min(1, Math.max(0, -bounds.top / distance)))
    }

    const onScroll = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const scaled = progress * sceneCount
  const sceneIndex = Math.min(sceneCount - 1, Math.floor(scaled))
  const sceneProgress = Math.min(1, scaled - sceneIndex)
  const beat = prologueBeats[Math.min(sceneIndex, prologueBeats.length - 1)]
  const isTitle = sceneIndex === sceneCount - 1
  const vehicleX = 120 + sceneProgress * 920

  return (
    <section className="prologue" ref={sectionRef} aria-label="A history of curiosity">
      <div className={`prologue__stage scene-${isTitle ? 'title' : beat.id}`}>
        <div className="prologue__toolbar">
          <strong>LUNA</strong>
          <span aria-label={`Intro ${Math.round(progress * 100)} percent complete`}>
            {String(sceneIndex + 1).padStart(2, '0')} / {String(sceneCount).padStart(2, '0')}
          </span>
          <button className="icon-button" onClick={onToggleSound} type="button">
            Sound {soundEnabled ? 'on' : 'off'}
          </button>
        </div>

        <svg
          className="prologue-art"
          viewBox="0 0 1200 700"
          role="img"
          aria-label={isTitle ? 'A rocket clears into a field of stars' : beat.title}
        >
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#071424" />
              <stop offset="1" stopColor="#39231e" />
            </linearGradient>
            <linearGradient id="ground" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#11181c" />
              <stop offset="0.5" stopColor="#422b22" />
              <stop offset="1" stopColor="#171a1c" />
            </linearGradient>
            <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#eef6f5" />
              <stop offset="0.5" stopColor="#819499" />
              <stop offset="1" stopColor="#26373c" />
            </linearGradient>
            <radialGradient id="fire">
              <stop offset="0" stopColor="#fff5ba" />
              <stop offset="0.45" stopColor="#ffae38" />
              <stop offset="1" stopColor="#ef4f26" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="1200" height="700" fill="url(#sky)" />
          <circle className="moon-disc" cx="990" cy="125" r="68" fill="#f4ebd1" opacity=".72" />
          <path d="M0 520 Q220 450 430 515 T820 500 T1200 485 V700 H0Z" fill="url(#ground)" />

          <g className="scene-group" data-active={sceneIndex === 0}>
            <path className="lightning-bolt" d="M690 0 570 230 660 220 535 470 790 165 682 184 770 0Z" />
            <path d="M750 530 790 310 820 530" stroke="#281811" strokeWidth="30" strokeLinecap="round" />
            <path d="M712 376 Q790 326 860 383 Q817 440 742 431Z" fill="url(#fire)" filter="url(#glow)" />
            <g className="watchers" fill="#07090c">
              <circle cx="280" cy="420" r="25" /><path d="M252 445 220 535H330L306 446Z" />
              <circle cx="380" cy="442" r="21" /><path d="M357 462 334 535H425L402 462Z" />
            </g>
          </g>

          <g className="scene-group" data-active={sceneIndex === 1}>
            <path d="M515 555 Q590 405 665 555Z" fill="#1b1210" />
            <path className="flame flame-one" d="M560 530 Q520 440 600 365 Q580 445 635 480 Q650 400 690 386 Q720 490 655 545Z" fill="url(#fire)" filter="url(#glow)" />
            <circle cx="365" cy="405" r="31" fill="#19130f" />
            <path d="M335 438 Q365 412 400 440L445 555H290Z" fill="#17120f" />
            <path d="M390 458 520 510" stroke="#8d5b32" strokeWidth="16" strokeLinecap="round" />
          </g>

          <g className="scene-group" data-active={sceneIndex === 2}>
            <path d="M390 550H820L760 470H440Z" fill="#281916" />
            <rect x="520" y="468" width="190" height="34" rx="8" fill="#ff7f35" filter="url(#glow)" />
            <g className="hammer">
              <rect x="570" y="195" width="28" height="225" rx="12" fill="#7b4c2d" />
              <rect x="505" y="168" width="160" height="58" rx="14" fill="url(#metal)" />
            </g>
            <g className="sparks" fill="#ffce69">
              <circle cx="500" cy="455" r="5" /><circle cx="744" cy="430" r="6" />
              <circle cx="475" cy="400" r="4" /><circle cx="780" cy="385" r="4" />
              <circle cx="725" cy="470" r="3" />
            </g>
          </g>

          <g className="scene-group" data-active={sceneIndex === 3}>
            <g transform={`translate(${vehicleX - 160} 0)`}>
              <circle cx="185" cy="530" r="65" fill="none" stroke="#6f4428" strokeWidth="18" />
              <circle cx="455" cy="530" r="65" fill="none" stroke="#6f4428" strokeWidth="18" />
              <path d="M145 350H485L455 485H185Z" fill="#95633b" />
              <path d="M180 365 260 485M450 365 370 485" stroke="#c68a51" strokeWidth="12" />
            </g>
          </g>

          <g className="scene-group" data-active={sceneIndex === 4}>
            <g transform={`translate(${vehicleX - 220} 0)`}>
              <path d="M160 465 245 365H500L590 455V520H135V482Z" fill="#d75e3b" />
              <path d="M270 385H475L520 450H220Z" fill="#b9e0e3" />
              <circle cx="245" cy="520" r="54" fill="#101418" stroke="#d4d8d2" strokeWidth="14" />
              <circle cx="500" cy="520" r="54" fill="#101418" stroke="#d4d8d2" strokeWidth="14" />
            </g>
          </g>

          <g className="scene-group" data-active={sceneIndex === 5}>
            <path d="M0 455 Q200 420 420 455 T850 450 T1200 440V700H0Z" fill="#0d3445" />
            <g transform={`translate(${vehicleX - 260} 0)`}>
              <path d="M120 410H610L530 520H205Z" fill="#e6e3d7" />
              <rect x="250" y="300" width="225" height="115" rx="12" fill="#c5c2b5" />
              <rect x="290" y="330" width="46" height="40" fill="#163e53" />
              <rect x="365" y="330" width="46" height="40" fill="#163e53" />
              <path d="M410 300V175L555 300Z" fill="#f0efe5" />
            </g>
          </g>

          <g className="scene-group" data-active={sceneIndex === 6}>
            <g transform={`translate(${vehicleX - 250} ${-90 - Math.sin(sceneProgress * Math.PI) * 80})`}>
              <path d="M120 395Q370 300 660 365L700 410Q380 420 120 395Z" fill="#e7ecea" />
              <path d="M360 365 490 220 540 235 485 375Z" fill="#bccdce" />
              <path d="M320 390 470 515 410 520 260 402Z" fill="#aabfc1" />
              <circle cx="650" cy="385" r="22" fill="#1c596e" />
            </g>
          </g>

          <g className="scene-group" data-active={sceneIndex === 7 || isTitle}>
            <g transform={`translate(0 ${sceneIndex === 7 ? -sceneProgress * 780 : -760})`}>
              <path d="M535 475Q600 230 665 475V570H535Z" fill="url(#metal)" />
              <path d="M535 470 475 555H535ZM665 470 725 555H665Z" fill="#d45237" />
              <circle cx="600" cy="380" r="32" fill="#194b62" stroke="#deeced" strokeWidth="9" />
              <path className="rocket-flame" d="M555 570Q600 700 645 570Z" fill="url(#fire)" filter="url(#glow)" />
              <g className="smoke" fill="#ccd0cb" opacity=".72">
                <circle cx="540" cy="680" r="75" /><circle cx="635" cy="690" r="92" /><circle cx="705" cy="660" r="65" />
              </g>
            </g>
          </g>

          <g className="stars" data-active={isTitle}>
            {Array.from({ length: 42 }, (_, index) => (
              <circle
                key={index}
                cx={(index * 89) % 1180 + 10}
                cy={(index * 137) % 650 + 10}
                r={index % 5 === 0 ? 2.4 : 1.2}
                fill="#fff"
                opacity={0.35 + (index % 4) * 0.15}
              />
            ))}
          </g>
        </svg>

        {!isTitle ? (
          <article className="prologue-copy" key={beat.id}>
            <span>{beat.label}</span>
            <h1>{beat.title}</h1>
            <p>{beat.text}</p>
          </article>
        ) : (
          <div className="title-reveal">
            <span>CurioCET presents</span>
            <h1>LUNA</h1>
            <p>A NASA outpost science adventure</p>
            <button className="primary-button" onClick={onComplete} type="button">
              Enter Mission Control
            </button>
          </div>
        )}

        <div className="scroll-meter" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
        {sceneIndex === 0 && (
          <span className="sound-caption">
            {soundEnabled ? 'Sound: lightning cracks; thunder rolls.' : 'Sound is off: lightning flashes across the sky.'}
          </span>
        )}
        {!isTitle && <span className="scroll-prompt">Scroll to move through time</span>}
      </div>
    </section>
  )
}
