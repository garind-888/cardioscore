import type { ScoreResult, Interpretation, RiskLevel } from '../../types'

interface QtcThresholds {
  normal: number
  borderline: number
  prolonged: number
}

const thresholds: Record<string, QtcThresholds> = {
  male: { normal: 450, borderline: 470, prolonged: 500 },
  female: { normal: 470, borderline: 480, prolonged: 500 },
}

export function classifyQtc(qtc: number, sex: string): { level: RiskLevel; label: string } {
  const t = thresholds[sex] ?? thresholds.male
  if (qtc >= t.prolonged) return { level: 'high', label: 'Prolongé (risque TdP)' }
  if (qtc >= t.borderline) return { level: 'high', label: 'Prolongé' }
  if (qtc >= t.normal) return { level: 'moderate', label: 'Borderline' }
  return { level: 'low', label: 'Normal' }
}

export function interpretQtc(result: ScoreResult): Interpretation {
  const d = result.details!
  const bazett = d.bazett as number

  const classification = classifyQtc(bazett, 'male')

  return {
    riskLevel: classification.level,
    title: classification.label,
    summary: `QTc Bazett = ${bazett} ms`,
    extras: [
      { label: 'Bazett', value: `${d.bazett} ms`, riskLevel: classification.level },
      { label: 'Fridericia', value: `${d.fridericia} ms`, riskLevel: classifyQtc(d.fridericia as number, 'male').level },
      { label: 'Hodges', value: `${d.hodges} ms`, riskLevel: classifyQtc(d.hodges as number, 'male').level },
      { label: 'Framingham', value: `${d.framingham} ms`, riskLevel: classifyQtc(d.framingham as number, 'male').level },
      { label: 'Rautaharju', value: `${d.rautaharju} ms`, riskLevel: classifyQtc(d.rautaharju as number, 'male').level },
    ],
  }
}

export function interpretQtcWithSex(result: ScoreResult, sex: string): Interpretation {
  const d = result.details!

  const formulas = ['bazett', 'fridericia', 'hodges', 'framingham', 'rautaharju'] as const
  const labels = ['Bazett', 'Fridericia', 'Fridericia (FDA)', 'Hodges', 'Framingham', 'Rautaharju']

  const extras = formulas.map((f, i) => {
    const val = d[f] as number
    const cls = classifyQtc(val, sex)
    return { label: labels[i], value: `${val} ms`, riskLevel: cls.level }
  })

  const worstLevel = extras.reduce<RiskLevel>((worst, e) => {
    const order: RiskLevel[] = ['low', 'moderate', 'high']
    return order.indexOf(e.riskLevel!) > order.indexOf(worst) ? e.riskLevel! : worst
  }, 'low')

  const bazettCls = classifyQtc(d.bazett as number, sex)

  return {
    riskLevel: worstLevel,
    title: bazettCls.label,
    summary: `QTc Bazett = ${d.bazett} ms (${sex === 'female' ? 'femme' : 'homme'})`,
    extras,
  }
}
