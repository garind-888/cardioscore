import { describe, it, expect } from 'vitest'
import { calculateChadVa } from './calculate'

describe('CHA₂DS₂-VA', () => {
  it('returns 0 when all factors are false', () => {
    const result = calculateChadVa({})
    expect(result?.score).toBe(0)
  })

  it('scores 1 for heart failure alone', () => {
    const result = calculateChadVa({ heartFailure: true })
    expect(result?.score).toBe(1)
  })

  it('scores 2 for age >= 75', () => {
    const result = calculateChadVa({ age75: true })
    expect(result?.score).toBe(2)
  })

  it('scores 2 for stroke/TIA', () => {
    const result = calculateChadVa({ stroke: true })
    expect(result?.score).toBe(2)
  })

  it('age75 and age65 are mutually exclusive (age75 wins when both true)', () => {
    // In the calculate function, age75 takes precedence via if/else
    const result = calculateChadVa({ age75: true, age65: true })
    expect(result?.score).toBe(2) // only age75 points
  })

  it('max score is 8 (all factors, age >= 75)', () => {
    const result = calculateChadVa({
      heartFailure: true,   // 1
      hypertension: true,   // 1
      age75: true,          // 2
      diabetes: true,       // 1
      stroke: true,         // 2
      vascular: true,       // 1
    })
    expect(result?.score).toBe(8)
  })

  it('scores correctly with age 65-74 path', () => {
    const result = calculateChadVa({
      hypertension: true,  // 1
      age65: true,         // 1
      diabetes: true,      // 1
    })
    expect(result?.score).toBe(3)
  })
})
