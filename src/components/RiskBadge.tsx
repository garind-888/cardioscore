import type { RiskLevel } from '../types'

const styles: Record<RiskLevel, string> = {
  low: 'bg-green-100 text-risk-low',
  moderate: 'bg-amber-100 text-risk-moderate',
  high: 'bg-red-100 text-risk-high',
}

const labels: Record<RiskLevel, string> = {
  low: 'Risque bas',
  moderate: 'Risque modéré',
  high: 'Risque élevé',
}

interface Props {
  level: RiskLevel
  label?: string
}

export default function RiskBadge({ level, label }: Props) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${styles[level]}`}
    >
      {label ?? labels[level]}
    </span>
  )
}
