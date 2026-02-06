import type { ScoreDefinition } from '../types'
import chadVaScore from './chad-va'
import qtcScore from './qtc'
import graceScore from './grace'

export const scoreRegistry: ScoreDefinition[] = [
  chadVaScore,
  qtcScore,
  graceScore,
]

export function getScoreById(id: string): ScoreDefinition | undefined {
  return scoreRegistry.find((s) => s.id === id)
}
