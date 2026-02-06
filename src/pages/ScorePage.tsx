import { useCallback, useMemo, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getScoreById } from '../scores/registry'
import NumberInput from '../components/inputs/NumberInput'
import ToggleInput from '../components/inputs/ToggleInput'
import SegmentInput from '../components/inputs/SegmentInput'
import ScoreCard from '../components/ScoreCard'
import RiskBadge from '../components/RiskBadge'
import type { ScoreResult, Interpretation } from '../types'
import { isDependsMet } from '../types'
import { interpretQtcWithSex } from '../scores/qtc/interpret'
import { getFormulaAdvice } from '../scores/qtc/calculate'

export default function ScorePage() {
  const { id } = useParams<{ id: string }>()
  const scoreDef = getScoreById(id ?? '')

  const [values, setValues] = useState<Record<string, number | boolean | string | ''>>({})

  const handleChange = useCallback(
    (key: string, value: number | boolean | string | '') => {
      setValues((prev) => {
        const next = { ...prev, [key]: value }
        // CHA₂DS₂-VA: age toggles are mutually exclusive
        if (scoreDef?.id === 'chad-va') {
          if (key === 'age75' && value === true) next.age65 = false
          if (key === 'age65' && value === true) next.age75 = false
        }
        return next
      })
    },
    [scoreDef?.id],
  )

  const result: ScoreResult | null = useMemo(() => {
    if (!scoreDef) return null
    return scoreDef.calculate(values as Record<string, number | boolean | string>)
  }, [scoreDef, values])

  const interpretation: Interpretation | null = useMemo(() => {
    if (!scoreDef || !result) return null
    // QTc: use sex-aware interpretation
    if (scoreDef.id === 'qtc') {
      const sex = (values.sex as string) || 'male'
      return interpretQtcWithSex(result, sex)
    }
    return scoreDef.interpret(result)
  }, [scoreDef, result, values])

  // Filter inputs based on dependsOn conditions
  const visibleInputs = useMemo(() => {
    if (!scoreDef) return []
    return scoreDef.inputs.filter((input) => isDependsMet(input.dependsOn, values))
  }, [scoreDef, values])

  if (!scoreDef) return <Navigate to="/" replace />

  const isQtc = scoreDef.id === 'qtc'

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{scoreDef.icon}</span>
          <div>
            <h1 className="text-xl font-black text-gray-900">{scoreDef.name}</h1>
            <p className="text-sm text-gray-500">{scoreDef.shortDescription}</p>
          </div>
        </div>
      </div>

      {/* Sticky result */}
      {result && interpretation && (
        <div className="sticky top-14 z-20 mb-6">
          {isQtc ? (
            <QtcResultCard result={result} interpretation={interpretation} hr={values.hr as number} />
          ) : (
            <ScoreCard
              score={result.display ?? result.score}
              riskLevel={interpretation.riskLevel}
              label={interpretation.title}
              subtitle={interpretation.summary}
            >
              {interpretation.recommendations && (
                <ul className="space-y-1">
                  {interpretation.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-gray-600">• {r}</li>
                  ))}
                </ul>
              )}
              {interpretation.extras && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {interpretation.extras.map((e) => (
                    <div key={e.label} className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">{e.label}:</span>
                      <RiskBadge level={e.riskLevel ?? 'low'} label={e.value} />
                    </div>
                  ))}
                </div>
              )}
            </ScoreCard>
          )}
        </div>
      )}

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        {visibleInputs.map((input) => {
          switch (input.type) {
            case 'number':
              return (
                <NumberInput
                  key={input.key}
                  def={input}
                  value={values[input.key] as number | ''}
                  onChange={handleChange}
                />
              )
            case 'toggle':
              return (
                <ToggleInput
                  key={input.key}
                  def={input}
                  value={values[input.key] === true}
                  onChange={handleChange}
                />
              )
            case 'segment':
              return (
                <SegmentInput
                  key={input.key}
                  def={input}
                  value={(values[input.key] as string | number) ?? ''}
                  onChange={handleChange}
                />
              )
          }
        })}
      </div>
    </div>
  )
}

// Specialized QTc result display
function QtcResultCard({
  result,
  interpretation,
  hr,
}: {
  result: ScoreResult
  interpretation: Interpretation
  hr: number
}) {
  const [showAdvice, setShowAdvice] = useState(false)
  const d = result.details!

  const riskColors = {
    low: 'text-risk-low bg-green-50 border-green-200',
    moderate: 'text-risk-moderate bg-amber-50 border-amber-200',
    high: 'text-risk-high bg-red-50 border-red-200',
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 text-center text-sm text-gray-500">
        {result.label}
      </div>

      {/* Formula results grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {interpretation.extras?.map((e) => (
          <div
            key={e.label}
            className={`rounded-xl border px-3 py-2 text-center ${riskColors[e.riskLevel ?? 'low']}`}
          >
            <div className="text-lg font-black">{e.value.replace(' ms', '')}</div>
            <div className="text-xs font-medium opacity-80">{e.label}</div>
          </div>
        ))}
      </div>

      {/* Alert for dangerous QTc */}
      {(d.bazett as number) >= 500 && (
        <div className="mt-3 rounded-xl bg-red-100 p-3 text-center text-sm font-semibold text-red-700">
          QTc ≥ 500 ms — Risque de Torsades de Pointes
        </div>
      )}

      {/* Advice */}
      <button
        type="button"
        onClick={() => setShowAdvice(!showAdvice)}
        className="mt-3 w-full rounded-xl bg-gray-50 px-3 py-2 text-center text-sm font-medium text-gray-600 active:bg-gray-100"
      >
        {showAdvice ? '▲' : '▼'} Quelle formule choisir ?
      </button>
      {showAdvice && (
        <div className="mt-2 rounded-xl bg-blue-50 p-3 text-sm text-gray-700">
          <p className="font-semibold text-primary">{hr ? getFormulaAdvice(hr) : ''}</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            <li><b>Fridericia</b> — Recommandée FDA/EMA pour études cliniques</li>
            <li><b>Hodges / Rautaharju</b> — Meilleure correction aux FC extrêmes</li>
            <li><b>Framingham</b> — Meilleur prédicteur de mortalité à 30j</li>
            <li><b>Bazett</b> — Historique, fiable uniquement si FC 60–100</li>
          </ul>
        </div>
      )}
    </div>
  )
}
