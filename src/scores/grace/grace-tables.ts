// GRACE 2.0 point lookup tables
// Source: Fox KAA et al. BMJ Open 2014; MDCalc; UMass GRACE coefficients

type Bracket = [number, number, number] // [min, max, points]

export const ageBrackets: Bracket[] = [
  [0, 29, 0],
  [30, 39, 8],
  [40, 49, 25],
  [50, 59, 41],
  [60, 69, 58],
  [70, 79, 75],
  [80, 89, 91],
  [90, Infinity, 100],
]

export const hrBrackets: Bracket[] = [
  [0, 49, 0],
  [50, 69, 3],
  [70, 89, 9],
  [90, 109, 15],
  [110, 149, 24],
  [150, 199, 38],
  [200, Infinity, 46],
]

// Inverse: lower BP = more points
export const sbpBrackets: Bracket[] = [
  [0, 79, 58],
  [80, 99, 53],
  [100, 119, 43],
  [120, 139, 34],
  [140, 159, 24],
  [160, 199, 10],
  [200, Infinity, 0],
]

export const creatinineBrackets: Bracket[] = [
  [0, 0.39, 1],
  [0.4, 0.79, 4],
  [0.8, 1.19, 7],
  [1.2, 1.59, 10],
  [1.6, 1.99, 13],
  [2.0, 3.99, 21],
  [4.0, Infinity, 28],
]

export const killipPoints: Record<number, number> = {
  1: 0,
  2: 20,
  3: 39,
  4: 59,
}

export const cardiacArrestPoints = 39
export const stDeviationPoints = 28
export const elevatedEnzymesPoints = 14

export function lookupBracket(value: number, brackets: Bracket[]): number {
  for (const [min, max, points] of brackets) {
    if (value >= min && value <= max) return points
  }
  return 0
}

// Score-to-probability interpolation for in-hospital mortality
// Knot points from GRACE 2.0 validation data
const inHospitalKnots: [number, number][] = [
  [50, 0.001],
  [87, 0.02],
  [107, 0.01],
  [115, 0.02],
  [128, 0.03],
  [140, 0.05],
  [149, 0.1],
  [165, 0.15],
  [173, 0.2],
  [181, 0.3],
  [190, 0.4],
  [199, 0.5],
  [207, 0.6],
  [218, 0.7],
  [250, 0.8],
  [284, 0.9],
  [320, 0.95],
  [372, 0.99],
]

const sixMonthKnots: [number, number][] = [
  [40, 0.002],
  [70, 0.01],
  [89, 0.03],
  [107, 0.05],
  [118, 0.08],
  [130, 0.10],
  [145, 0.15],
  [160, 0.20],
  [175, 0.30],
  [190, 0.40],
  [210, 0.50],
  [250, 0.70],
  [300, 0.85],
  [372, 0.99],
]

function interpolate(score: number, knots: [number, number][]): number {
  if (score <= knots[0][0]) return knots[0][1]
  if (score >= knots[knots.length - 1][0]) return knots[knots.length - 1][1]

  for (let i = 0; i < knots.length - 1; i++) {
    const [x0, y0] = knots[i]
    const [x1, y1] = knots[i + 1]
    if (score >= x0 && score <= x1) {
      const t = (score - x0) / (x1 - x0)
      return y0 + t * (y1 - y0)
    }
  }
  return 0
}

export function inHospitalMortality(score: number): number {
  return Math.round(interpolate(score, inHospitalKnots) * 1000) / 10
}

export function sixMonthMortality(score: number): number {
  return Math.round(interpolate(score, sixMonthKnots) * 1000) / 10
}
