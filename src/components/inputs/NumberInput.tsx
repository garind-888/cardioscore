import { useCallback } from 'react'
import type { NumberInputDef } from '../../types'

interface Props {
  def: NumberInputDef
  value: number | ''
  onChange: (key: string, value: number | '') => void
}

export default function NumberInput({ def, value, onChange }: Props) {
  const hasValue = value !== '' && value !== undefined

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      if (raw === '') {
        onChange(def.key, '')
        return
      }
      const num = parseFloat(raw)
      if (!isNaN(num)) {
        onChange(def.key, num)
      }
    },
    [def.key, onChange],
  )

  const adjust = useCallback(
    (delta: number) => {
      if (!hasValue) return
      const next = Math.round(((value as number) + delta) * 1000) / 1000
      const clamped = Math.min(def.max, Math.max(def.min, next))
      onChange(def.key, clamped)
    },
    [def, value, hasValue, onChange],
  )

  const isOutOfRange = hasValue && ((value as number) < def.min || (value as number) > def.max)

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">
        {def.label}
        {def.unit && <span className="ml-1 text-gray-400">({def.unit})</span>}
      </label>
      <div className="flex items-center gap-2">
        {hasValue && (
          <button
            type="button"
            onClick={() => adjust(-def.step)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-lg font-bold text-gray-700 active:bg-gray-300"
            aria-label={`Diminuer ${def.label}`}
          >
            −
          </button>
        )}
        <input
          type="number"
          inputMode={def.inputMode ?? 'numeric'}
          value={value}
          onChange={handleChange}
          placeholder={def.placeholder ?? `${def.min}–${def.max}`}
          min={def.min}
          max={def.max}
          step={def.step}
          className={`h-11 w-full rounded-xl border px-4 text-center text-lg font-semibold outline-none transition-colors ${
            isOutOfRange
              ? 'border-red-400 bg-red-50 text-red-700'
              : 'border-gray-300 bg-white text-gray-900 focus:border-primary'
          }`}
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => adjust(def.step)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-lg font-bold text-gray-700 active:bg-gray-300"
            aria-label={`Augmenter ${def.label}`}
          >
            +
          </button>
        )}
      </div>
      {isOutOfRange && (
        <span className="text-xs text-red-500">
          Valeur attendue : {def.min}–{def.max}
        </span>
      )}
    </div>
  )
}
