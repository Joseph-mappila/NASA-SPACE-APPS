import { useRef, type ReactNode, type RefObject } from 'react'
import { useSceneProgress } from './useSceneProgress'

type SceneProps = {
  active: boolean
  progressRef: RefObject<number>
  index: number
}

function SceneShell({
  id,
  active,
  children,
  className = '',
}: {
  id: string
  active: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div
      aria-hidden={!active}
      className={`intro__scene intro__scene--${id} ${active ? 'is-active' : ''} ${className}`}
    >
      <svg
        className="intro__art"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1600 900"
      >
        {children}
      </svg>
    </div>
  )
}

export function StormScene({ active, progressRef, index }: SceneProps) {
  return (
    <SceneShell active={active} id="storm">
      <defs>
        <linearGradient id="storm-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#03050a" />
          <stop offset="0.5" stopColor="#0d1822" />
          <stop offset="0.82" stopColor="#263740" />
          <stop offset="1" stopColor="#3a4b4d" />
        </linearGradient>
        <linearGradient id="storm-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#16211f" />
          <stop offset="1" stopColor="#050807" />
        </linearGradient>
        <radialGradient id="storm-horizon">
          <stop offset="0" stopColor="#5b7b7c" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5b7b7c" stopOpacity="0" />
        </radialGradient>
        <filter id="storm-blur">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <rect fill="url(#storm-sky)" height="900" width="1600" />
      <ellipse cx="1050" cy="690" fill="url(#storm-horizon)" rx="700" ry="240" />
      <g className="storm-cloud storm-cloud--one" fill="#060b11" opacity="0.9">
        <path d="M-80 160c90-70 210-84 318-40 54-74 184-96 276-38 74-42 196-26 246 48 104-18 214 34 238 116H-80Z" />
      </g>
      <g className="storm-cloud storm-cloud--two" fill="#0a1219" opacity="0.75">
        <path d="M520 86c58-46 146-52 212-18 40-38 118-44 164 0 54-20 126 4 142 62H520Z" />
      </g>
      <g className="storm-cloud storm-cloud--three" fill="#101c23" filter="url(#storm-blur)" opacity="0.9">
        <path d="M760 310c130-120 360-140 520-40 130-60 300 20 340 150H760Z" />
      </g>
      <path
        d="M0 690 150 640 290 672 430 610 590 658 760 600 930 652 1080 612 1240 656 1410 600 1600 648V900H0Z"
        fill="url(#storm-ground)"
      />
      <path
        d="M0 748 220 704 420 748 650 692 880 738 1110 690 1340 736 1600 700V900H0Z"
        fill="#070c0b"
      />
      <g fill="#030506" transform="translate(-340 0)">
        <path d="M1232 690c-10-96 6-188 16-286 4-34 12-62 24-82-4 48-2 100 4 144 8 66 18 144 12 224Z" />
        <path d="M1250 470c-36-52-74-86-112-112 34 4 74 28 112 64Z" />
        <path d="M1256 432c22-46 46-80 80-112-16 42-36 84-64 122Z" />
        <path d="M1264 520c46-34 82-52 118-60-30 20-64 44-100 76Z" />
        <path d="M1242 556c-46-22-82-28-118-24 32 12 66 28 102 48Z" />
        <path d="M1270 382c-16-40-22-72-20-108 12 34 26 66 42 96Z" />
      </g>
      <g fill="#030506">
        <circle cx="430" cy="646" r="16" />
        <path d="M412 664h36l14 62h-64Z" />
        <path d="M416 678 394 730h14l18-40Z" />
        <path d="M444 678 468 730h-14l-20-40Z" />
        <circle cx="500" cy="654" r="14" />
        <path d="M484 670h32l10 54h-52Z" />
        <path d="M490 682 470 724h12l16-34Z" />
        <path d="M514 682 534 724h-12l-16-34Z" />
        <path d="M520 668 584 628" stroke="#030506" strokeWidth="4" />
      </g>
      <path
        d="M0 795c180-42 300 6 460-10 180-18 260-62 420-48 160 14 280 48 440 22 100-16 180-10 280 10V900H0Z"
        fill="#030605"
      />
    </SceneShell>
  )
}

