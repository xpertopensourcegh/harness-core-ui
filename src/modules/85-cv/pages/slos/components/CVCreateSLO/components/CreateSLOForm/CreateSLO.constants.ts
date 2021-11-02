import type { SLIMetricSpec } from 'services/cv'
import { SLIMetricEnum, SLITypeEnum } from './components/SLI/SLI.constants'
import { PeriodTypeEnum } from './components/SLOTargetAndBudgetPolicy/SLOTargetAndBudgetPolicy.constants'

export enum CreateSLOEnum {
  NAME = 'Name',
  SLI = 'SLI',
  SLO_TARGET_BUDGET_POLICY = 'SLO Target & Error Budget Policy'
}

export const TabsOrder = [CreateSLOEnum.NAME, CreateSLOEnum.SLI, CreateSLOEnum.SLO_TARGET_BUDGET_POLICY]

export const initialValuesSLO = {
  name: '',
  identifier: '',
  description: '',
  tags: {},
  userJourneyRef: '',
  monitoredServiceRef: '',
  healthSourceRef: '',
  serviceLevelIndicators: {
    name: '',
    identifier: '',
    type: SLITypeEnum.LATENCY,
    spec: {
      type: SLIMetricEnum.RATIO,
      spec: {
        eventType: '',
        metric1: '',
        metric2: ''
      } as SLIMetricSpec
    }
  },
  target: {
    type: PeriodTypeEnum.ROLLING,
    sloTargetPercentage: 0,
    spec: {
      periodLength: '',
      startDate: '',
      endDate: ''
    }
  }
}
