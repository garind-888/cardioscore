import { describe, it, expect } from 'vitest'
import {
  calculateSCORE2,
  calculateSCORE2OP,
  calculateSCORE2Diabetes,
  calculateSCORE2CKD,
  calculateScore2Unified,
} from './calculate'

// =============================================================================
// SCORE2 — validated against R package RiskScorescvd
// =============================================================================

describe('SCORE2 (40–69)', () => {
  it('H50 fumeur Low → 5.9%', () => {
    const risk = calculateSCORE2({
      region: 'Low', age: 50, gender: 'male', smoker: 1,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
    })
    expect(risk).toBe(5.9)
  })

  it('F50 fumeuse Low → 4.2%', () => {
    const risk = calculateSCORE2({
      region: 'Low', age: 50, gender: 'female', smoker: 1,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
    })
    expect(risk).toBe(4.2)
  })

  it('H50 fumeur Very high → 14.0%', () => {
    const risk = calculateSCORE2({
      region: 'Very high', age: 50, gender: 'male', smoker: 1,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
    })
    expect(risk).toBe(14.0)
  })

  it('F50 fumeuse Very high → 13.7%', () => {
    const risk = calculateSCORE2({
      region: 'Very high', age: 50, gender: 'female', smoker: 1,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
    })
    expect(risk).toBe(13.7)
  })
})

// =============================================================================
// SCORE2-Diabetes
// =============================================================================

describe('SCORE2-Diabetes', () => {
  it('H60 DM Low → 8.4%', () => {
    const risk = calculateSCORE2Diabetes({
      region: 'Low', age: 60, gender: 'male', smoker: 0,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
      diabetesAge: 60, hba1c: 50, egfr: 90,
    })
    expect(risk).toBe(8.4)
  })

  it('H60 DM Moderate → ~11%', () => {
    const risk = calculateSCORE2Diabetes({
      region: 'Moderate', age: 60, gender: 'male', smoker: 0,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
      diabetesAge: 60, hba1c: 50, egfr: 90,
    })
    expect(risk).toBeCloseTo(11, 0)
  })

  it('H60 DM high-risk Moderate → ~17%', () => {
    const risk = calculateSCORE2Diabetes({
      region: 'Moderate', age: 60, gender: 'male', smoker: 0,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
      diabetesAge: 50, hba1c: 70, egfr: 60,
    })
    expect(Math.abs(risk - 17)).toBeLessThan(1)
  })

  it('F60 DM Moderate → ~8%', () => {
    const risk = calculateSCORE2Diabetes({
      region: 'Moderate', age: 60, gender: 'female', smoker: 0,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
      diabetesAge: 60, hba1c: 50, egfr: 90,
    })
    expect(Math.abs(risk - 8)).toBeLessThan(1)
  })

  it('F60 DM high-risk Moderate → ~13%', () => {
    const risk = calculateSCORE2Diabetes({
      region: 'Moderate', age: 60, gender: 'female', smoker: 0,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
      diabetesAge: 50, hba1c: 70, egfr: 60,
    })
    expect(Math.abs(risk - 13)).toBeLessThan(1)
  })
})

// =============================================================================
// SCORE2 + CKD Add-on
// =============================================================================