export function FireScene({ active }: SceneProps) {
  return (
    <SceneShell active={active} id="fire">
      <defs>
        <linearGradient id="fire-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#03050a" />
          <stop offset="0.6" stopColor="#101a25" />
          <stop offset="1" stopColor="#2c2721" />
        </linearGradient>
        <linearGradient id="fire-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2a2118" />
          <stop offset="1" stopColor="#080706" />
        </linearGradient>
        <radialGradient id="fire-glow">
          <stop offset="0" stopColor="#ff9d45" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ff6a2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cave-wall" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#15100c" />
          <stop offset="1" stopColor="#050403" />
        </linearGradient>
        <linearGradient id="fire-flame" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="0.32" stopColor="#ffb349" />
          <stop offset="0.72" stopColor="#ff6524" />
          <stop offset="1" stopColor="#c02a12" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect fill="url(#fire-sky)" height="900" width="1600" />
      {Array.from({ length: 44 }, (_, i) => (
        <circle
          cx={(i * 173) % 1600}
          cy={(i * 97) % 430}
          fill="#dbe7ea"
          key={i}
          opacity={0.25 + (i % 4) * 0.12}
          r={i % 6 === 0 ? 1.8 : 0.9}
        />
      ))}
      <path
        d="M0 650 120 590 240 640 380 570 520 630 700 585 890 640 1060 590 1240 642 1420 585 1600 628V900H0Z"
        fill="#12100d"
      />
      <path d="M0 720c220-42 360 16 540-2 220-22 340-70 560-52 180 14 340 54 500 30V900H0Z" fill="url(#fire-ground)" />
      <g>
        <path d="M0 0h360c20 130 8 280-40 390-46 106-130 194-240 236V0Z" fill="url(#cave-wall)" />
        <path d="M300 0c-12 156-8 292-48 412-34 104-104 198-204 250V0Z" fill="#080604" />
        <path d="M0 0h80c64 126 86 264 54 420-20 102-66 194-134 250V0Z" fill="#0d0a08" opacity="0.7" />
      </g>
      <g fill="#070504" transform="translate(-130 0)">
        <path d="M1384 700c-18-112-4-212 16-304 10-48 26-88 44-116-6 60-2 132 6 196 8 74 10 150 2 224Z" />
        <path d="M1406 460c-42-34-78-56-118-70 34-2 72 18 108 50Z" />
        <path d="M1410 420c18-46 44-80 78-104-18 42-36 82-62 124Z" />
        <path d="M1414 530c46-30 82-44 120-50-34 18-68 40-104 68Z" />
        <path d="M1392 580c-46-18-82-20-118-12 34 8 68 22 104 42Z" />
      </g>
      <ellipse cx="768" cy="672" fill="url(#fire-glow)" rx="360" ry="260" />
      <g fill="#0a0806">
        <path d="M690 700h156l28 24H662Z" />
        <path d="M720 690h96l8 18h-112Z" />
      </g>
      <g className="fire-flames" fill="url(#fire-flame)">
        <path d="M700 694c-20-34-8-72 16-104 6 26 20 34 22 62 10-16 10-34 8-52 28 28 38 62 22 94Z" />
        <path d="M756 696c-14-44-2-86 20-116 2 30 16 44 16 72 10-12 12-28 10-44 24 26 32 58 20 88Z" opacity="0.92" />
        <path d="M806 696c-12-36 0-68 16-94 2 24 14 34 14 56 8-12 10-24 8-38 22 22 30 50 18 76Z" opacity="0.8" />
      </g>
      <g fill="#030303">
        <circle cx="560" cy="590" r="24" />
        <path d="M534 614h52l24 96h-104Z" />
        <path d="M540 640 492 724h30l38-72Z" />
        <path d="M584 640 618 724h-30l-24-64Z" />
        <circle cx="960" cy="604" r="22" />
        <path d="M936 626h48l20 88h-88Z" />
        <path d="M946 648 906 720h26l30-58Z" />
        <path d="M978 648 1012 720h-26l-22-58Z" />
        <circle cx="1080" cy="620" r="20" />
        <path d="M1058 640h44l16 74h-76Z" />
        <path d="M1068 660 1042 716h22l20-48Z" />
        <path d="M1098 660 1122 716h-22l-14-48Z" />
      </g>
      <path d="M598 668 520 520" stroke="#0a0806" strokeWidth="6" strokeLinecap="round" />
      <path d="M520 520 500 474l34 22 10 42Z" fill="#0a0806" />
      <path
        d="M0 800c220-28 380 18 560 2 240-22 380-62 600-36 180 22 300 44 440 20V900H0Z"
        fill="#050403"
      />
    </SceneShell>
  )
}

