// Utilitário de Efeitos Sonoros Sutis usando Web Audio API
// 100% sintetizado no navegador (sem arquivos externos, 0 latency, leve e não intrusivo)
// Só emite sons se o usuário ativar explicitamente o som no botão da navbar.

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export const soundManager = {
  enabled: false,

  toggle(): boolean {
    this.enabled = !this.enabled
    if (this.enabled) {
      this.playChime()
    }
    return this.enabled
  },

  // Clique mecânico sutil para botões
  playClick() {
    if (!this.enabled) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch {}
  },

  // Hover suave de interface
  playHover() {
    if (!this.enabled) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(1200, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.03)
    } catch {}
  },

  // Chime elegante ao ativar o som ou concluir uma ação
  playChime() {
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime

      const freqs = [523.25, 659.25, 783.99] // Acorde C Maior (Dó, Mi, Sol)
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine"
        osc.frequency.setValueAtTime(f, now + i * 0.06)

        gain.gain.setValueAtTime(0.03, now + i * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + i * 0.06)
        osc.stop(now + i * 0.06 + 0.35)
      })
    } catch {}
  }
}
