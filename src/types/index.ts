import type { ReactNode } from 'react'

export type RiskLevel = 'low' | 'moderate' | 'high'

export interface NumberInputDef {
  type: 'number'
  key: string
  label: string
  unit?: string
  min: number
  max: number
  step: number
  placeholder?: string
  inputMode?: 'numeric' | 'decimal'
}

export interface ToggleInputDef {
  type: 'toggle'
  key: string
  label: string
  description?: string
  points?: number
}

export interface SegmentInputDef {
  type: 'segment'
  key: string
  label: string
  options: { value: string | number; label: string; description?: string }[]
}

export type InputDefinition = NumberInputDef | ToggleInputDef | SegmentInputDef

export interface ScoreResult {
  score: number
  label?: string
  details?: Record<string, string | number>
}

export interface Interpretation {
  riskLevel: RiskLevel
  title: string
  summary: string
  recommendations?: string[]
  extras?: { label: string; value: string; riskLevel?: RiskLevel }[]
}

export interface ScoreDefinition {
  id: string
  name: string
  shortName: string
  shortDescription: string
  category: string
  icon: string
  inputs: InputDefinition[]
  calculate: (values: Record<string, number | boolean | string>) => ScoreResult | null
  interpret: (result: ScoreResult) => Interpretation
  customComponent?: React.ComponentType<{
    values: Record<string, number | boolean | string>
    result: ScoreResult | null
  }>
  renderResult?: (result: ScoreResult, interpretation: Interpretation) => ReactNode
}
