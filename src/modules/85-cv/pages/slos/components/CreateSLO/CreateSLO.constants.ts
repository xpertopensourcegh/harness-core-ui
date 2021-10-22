import { SLIMetricEnum, SLITypeEnum } from './components/SLI/SLI.constants'

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
  tags: [],
  userJourney: '',
  monitoredServiecRef: '',
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
      }
    }
  },
  target: {
    type: '',
    spec: {
      periodLength: '',
      startDate: '',
      endDate: '',
      sloTargetPercentage: ''
    }
  }
}
