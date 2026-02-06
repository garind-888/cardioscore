// SCORE2, SCORE2-OP, SCORE2-Diabetes & SCORE2-CKD — Coefficients
// ==========================================================================
// Source: Package R "RiskScorescvd" (CRAN), par dvicencio et al.
//
// Références:
// - SCORE2:          Eur Heart J 2021;42:2439–2454
// - SCORE2-OP:       Eur Heart J 2021;42:2455–2467
// - SCORE2-Diabetes: Eur Heart J 2023;44:2544–2556
// - SCORE2-CKD:      Eur J Prev Cardiol 2022 (doi:10.1093/eurjpc/zwac216)

export type Region = 'Low' | 'Moderate' | 'High' | 'Very high'
export type Gender = 'male' | 'female'

interface RecalibrationParams {
  s1: number
  s2: number
}

// =============================================================================
// RECALIBRATION PARAMETERS
// =============================================================================

export const RECALIBRATION: Record<
  'score2' | 'score2op',
  Record<Region, Record<Gender, RecalibrationParams>>
> = {
  score2: {
    Low:         { male: { s1: -0.5699, s2: 0.7476 }, female: { s1: -0.7380, s2: 0.7019 } },
    Moderate:    { male: { s1: -0.1565, s2: 0.8009 }, female: { s1: -0.3143, s2: 0.7701 } },
    High:        { male: { s1:  0.3207, s2: 0.9360 }, female: { s1:  0.5710, s2: 0.9369 } },
    'Very high': { male: { s1:  0.5836, s2: 0.8294 }, female: { s1:  0.9412, s2: 0.8329 } },
  },
  score2op: {
    Low:         { male: { s1: -0.34, s2: 1.19 }, female: { s1: -0.52, s2: 1.01 } },
    Moderate:    { male: { s1:  0.01, s2: 1.25 }, female: { s1: -0.10, s2: 1.10 } },
    High:        { male: { s1:  0.08, s2: 1.15 }, female: { s1:  0.38, s2: 1.09 } },
    'Very high': { male: { s1:  0.05, s2: 0.70 }, female: { s1:  0.38, s2: 0.69 } },
  },
}

// =============================================================================
// COEFFICIENTS — SCORE2 (40–69, sans diabète)
// =============================================================================

export const SCORE2_COEF: Record<Gender, {
  age: number; smoker: number; sbp: number; diabetes: number
  tc: number; hdl: number
  age_x_smoker: number; age_x_sbp: number; age_x_tc: number
  age_x_hdl: number; age_x_diabetes: number
  S0: number
}> = {
  male: {
    age: 0.3742, smoker: 0.6012, sbp: 0.2777, diabetes: 0.6457,
    tc: 0.1458, hdl: -0.2698,
    age_x_smoker: -0.0755, age_x_sbp: -0.0255, age_x_tc: -0.0281,
    age_x_hdl: 0.0426, age_x_diabetes: -0.0983,
    S0: 0.9605,
  },
  female: {
    age: 0.4648, smoker: 0.7744, sbp: 0.3131, diabetes: 0.8096,
    tc: 0.1002, hdl: -0.2606,
    age_x_smoker: -0.1088, age_x_sbp: -0.0277, age_x_tc: -0.0226,
    age_x_hdl: 0.0613, age_x_diabetes: -0.1272,
    S0: 0.9776,
  },
}

// =============================================================================
// COEFFICIENTS — SCORE2-OP (≥70)
// =============================================================================

export const SCORE2OP_COEF: Record<Gender, {
  age: number; diabetes: number; smoker: number; sbp: number
  tc: number; hdl: number
  age_x_diabetes: number; age_x_smoker: number; age_x_sbp: number
  age_x_tc: number; age_x_hdl: number
  S0: number; offset: number
}> = {
  male: {
    age: 0.0634, diabetes: 0.4245, smoker: 0.3524, sbp: 0.0094,
    tc: 0.0850, hdl: -0.3564,
    age_x_diabetes: -0.0174, age_x_smoker: -0.0247, age_x_sbp: -0.0005,
    age_x_tc: 0.0073, age_x_hdl: 0.0091,
    S0: 0.7576, offset: 0.0929,
  },
  female: {
    age: 0.0789, diabetes: 0.6010, smoker: 0.4921, sbp: 0.0102,
    tc: 0.0605, hdl: -0.3040,
    age_x_diabetes: -0.0107, age_x_smoker: -0.0255, age_x_sbp: -0.0004,
    age_x_tc: -0.0009, age_x_hdl: 0.0154,
    S0: 0.8082, offset: 0.2290,
  },
}

