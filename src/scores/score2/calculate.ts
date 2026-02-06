import type { ScoreResult } from '../../types'
import type { Region, Gender } from './coefficients'
import {
  RECALIBRATION,
  SCORE2_COEF,
  SCORE2OP_COEF,
  SCORE2_DIABETES_COEF,
  CKD_ADDON,
} from './coefficients'

// =============================================================================
// HELPERS
// =============================================================================

function recalibrate(uncalRisk: number, s1: number, s2: number): number {
  return 1 - Math.exp(-Math.exp(s1 + s2 * Math.log(-Math.log(1 - uncalRisk))))
}

// =============================================================================
// SCORE2 (40–69)
// =============================================================================

export interface Score2Params {
  region: Region
  age: number
  gender: Gender
  smoker: number
  sbp: number
  totalChol: number
  hdl: number
  diabetes?: number
}

export function calculateSCORE2(p: Score2Params) {
  const c = SCORE2_COEF[p.gender]
  const r = RECALIBRATION.score2[p.region][p.gender]
  const diabetes = p.diabetes ?? 0
  const cAge = (p.age - 60) / 5
  const cSBP = (p.sbp - 120) / 20
  const cTC = p.totalChol - 6
  const cHDL = (p.hdl - 1.3) / 0.5

  const lp =
    c.age * cAge + c.smoker * p.smoker + c.sbp * cSBP + c.diabetes * diabetes +
    c.tc * cTC + c.hdl * cHDL +
    c.age_x_smoker * cAge * p.smoker + c.age_x_sbp * cAge * cSBP +
    c.age_x_tc * cAge * cTC + c.age_x_hdl * cAge * cHDL +
    c.age_x_diabetes * cAge * diabetes

  const uncal = 1 - Math.pow(c.S0, Math.exp(lp))
  const risk = recalibrate(uncal, r.s1, r.s2)
  return Math.round(risk * 1000) / 10
}

// =============================================================================
// SCORE2-OP (≥70)
// =============================================================================

export function calculateSCORE2OP(p: Score2Params) {
  const c = SCORE2OP_COEF[p.gender]
  const r = RECALIBRATION.score2op[p.region][p.gender]
  const diabetes = p.diabetes ?? 0
  const cAge = p.age - 73
  const cSBP = p.sbp - 150
  const cTC = p.totalChol - 6
  const cHDL = p.hdl - 1.4

  const lp =
    c.age * cAge + c.diabetes * diabetes + c.smoker * p.smoker + c.sbp * cSBP +
    c.tc * cTC + c.hdl * cHDL +
    c.age_x_diabetes * cAge * diabetes + c.age_x_smoker * cAge * p.smoker +
    c.age_x_sbp * cAge * cSBP + c.age_x_tc * cAge * cTC + c.age_x_hdl * cAge * cHDL

  const uncal = 1 - Math.pow(c.S0, Math.exp(lp - c.offset))
  const risk = recalibrate(uncal, r.s1, r.s2)
  return Math.round(risk * 1000) / 10
}

// =============================================================================
// SCORE2-Diabetes (40–69, DT2)
// =============================================================================

export interface Score2DiabetesParams extends Score2Params {
  diabetesAge: number
  hba1c: number
  egfr: number
}

