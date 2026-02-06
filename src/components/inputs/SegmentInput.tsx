import { useCallback } from 'react'
import type { SegmentInputDef } from '../../types'

interface Props {
  def: SegmentInputDef
  value: string | number
  onChange: (key: string, value: string | number) => void
}

export default function SegmentInput({ def, value, onChange }: Props) {
  const handleSelect = useCallback(
    (optValue: string | number) => {
      onChange(def.key, optValue)
    },
    [def.key, onChange],
  )

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">{def.label}</label>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {def.options.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`rounded-xl border-2 px-3 py-2.5 text-center text-sm font-semibold transition-colors ${
                selected
                  ? 'border-primary bg-blue-50 text-primary-dark'
                  : 'border-gray-200 bg-white text-gray-700 active:bg-gray-100'
              }`}
            >
              {opt.label}
              {opt.description && (
                <span className="mt-0.5 block text-xs font-normal text-gray-400">
                  {opt.description}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
