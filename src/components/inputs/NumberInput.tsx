import { useCallback, useState } from 'react'
import type { NumberInputDef } from '../../types'

interface Props {
  def: NumberInputDef
  value: number | ''
  onChange: (key: string, value: number | '') => void
}

export default function NumberInput({ def, value, onChange }: Props) {
  const [useAltUnit, setUseAltUnit] = useState(false)
  const conv = def.conversion
  const hasValue = value !== '' && value !== undefined

  // Effective params based on active unit
  const activeUnit = conv && useAltUnit ? conv.altUnit : def.unit
  const activeMin = conv && useAltUnit ? conv.altMin : def.min
  const activeMax = conv && useAltUnit ? conv.altMax : def.max
  const activeStep = conv && useAltUnit ? conv.altStep : def.step

  // Display value: convert base → alt when in alt mode
  const displayValue = hasValue && conv && useAltUnit ? conv.toAlt(value as number) : value

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      if (raw === '') {
        onChange(def.key, '')
        return
      }
      const num = parseFloat(raw)
      if (!isNaN(num)) {
        onChange(def.key, conv && useAltUnit ? conv.toBase(num) : num)
      }
    },
    [def.key, onChange, conv, useAltUnit],
  )

  const adjust = useCallback(
    (delta: number) => {
      if (!hasValue) return
      const current = conv && useAltUnit ? conv.toAlt(value as number) : (value as number)
      const next = Math.round((current + delta) * 1000) / 1000
      const clamped = Math.min(activeMax, Math.max(activeMin, next))
      onChange(def.key, conv && useAltUnit ? conv.toBase(clamped) : clamped)
    },
    [def.key, value, hasValue, onChange, conv, useAltUnit, activeMin, activeMax],
  )

  const isOutOfRange =
    hasValue &&
    ((displayValue as number) < activeMin || (displayValue as number) > activeMax)

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">
        {def.label}
        {conv ? (
          <button
            type="button"
            onClick={() => setUseAltUnit((u) => !u)}
            className="ml-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-primary active:bg-gray-200"
          >
            {activeUnit}
          </button>
        ) : (
          activeUnit && <span className="ml-1 text-gray-400">({activeUnit})</span>
        )}
      </label>
      <div className="flex items-center gap-2">
        {hasValue && (
          <button
            type="button"
            onClick={() => adjust(-activeStep)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-lg font-bold text-gray-700 active:bg-gray-300"
            aria-label={`Diminuer ${def.label}`}
          >
            −
          </button>
        )}
        <input
          type="number"
          inputMode={def.inputMode ?? 'numeric'}
          value={displayValue}
          onChange={handleChange}
          placeholder={def.placeholder ?? `${activeMin}–${activeMax}`}
          min={activeMin}
          max={activeMax}
          step={activeStep}
          className={`h-11 w-full rounded-xl border px-4 text-center text-lg font-semibold outline-none transition-colors ${
            isOutOfRange
              ? 'border-red-400 bg-red-50 text-red-700'
              : 'border-gray-300 bg-white text-gray-900 focus:border-primary'
          }`}
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => adjust(activeStep)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-lg font-bold text-gray-700 active:bg-gray-300"
            aria-label={`Augmenter ${def.label}`}
          >
            +
          </button>
        )}
      </div>
      {isOutOfRange && (
        <span className="text-xs text-red-500">
          Valeur attendue : {activeMin}–{activeMax}
        </span>
      )}
    </div>
  )
}
