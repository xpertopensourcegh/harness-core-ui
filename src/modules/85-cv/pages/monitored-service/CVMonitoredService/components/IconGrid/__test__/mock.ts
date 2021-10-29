import type { RiskData } from 'services/cv'
import { RiskValues } from '@cv/utils/CommonUtils'

export const items: RiskData[] = [
  {
    riskStatus: RiskValues.HEALTHY,
    healthScore: 99
  },
  {
    riskStatus: RiskValues.OBSERVE,
    healthScore: 74
  },
  {
    riskStatus: RiskValues.NEED_ATTENTION,
    healthScore: 49
  },
  {
    riskStatus: RiskValues.NO_DATA
  },
  {
    riskStatus: RiskValues.UNHEALTHY,
    healthScore: 24
  }
]