export function ForgeScene({ active }: SceneProps) {
  return (
    <SceneShell active={active} id="forge">
      <defs>
        <linearGradient id="forge-wall" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0d0908" />
          <stop offset="0.55" stopColor="#1d110d" />
          <stop offset="1" stopColor="#090605" />
        </linearGradient>
        <linearGradient id="forge-floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#24140e" />
          <stop offset="1" stopColor="#070403" />
        </linearGradient>
        <radialGradient id="forge-heat">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.72" />
          <stop offset="0.35" stopColor="#ff7b2e" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ff4b1e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="forge-metal" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffca6b" />
          <stop offset="0.5" stopColor="#ff7b2f" />
          <stop offset="1" stopColor="#73200f" />
        </linearGradient>
        <filter id="forge-soft">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <rect fill="url(#forge-wall)" height="900" width="1600" />
      <g opacity="0.45" stroke="#050403" strokeWidth="3">
        <path d="M0 170h1600M0 340h1600M0 510h1600" />
        <path d="M180 0v900M520 0v900M960 0v900M1320 0v900" />
      </g>
      <g>
        <path d="M0 0h470v700H0Z" fill="#080504" />
        <path d="M60 260c0-120 84-200 180-200s180 80 180 200v260H60Z" fill="#160b07" />
        <path d="M120 300c0-82 54-140 120-140s120 58 120 140v200H120Z" fill="#0a0503" />
        <ellipse cx="240" cy="512" fill="url(#forge-heat)" rx="250" ry="210" filter="url(#forge-soft)" />
        <ellipse cx="240" cy="540" fill="#ffb75a" opacity="0.6" rx="110" ry="34" />
      </g>
      <g fill="#050302">
        <path d="M520 0h40v300h-40Z" />
        <path d="M600 0h22v270h-22Z" />
        <path d="M780 0h26v240h-26Z" />
        <path d="M860 0h16v300h-16Z" />
      </g>
      <g stroke="#2b1912" strokeWidth="10">
        <path d="M545 300h210" />
        <path d="M560 300v90M730 300v80" />
      </g>
      <g fill="#070403">
        <path d="M1120 650c30-200 82-300 164-420 46 82 78 190 88 420Z" />
        <circle cx="1250" cy="210" r="58" />
        <path d="M1210 268h92l40 382h-188Z" />
        <path d="M1204 320 1106 548l42 18 108-232Z" />
        <path d="M1300 316 1450 458l-28 40-152-108Z" />
      </g>
      <g>
        <path d="M820 590h250l-18 62H838Z" fill="#080504" />
        <path d="M860 652h170l-14 46H874Z" fill="#0d0806" />
        <path d="M870 588h150l-10 18H880Z" fill="#2a2320" />
        <path d="M896 570h106l-8 22H904Z" fill="url(#forge-metal)" />
        <ellipse cx="944" cy="572" fill="#ffcf7a" opacity="0.55" rx="80" ry="18" filter="url(#forge-soft)" />
      </g>
      <g className="forge-hammer">
        <rect fill="#4b2c18" height="196" rx="9" width="26" x="1116" y="386" />
        <path d="M1042 360h176l24 28-24 28h-176l-16-28Z" fill="#6c7474" />
        <path d="M1054 372h152l14 16-14 16h-152Z" fill="#b9c1c0" opacity="0.55" />
      </g>
      <circle cx="1129" cy="582" fill="#0a0605" r="19" />
      <path d="M0 700h1600v200H0Z" fill="url(#forge-floor)" />
      <g stroke="#1a0e09" strokeWidth="8" opacity="0.7">
        <path d="M0 760h1600M0 840h1600" />
        <path d="M250 700v200M700 700v200M1160 700v200M1460 700v200" />
      </g>
      <g fill="#0a0605">
        <path d="M470 700h160v30H470Z" />
        <path d="M1440 680l120-40v44l-120 36Z" />
      </g>
    </SceneShell>
  )
}

