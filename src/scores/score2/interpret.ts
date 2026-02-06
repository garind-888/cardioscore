import type { ScoreResult, Interpretation, RiskLevel } from '../../types'

function classifySCORE2(age: number, pct: number): { level: RiskLevel; label: string } {
  if (age < 50) {
    if (pct < 2.5) return { level: 'low', label: 'Risque bas' }
    if (pct < 7.5) return { level: 'moderate', label: 'Risque modéré' }
    return { level: 'high', label: 'Risque élevé' }
  }
  if (age <= 69) {
    if (pct < 5) return { level: 'low', label: 'Risque bas' }
    if (pct < 10) return { level: 'moderate', label: 'Risque modéré' }
    return { level: 'high', label: 'Risque élevé' }
  }
  // ≥70
  if (pct < 7.5) return { level: 'low', label: 'Risque bas' }
  if (pct < 15) return { level: 'moderate', label: 'Risque modéré' }
  return { level: 'high', label: 'Risque élevé' }
}

function classifySCORE2Diabetes(pct: number): { level: RiskLevel; label: string } {
  if (pct < 5) return { level: 'low', label: 'Risque bas' }
  if (pct < 10) return { level: 'moderate', label: 'Risque modéré' }
  if (pct < 20) return { level: 'high', label: 'Risque élevé' }
  return { level: 'high', label: 'Risque très élevé' }
}

export function interpretScore2(result: ScoreResult, age: number): Interpretation {
  const d = result.details!
  const model = d.model as string
  const risk = result.score

  const isDiabetes = model === 'SCORE2-Diabetes'
  const isCKD = model.includes('CKD')
  const cls = isDiabetes ? classifySCORE2Diabetes(risk) : classifySCORE2(age, risk)

  const recommendations: string[] = []
  if (cls.level === 'low') {
    recommendations.push('Conseils hygiéno-diététiques')
  } else if (cls.level === 'moderate') {
    recommendations.push('Considérer traitement des facteurs de risque')
    recommendations.push('Objectifs lipidiques selon contexte clinique')
  } else {
    recommendations.push('Traitement intensif des facteurs de risque')
    recommendations.push('Objectif LDL-C < 1.4 mmol/L si risque très élevé')
  }

  const extras: Interpretation['extras'] = [
    { label: 'Modèle', value: model },
  ]

  if (isCKD) {
    extras.push(
      { label: 'Risque de base', value: `${d.baseRisk}%`, riskLevel: classifySCORE2(age, d.baseRisk as number).level },
      { label: 'Ajusté DFGe', value: `${d.eGFRAdjusted}%`, riskLevel: classifySCORE2(age, d.eGFRAdjusted as number).level },
      { label: 'Final', value: `${d.finalRisk}%`, riskLevel: cls.level },
    )
  }

  return {
    riskLevel: cls.level,
    title: cls.label,
    summary: `Risque CV à 10 ans : ${risk}% (${model})`,
    recommendations,
    extras,
  }
}