export function calculateSCORE2Diabetes(p: Score2DiabetesParams) {
  const c = SCORE2_DIABETES_COEF[p.gender]
  const r = RECALIBRATION.score2[p.region][p.gender]
  const cAge = (p.age - 60) / 5
  const cSBP = (p.sbp - 120) / 20
  const cTC = p.totalChol - 6
  const cHDL = (p.hdl - 1.3) / 0.5
  const cDmAge = (p.diabetesAge - 50) / 5
  const cHbA1c = (p.hba1c - 31) / 9.34
  const cLogGFR = (Math.log(p.egfr) - 4.5) / 0.15

  const lp =
    c.age * cAge + c.smoker * p.smoker + c.sbp * cSBP + c.diabetes * 1 +
    c.tc * cTC + c.hdl * cHDL +
    c.age_x_smoker * cAge * p.smoker + c.age_x_sbp * cAge * cSBP +
    c.age_x_diabetes * cAge * 1 + c.age_x_tc * cAge * cTC + c.age_x_hdl * cAge * cHDL +
    c.dm_age * 1 * cDmAge + c.hba1c * cHbA1c + c.log_egfr * cLogGFR +
    c.log_egfr_sq * cLogGFR * cLogGFR +
    c.hba1c_x_age * cHbA1c * cAge + c.log_egfr_x_age * cLogGFR * cAge

  const uncal = 1 - Math.pow(c.S0, Math.exp(lp))
  const risk = recalibrate(uncal, r.s1, r.s2)
  return Math.round(risk * 1000) / 10
}

// =============================================================================
// CKD ADD-ON — Expected eGFR & ACR
// =============================================================================

function calculateExpectedEGFR(p: {
  age: number; gender: Gender; smoker: number; sbp: number
  totalChol: number; hdl: number; diabetes: number
}): number {
  const e = CKD_ADDON.expectedEGFR
  const cAge = (p.age - 60) / 5
  const cSBP = (p.sbp - 120) / 20
  const cTC = p.totalChol - 6
  const cHDL = (p.hdl - 1.3) / 0.5

  return (
    e.intercept +
    e.age * cAge +
    (p.gender === 'female' ? e.female : 0) +
    e.tc * cTC +
    e.hdl * cHDL +
    e.sbp * cSBP +
    e.diabetes * p.diabetes +
    e.smoker * p.smoker +
    e.age_x_tc * cAge * cTC +
    e.age_x_hdl * cAge * cHDL +
    e.age_x_sbp * cAge * cSBP +
    e.age_x_diabetes * cAge * p.diabetes +
    e.age_x_smoker * cAge * p.smoker
  )
}

function calculateExpectedACR(p: {
  age: number; gender: Gender; smoker: number; sbp: number
  totalChol: number; hdl: number; diabetes: number; egfr: number
}): number {
  const a = CKD_ADDON.expectedACR
  const cAge = (p.age - 60) / 5
  const cSBP = (p.sbp - 120) / 20
  const cTC = p.totalChol - 6
  const cHDL = (p.hdl - 1.3) / 0.5

  const eGFR_b60 = Math.min(p.egfr - 60, 0) / -15
  const eGFR_60_90 = Math.min(Math.max(p.egfr - 60, 0), 30) / -15
  const eGFR_a90 = Math.max(p.egfr - 90, 0) / -15

  const exponent =
    a.intercept + a.offset +
    a.age * cAge +
    (p.gender === 'female' ? a.female : 0) +
    a.tc * cTC + a.hdl * cHDL + a.sbp * cSBP +
    a.diabetes * p.diabetes + a.smoker * p.smoker +
    a.age_x_tc * cAge * cTC + a.age_x_hdl * cAge * cHDL +
    a.age_x_sbp * cAge * cSBP + a.age_x_diabetes * cAge * p.diabetes +
    a.age_x_smoker * cAge * p.smoker +
    a.eGFR_below60 * eGFR_b60 + a.eGFR_60_90 * eGFR_60_90 + a.eGFR_above90 * eGFR_a90

  return Math.pow(8, exponent)
}

// =============================================================================
// SCORE2/OP + CKD ADD-ON
// =============================================================================

export interface Score2CKDParams extends Score2Params {
  egfr: number
  acr?: number
  dipstick?: string
}

