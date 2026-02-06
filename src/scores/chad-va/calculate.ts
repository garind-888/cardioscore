import type { ScoreResult } from '../../types'

export interface ChadVaInputs {
  heartFailure: boolean
  hypertension: boolean
  age75: boolean
  diabetes: boolean
  stroke: boolean
  vascular: boolean
  age65: boolean
}

export function calculateChadVa(values: Record<string, number | boolean | string>): ScoreResult | null {
  const v: ChadVaInputs = {
    heartFailure: values.heartFailure === true,
    hypertension: values.hypertension === true,
    age75: values.age75 === true,
    diabetes: values.diabetes === true,
    stroke: values.stroke === true,
    vascular: values.vascular === true,
    age65: values.age65 === true,
  }

  let score = 0
  if (v.heartFailure) score += 1
  if (v.hypertension) score += 1
  if (v.age75) score += 2
  else if (v.age65) score += 1
  if (v.diabetes) score += 1
  if (v.stroke) score += 2
  if (v.vascular) score += 1

  return { score }
}