describe('SCORE2 + CKD', () => {
  const baseParams = {
    region: 'Low' as const, age: 60, gender: 'male' as const, smoker: 0,
    sbp: 140, totalChol: 5.5, hdl: 1.3, diabetes: 0,
  }

  it('eGFR normal (90) → close to base SCORE2', () => {
    const ckd = calculateSCORE2CKD({ ...baseParams, egfr: 90 })
    const base = calculateSCORE2(baseParams)
    expect(Math.abs(ckd.risk - base)).toBeLessThan(2)
  })

  it('eGFR bas (30) → risk significantly higher than base', () => {
    const ckd = calculateSCORE2CKD({ ...baseParams, egfr: 30 })
    const base = calculateSCORE2(baseParams)
    expect(ckd.risk).toBeGreaterThan(base)
  })

  it('eGFR bas + ACR élevé → risk higher than eGFR alone', () => {
    const ckdNoACR = calculateSCORE2CKD({ ...baseParams, egfr: 30 })
    const ckdACR = calculateSCORE2CKD({ ...baseParams, egfr: 30, acr: 300 })
    expect(ckdACR.risk).toBeGreaterThan(ckdNoACR.risk)
  })

  it('layers are consistent (base ≤ eGFR ≤ final when eGFR low)', () => {
    const ckd = calculateSCORE2CKD({ ...baseParams, egfr: 30, acr: 300 })
    expect(ckd.layers.base).toBeLessThanOrEqual(ckd.layers.eGFR)
    expect(ckd.layers.eGFR).toBeLessThanOrEqual(ckd.layers.final)
  })

  it('dipstick 2+ adds risk', () => {
    const ckdNone = calculateSCORE2CKD({ ...baseParams, egfr: 45 })
    const ckdDip = calculateSCORE2CKD({ ...baseParams, egfr: 45, dipstick: '2+' })
    expect(ckdDip.risk).toBeGreaterThan(ckdNone.risk)
  })
})

// =============================================================================
// SCORE2-OP (≥70) + CKD
// =============================================================================

describe('SCORE2-OP', () => {
  it('H75 fumeur Low returns a reasonable value', () => {
    const risk = calculateSCORE2OP({
      region: 'Low', age: 75, gender: 'male', smoker: 1,
      sbp: 150, totalChol: 5.5, hdl: 1.3,
    })
    expect(risk).toBeGreaterThan(5)
    expect(risk).toBeLessThan(40)
  })

  it('SCORE2-OP + CKD increases risk for low eGFR + high ACR', () => {
    const ckd = calculateSCORE2CKD({
      region: 'Low', age: 75, gender: 'male', smoker: 0,
      sbp: 150, totalChol: 5.5, hdl: 1.3, diabetes: 0,
      egfr: 40, acr: 200,
    })
    const base = calculateSCORE2OP({
      region: 'Low', age: 75, gender: 'male', smoker: 0,
      sbp: 150, totalChol: 5.5, hdl: 1.3,
    })
    expect(ckd.risk).toBeGreaterThan(base)
  })
})

// =============================================================================
// Unified router
// =============================================================================

describe('calculateScore2Unified — auto-routing', () => {
  it('returns null when required fields missing', () => {
    expect(calculateScore2Unified({})).toBeNull()
    expect(calculateScore2Unified({ age: 55 })).toBeNull()
  })

  it('routes to SCORE2 for age < 70 without diabetes/ckd', () => {
    const result = calculateScore2Unified({
      region: 'Low', age: 55, sex: 'male', smoker: false,
      sbp: 130, totalChol: 5, hdl: 1.4,
    })
    expect(result?.label).toBe('SCORE2')
  })

  it('routes to SCORE2-OP for age ≥ 70', () => {
    const result = calculateScore2Unified({
      region: 'Low', age: 75, sex: 'male', smoker: false,
      sbp: 150, totalChol: 5, hdl: 1.4,
    })
    expect(result?.label).toBe('SCORE2-OP')
  })

  it('routes to SCORE2-Diabetes when diabetes fields filled', () => {
    const result = calculateScore2Unified({
      region: 'Low', age: 60, sex: 'male', smoker: false,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
      diabetes: true, diabetesAge: 55, hba1c: 55, egfr: 85,
    })
    expect(result?.label).toBe('SCORE2-Diabetes')
  })

  it('routes to SCORE2 + CKD when ckd flag + eGFR', () => {
    const result = calculateScore2Unified({
      region: 'Low', age: 60, sex: 'male', smoker: false,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
      ckd: true, egfr: 35, acr: 300,
    })
    expect(result?.label).toBe('SCORE2 + CKD')
  })

  it('display shows percentage', () => {
    const result = calculateScore2Unified({
      region: 'Low', age: 50, sex: 'male', smoker: true,
      sbp: 140, totalChol: 5.5, hdl: 1.3,
    })
    expect(result?.display).toMatch(/%$/)
  })
})
