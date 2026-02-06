import type { ScoreResult } from '../../types'
import {
  ageBrackets,
  hrBrackets,
  sbpBrackets,
  creatinineBrackets,
  killipPoints,
  cardiacArrestPoints,
  stDeviationPoints,
  elevatedEnzymesPoints,
  lookupBracket,
  inHospitalMortality,
  sixMonthMortality,
} from './grace-tables'

export function calculateGrace(values: Record<string, number | boolean | string>): ScoreResult | null {
  const age = values.age as number
  const hr = values.hr as number
  const sbp = values.sbp as number
  const creatinine = values.creatinine as number
  const killip = values.killip as number

  if (!age || !hr || !sbp || !creatinine || !killip) return null

  const agePoints = lookupBracket(age, ageBrackets)
  const hrPoints = lookupBracket(hr, hrBrackets)
  const sbpPoints = lookupBracket(sbp, sbpBrackets)
  const creatPoints = lookupBracket(creatinine, creatinineBrackets)
  const killipPts = killipPoints[killip] ?? 0

  const arrestPts = values.cardiacArrest === true ? cardiacArrestPoints : 0
  const stPts = values.stDeviation === true ? stDeviationPoints : 0
  const enzymePts = values.elevatedEnzymes === true ? elevatedEnzymesPoints : 0

  const score = agePoints + hrPoints + sbpPoints + creatPoints + killipPts + arrestPts + stPts + enzymePts

  return {
    score,
    details: {
      agePoints,
      hrPoints,
      sbpPoints,
      creatPoints,
      killipPts,
      arrestPts,
      stPts,
      enzymePts,
      inHospitalMortality: inHospitalMortality(score),
      sixMonthMortality: sixMonthMortality(score),
    },
  }
}