export function calculateSCORE2CKD(p: Score2CKDParams): {
  risk: number
  model: string
  layers: { base: number; eGFR: number; final: number }
} {
  const isOP = p.age >= 70
  const diabetes = p.diabetes ?? 0

  // Layer 1: base SCORE2 or SCORE2-OP
  let baseRiskProp: number
  if (!isOP) {
    const c = SCORE2_COEF[p.gender]
    const r = RECALIBRATION.score2[p.region][p.gender]
    const cAge = (p.age - 60) / 5
    const cSBP = (p.sbp - 120) / 20
    const cTC = p.totalChol - 6
    const cHDL = (p.hdl - 1.3) / 0.5
    const lp =
      c.age * cAge + c.smoker * p.smoker + c.sbp * cSBP + c.diabetes * diabetes +
      c.tc * cTC + c.hdl * cHDL +
      c.age_x_smoker * cAge * p.smoker + c.age_x_sbp * cAge * cSBP +
      c.age_x_tc * cAge * cTC + c.age_x_hdl * cAge * cHDL + c.age_x_diabetes * cAge * diabetes
    const uncal = 1 - Math.pow(c.S0, Math.exp(lp))
    baseRiskProp = recalibrate(uncal, r.s1, r.s2)
  } else {
    const c = SCORE2OP_COEF[p.gender]
    const r = RECALIBRATION.score2op[p.region][p.gender]
    const cAge = p.age - 73
    const cSBP = p.sbp - 150
    const cTC = p.totalChol - 6
    const cHDL = p.hdl - 1.4
    const lp =
      c.age * cAge + c.diabetes * diabetes + c.smoker * p.smoker + c.sbp * cSBP +
      c.tc * cTC + c.hdl * cHDL +
      c.age_x_diabetes * cAge * diabetes + c.age_x_smoker * cAge * p.smoker +
      c.age_x_sbp * cAge * cSBP + c.age_x_tc * cAge * cTC + c.age_x_hdl * cAge * cHDL
    const uncal = 1 - Math.pow(c.S0, Math.exp(lp - c.offset))
    baseRiskProp = recalibrate(uncal, r.s1, r.s2)
  }

  // Layer 2: eGFR adjustment
  const exEGFR = calculateExpectedEGFR({
    age: p.age, gender: p.gender, smoker: p.smoker, sbp: p.sbp,
    totalChol: p.totalChol, hdl: p.hdl, diabetes,
  })

  const obs_b60 = Math.min(p.egfr, 60) / -15
  const obs_60_90 = Math.min(Math.max(p.egfr - 60, 0), 30) / -15
  const obs_a90 = Math.max(p.egfr - 90, 0) / -15
  const exp_b60 = Math.min(exEGFR, 60) / -15
  const exp_60_90 = Math.min(Math.max(exEGFR - 60, 0), 30) / -15
  const exp_a90 = Math.max(exEGFR - 90, 0) / -15

  let deltaEGFR: number
  if (!isOP) {
    const k = CKD_ADDON.eGFR_under70
    const cAge5 = (p.age - 60) / 5
    deltaEGFR =
      k.below60 * (obs_b60 - exp_b60) +
      k.range60_90 * (obs_60_90 - exp_60_90) +
      k.age_x_below60 * cAge5 * (obs_b60 - exp_b60) +
      k.age_x_range60_90 * cAge5 * (obs_60_90 - exp_60_90)
  } else {
    const k = CKD_ADDON.eGFR_over70
    const cAge73 = p.age - 73
    deltaEGFR =
      k.below60 * (obs_b60 - exp_b60) +
      k.range60_90 * (obs_60_90 - exp_60_90) +
      k.above90 * (obs_a90 - exp_a90) +
      k.age_x_below60 * cAge73 * (obs_b60 - exp_b60) +
      k.age_x_range60_90 * cAge73 * (obs_60_90 - exp_60_90) +
      k.age_x_above90 * cAge73 * (obs_a90 - exp_a90)
  }

  const eGFRRiskProp = 1 - Math.pow(1 - baseRiskProp, Math.exp(deltaEGFR))

  // Layer 3: albuminuria (ACR or dipstick)
  let finalRiskProp = eGFRRiskProp

  if (p.acr !== undefined) {
    const exACR = calculateExpectedACR({
      age: p.age, gender: p.gender, smoker: p.smoker, sbp: p.sbp,
      totalChol: p.totalChol, hdl: p.hdl, diabetes, egfr: p.egfr,
    })
    const acrCoef = !isOP ? CKD_ADDON.ACR_coef.under70 : CKD_ADDON.ACR_coef.over70
    const deltaACR = acrCoef * (Math.log(p.acr) / Math.log(8) - Math.log(exACR) / Math.log(8))
    finalRiskProp = 1 - Math.pow(1 - eGFRRiskProp, Math.exp(deltaACR))
  } else if (p.dipstick !== undefined) {
    const dipCoef = CKD_ADDON.dipstick[p.dipstick]
    if (dipCoef !== undefined) {
      finalRiskProp = 1 - Math.pow(1 - eGFRRiskProp, Math.exp(dipCoef))
    }
  }

  const risk = Math.round(finalRiskProp * 1000) / 10
  const model = isOP ? 'SCORE2-OP + CKD' : 'SCORE2 + CKD'

  return {
    risk,
    model,
    layers: {
      base: Math.round(baseRiskProp * 1000) / 10,
      eGFR: Math.round(eGFRRiskProp * 1000) / 10,
      final: risk,
    },
  }
}

