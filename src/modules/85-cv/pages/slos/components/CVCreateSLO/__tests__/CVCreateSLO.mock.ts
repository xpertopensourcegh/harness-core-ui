export const mockedSLODataById = {
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
          spec: {
            type: 'Ratio',
            spec: {
              eventType: 'good',
              metric1: 'metric1',
              metric2: 'metric2',
              metricName: 'metric1'
            }
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

export const expectedInitialValuesEditFlow = {
  description: 'description added',
  healthSourceRef: 'Test_gcp',
  identifier: 'SLO5',
  monitoredServiceRef: 'test1_env1',
  name: 'SLO-5-updated',
  orgIdentifier: 'org-1',
  projectIdentifier: 'project-1',
  serviceLevelIndicators: {
    spec: {
      spec: {
        eventType: 'good',
        metric1: 'metric1',
        metric2: 'metric2',
        metricName: 'metric1'
      },
      type: 'Ratio'
    },
    type: 'Latency'
  },
  tags: {},
  target: {
    sloTargetPercentage: 0,
    spec: {
      periodLength: '30'
    },
    type: 'Rolling'
  },
  userJourneyRef: 'journey2'
}

export const expectedInitialValuesCreateFlow = {
  description: '',
  healthSourceRef: '',
  identifier: '',
  monitoredServiceRef: '',
  name: '',
  serviceLevelIndicators: {
    identifier: '',
    name: '',
    spec: {
      spec: {
        eventType: '',
        metric1: '',
        metric2: ''
      },
      type: 'Ratio'
    },
    type: 'Latency'
  },
  tags: {},
  target: {
    sloTargetPercentage: 0,
    spec: {
      endDate: '',
      periodLength: '',
      startDate: ''
    },
    type: 'Rolling'
  },
  userJourneyRef: ''
}

export const mockPayloadForUpdateRequest = {
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
          eventType: 'good',
          metric1: 'metric1',
          metric2: 'metric2',
          metricName: 'metric1'
        },
        type: 'Ratio'
      },
      type: 'Latency'
    }
  ],
  tags: {},
  target: {
    sloTargetPercentage: 0,
    spec: {
      periodLength: '30'
    },
    type: 'Rolling'
  },
  userJourneyRef: 'journey2'
}
