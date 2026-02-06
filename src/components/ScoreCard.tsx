import type { RiskLevel } from '../types'
import RiskBadge from './RiskBadge'

const ringColors: Record<RiskLevel, string> = {
  low: 'ring-risk-low/30',
  moderate: 'ring-risk-moderate/30',
  high: 'ring-risk-high/30',
}

const textColors: Record<RiskLevel, string> = {
  low: 'text-risk-low',
  moderate: 'text-risk-moderate',
  high: 'text-risk-high',
}

interface Props {
  score: number | string
  label?: string
  riskLevel: RiskLevel
  subtitle?: string
  children?: React.ReactNode
}

export default function ScoreCard({ score, label, riskLevel, subtitle, children }: Props) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-sm ring-2 ${ringColors[riskLevel]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-4xl font-black ${textColors[riskLevel]}`}>
            {score}
          </div>
          {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
        </div>
        <RiskBadge level={riskLevel} label={label} />
      </div>
      {children && <div className="mt-3 border-t border-gray-100 pt-3">{children}</div>}
    </div>
  )
}
