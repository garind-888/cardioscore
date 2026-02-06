import type { ScoreDefinition } from '../../types'
import { calculateQtc } from './calculate'
import { interpretQtc } from './interpret'

const qtcScore: ScoreDefinition = {
  id: 'qtc',
  name: 'Calculateur QTc',
  shortName: 'QTc',
  shortDescription: 'QT corrigé selon 5 formules (Bazett, Fridericia, Hodges…)',
  category: 'ECG',
  icon: '📈',
  inputs: [
    {
      type: 'segment',
      key: 'sex',
      label: 'Sexe',
      options: [
        { value: 'male', label: 'Homme' },
        { value: 'female', label: 'Femme' },
      ],
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
      key: 'squares',
      label: 'QT en petits carrés',
      unit: 'petits carrés',
      min: 1,
      max: 20,
      step: 1,
      placeholder: 'Nb petits carrés',
    },
  ],
  calculate: calculateQtc,
  interpret: interpretQtc,
}

export default qtcScore
