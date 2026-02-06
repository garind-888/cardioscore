import type { ScoreDefinition } from '../../types'
import { calculateScore2Unified } from './calculate'
import { interpretScore2 } from './interpret'

const score2Score: ScoreDefinition = {
  id: 'score2',
  name: 'SCORE2 / SCORE2-OP',
  shortName: 'SCORE2',
  shortDescription: 'Risque CV à 10 ans (ESC 2021) — inclut Diabète et MRC',
  category: 'Prévention',
  icon: '🫁',
  inputs: [
    {
      type: 'segment',
      key: 'region',
      label: 'Région de risque',
      options: [
        { value: 'Low', label: 'Bas', description: 'FR, CH, BE, ES…' },
        { value: 'Moderate', label: 'Modéré', description: 'DE, IT, PT…' },
        { value: 'High', label: 'Élevé', description: 'PL, CZ, HR…' },
        { value: 'Very high', label: 'Très élevé', description: 'RO, BG, UA…' },
      ],
    },
    {
      type: 'number',
      key: 'age',
      label: 'Âge',
      unit: 'ans',
      min: 40,
      max: 90,
      step: 1,
      placeholder: 'Âge',
    },
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
      type: 'toggle',
      key: 'smoker',
      label: 'Tabac actif',
    },
    {
      type: 'number',
      key: 'sbp',
      label: 'Pression artérielle systolique',
      unit: 'mmHg',
      min: 90,
      max: 200,
      step: 1,
      placeholder: 'PAS',
    },
    {
      type: 'number',
      key: 'totalChol',
      label: 'Cholestérol total',
      unit: 'mmol/L',
      min: 3,
      max: 10,
      step: 0.1,
      inputMode: 'decimal',
      placeholder: 'CT',
    },
    {
      type: 'number',
      key: 'hdl',
      label: 'HDL-cholestérol',
      unit: 'mmol/L',
      min: 0.5,
      max: 3.0,
      step: 0.1,
      inputMode: 'decimal',
      placeholder: 'HDL',
    },
    // --- Optional sections ---
    {
      type: 'toggle',
      key: 'diabetes',
      label: 'Diabète type 2',
      description: 'Active les champs SCORE2-Diabetes si < 70 ans',
    },
    {
      type: 'number',
      key: 'diabetesAge',
      label: 'Âge au diagnostic du diabète',
      unit: 'ans',
      min: 20,
      max: 90,
      step: 1,
      placeholder: 'Âge diag.',
      dependsOn: { key: 'diabetes', value: true },
    },
    {
      type: 'number',
      key: 'hba1c',
      label: 'HbA1c',
      unit: 'mmol/mol',
      min: 20,
      max: 130,
      step: 1,
      placeholder: 'HbA1c',
      dependsOn: { key: 'diabetes', value: true },
    },
    {
      type: 'toggle',
      key: 'ckd',
      label: 'Ajustement rénal (MRC)',
      description: 'Add-on CKD — DFGe, RAC, bandelette',
    },
    {
      type: 'number',
      key: 'egfr',
      label: 'DFGe (débit de filtration glomérulaire)',
      unit: 'mL/min/1.73m²',
      min: 15,
      max: 120,
      step: 1,
      placeholder: 'DFGe',
      dependsOn: [
        { key: 'diabetes', value: true },
        { key: 'ckd', value: true },
      ],
    },
    {
      type: 'number',
      key: 'acr',
      label: 'RAC (rapport albumine/créatinine)',
      unit: 'mg/g',
      min: 0,
      max: 3000,
      step: 1,
      placeholder: 'RAC (optionnel)',
      dependsOn: { key: 'ckd', value: true },
    },
    {
      type: 'segment',
      key: 'dipstick',
      label: 'Bandelette urinaire (si RAC indisponible)',
      options: [
        { value: 'negative', label: 'Négatif' },
        { value: 'trace', label: 'Traces' },
        { value: '1+', label: '1+' },
        { value: '2+', label: '2+' },
        { value: '3+', label: '3+' },
      ],
      dependsOn: { key: 'ckd', value: true },
    },
  ],
  calculate: calculateScore2Unified,
  interpret: (result) => {
    // Age is stored in details or we extract from the result context
    // For interpret, we need age — we store it via the calculate function
    const age = (result.details?.age as number) || 60
    return interpretScore2(result, age)
  },
}

export default score2Score
