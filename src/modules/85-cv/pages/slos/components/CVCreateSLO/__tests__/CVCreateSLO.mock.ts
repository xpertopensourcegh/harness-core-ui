import type {
  RestResponseServiceLevelObjectiveResponse,
  ThresholdSLIMetricSpec,
  RatioSLIMetricSpec,
  ServiceLevelObjectiveDTO,
  CalenderSLOTargetSpec,
  RollingSLOTargetSpec
} from 'services/cv'
import {
  Comparators,
  PeriodTypes,
  SLIEventTypes,
  SLIMetricTypes,
  SLIMissingDataTypes,
  SLITypes,
  SLOForm
} from '../CVCreateSLO.types'

export const mockedSLODataById: RestResponseServiceLevelObjectiveResponse = {
  metaData: {},
  resource: {
    serviceLevelObjective: {
      orgIdentifier: 'org-1',
      projectIdentifier: 'project-1',
      identifier: 'SLO5',
      name: 'SLO-5-updated',
      description: 'description added',
      tags: {},
      userJourneyRef: 'journey2',
      monitoredServiceRef: 'test1_env1',
      healthSourceRef: 'Test_gcp',
      serviceLevelIndicators: [
        {
          name: 'SLO5_metric1',
          identifier: 'SLO5_metric1',
          type: 'Latency',
          sliMissingDataType: SLIMissingDataTypes.GOOD,
          spec: {
            type: 'Ratio',
            spec: {
              eventType: SLIEventTypes.GOOD,
              metric1: 'metric1',
              metric2: 'metric2',
              metricName: 'metric1',
              thresholdValue: 10,
              thresholdType: Comparators.LESS
            } as ThresholdSLIMetricSpec | RatioSLIMetricSpec
          }
        }
      ],
      target: {
        type: 'Rolling',
        sloTargetPercentage: 0,
        spec: {
          periodLength: '30'
        }
      }
    },
    createdAt: 1635491125651,
    lastModifiedAt: 1635493371812
  },
  responseMessages: []
}

export const expectedInitialValuesEditFlow: SLOForm = {
  name: 'SLO-5-updated',
  identifier: 'SLO5',
  description: 'description added',
  tags: {},
  userJourneyRef: 'journey2',
  monitoredServiceRef: 'test1_env1',
  healthSourceRef: 'Test_gcp',
  SLIType: SLITypes.LATENCY,
  SLIMetricType: SLIMetricTypes.RATIO,
  eventType: SLIEventTypes.GOOD,
  validRequestMetric: 'metric1',
  goodRequestMetric: 'metric2',
  objectiveValue: 10,
  objectiveComparator: Comparators.LESS,
  SLIMissingDataType: SLIMissingDataTypes.GOOD,
  periodType: PeriodTypes.ROLLING,
  periodLength: '30',
  periodLengthType: undefined,
  dayOfWeek: undefined,
  dayOfMonth: undefined,
  SLOTargetPercentage: 0
}

export const initialFormData: SLOForm = {
  name: '',
  identifier: '',
  userJourneyRef: '',
  monitoredServiceRef: '',
  healthSourceRef: '',
  SLIType: SLITypes.LATENCY,
  SLIMetricType: SLIMetricTypes.RATIO,
  validRequestMetric: '',
  SLIMissingDataType: SLIMissingDataTypes.GOOD,
  periodType: PeriodTypes.ROLLING,
  SLOTargetPercentage: 0
}

export const mockPayloadForUpdateRequest: ServiceLevelObjectiveDTO = {
  description: 'description added',
  healthSourceRef: 'Test_gcp',
  identifier: 'SLO5',
  monitoredServiceRef: 'test1_env1',
  name: 'SLO-5-updated',
  orgIdentifier: 'org-1',
  projectIdentifier: 'project-1',
  serviceLevelIndicators: [
    {
      spec: {
        spec: {
          eventType: SLIEventTypes.GOOD,
          metric1: 'metric1',
          metric2: 'metric2',
          thresholdValue: 10,
          thresholdType: '<'
        } as ThresholdSLIMetricSpec | RatioSLIMetricSpec,
        type: 'Ratio'
      },
      type: 'Latency',
      sliMissingDataType: SLIMissingDataTypes.GOOD
    }
  ],
  tags: {},
  target: {
    sloTargetPercentage: 0,
    spec: {
      periodLength: '30',
      spec: {}
    } as CalenderSLOTargetSpec | RollingSLOTargetSpec,
    type: 'Rolling'
  },
  userJourneyRef: 'journey2'
}
