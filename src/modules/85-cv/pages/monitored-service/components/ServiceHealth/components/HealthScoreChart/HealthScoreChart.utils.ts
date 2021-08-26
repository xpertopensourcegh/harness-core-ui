import { highRiskColor, lowRiskColor, mediumRiskColor } from '@common/components/HeatMap/ColorUtils'
import { RiskValues } from '@cv/utils/CommonUtils'
import type { RiskData } from 'services/cv'
import type { SeriesDataPoint } from './HealthScoreChart.types'

export const mapRiskStatusToColor = (riskStatus: string): string => {
  switch (riskStatus) {
    case RiskValues.LOW:
      return lowRiskColor
    case RiskValues.MEDIUM:
      return mediumRiskColor
    case RiskValues.HIGH:
      return highRiskColor
    default:
      return lowRiskColor
  }
}

export const getSeriesData = (healthScoreData: RiskData[]): SeriesDataPoint[] => {
  return healthScoreData.map(el =>
    el.healthScore === null ? { y: 0 } : { y: el.healthScore, color: mapRiskStatusToColor(el.riskStatus as string) }
  )
}
