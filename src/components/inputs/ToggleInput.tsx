import { useCallback } from 'react'
import type { ToggleInputDef } from '../../types'

interface Props {
  def: ToggleInputDef
  value: boolean
  onChange: (key: string, value: boolean) => void
}

export default function ToggleInput({ def, value, onChange }: Props) {
  const toggle = useCallback(() => {
    onChange(def.key, !value)
  }, [def.key, value, onChange])

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-colors ${
        value
          ? 'border-primary bg-blue-50 text-primary-dark'
          : 'border-gray-200 bg-white text-gray-700'
      }`}
      role="switch"
      aria-checked={value}
      aria-label={def.label}
    >
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{def.label}</span>
        {def.description && (
          <span className="text-xs text-gray-400">{def.description}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {def.points !== undefined && value && (
          <span className="text-xs font-bold text-primary">+{def.points}</span>
        )}
        <div
          className={`flex h-7 w-12 items-center rounded-full px-1 transition-colors ${
            value ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
              value ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </button>
  )
}
