import { describe, it, expect } from 'vitest'
import { calculateQtc } from './calculate'

describe('QTc Calculator', () => {
  it('returns null when inputs are missing', () => {
    expect(calculateQtc({})).toBeNull()
    expect(calculateQtc({ hr: 75 })).toBeNull()
    expect(calculateQtc({ squares: 10 })).toBeNull()
  })

  it('computes QT from small squares (10 squares = 400ms)', () => {
    const result = calculateQtc({ hr: 75, squares: 10 })
    expect(result?.details?.qtMs).toBe(400)
  })

  it('computes Bazett correctly at HR=60 (RR=1s)', () => {
    // At HR=60, RR=1.0s, QTc = QT / sqrt(1) = QT
    const result = calculateQtc({ hr: 60, squares: 10 })
    expect(result?.details?.bazett).toBe(400)
  })

  it('Bazett overcorrects at high HR', () => {
    // HR=120, QT=320ms (8 squares), RR=0.5s
    // Bazett: 320 / sqrt(0.5) = 320 / 0.7071 ≈ 453
    const result = calculateQtc({ hr: 120, squares: 8 })
    expect(result?.details?.bazett).toBe(453)
  })

  it('computes Fridericia correctly', () => {
    // HR=75, QT=400ms (10 squares), RR=0.8s
    // Fridericia: 400 / 0.8^(1/3) = 400 / 0.9283 ≈ 431
    const result = calculateQtc({ hr: 75, squares: 10 })
    expect(result?.details?.fridericia).toBe(431)
  })

  it('computes Hodges correctly', () => {
    // HR=75, QT=400ms
    // Hodges: 400 + 1.75 * (75-60) = 400 + 26.25 = 426
    const result = calculateQtc({ hr: 75, squares: 10 })
    expect(result?.details?.hodges).toBe(426)
  })

  it('computes Framingham correctly', () => {
    // HR=75, QT=400ms, RR=800ms
    // Framingham: 400 + 0.154 * (1000 - 800) = 400 + 30.8 = 431
    const result = calculateQtc({ hr: 75, squares: 10 })
    expect(result?.details?.framingham).toBe(431)
  })

  it('computes Rautaharju correctly', () => {
    // HR=75, QT=400ms
    // Rautaharju: 400 * (120+75) / 180 = 400 * 195/180 ≈ 433
    const result = calculateQtc({ hr: 75, squares: 10 })
    expect(result?.details?.rautaharju).toBe(433)
  })

  it('all formulas agree at HR=60 (RR=1s)', () => {
    // Bazett: QT/sqrt(1)=QT, Fridericia: QT/1^(1/3)=QT
    // Hodges: QT + 1.75*(60-60) = QT, Framingham: QT + 0.154*(1000-1000) = QT
    // Rautaharju: QT * (120+60)/180 = QT
    const result = calculateQtc({ hr: 60, squares: 10 })
    const d = result?.details!
    expect(d.bazett).toBe(400)
    expect(d.fridericia).toBe(400)
    expect(d.hodges).toBe(400)
    expect(d.framingham).toBe(400)
    expect(d.rautaharju).toBe(400)
  })

  it('bogossian is empty string when QRS is not provided', () => {
    const result = calculateQtc({ hr: 75, squares: 10 })
    expect(result?.details?.bogossian).toBe('')
  })

  it('computes Bogossian correctly with QRS', () => {
    // HR=60, QT=400ms (10 squares), QRS=160ms, RR=1.0s
    // QTm = 400 - 0.485 * 160 = 400 - 77.6 = 322.4
    // Bogossian = 322.4 / sqrt(1.0) = 322
    const result = calculateQtc({ hr: 60, squares: 10, qrs: 160 })
    expect(result?.details?.bogossian).toBe(322)
  })

  it('computes Bogossian with rate correction', () => {
    // HR=75, QT=400ms (10 squares), QRS=140ms, RR=0.8s
    // QTm = 400 - 0.485 * 140 = 400 - 67.9 = 332.1
    // Bogossian = 332.1 / sqrt(0.8) = 332.1 / 0.8944 ≈ 371
    const result = calculateQtc({ hr: 75, squares: 10, qrs: 140 })
    expect(result?.details?.bogossian).toBe(371)
  })
})
