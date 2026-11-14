import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type RefObject,
} from 'react'

type Point = { x: number; y: number }

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  drag: number
  gravity: number
  additive: boolean
  shrink: number
  stretch?: number
}

type Bolt = {
  points: Point[]
  branches: Point[][]
  target: Point
}

type Projection = {
  scale: number
  offsetX: number
  offsetY: number
}

export type EffectsHandle = {
  strike: () => void
  sparkBurst: () => void
}

type EffectsCanvasProps = {
  progressRef: RefObject<number>
  sceneRef: RefObject<number>
}

const SCENE_COUNT = 9
const VIEW_WIDTH = 1600
const VIEW_HEIGHT = 900

const FIRE_COLORS = ['#ffd166', '#ffb24d', '#ff8b3d', '#ff6a2e', '#d9431f']
const SPARK_COLORS = ['#fffbd5', '#ffe08a', '#ffab45', '#ff6a2e']

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function pick<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)]
}

const EffectsCanvas = forwardRef<EffectsHandle, EffectsCanvasProps>(
  function EffectsCanvas({ progressRef, sceneRef }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particles = useRef<Particle[]>([])
    const bolt = useRef<Bolt | null>(null)
    const boltLife = useRef(0)
    const flash = useRef(0)
    const lastScene = useRef(-1)
    const lastTime = useRef(0)
    const projection = useRef<Projection>({ scale: 1, offsetX: 0, offsetY: 0 })
    const stars = useRef(
      Array.from({ length: 120 }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: rand(0.6, 2.2),
        phase: rand(0, Math.PI * 2),
      })),
    )

    useImperativeHandle(ref, () => ({
      strike() {
        const startX = rand(800, 960)
        const target = { x: rand(884, 924), y: rand(330, 425) }
        const segments = 18
        const points: Point[] = [{ x: startX, y: -70 }]

        for (let index = 1; index <= segments; index += 1) {
          const t = index / segments
          const jitter = (1 - t * 0.55) * 48
          points.push({
            x: startX + (target.x - startX) * t + rand(-jitter, jitter),
            y: -70 + (target.y + 70) * t,
          })
        }
        points[points.length - 1] = target

        const branches: Point[][] = []
        for (const index of [4, 7, 10, 13]) {
          const origin = points[index]
          const direction = Math.random() > 0.5 ? 1 : -1
          const branch: Point[] = [origin]
          let bx = origin.x
          let by = origin.y
          for (let step = 0; step < 5; step += 1) {
            bx += direction * rand(18, 58)
            by += rand(8, 44)
            branch.push({ x: bx, y: by })
          }
          branches.push(branch)
        }

        bolt.current = { points, branches, target }
        boltLife.current = 1
        flash.current = 1
      },
      sparkBurst() {
        const { scale, offsetX, offsetY } = projection.current
        const originX = offsetX + 944 * scale
        const originY = offsetY + 566 * scale
        for (let index = 0; index < 44; index += 1) {
          const angle = rand(-Math.PI * 0.98, -Math.PI * 0.02)
          const speed = rand(130, 580) * scale
          particles.current.push({
            x: originX + rand(-10, 10) * scale,
            y: originY + rand(-5, 5) * scale,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: rand(0.35, 1),
            maxLife: 1,
            size: rand(1.2, 3.8) * scale,
            color: pick(SPARK_COLORS),
            drag: 0.988,
            gravity: 760 * scale,
            additive: true,
            shrink: 0.55,
          })
        }
      },
    }))

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return

      let width = 0
      let height = 0
      let dpr = 1
      let frame = 0
      let running = true

      const resize = () => {
        const rect = canvas.getBoundingClientRect()
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        width = rect.width
        height = rect.height
        canvas.width = Math.max(1, Math.floor(width * dpr))
        canvas.height = Math.max(1, Math.floor(height * dpr))
        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        const scale = Math.max(width / VIEW_WIDTH, height / VIEW_HEIGHT)
        projection.current = {
          scale,
          offsetX: (width - VIEW_WIDTH * scale) / 2,
          offsetY: (height - VIEW_HEIGHT * scale) / 2,
        }
      }

      const addParticle = (particle: Particle) => {
        if (particles.current.length < 1100) particles.current.push(particle)
      }

      const resetScene = (scene: number) => {
        particles.current = []
        if (scene === 0) {
          bolt.current = null
          boltLife.current = 0
          flash.current = 0
        }
      }

      const sceneLocal = (scene: number): number => {
        const start = scene / SCENE_COUNT
        const end = (scene + 1) / SCENE_COUNT
        return Math.min(1, Math.max(0, (progressRef.current - start) / (end - start)))
      }

      const spawnFlame = (
        originX: number,
        originY: number,
        scale: number,
        spread = 78,
      ) => {
        addParticle({
          x: originX + rand(-spread, spread) * scale,
          y: originY + rand(-6, 12) * scale,
          vx: rand(-14, 14) * scale,
          vy: rand(-215, -90) * scale,
          life: rand(0.4, 1.05),
          maxLife: 1.05,
          size: rand(6, 19) * scale,
          color: Math.random() > 0.88 ? '#fff3ba' : pick(FIRE_COLORS),
          drag: 0.984,
          gravity: -32 * scale,
          additive: true,
          shrink: 0.45,
          stretch: 1.9,
        })
      }

      const spawnEmber = (
        originX: number,
        originY: number,
        spread: number,
        scale = 1,
      ) => {
        addParticle({
          x: originX + rand(-spread, spread) * scale,
          y: originY + rand(-10, 10) * scale,
          vx: rand(-44, 44) * scale,
          vy: rand(-170, -55) * scale,
          life: rand(0.8, 2.2),
          maxLife: 2.2,
          size: rand(1, 3.1) * scale,
          color: pick(SPARK_COLORS),
          drag: 0.99,
          gravity: -10 * scale,
          additive: true,
          shrink: 0.7,
        })
      }

      const spawnSmoke = (
        originX: number,
        originY: number,
        scale = 1,
        spread = 50,
      ) => {
        addParticle({
          x: originX + rand(-spread, spread) * scale,
          y: originY + rand(-18, 18) * scale,
          vx: rand(-24, 24) * scale,
          vy: rand(-70, -26) * scale,
          life: rand(1.5, 3.6),
          maxLife: 3.6,
          size: rand(26, 78) * scale,
          color: `rgba(${Math.round(rand(92, 148))}, ${Math.round(
            rand(92, 144),
          )}, ${Math.round(rand(90, 138))}, 0.16)`,
          drag: 0.996,
          gravity: -5 * scale,
          additive: false,
          shrink: 0.35,
        })
      }

      const drawGlow = (
        x: number,
        y: number,
        radius: number,
        color: string,
        alpha: number,
      ) => {
        if (radius <= 0) return
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, color)
        gradient.addColorStop(0.55, color)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        context.save()
        context.globalAlpha = alpha
        context.fillStyle = gradient
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fill()
        context.restore()
      }

      const drawBolt = (time: number) => {
        const current = bolt.current
        if (!current) return
        const { scale, offsetX, offsetY } = projection.current
        const life = Math.max(0, Math.min(1, boltLife.current))
        const flicker = 0.62 + 0.38 * Math.abs(Math.sin(time * 0.052))
        const alpha = life * flicker
        const px = (value: number) => offsetX + value * scale
        const py = (value: number) => offsetY + value * scale

        context.save()
        context.globalCompositeOperation = 'lighter'
        context.lineJoin = 'round'
        context.lineCap = 'round'

        const strokePath = (points: Point[]) => {
          context.beginPath()
          context.moveTo(px(points[0].x), py(points[0].y))
          for (const point of points.slice(1)) {
            context.lineTo(px(point.x), py(point.y))
          }
          context.stroke()
        }

        context.globalAlpha = alpha * 0.4
        context.strokeStyle = '#6fb6ff'
        context.lineWidth = 22 * scale
        context.shadowColor = '#7fc7ff'
        context.shadowBlur = 46 * scale
        strokePath(current.points)

        context.globalAlpha = alpha * 0.7
        context.strokeStyle = '#b9e6ff'
        context.lineWidth = 7 * scale
        context.shadowBlur = 24 * scale
        strokePath(current.points)

        context.globalAlpha = alpha
        context.strokeStyle = '#ffffff'
        context.lineWidth = 2.6 * scale
        context.shadowBlur = 12 * scale
        strokePath(current.points)

        context.globalAlpha = alpha * 0.5
        context.strokeStyle = '#bfe8ff'
        context.lineWidth = 2 * scale
        for (const branch of current.branches) strokePath(branch)
        context.restore()

        const impactX = px(current.target.x)
        const impactY = py(current.target.y)
        context.save()
        context.globalCompositeOperation = 'lighter'
        drawGlow(
          impactX,
          impactY,
          86 * scale,
          'rgba(150, 210, 255, 0.55)',
          alpha * 0.55,
        )
        drawGlow(
          impactX,
          impactY,
          32 * scale,
          'rgba(255, 255, 255, 0.9)',
          alpha * 0.9,
        )
        context.restore()
      }

      const spriteCache = new Map<string, HTMLCanvasElement>()
      const getSprite = (color: string) => {
        const cached = spriteCache.get(color)
        if (cached) return cached
        const sprite = document.createElement('canvas')
        sprite.width = 64
        sprite.height = 64
        const spriteContext = sprite.getContext('2d')
        if (spriteContext) {
          const gradient = spriteContext.createRadialGradient(32, 32, 0, 32, 32, 32)
          gradient.addColorStop(0, color)
          gradient.addColorStop(0.42, color)
          gradient.addColorStop(0.72, 'rgba(0, 0, 0, 0)')
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          spriteContext.fillStyle = gradient
          spriteContext.fillRect(0, 0, 64, 64)
        }
        spriteCache.set(color, sprite)
        return sprite
      }

      const drawParticles = (dt: number, scale: number) => {
        context.save()
        for (const particle of particles.current) {
          particle.life -= dt
          particle.vx *= particle.drag
          particle.vy = particle.vy * particle.drag + particle.gravity * dt
          particle.x += particle.vx * dt
          particle.y += particle.vy * dt
          const alpha = Math.max(0, particle.life / particle.maxLife)
          context.globalCompositeOperation = particle.additive
            ? 'lighter'
            : 'source-over'
          context.globalAlpha = alpha * (particle.additive ? 0.58 : 1)
          const radius = Math.max(
            0.4,
            particle.size * (1 - particle.shrink * (1 - alpha)),
          )
          const stretch = particle.stretch && particle.stretch > 1 ? particle.stretch : 1
          const sprite = getSprite(particle.color)
          context.drawImage(
            sprite,
            particle.x - radius,
            particle.y - radius * stretch,
            radius * 2,
            radius * 2 * stretch,
          )
        }
        particles.current = particles.current.filter(
          (particle) =>
            particle.life > 0 &&
            particle.y > -260 * scale &&
            particle.x > -320 * scale,
        )
        context.restore()
      }

      const drawStars = (time: number, opacity: number, limit = 1) => {
        context.save()
        context.globalCompositeOperation = 'source-over'
        for (const star of stars.current) {
          const twinkle = 0.45 + Math.sin(time * 0.0013 + star.phase) * 0.4
          context.globalAlpha = Math.max(0.08, twinkle * opacity)
          context.fillStyle = '#ffffff'
          context.beginPath()
          context.arc(star.x * width, star.y * height * limit, star.size, 0, Math.PI * 2)
          context.fill()
        }
        context.restore()
      }

      const tick = (time: number) => {
        if (!running) return
        const dt = Math.min(0.05, (time - lastTime.current) / 1000 || 0.016)
        lastTime.current = time
        const scene = sceneRef.current
        if (scene !== lastScene.current) {
          resetScene(scene)
          lastScene.current = scene
        }
        const local = sceneLocal(scene)
        const { scale } = projection.current
        const X = (value: number) => projection.current.offsetX + value * scale
        const Y = (value: number) => projection.current.offsetY + value * scale
        context.clearRect(0, 0, width, height)

        if (scene === 0) {
          const rainCount = width < 700 ? 80 : 170
          context.strokeStyle = 'rgba(170, 208, 232, 0.3)'
          context.lineWidth = 1
          context.beginPath()
          for (let index = 0; index < rainCount; index += 1) {
            const x = ((index * 137 + time * 0.11) % (width + 80)) - 40
            const y = (index * 89 + time * 0.62) % height
            context.moveTo(x, y)
            context.lineTo(x - 7, y + 28)
          }
          context.stroke()

          drawGlow(X(1080), Y(640), 520 * scale, 'rgba(48, 88, 120, 0.2)', 0.7)

          if (boltLife.current > 0) {
            boltLife.current = Math.max(0, boltLife.current - dt * 1.25)
            flash.current = Math.max(0, flash.current - dt * 1.9)
            context.fillStyle = `rgba(196, 228, 255, ${flash.current * 0.15})`
            context.fillRect(0, 0, width, height)
            context.fillStyle = `rgba(255, 255, 255, ${flash.current * 0.07})`
            context.fillRect(0, 0, width, height)
            drawBolt(time)
            if (boltLife.current === 0) bolt.current = null
          } else if (flash.current > 0) {
            flash.current = Math.max(0, flash.current - dt * 2)
            context.fillStyle = `rgba(196, 228, 255, ${flash.current * 0.08})`
            context.fillRect(0, 0, width, height)
          }
        }

        if (scene === 1) {
          const fireX = X(768)
          const fireBase = Y(678)
          drawGlow(
            fireX,
            fireBase - 60 * scale,
            (width < 700 ? 185 : 250) * scale,
            'rgba(255, 104, 34, 0.3)',
            0.9,
          )
          drawGlow(
            fireX,
            fireBase + 4 * scale,
            (width < 700 ? 120 : 150) * scale,
            'rgba(255, 190, 92, 0.22)',
            0.9,
          )
          const flames = width < 700 ? 3 : 5
          for (let index = 0; index < flames; index += 1) {
            spawnFlame(fireX, fireBase, scale)
          }
          if (Math.random() > 0.35) spawnEmber(fireX, fireBase - 30 * scale, 100, scale)
          if (Math.random() > 0.88) spawnSmoke(fireX, fireBase - 90 * scale, scale, 70)
          drawParticles(dt, scale)
          drawGlow(fireX, fireBase - 100 * scale, 120 * scale, 'rgba(255, 219, 138, 0.14)', 0.9)
        }

        if (scene === 2) {
          const anvilX = X(944)
          const anvilY = Y(566)
          drawGlow(anvilX, anvilY - 10 * scale, 170 * scale, 'rgba(255, 116, 40, 0.32)', 0.85)
          drawGlow(X(245), Y(540), 300 * scale, 'rgba(255, 86, 26, 0.22)', 0.7)
          if (Math.random() > 0.4) spawnEmber(anvilX, anvilY, 80, scale)
          if (Math.random() > 0.55) spawnEmber(X(245), Y(536), 110, scale)
          if (Math.random() > 0.9) spawnSmoke(anvilX, anvilY - 40 * scale, scale * 0.7, 60)
          drawParticles(dt, scale)
        }

        if (scene === 3 || scene === 4) {
          const worldX =
            scene === 3 ? -480 + local * 2320 : -530 + local * 2360
          const wheelY = scene === 3 ? 786 : 762
          const onScreen = X(worldX) > -120 && X(worldX) < width + 120
          if (onScreen) {
            for (let index = 0; index < 2; index += 1) {
              addParticle({
                x: X(worldX + rand(-62, 8)),
                y: Y(wheelY + rand(-14, 8)),
                vx: rand(-120, -34) * scale,
                vy: rand(-46, 4) * scale,
                life: rand(0.35, 0.95),
                maxLife: 0.95,
                size: rand(6, 15) * scale,
                color: 'rgba(198, 178, 142, 0.2)',
                drag: 0.97,
                gravity: -6 * scale,
                additive: false,
                shrink: 0.2,
              })
            }
          }
          drawParticles(dt, scale)
        }

        if (scene === 5) {
          const shipX = -800 + local * 2500
          const stern = 70 + shipX
          const bow = 660 + shipX
          if (X(stern) > -160 && X(stern) < width + 160) {
            for (let index = 0; index < 2; index += 1) {
              addParticle({
                x: X(stern + rand(-20, 30)),
                y: Y(706 + rand(-8, 10)),
                vx: rand(-120, -40) * scale,
                vy: rand(-36, 10) * scale,
                life: rand(0.8, 1.9),
                maxLife: 1.9,
                size: rand(6, 16) * scale,
                color: 'rgba(214, 236, 236, 0.26)',
                drag: 0.99,
                gravity: 16 * scale,
                additive: false,
                shrink: 0.1,
              })
              addParticle({
                x: X(bow + rand(-10, 24)),
                y: Y(700 + rand(-6, 8)),
                vx: rand(10, 70) * scale,
                vy: rand(-90, -24) * scale,
                life: rand(0.3, 0.7),
                maxLife: 0.7,
                size: rand(2, 6) * scale,
                color: 'rgba(232, 246, 246, 0.5)',
                drag: 0.98,
                gravity: 130 * scale,
                additive: false,
                shrink: 0.4,
              })
            }
          }
          drawParticles(dt, scale)
        }

        if (scene === 6) {
          const planeX = -900 + local * 2500
          const planeY = 40 + Math.sin(local * Math.PI) * 70 + local * 20
          const tail = 126 + planeX
          if (X(tail) > -100 && X(tail) < width + 100) {
            for (let index = 0; index < 2; index += 1) {
              addParticle({
                x: X(tail + rand(-10, 16)),
                y: Y(430 + planeY + rand(-8, 8)),
                vx: rand(-86, -32) * scale,
                vy: rand(-8, 8) * scale,
                life: rand(1.2, 2.6),
                maxLife: 2.6,
                size: rand(7, 19) * scale,
                color: 'rgba(244, 248, 248, 0.24)',
                drag: 0.994,
                gravity: -4 * scale,
                additive: false,
                shrink: 0.15,
              })
            }
          }
          drawParticles(dt, scale)
        }

        if (scene === 7) {
          const baseY = 690 - local * 520
          const flameX = X(800)
          const flameY = Y(baseY)
          drawGlow(
            flameX,
            flameY + 60 * scale,
            170 * scale,
            'rgba(255, 124, 42, 0.36)',
            0.9,
          )
          for (let index = 0; index < 4; index += 1) {
            addParticle({
              x: flameX + rand(-24, 24) * scale,
              y: flameY + rand(26, 92) * scale,
              vx: rand(-24, 24) * scale,
              vy: rand(130, 310) * scale,
              life: rand(0.25, 0.62),
              maxLife: 0.62,
              size: rand(6, 18) * scale,
              color: pick(FIRE_COLORS),
              drag: 0.97,
              gravity: 26 * scale,
              additive: true,
              shrink: 0.45,
              stretch: 1.7,
            })
          }
          if (Math.random() > 0.5) spawnSmoke(X(800), Y(684), scale * 1.15, 70)
          if (Math.random() > 0.55) spawnEmber(flameX, flameY + 60 * scale, 70, scale)
          drawParticles(dt, scale)
          const starOpacity = Math.min(1, Math.max(0, (local - 0.35) * 1.7))
          if (starOpacity > 0) drawStars(time, starOpacity, 0.8)
        }

        if (scene === 8) {
          drawStars(time, 0.9)
          if (Math.random() > 0.994) {
            context.save()
            context.globalAlpha = 0.65
            context.strokeStyle = 'rgba(255,255,255,0.75)'
            context.lineWidth = 1.4
            const startX = rand(0, width * 0.7)
            const startY = rand(0, height * 0.4)
            context.beginPath()
            context.moveTo(startX, startY)
            context.lineTo(startX + 90, startY + 24)
            context.stroke()
            context.restore()
          }
        }

        frame = requestAnimationFrame(tick)
      }

      resize()
      const observer = new ResizeObserver(resize)
      observer.observe(canvas)
      frame = requestAnimationFrame(tick)

      return () => {
        running = false
        cancelAnimationFrame(frame)
        observer.disconnect()
      }
    }, [progressRef, sceneRef])

    return <canvas aria-hidden="true" className="intro__effects" ref={canvasRef} />
  },
)

export default EffectsCanvas
