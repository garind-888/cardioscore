import type { ScoreDefinition } from '../../types'
import { calculateGrace } from './calculate'
import { interpretGrace } from './interpret'

const graceScore: ScoreDefinition = {
  id: 'grace',
  name: 'GRACE 2.0',
  shortName: 'GRACE',
  shortDescription: 'Mortalité dans le syndrome coronarien aigu',
  category: 'SCA',
  icon: '🫀',
  inputs: [
    {
      type: 'number',
      key: 'age',
      label: 'Âge',
      unit: 'ans',
      min: 18,
      max: 110,
      step: 1,
      placeholder: 'Âge',
    },
    {
      type: 'number',
      key: 'hr',
      label: 'Fréquence cardiaque',
      unit: 'bpm',
      min: 30,
      max: 250,
      step: 1,
      placeholder: 'FC',
    },
    {
      type: 'number',
      key: 'sbp',
      label: 'Pression artérielle systolique',
      unit: 'mmHg',
      min: 40,
      max: 250,
      step: 1,
      placeholder: 'PAS',
    },
    {
      type: 'number',
      key: 'creatinine',
      label: 'Créatinine sérique',
      unit: 'µmol/L',
      min: 10,
      max: 880,
      step: 1,
      placeholder: 'Créat',
    },
    {
      type: 'segment',
      key: 'killip',
      label: 'Classe Killip',
      options: [
        { value: 1, label: 'I', description: 'Pas d\'IC' },
        { value: 2, label: 'II', description: 'Râles / TJD' },
        { value: 3, label: 'III', description: 'OAP' },
        { value: 4, label: 'IV', description: 'Choc cardiogénique' },
      ],
    },
    {
      type: 'toggle',
      key: 'cardiacArrest',
      label: 'Arrêt cardiaque à l\'admission',
      points: 39,
    },
    {
      type: 'toggle',
      key: 'stDeviation',
      label: 'Déviation du segment ST',
      points: 28,
    },
    {
      type: 'toggle',
      key: 'elevatedEnzymes',
      label: 'Enzymes cardiaques élevées',
      description: 'Troponine / CK-MB élevée',
      points: 14,
    },
  ],
  calculate: calculateGrace,
  interpret: interpretGrace,
}

export default graceScore
