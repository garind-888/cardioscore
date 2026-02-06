import { describe, it, expect } from 'vitest'
import { calculateGrace } from './calculate'

describe('GRACE 2.0', () => {
  it('returns null when required fields are missing', () => {
    expect(calculateGrace({})).toBeNull()
    expect(calculateGrace({ age: 65 })).toBeNull()
    expect(calculateGrace({ age: 65, hr: 80 })).toBeNull()
  })

  it('calculates a low-risk patient correctly', () => {
    // Young, normal vitals, Killip I, no flags
    const result = calculateGrace({
      age: 45,       // 40-49 = 25 pts
      hr: 72,        // 70-89 = 9 pts
      sbp: 130,      // 120-139 = 34 pts
      creatinine: 0.9, // 0.8-1.19 = 7 pts
      killip: 1,     // 0 pts
      cardiacArrest: false, // 0
      stDeviation: false,   // 0
      elevatedEnzymes: false, // 0
    })
    expect(result).not.toBeNull()
    expect(result!.score).toBe(25 + 9 + 34 + 7 + 0)
    expect(result!.score).toBe(75)
  })

  it('calculates a high-risk patient correctly', () => {
    // Elderly, hypotensive, renal failure, Killip IV, all flags
    const result = calculateGrace({
      age: 82,        // 80-89 = 91 pts
      hr: 115,        // 110-149 = 24 pts
      sbp: 75,        // <80 = 58 pts
      creatinine: 2.5, // 2.0-3.99 = 21 pts
      killip: 4,      // 59 pts
      cardiacArrest: true,   // 39 pts
      stDeviation: true,     // 28 pts
      elevatedEnzymes: true, // 14 pts
    })
    expect(result).not.toBeNull()
    expect(result!.score).toBe(91 + 24 + 58 + 21 + 59 + 39 + 28 + 14)
    expect(result!.score).toBe(334)
  })

  it('binary flags add correct points', () => {
    const base = {
      age: 55, hr: 80, sbp: 120, creatinine: 1.0, killip: 1,
      cardiacArrest: false, stDeviation: false, elevatedEnzymes: false,
    }
    const baseScore = calculateGrace(base)!.score

    const withArrest = calculateGrace({ ...base, cardiacArrest: true })!.score
    expect(withArrest - baseScore).toBe(39)

    const withST = calculateGrace({ ...base, stDeviation: true })!.score
    expect(withST - baseScore).toBe(28)

    const withEnzymes = calculateGrace({ ...base, elevatedEnzymes: true })!.score
    expect(withEnzymes - baseScore).toBe(14)
  })

  it('lower SBP gives higher points (inverse)', () => {
    const base = { age: 55, hr: 80, creatinine: 1.0, killip: 1 }
    const low = calculateGrace({ ...base, sbp: 70 })!.score
    const high = calculateGrace({ ...base, sbp: 180 })!.score
    expect(low).toBeGreaterThan(high)
  })

  it('includes mortality estimates in details', () => {
    const result = calculateGrace({
      age: 65, hr: 90, sbp: 130, creatinine: 1.0, killip: 1,
      cardiacArrest: false, stDeviation: false, elevatedEnzymes: false,
    })
    expect(result?.details?.inHospitalMortality).toBeDefined()
    expect(result?.details?.sixMonthMortality).toBeDefined()
    expect(typeof result?.details?.inHospitalMortality).toBe('number')
  })
})