// =============================================================================
// COEFFICIENTS — SCORE2-DIABETES (40–69, DT2)
// =============================================================================

export const SCORE2_DIABETES_COEF: Record<Gender, {
  age: number; smoker: number; sbp: number; diabetes: number
  tc: number; hdl: number
  age_x_smoker: number; age_x_sbp: number; age_x_diabetes: number
  age_x_tc: number; age_x_hdl: number
  dm_age: number; hba1c: number; log_egfr: number
  log_egfr_sq: number; hba1c_x_age: number; log_egfr_x_age: number
  S0: number
}> = {
  male: {
    age: 0.5368, smoker: 0.4774, sbp: 0.1322, diabetes: 0.6457,
    tc: 0.1102, hdl: -0.1087,
    age_x_smoker: -0.0672, age_x_sbp: -0.0268, age_x_diabetes: -0.0983,
    age_x_tc: -0.0181, age_x_hdl: 0.0095,
    dm_age: -0.0998, hba1c: 0.0955, log_egfr: -0.0591,
    log_egfr_sq: 0.0058, hba1c_x_age: -0.0134, log_egfr_x_age: 0.0115,
    S0: 0.9605,
  },
  female: {
    age: 0.6624, smoker: 0.6139, sbp: 0.1421, diabetes: 0.8096,
    tc: 0.1127, hdl: -0.1568,
    age_x_smoker: -0.1122, age_x_sbp: -0.0167, age_x_diabetes: -0.1272,
    age_x_tc: -0.0200, age_x_hdl: 0.0186,
    dm_age: -0.1180, hba1c: 0.1173, log_egfr: -0.0640,
    log_egfr_sq: 0.0062, hba1c_x_age: -0.0196, log_egfr_x_age: 0.0169,
    S0: 0.9776,
  },
}

// =============================================================================
// COEFFICIENTS — CKD ADD-ON
// =============================================================================
// Source: doi:10.1093/eurjpc/zwac216 & doi:10.1093/eurjpc/zwac176

export const CKD_ADDON = {
  expectedEGFR: {
    intercept:      87.8980,
    age:           -3.7891,
    female:        -0.7023,
    tc:            -0.2941,
    hdl:            1.0960,
    sbp:           -0.1364,
    diabetes:       0.1205,
    smoker:         1.3211,
    age_x_tc:       0.0555,
    age_x_hdl:      0.1717,
    age_x_sbp:      0.0059,
    age_x_diabetes: -0.8994,
    age_x_smoker:   0.2181,
  },

  eGFR_under70: {
    below60:           0.4713,
    range60_90:        0.0956,
    age_x_below60:    -0.0802,
    age_x_range60_90:  0.0088,
  },

  eGFR_over70: {
    below60:            0.3072,
    range60_90:         0.0942,
    above90:           -0.4616,
    age_x_below60:     -0.0127,
    age_x_range60_90:  -0.0098,
    age_x_above90:     -0.0075,
  },

  expectedACR: {
    intercept:       1,
    offset:         -0.0225,
    age:             0.0159,
    female:          0.0308,
    tc:              0.0185,
    hdl:            -0.0274,
    sbp:             0.1339,
    diabetes:        0.2171,
    smoker:          0.0629,
    age_x_tc:       -0.0062,
    age_x_hdl:       0.0003,
    age_x_sbp:       0.0008,
    age_x_diabetes: -0.0109,
    age_x_smoker:    0.0085,
    eGFR_below60:    0.4057,
    eGFR_60_90:      0.0597,
    eGFR_above90:   -0.0916,
  },

  ACR_coef: {
    under70: 0.2432,
    over70:  0.2370,
  },

  dipstick: {
    negative: 0,
    trace:    0.2644,
    '1+':     0.4126,
    '2+':     0.4761,
    '3+':     0.4761,
    '4+':     0.4761,
  } as Record<string, number>,
}
