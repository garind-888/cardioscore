import type { ScoreResult, Interpretation, RiskLevel } from '../../types'

function inHospitalRisk(score: number): { level: RiskLevel; label: string } {
  if (score <= 108) return { level: 'low', label: 'Bas (< 1%)' }
  if (score <= 140) return { level: 'moderate', label: 'Intermédiaire (1–3%)' }
  return { level: 'high', label: 'Élevé (> 3%)' }
}

function sixMonthRisk(score: number): { level: RiskLevel; label: string } {
  if (score <= 88) return { level: 'low', label: 'Bas (< 3%)' }
  if (score <= 118) return { level: 'moderate', label: 'Intermédiaire (3–8%)' }
  return { level: 'high', label: 'Élevé (> 8%)' }
}

export function interpretGrace(result: ScoreResult): Interpretation {
  const { score, details } = result
  const ih = inHospitalRisk(score)
  const sm = sixMonthRisk(score)

  const worstLevel: RiskLevel =
    ih.level === 'high' || sm.level === 'high'
      ? 'high'
      : ih.level === 'moderate' || sm.level === 'moderate'
        ? 'moderate'
        : 'low'

  const recommendations: string[] = []
  if (score > 140) {
    recommendations.push('Stratégie invasive précoce recommandée')
    recommendations.push('Traitement agressif prioritaire')
  } else if (score > 108) {
    recommendations.push('Surveillance étroite')
    recommendations.push('Considérer stratégie invasive selon contexte clinique')
  } else {
    recommendations.push('Prise en charge médicale')
    recommendations.push('Sortie précoce envisageable')
  }

  return {
    riskLevel: worstLevel,
    title: `GRACE ${score}`,
    summary: `Mortalité hospitalière : ${details?.inHospitalMortality}% — 6 mois : ${details?.sixMonthMortality}%`,
    recommendations,
    extras: [
      { label: 'Mortalité hospitalière', value: `${details?.inHospitalMortality}%`, riskLevel: ih.level },
      { label: 'Mortalité à 6 mois', value: `${details?.sixMonthMortality}%`, riskLevel: sm.level },
    ],
  }
}
