import { get } from 'lodash-es'

export const RiskValues = {
  NO_DATA: 'NO_DATA',
  NO_ANALYSIS: 'NO_ANALYSIS',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
}

export type Risk = 'NO_DATA' | 'NO_ANALYSIS' | 'LOW' | 'MEDIUM' | 'HIGH' | undefined

export function roundNumber(value: number, precision = 2) {
  if (Number.isInteger(precision) && precision >= 0) {
    const factor = 10 ** precision
    return Math.round(value * factor) / factor
  }
}

export function getErrorMessage(errorObj?: any): string | undefined {
  return get(errorObj, 'data.detailedMessage') || get(errorObj, 'data.message')
}
