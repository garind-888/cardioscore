import { describe, it, expect } from 'vitest'
import { creatinineConversion } from './units'

describe('creatinineConversion', () => {
  it('converts mg/dL to µmol/L', () => {
    expect(creatinineConversion.toAlt(1.0)).toBeCloseTo(88.4, 0)
    expect(creatinineConversion.toAlt(0.9)).toBeCloseTo(79.6, 0)
    expect(creatinineConversion.toAlt(2.5)).toBeCloseTo(221.0, 0)
  })

  it('converts µmol/L to mg/dL', () => {
    expect(creatinineConversion.toBase(88.4)).toBeCloseTo(1.0, 1)
    expect(creatinineConversion.toBase(80)).toBeCloseTo(0.9, 1)
    expect(creatinineConversion.toBase(220)).toBeCloseTo(2.49, 1)
  })

  it('round-trips with acceptable precision', () => {
    const testValues = [0.1, 0.5, 0.9, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0]
    for (const v of testValues) {
      const roundTrip = creatinineConversion.toBase(creatinineConversion.toAlt(v))
      expect(roundTrip).toBeCloseTo(v, 1)
    }
  })
})
