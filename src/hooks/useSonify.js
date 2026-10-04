import { useCallback, useEffect, useRef, useState } from 'react'

// C major pentatonik, 3 oktava
const SCALE = ['C3','D3','E3','G3','A3','C4','D4','E4','G4','A4','C5','D5','E5','G5','A5']

export function useSonify(data, speedMs = 120, wave = 'triangle') {
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(data.length - 1)
  const synth = useRef(null)
  const reverbRef = useRef(null)
  const timer = useRef(null)
  const idx = useRef(data.length - 1)
  const live = useRef({ data, speedMs, wave })
  live.current = { data, speedMs, wave }

  const stop = useCallback(() => { clearTimeout(timer.current); setPlaying(false) }, [])

  const tick = useCallback(() => {
    const { data: d, speedMs: sp, wave: w } = live.current
    const i = idx.current
    if (i >= d.length) { stop(); setIndex(d.length - 1); idx.current = d.length - 1; return }
    let min = Infinity, max = -Infinity
    for (const p of d) { if (p.value < min) min = p.value; if (p.value > max) max = p.value }
    const note = SCALE[Math.round(((d[i].value - min) / (max - min || 1)) * (SCALE.length - 1))]
    synth.current.oscillator.type = w
    synth.current.triggerAttackRelease(note, Math.min(0.45, (sp / 1000) * 1.8))
    setIndex(i)
    idx.current = i + 1
    timer.current = setTimeout(tick, sp)
  }, [stop])

  const play = useCallback(async () => {
    const Tone = await import('tone') // og'ir kutubxona: faqat Ijro bosilganda yuklanadi
    await Tone.start() // brauzer ovozni faqat bosishdan keyin yoqadi
    if (!synth.current) {
      const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination()
      reverbRef.current = reverb
      synth.current = new Tone.Synth({ oscillator: { type: live.current.wave }, envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.5 } })
      synth.current.volume.value = -8
      synth.current.connect(reverb)
    }
    if (idx.current >= live.current.data.length - 1) idx.current = 0
    setPlaying(true)
    tick()
  }, [tick])

  const seek = useCallback((i) => { idx.current = i; setIndex(i) }, [])

  // Ma'lumot to'plami almashganda boshiga qaytadi
  useEffect(() => {
    clearTimeout(timer.current)
    idx.current = data.length - 1
    setIndex(data.length - 1)
    setPlaying(false)
  }, [data])

  useEffect(() => () => {
    clearTimeout(timer.current)
    synth.current?.dispose(); synth.current = null
    reverbRef.current?.dispose(); reverbRef.current = null
  }, [])

  const safeIndex = Math.min(index, data.length - 1)
  return { playing, index: safeIndex, play, stop, seek }
}