export function WheelScene({ active, progressRef, index }: SceneProps) {
  const cart = useRef<SVGGElement>(null)
  const wheelA = useRef<SVGGElement>(null)
  const wheelB = useRef<SVGGElement>(null)

  useSceneProgress(progressRef, index, active, (local) => {
    const x = -600 + local * 2320
    cart.current?.setAttribute('transform', `translate(${x} 0)`)
    const degrees = local * 900
    wheelA.current?.setAttribute('transform', `rotate(${degrees} 120 710)`)
    wheelB.current?.setAttribute('transform', `rotate(${degrees} 360 710)`)
  })

  return (
    <SceneShell active={active} id="wheel">
      <defs>
        <linearGradient id="wheel-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1a2832" />
          <stop offset="0.5" stopColor="#6b6250" />
          <stop offset="0.72" stopColor="#b88b58" />
          <stop offset="1" stopColor="#5b4028" />
        </linearGradient>
        <linearGradient id="wheel-road" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6f5536" />
          <stop offset="1" stopColor="#2c1f13" />
        </linearGradient>
        <radialGradient id="wheel-sun">
          <stop offset="0" stopColor="#ffe4a3" />
          <stop offset="0.55" stopColor="#f3a85e" />
          <stop offset="1" stopColor="#f3a85e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect fill="url(#wheel-sky)" height="900" width="1600" />
      <circle cx="1220" cy="360" fill="url(#wheel-sun)" r="180" />
      <path d="M0 560 180 500 340 540 520 470 720 530 900 480 1120 540 1320 490 1600 540V760H0Z" fill="#3d3324" opacity="0.8" />
      <path d="M0 620c220-30 340 18 540-4 220-24 360-54 580-30 180 20 320 36 480 14V900H0Z" fill="url(#wheel-road)" />
      <g fill="#2b2116">
        <path d="M80 610h180l-18-120H100Z" />
        <path d="M130 490h80v100h-80Z" />
        <path d="M138 500h64v36h-64Z" fill="#5e4b32" />
        <path d="M1120 600h190l-14-110h-160Z" />
        <path d="M1160 490h110v100h-110Z" />
        <path d="M1172 500h86v34h-86Z" fill="#5e4b32" />
        <path d="M430 650h150l-10-80H442Z" />
        <path d="M470 570h74v80h-74Z" />
      </g>
      <g stroke="#3c2c1c" strokeWidth="4" opacity="0.7">
        <path d="M0 760h1600M120 810h1400" />
      </g>
      <g ref={cart}>
        <g fill="#3b2515">
          <path d="M46 610h390l-18 70H64Z" />
          <path d="M72 548h330l22 68H50Z" />
          <path d="M90 548 130 486h240l30 62Z" fill="#5a3a22" />
        </g>
        <g stroke="#21150c" strokeWidth="7" fill="none">
          <path d="M108 555 142 610M190 548v62M260 548v62M330 552l-24 58" />
        </g>
        <g ref={wheelA}>
          <circle cx="120" cy="710" fill="none" r="78" stroke="#2a1a0e" strokeWidth="18" />
          <circle cx="120" cy="710" fill="#4f341e" r="12" />
          <path d="M120 646v128M56 710h128M75 665l90 90M165 665l-90 90" stroke="#6b4929" strokeWidth="8" />
        </g>
        <g ref={wheelB}>
          <circle cx="360" cy="710" fill="none" r="78" stroke="#2a1a0e" strokeWidth="18" />
          <circle cx="360" cy="710" fill="#4f341e" r="12" />
          <path d="M360 646v128M296 710h128M315 665l90 90M405 665l-90 90" stroke="#6b4929" strokeWidth="8" />
        </g>
        <path d="M42 620 12 638l30 18" fill="#3b2515" />
      </g>
      <path d="M0 850h1600v50H0Z" fill="#1e150d" />
    </SceneShell>
  )
}

export function CarScene({ active, progressRef, index }: SceneProps) {
  const car = useRef<SVGGElement>(null)
  const wheelA = useRef<SVGGElement>(null)
  const wheelB = useRef<SVGGElement>(null)

  useSceneProgress(progressRef, index, active, (local) => {
    const x = -760 + local * 2360
    car.current?.setAttribute('transform', `translate(${x} 0)`)
    const degrees = local * 1400
    wheelA.current?.setAttribute('transform', `rotate(${degrees} 230 705)`)
    wheelB.current?.setAttribute('transform', `rotate(${degrees} 584 705)`)
  })

  return (
    <SceneShell active={active} id="car">
      <defs>
        <linearGradient id="car-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#162d40" />
          <stop offset="0.45" stopColor="#4f7d8d" />
          <stop offset="0.68" stopColor="#e1b078" />
          <stop offset="1" stopColor="#5c4a3e" />
        </linearGradient>
        <linearGradient id="car-road" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3c4144" />
          <stop offset="1" stopColor="#161a1c" />
        </linearGradient>
        <linearGradient id="car-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8fd4d4" />
          <stop offset="0.45" stopColor="#3b8d95" />
          <stop offset="1" stopColor="#1b4c57" />
        </linearGradient>
        <radialGradient id="car-sun">
          <stop offset="0" stopColor="#fff2c3" />
          <stop offset="0.5" stopColor="#ffc776" />
          <stop offset="1" stopColor="#ffc776" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect fill="url(#car-sky)" height="900" width="1600" />
      <circle cx="1210" cy="430" fill="url(#car-sun)" r="210" />
      <path d="M0 560 190 470 330 540 500 450 690 530 860 470 1060 540 1240 480 1430 540 1600 500V780H0Z" fill="#2e3c40" opacity="0.75" />
      <path d="M0 620c240-24 380 28 610 0 250-30 430-48 640-16 130 20 240 28 350 10V900H0Z" fill="url(#car-road)" />
      <path d="M0 760h1600" stroke="#b8b4a6" strokeWidth="4" opacity="0.22" />
      <g stroke="#0d1518" strokeWidth="9" opacity="0.8">
        <path d="M150 700V420M150 450h60M150 500h60M150 550h60M150 600h60" />
        <path d="M770 680V390M770 420h60M770 470h60M770 520h60M770 570h60" />
        <path d="M1380 650V360M1380 390h60M1380 440h60M1380 490h60M1380 540h60" />
      </g>
      <g opacity="0.3" stroke="#f7dba7" strokeWidth="5">
        <path d="M0 705h1600M0 735h1600M0 785h1600" />
      </g>
      <g ref={car}>
        <path d="M74 676c12-40 32-64 64-76l58-76h296l94 94 122 18c30 6 44 22 44 48v38H74Z" fill="url(#car-body)" />
        <path d="M212 598 258 544h190l58 54Z" fill="#a7e0dd" opacity="0.7" />
        <path d="M236 598 270 560h76v38Z" fill="#173a45" />
        <path d="M360 598v-38h78l40 38Z" fill="#173a45" />
        <path d="M600 680h118l-18 24H610Z" fill="#b6c4c1" opacity="0.6" />
        <path d="M74 690h640v30H74Z" fill="#112d36" />
        <path d="M650 642h48v26h-48Z" fill="#ffd38a" />
        <path d="M88 642h34v24H88Z" fill="#fff0b5" />
        <g ref={wheelA}>
          <circle cx="230" cy="705" fill="#0b0e10" r="62" stroke="#d4d9d2" strokeWidth="12" />
          <circle cx="230" cy="705" fill="#aab3ae" r="26" />
          <path d="M230 657v96M182 705h96" stroke="#5d6968" strokeWidth="6" />
        </g>
        <g ref={wheelB}>
          <circle cx="584" cy="705" fill="#0b0e10" r="62" stroke="#d4d9d2" strokeWidth="12" />
          <circle cx="584" cy="705" fill="#aab3ae" r="26" />
          <path d="M584 657v96M536 705h96" stroke="#5d6968" strokeWidth="6" />
        </g>
        <path d="M74 668 38 664l30 22Z" fill="#9bb4b2" />
      </g>
      <path d="M0 850h1600v50H0Z" fill="#0a0d0e" />
    </SceneShell>
  )
}

export function ShipScene({ active, progressRef, index }: SceneProps) {
  const ship = useRef<SVGGElement>(null)

  useSceneProgress(progressRef, index, active, (local) => {
    const x = -800 + local * 2500
    const bob = Math.sin(local * Math.PI * 6) * 7
    const tilt = Math.sin(local * Math.PI * 4) * 1.2
    ship.current?.setAttribute(
      'transform',
      `translate(${x} ${bob}) rotate(${tilt} 300 600)`,
    )
  })

  return (
    <SceneShell active={active} id="ship">
      <defs>
        <linearGradient id="ship-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#080f1b" />
          <stop offset="0.55" stopColor="#1e3448" />
          <stop offset="1" stopColor="#59717a" />
        </linearGradient>
        <linearGradient id="ship-sea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#223d4b" />
          <stop offset="1" stopColor="#071219" />
        </linearGradient>
        <radialGradient id="ship-moon">
          <stop offset="0" stopColor="#f4f2dd" />
          <stop offset="0.5" stopColor="#cdd9d8" />
          <stop offset="1" stopColor="#cdd9d8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ship-hull" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e8e4d6" />
          <stop offset="0.55" stopColor="#9d9c92" />
          <stop offset="1" stopColor="#303a3c" />
        </linearGradient>
      </defs>
      <rect fill="url(#ship-sky)" height="900" width="1600" />
      <circle cx="1260" cy="220" fill="url(#ship-moon)" r="150" />
      <g fill="#111d27" opacity="0.8">
        <path d="M0 260c100-40 220-30 300 10 90-46 220-38 310 8 110-32 220-12 280 34H0Z" />
        <path d="M880 330c90-30 190-20 250 20 80-26 180-12 220 28H880Z" />
      </g>
      <path d="M0 600h1600v300H0Z" fill="url(#ship-sea)" />
      <g fill="none" stroke="#88a5ab" strokeWidth="3" opacity="0.3">
        <path d="M0 650c100-18 180 18 280 0s200-20 300 0 200 18 300 0 220-20 340 0 260 16 380-4" />
        <path d="M0 710c120-20 220 20 340 0s240-18 360 0 240 16 360-2 280-18 540 2" />
        <path d="M0 780c140-24 260 20 400 0s280-18 420 0 260 20 400-4 240-16 380 4" />
      </g>
      <g ref={ship}>
        <path d="M70 610h500l114 52-96 46H150Z" fill="url(#ship-hull)" />
        <path d="M120 560h420v56H120Z" fill="#d6d4c8" />
        <path d="M150 500h250v62H150Z" fill="#bdbdb3" />
        <path d="M190 440h160v62H190Z" fill="#e8e5d8" />
        <path d="M120 536h420v14H120Z" fill="#2d3a3e" />
        <g fill="#7a2d24">
          <path d="M220 350h54v94h-54Z" />
          <path d="M340 370h48v74h-48Z" />
          <path d="M420 390h34v54h-34Z" />
        </g>
        <g fill="#2b2421">
          <path d="M222 340h50v18h-50Z" />
          <path d="M342 360h44v16h-44Z" />
          <path d="M421 382h32v14h-32Z" />
        </g>
        <g fill="#23444f">
          <rect height="14" width="24" x="208" y="456" />
          <rect height="14" width="24" x="240" y="456" />
          <rect height="14" width="24" x="272" y="456" />
          <rect height="14" width="24" x="304" y="456" />
        </g>
        <g fill="#38474a">
          <circle cx="220" cy="580" r="8" />
          <circle cx="270" cy="580" r="8" />
          <circle cx="320" cy="580" r="8" />
          <circle cx="370" cy="580" r="8" />
          <circle cx="420" cy="580" r="8" />
          <circle cx="470" cy="580" r="8" />
        </g>
      </g>
      <path d="M0 850c180-30 300 20 480 0s320-20 500 0 260 18 420-6 220 0 200 6v50H0Z" fill="#061015" />
    </SceneShell>
  )
}

export function PlaneScene({ active, progressRef, index }: SceneProps) {
  const plane = useRef<SVGGElement>(null)
  const propeller = useRef<SVGGElement>(null)

  useSceneProgress(progressRef, index, active, (local) => {
    const x = -900 + local * 2500
    const y = 40 + Math.sin(local * Math.PI) * 70 + local * 20
    const tilt = -12 + Math.sin(local * Math.PI * 2) * 8
    plane.current?.setAttribute('transform', `translate(${x} ${y}) rotate(${tilt} 300 420)`)
    propeller.current?.setAttribute('transform', `rotate(${local * 3000} 735 400)`)
  })

  return (
    <SceneShell active={active} id="plane">
      <defs>
        <linearGradient id="plane-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#345f7c" />
          <stop offset="0.55" stopColor="#92bbc7" />
          <stop offset="1" stopColor="#f0d8a9" />
        </linearGradient>
        <radialGradient id="plane-sun">
          <stop offset="0" stopColor="#fff7d0" />
          <stop offset="0.4" stopColor="#ffe1a2" />
          <stop offset="1" stopColor="#ffe1a2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plane-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f1efe3" />
          <stop offset="0.6" stopColor="#b8c7c8" />
          <stop offset="1" stopColor="#536a70" />
        </linearGradient>
        <filter id="plane-soft">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <rect fill="url(#plane-sky)" height="900" width="1600" />
      <circle cx="1220" cy="330" fill="url(#plane-sun)" r="230" />
      <g fill="#e9eef0" opacity="0.44" filter="url(#plane-soft)">
        <ellipse cx="260" cy="250" rx="220" ry="80" />
        <ellipse cx="1340" cy="560" rx="300" ry="90" />
        <ellipse cx="840" cy="720" rx="360" ry="100" />
        <ellipse cx="600" cy="170" rx="180" ry="60" />
      </g>
      <g fill="#f6f5ef" opacity="0.72">
        <ellipse cx="360" cy="390" rx="150" ry="42" />
        <ellipse cx="470" cy="370" rx="110" ry="46" />
        <ellipse cx="1120" cy="650" rx="210" ry="52" />
        <ellipse cx="990" cy="630" rx="120" ry="44" />
      </g>
      <g ref={plane}>
        <path d="M120 430c40-30 130-48 260-46l180 2 120-26 42 14-76 38 74 4 30 18-88 10-180 10c-140 6-270-2-350-14Z" fill="url(#plane-body)" />
        <path d="M300 410 214 318l54-16 148 102Z" fill="#d9ded8" />
        <path d="M300 448 204 548l50 16 150-106Z" fill="#aab9b8" />
        <path d="M470 386 520 300l38 8-24 80Z" fill="#dfe2d9" />
        <path d="M470 448 520 530l38-8-24-78Z" fill="#9badaf" />
        <path d="M360 388h180l-20 64H380Z" fill="#23444f" />
        <path d="M380 398h70v34h-70Z" fill="#8fc3c8" opacity="0.6" />
        <circle cx="650" cy="410" r="24" fill="#2d5965" />
        <circle cx="735" cy="400" fill="rgba(226, 238, 238, 0.14)" r="54" />
        <g ref={propeller}>
          <path d="M690 400h90M735 355v90" stroke="#2a3437" strokeWidth="8" />
          <circle cx="735" cy="400" fill="#56676a" r="12" />
        </g>
        <path d="M120 430 74 420l46 26Z" fill="#ccd3cd" />
      </g>
      <path d="M0 820c200-30 340 20 540 0s360-20 560 0 300 16 500-4v84H0Z" fill="#d9d4c1" opacity="0.35" />
    </SceneShell>
  )
}

export function RocketScene({ active, progressRef, index }: SceneProps) {
  const rocket = useRef<SVGGElement>(null)
  const stars = useRef<SVGGElement>(null)

  useSceneProgress(progressRef, index, active, (local) => {
    const y = -local * 520
    const shake = local > 0.12 && local < 0.45 ? Math.sin(local * 400) * 2 : 0
    rocket.current?.setAttribute('transform', `translate(${shake} ${y})`)
    if (stars.current) {
      stars.current.style.opacity = String(Math.max(0, (local - 0.35) * 1.4))
    }
  })

  return (
    <SceneShell active={active} id="rocket">
      <defs>
        <linearGradient id="rocket-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#020308" />
          <stop offset="0.6" stopColor="#07101a" />
          <stop offset="1" stopColor="#16222a" />
        </linearGradient>
        <linearGradient id="rocket-body" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7d898c" />
          <stop offset="0.3" stopColor="#eef1e9" />
          <stop offset="0.7" stopColor="#c8cec9" />
          <stop offset="1" stopColor="#5f6c70" />
        </linearGradient>
        <linearGradient id="rocket-flame" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff7c2" />
          <stop offset="0.4" stopColor="#ffb246" />
          <stop offset="1" stopColor="#ff4a1f" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rocket-glow">
          <stop offset="0" stopColor="#ffb35d" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff6b2e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect fill="url(#rocket-sky)" height="900" width="1600" />
      <g ref={stars} style={{ opacity: 0 }}>
        {Array.from({ length: 70 }, (_, i) => (
          <circle
            cx={(i * 229) % 1600}
            cy={(i * 131) % 620}
            fill="#e9f2f2"
            key={i}
            opacity={0.3 + (i % 5) * 0.12}
            r={i % 7 === 0 ? 1.9 : 0.9}
          />
        ))}
      </g>
      <circle cx="1240" cy="190" fill="#dfe8e4" opacity="0.85" r="52" />
      <circle cx="1224" cy="178" fill="#07101a" opacity="0.55" r="44" />
      <g fill="#121a1e">
        <path d="M0 690h1600v210H0Z" />
        <path d="M0 620 150 580 300 630 460 590 620 638 800 600 980 640 1160 590 1340 634 1600 595V720H0Z" />
      </g>
      <g stroke="#344248" strokeWidth="14" fill="none">
        <path d="M330 690V190h150M330 250h200M330 330h200M330 410h200M330 490h200M330 570h200" />
        <path d="M1120 690V170h-130M1120 240h-190M1120 320h-190M1120 400h-190M1120 480h-190M1120 560h-190" />
      </g>
      <g stroke="#3e4c52" strokeWidth="8">
        <path d="M300 680 360 630M1300 680 1240 630" />
      </g>
      <ellipse cx="800" cy="760" fill="url(#rocket-glow)" rx="300" ry="120" />
      <g ref={rocket}>
        <path d="M760 250c0-90 40-150 40-150s40 60 40 150v340h-80Z" fill="url(#rocket-body)" />
        <path d="M760 590h80v90h-80Z" fill="#2c3539" />
        <path d="M760 430h80v34h-80Z" fill="#bd3d2f" />
        <path d="M758 580 710 690h50l0-110Z" fill="#c84a37" />
        <path d="M842 580 890 690h-50l0-110Z" fill="#c84a37" />
        <path d="M760 380h80v22h-80Z" fill="#1e2c33" />
        <circle cx="800" cy="340" fill="#183c4b" r="18" stroke="#e9efe7" strokeWidth="5" />
        <path className="rocket-flame" d="M766 680c0 120 34 190 34 190s34-70 34-190Z" fill="url(#rocket-flame)" />
        <path d="M790 680v78M810 680v78" stroke="#fff3b0" strokeWidth="6" opacity="0.6" />
      </g>
      <g fill="#0c1114">
        <rect height="90" rx="8" width="160" x="120" y="720" />
        <rect height="70" rx="6" width="130" x="1320" y="740" />
        <rect height="14" width="240" x="80" y="710" />
      </g>
      <path d="M0 850h1600v50H0Z" fill="#040608" />
    </SceneShell>
  )
}
