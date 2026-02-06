import type { ScoreDefinition } from '../types'
import chadVaScore from './chad-va'
import qtcScore from './qtc'
import graceScore from './grace'
import score2Score from './score2'

export const scoreRegistry: ScoreDefinition[] = [
  chadVaScore,
  qtcScore,
  graceScore,
  score2Score,
]

export function getScoreById(id: string): ScoreDefinition | undefined {
  return scoreRegistry.find((s) => s.id === id)
}
