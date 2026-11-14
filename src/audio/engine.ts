import ambientUrl from './ambient.mp4'

type LoopKind =
  | 'storm'
  | 'fire'
  | 'forge'
  | 'cart'
  | 'engine'
  | 'ocean'
  | 'plane'
  | 'rocket'
  | 'space'
  | null

class AudioEngine {
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private loopNodes: AudioNode[] = []
  private loopKind: LoopKind = null
  private enabled = true
  private volume = 0.55
  private ambient: HTMLAudioElement | null = null
  private ambientVolume = 0.5
  private unlocked = false

  enable(): void {
    // Browsers only allow audio to start after a real interaction. App calls
    // this from its first pointer, touch, or key event.
    this.unlocked = true
    this.startAmbient()
    const context = this.ensure()
    if (!context) return
    if (this.loopKind && this.enabled && this.loopNodes.length === 0) {
      this.applyLoop()
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    if (this.master && this.context) {
      this.master.gain.cancelScheduledValues(this.context.currentTime)
      this.master.gain.setTargetAtTime(
        enabled ? this.volume : 0,
        this.context.currentTime,
        0.04,
      )
    }
    if (enabled) {
      this.ensure()
      if (this.unlocked) this.startAmbient()
      if (!this.loopNodes.length) this.applyLoop()
    } else {
      this.ambient?.pause()
    }
  }

  private startAmbient(): void {
    if (!this.enabled || !this.unlocked) return
    if (!this.ambient) {
      if (typeof Audio === 'undefined') return
      this.ambient = new Audio(ambientUrl)
      this.ambient.loop = true
      this.ambient.preload = 'auto'
      this.ambient.volume = this.ambientVolume
    }
    this.ambient.volume = this.ambientVolume
    if (!this.ambient.paused) return
    // A rejected play() only means the browser is still waiting for a gesture.
    // The next enable() or setEnabled(true) tries again.
    void this.ambient.play().catch(() => undefined)
  }

  setScene(kind: LoopKind): void {
    if (kind === this.loopKind) return
    this.loopKind = kind
    this.applyLoop()
  }

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.context) {
      const Ctor = window.AudioContext
      if (!Ctor) return null
      this.context = new Ctor()
      this.master = this.context.createGain()
      this.master.gain.value = this.enabled ? this.volume : 0
      this.master.connect(this.context.destination)
    }
    if (this.context.state === 'suspended') void this.context.resume()
    return this.context
  }

  private getNoise(context: AudioContext): AudioBuffer {
    if (this.noise) return this.noise
    const length = context.sampleRate * 2
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1
    }
    this.noise = buffer
    return buffer
  }

  private stopLoop(): void {
    for (const node of this.loopNodes) {
      try {
        if (node instanceof AudioScheduledSourceNode) node.stop()
      } catch {
        // Already stopped.
      }
      node.disconnect()
    }
    this.loopNodes = []
  }

  private applyLoop(): void {
    const context = this.ensure()
    this.stopLoop()
    if (!context || !this.master || !this.enabled || !this.loopKind) return

    switch (this.loopKind) {
      case 'storm':
        this.startNoiseLoop(context, 'lowpass', 460, 0.14)
        this.startNoiseLoop(context, 'bandpass', 950, 0.035)
        this.startToneLoop(context, 54, 'sine', 0.05, 120)
        break
      case 'fire':
        this.startNoiseLoop(context, 'lowpass', 820, 0.09)
        this.startNoiseLoop(context, 'highpass', 2100, 0.028)
        this.startNoiseLoop(context, 'bandpass', 3400, 0.016)
        break
      case 'forge':
        this.startNoiseLoop(context, 'lowpass', 500, 0.04)
        this.startNoiseLoop(context, 'bandpass', 1800, 0.02)
        break
      case 'cart':
        this.startNoiseLoop(context, 'lowpass', 380, 0.035)
        this.startNoiseLoop(context, 'bandpass', 1500, 0.012)
        break
      case 'engine':
        this.startToneLoop(context, 72, 'sawtooth', 0.028, 420)
        this.startNoiseLoop(context, 'lowpass', 600, 0.02)
        break
      case 'ocean':
        this.startNoiseLoop(context, 'lowpass', 520, 0.085)
        this.startNoiseLoop(context, 'bandpass', 240, 0.03)
        break
      case 'plane':
        this.startToneLoop(context, 108, 'sawtooth', 0.022, 900)
        this.startNoiseLoop(context, 'bandpass', 700, 0.028)
        break
      case 'rocket':
        this.startNoiseLoop(context, 'lowpass', 150, 0.14)
        this.startToneLoop(context, 44, 'sawtooth', 0.04, 180)
        break
      case 'space':
        this.startToneLoop(context, 92, 'sine', 0.014, 600)
        this.startToneLoop(context, 138, 'sine', 0.009, 600)
        break
    }
  }

  private startNoiseLoop(
    context: AudioContext,
    filterType: BiquadFilterType,
    frequency: number,
    gainValue: number,
  ): void {
    if (!this.master) return
    const source = context.createBufferSource()
    source.buffer = this.getNoise(context)
    source.loop = true
    const filter = context.createBiquadFilter()
    filter.type = filterType
    filter.frequency.value = frequency
    filter.Q.value = 0.8
    const gain = context.createGain()
    gain.gain.value = gainValue
    source.connect(filter).connect(gain).connect(this.master)
    source.start()
    this.loopNodes.push(source, filter, gain)
  }

  private startToneLoop(
    context: AudioContext,
    frequency: number,
    type: OscillatorType,
    gainValue: number,
    filterFrequency: number,
  ): void {
    if (!this.master) return
    const oscillator = context.createOscillator()
    oscillator.type = type
    oscillator.frequency.value = frequency
    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = filterFrequency
    const gain = context.createGain()
    gain.gain.value = gainValue
    oscillator.connect(filter).connect(gain).connect(this.master)
    oscillator.start()
    this.loopNodes.push(oscillator, filter, gain)
  }

  private oneShot(
    build: (context: AudioContext, destination: AudioNode) => void,
  ): void {
    const context = this.ensure()
    if (!context || !this.master || !this.enabled) return
    build(context, this.master)
  }

  beep(frequency = 980, duration = 0.075, gainValue = 0.035): void {
    this.oneShot((context, destination) => {
      const oscillator = context.createOscillator()
      oscillator.type = 'triangle'
      oscillator.frequency.value = frequency
      const gain = context.createGain()
      const now = context.currentTime
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
      oscillator.connect(gain).connect(destination)
      oscillator.start(now)
      oscillator.stop(now + duration + 0.02)
    })
  }

  thunder(): void {
    this.oneShot((context, destination) => {
      const now = context.currentTime
      const duration = 3.2

      const crack = context.createBufferSource()
      crack.buffer = this.getNoise(context)
      const crackFilter = context.createBiquadFilter()
      crackFilter.type = 'highpass'
      crackFilter.frequency.value = 900
      const crackGain = context.createGain()
      crackGain.gain.setValueAtTime(0.0001, now)
      crackGain.gain.exponentialRampToValueAtTime(0.5, now + 0.012)
      crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)
      crack.connect(crackFilter).connect(crackGain).connect(destination)
      crack.start(now)
      crack.stop(now + 0.45)

      const rumble = context.createBufferSource()
      rumble.buffer = this.getNoise(context)
      rumble.loop = true
      const rumbleFilter = context.createBiquadFilter()
      rumbleFilter.type = 'lowpass'
      rumbleFilter.frequency.setValueAtTime(760, now + 0.08)
      rumbleFilter.frequency.exponentialRampToValueAtTime(90, now + duration)
      rumbleFilter.Q.value = 0.7
      const rumbleGain = context.createGain()
      rumbleGain.gain.setValueAtTime(0.0001, now)
      rumbleGain.gain.exponentialRampToValueAtTime(0.85, now + 0.08)
      rumbleGain.gain.exponentialRampToValueAtTime(0.22, now + 0.7)
      rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
      rumble.connect(rumbleFilter).connect(rumbleGain).connect(destination)
      rumble.start(now)
      rumble.stop(now + duration + 0.1)

      const thump = context.createOscillator()
      thump.type = 'sine'
      thump.frequency.setValueAtTime(64, now)
      thump.frequency.exponentialRampToValueAtTime(32, now + 0.9)
      const thumpGain = context.createGain()
      thumpGain.gain.setValueAtTime(0.0001, now)
      thumpGain.gain.exponentialRampToValueAtTime(0.35, now + 0.05)
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4)
      thump.connect(thumpGain).connect(destination)
      thump.start(now)
      thump.stop(now + 1.45)
    })
  }

  hammer(): void {
    this.oneShot((context, destination) => {
      const now = context.currentTime
      const body = context.createOscillator()
      body.type = 'triangle'
      body.frequency.setValueAtTime(190, now)
      body.frequency.exponentialRampToValueAtTime(74, now + 0.22)
      const bodyGain = context.createGain()
      bodyGain.gain.setValueAtTime(0.4, now)
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)
      body.connect(bodyGain).connect(destination)
      body.start(now)
      body.stop(now + 0.3)

      const ring = context.createOscillator()
      ring.type = 'sine'
      ring.frequency.value = 1240
      const ringGain = context.createGain()
      ringGain.gain.setValueAtTime(0.16, now)
      ringGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7)
      ring.connect(ringGain).connect(destination)
      ring.start(now)
      ring.stop(now + 0.72)

      const source = context.createBufferSource()
      source.buffer = this.getNoise(context)
      const filter = context.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = 2400
      const gain = context.createGain()
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)
      source.connect(filter).connect(gain).connect(destination)
      source.start(now)
      source.stop(now + 0.1)
    })
  }

  click(): void {
    this.oneShot((context, destination) => {
      const now = context.currentTime
      const oscillator = context.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(680, now)
      oscillator.frequency.exponentialRampToValueAtTime(410, now + 0.07)
      const gain = context.createGain()
      gain.gain.setValueAtTime(0.09, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
      oscillator.connect(gain).connect(destination)
      oscillator.start(now)
      oscillator.stop(now + 0.09)
    })
  }

  success(): void {
    this.oneShot((context, destination) => {
      const notes = [392, 523.25, 659.25, 783.99]
      notes.forEach((frequency, index) => {
        const now = context.currentTime + index * 0.11
        const oscillator = context.createOscillator()
        oscillator.type = 'triangle'
        oscillator.frequency.value = frequency
        const gain = context.createGain()
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
        oscillator.connect(gain).connect(destination)
        oscillator.start(now)
        oscillator.stop(now + 0.52)
      })
    })
  }

  failure(): void {
    this.oneShot((context, destination) => {
      const now = context.currentTime
      const oscillator = context.createOscillator()
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(220, now)
      oscillator.frequency.exponentialRampToValueAtTime(58, now + 0.8)
      const filter = context.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 700
      const gain = context.createGain()
      gain.gain.setValueAtTime(0.16, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)
      oscillator.connect(filter).connect(gain).connect(destination)
      oscillator.start(now)
      oscillator.stop(now + 0.92)
    })
  }

  alarm(): void {
    this.oneShot((context, destination) => {
      for (let index = 0; index < 3; index += 1) {
        const now = context.currentTime + index * 0.2
        const oscillator = context.createOscillator()
        oscillator.type = 'square'
        oscillator.frequency.value = index % 2 === 0 ? 880 : 660
        const gain = context.createGain()
        gain.gain.setValueAtTime(0.07, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14)
        oscillator.connect(gain).connect(destination)
        oscillator.start(now)
        oscillator.stop(now + 0.15)
      }
    })
  }

  whoosh(): void {
    this.oneShot((context, destination) => {
      const now = context.currentTime
      const source = context.createBufferSource()
      source.buffer = this.getNoise(context)
      const filter = context.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(240, now)
      filter.frequency.exponentialRampToValueAtTime(2600, now + 0.5)
      filter.Q.value = 0.7
      const gain = context.createGain()
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.16)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75)
      source.connect(filter).connect(gain).connect(destination)
      source.start(now)
      source.stop(now + 0.8)
    })
  }

  horn(): void {
    this.oneShot((context, destination) => {
      const now = context.currentTime
      for (const frequency of [92, 138]) {
        const oscillator = context.createOscillator()
        oscillator.type = 'sawtooth'
        oscillator.frequency.value = frequency
        const filter = context.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 520
        const gain = context.createGain()
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.18)
        gain.gain.setValueAtTime(0.09, now + 0.8)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6)
        oscillator.connect(filter).connect(gain).connect(destination)
        oscillator.start(now)
        oscillator.stop(now + 1.65)
      }
    })
  }

  rocketIgnition(): void {
    this.oneShot((context, destination) => {
      const now = context.currentTime
      const source = context.createBufferSource()
      source.buffer = this.getNoise(context)
      source.loop = true
      const filter = context.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(180, now)
      filter.frequency.exponentialRampToValueAtTime(900, now + 1.2)
      const gain = context.createGain()
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.26, now + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2)
      source.connect(filter).connect(gain).connect(destination)
      source.start(now)
      source.stop(now + 3.3)
    })
  }
}

export const audio = new AudioEngine()
