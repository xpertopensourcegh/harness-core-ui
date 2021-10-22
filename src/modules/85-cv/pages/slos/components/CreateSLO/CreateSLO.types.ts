import type { SLIMetricEnum, SLITypeEnum } from './components/SLI/SLI.constants'
import type { PeriodTypeEnum } from './components/SLOTargetAndBudgetPolicy/SLOTargetAndBudgetPolicy.constants'

export interface SLOForm {
  name: string
  identifier: string
  description: string
  tags: Array<string>
  userJourney: string
  monitoredServiecRef: string
  healthSourceRef: string
  serviceLevelIndicators: {
    name: string
    identifier: string
    type: SLITypeEnum
    spec: {
      type: SLIMetricEnum
      spec: {
        eventType: string
        metric1: string
        metric2: string
      }
    }
  }
  target: {
    type: PeriodTypeEnum | string
    spec: {
      periodLength: string
      startDate: string
      endDate: string
      sloTargetPercentage: string
    }
  }
}
