import type { ScoreResult, Interpretation } from '../../types'

const annualStrokeRisk: Record<number, string> = {
  0: '0%',
  1: '1.3%',
  2: '2.2%',
  3: '3.2%',
  4: '4.0%',
  5: '6.7%',
  6: '9.8%',
  7: '9.6%',
  8: '15.2%',
}

export function interpretChadVa(result: ScoreResult): Interpretation {
  const { score } = result

  if (score === 0) {
    return {
      riskLevel: 'low',
      title: 'Risque bas',
      summary: `Score ${score} — Risque annuel d'AVC : ${annualStrokeRisk[score]}`,
      recommendations: ['Pas d\'anticoagulation recommandée'],
    }
  }

  if (score === 1) {
    return {
      riskLevel: 'moderate',
      title: 'Risque intermédiaire',
      summary: `Score ${score} — Risque annuel d'AVC : ${annualStrokeRisk[score]}`,
      recommendations: [
        'Anticoagulation orale à considérer',
        'Décision partagée avec le patient',
      ],
    }
  }

  return {
    riskLevel: 'high',
    title: 'Risque élevé',
    summary: `Score ${score} — Risque annuel d'AVC : ${annualStrokeRisk[score] ?? '>15%'}`,
    recommendations: ['Anticoagulation orale recommandée (AOD ou AVK)'],
  }
}