// =============================================================================
// UNIFIED ROUTER — auto-selects the right model
// =============================================================================

export function calculateScore2Unified(
  values: Record<string, number | boolean | string>,
): ScoreResult | null {
  const age = values.age as number
  const gender = (values.sex as string) as Gender
  const region = (values.region as string) as Region
  const sbp = values.sbp as number
  const totalChol = values.totalChol as number
  const hdl = values.hdl as number

  if (!age || !gender || !region || !sbp || !totalChol || !hdl) return null

  const smoker = values.smoker === true ? 1 : 0
  const diabetesOn = values.diabetes === true
  const ckdOn = values.ckd === true
  const diabetesFlag = diabetesOn ? 1 : 0

  const baseParams: Score2Params = {
    region, age, gender, smoker, sbp, totalChol, hdl, diabetes: diabetesFlag,
  }

  // Route 1: SCORE2-Diabetes (40–69 with diabetes-specific fields)
  if (diabetesOn && age < 70) {
    const diabetesAge = values.diabetesAge as number
    const hba1c = values.hba1c as number
    const egfr = values.egfr as number
    if (diabetesAge && hba1c && egfr) {
      const risk = calculateSCORE2Diabetes({
        ...baseParams, diabetesAge, hba1c, egfr,
      })
      return {
        score: risk,
        display: `${risk}%`,
        label: 'SCORE2-Diabetes',
        details: { model: 'SCORE2-Diabetes', risk, age },
      }
    }
  }

  // Route 2: CKD add-on (needs eGFR, without diabetes-specific fields)
  if (ckdOn && !diabetesOn) {
    const egfr = values.egfr as number
    if (egfr) {
      const acr = values.acr as number | undefined
      const dipstick = values.dipstick as string | undefined
      const result = calculateSCORE2CKD({
        ...baseParams,
        egfr,
        acr: acr || undefined,
        dipstick: dipstick || undefined,
      })
      return {
        score: result.risk,
        display: `${result.risk}%`,
        label: result.model,
        details: {
          model: result.model,
          risk: result.risk,
          age,
          baseRisk: result.layers.base,
          eGFRAdjusted: result.layers.eGFR,
          finalRisk: result.layers.final,
        },
      }
    }
  }

  // Route 3: SCORE2-OP (≥70)
  if (age >= 70) {
    const risk = calculateSCORE2OP(baseParams)
    return {
      score: risk,
      display: `${risk}%`,
      label: 'SCORE2-OP',
      details: { model: 'SCORE2-OP', risk, age },
    }
  }

  // Route 4: SCORE2 standard (40–69)
  const risk = calculateSCORE2(baseParams)
  return {
    score: risk,
    display: `${risk}%`,
    label: 'SCORE2',
    details: { model: 'SCORE2', risk, age },
  }
}
