import type { ScoreDefinition } from '../../types'
import { calculateChadVa } from './calculate'
import { interpretChadVa } from './interpret'

const chadVaScore: ScoreDefinition = {
  id: 'chad-va',
  name: 'CHA₂DS₂-VA',
  shortName: 'CHAD-VA',
  shortDescription: 'Risque d\'AVC dans la fibrillation auriculaire (ESC 2024)',
  category: 'Arythmie',
  icon: '💓',
  inputs: [
    {
      type: 'toggle',
      key: 'heartFailure',
      label: 'Insuffisance cardiaque',
      description: 'IC congestive ou FEVG < 40%',
      points: 1,
    },
    {
      type: 'toggle',
      key: 'hypertension',
      label: 'Hypertension',
      description: 'PA > 140/90 ou traitement antihypertenseur',
      points: 1,
    },
    {
      type: 'toggle',
      key: 'age75',
      label: 'Âge ≥ 75 ans',
      points: 2,
    },
    {
      type: 'toggle',
      key: 'diabetes',
      label: 'Diabète',
      points: 1,
    },
    {
      type: 'toggle',
      key: 'stroke',
      label: 'AVC / AIT / Thromboembolie',
      description: 'Antécédent',
      points: 2,
    },
    {
      type: 'toggle',
      key: 'vascular',
      label: 'Maladie vasculaire',
      description: 'IDM, AOMI ou plaque aortique',
      points: 1,
    },
    {
      type: 'toggle',
      key: 'age65',
      label: 'Âge 65–74 ans',
      points: 1,
    },
  ],
  calculate: calculateChadVa,
  interpret: interpretChadVa,
}

export default chadVaScore
