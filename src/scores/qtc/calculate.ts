import type { ScoreResult } from '../../types'

export interface QtcResults {
  qtMs: number
  rrS: number
  bazett: number
  fridericia: number
  hodges: number
  framingham: number
  rautaharju: number
}

export function calculateQtc(values: Record<string, number | boolean | string>): ScoreResult | null {
  const hr = values.hr as number
  const squares = values.squares as number

  if (!hr || !squares || hr <= 0 || squares <= 0) return null

  const qtMs = squares * 40
  const rrS = 60 / hr
  const rrMs = rrS * 1000

  const bazett = Math.round(qtMs / Math.sqrt(rrS))
  const fridericia = Math.round(qtMs / Math.cbrt(rrS))
  const hodges = Math.round(qtMs + 1.75 * (hr - 60))
  const framingham = Math.round(qtMs + 0.154 * (1000 - rrMs))
  const rautaharju = Math.round(qtMs * (120 + hr) / 180)

  return {
    score: bazett,
    label: `QT = ${qtMs} ms`,
    details: {
      qtMs,
      rrS: Math.round(rrS * 1000) / 1000,
      bazett,
      fridericia,
      hodges,
      framingham,
      rautaharju,
    },
  }
}

export function getFormulaAdvice(hr: number): string {
  if (hr >= 60 && hr <= 100) {
    return 'FC normale : Fridericia ou Framingham recommandées. Bazett acceptable.'
  }
  if (hr > 100) {
    return 'Tachycardie : préférer Hodges ou Rautaharju. Bazett surestime le QTc.'
  }
  return 'Bradycardie : préférer Hodges ou Rautaharju. Bazett sous-estime le QTc.'
}
