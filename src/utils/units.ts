export interface UnitConversion {
  baseUnit: string
  altUnit: string
  toAlt: (v: number) => number
  toBase: (v: number) => number
  altMin: number
  altMax: number
  altStep: number
}

export const creatinineConversion: UnitConversion = {
  baseUnit: 'mg/dL',
  altUnit: 'µmol/L',
  toAlt: (v) => Math.round(v * 88.4 * 10) / 10,
  toBase: (v) => Math.round((v / 88.4) * 100) / 100,
  altMin: 10,
  altMax: 880,
  altStep: 10,
}
