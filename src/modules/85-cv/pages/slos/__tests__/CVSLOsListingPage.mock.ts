import { SLIMetricEnum } from '../components/CVCreateSLO/components/CreateSLOForm/components/SLI/SLI.constants'

export const initialFormData = {
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
    type: 'latency',
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
    sloTargetPercentage: 10,
    spec: {
      periodLength: '',
      startDate: '',
      endDate: ''
    }
  }
}

export const mockedSLOsData = {
  status: 'SUCCESS',
  data: {
    totalPages: 1,
    totalItems: 3,
    pageItemCount: 3,
    pageSize: 10,
    content: [
      {
        serviceLevelObjective: {
          orgIdentifier: null,
          projectIdentifier: null,
          identifier: 'Third_SLO',
          name: 'Third SLO',
          description: '',
          tags: {},
          userJourneyRef: 'userjourney1',
          monitoredServiceRef: 'Service_101_QA',
          healthSourceRef: 'dasdsadsa',
          serviceLevelIndicators: [
            {
              name: 'Third_SLO_metric1',
              identifier: 'Third_SLO_metric1',
              type: 'Latency',
              spec: { type: null, spec: { metric1: 'metric1', metricName: 'metric1' } }
            }
          ],
          target: { type: null, sloTargetPercentage: 0.0, spec: { periodLength: '30d' } }
        },
        createdAt: 1636457618486,
        lastModifiedAt: 1636457728193
      },
      {
        serviceLevelObjective: {
          orgIdentifier: null,
          projectIdentifier: null,
          identifier: 'Second_SLO',
          name: 'Second SLO',
          description: '',
          tags: {},
          userJourneyRef: 'userjourney1',
          monitoredServiceRef: 'Service_101_QA',
          healthSourceRef: 'Test_AppD',
          serviceLevelIndicators: [
            {
              name: 'Second_SLO_metric1',
              identifier: 'Second_SLO_metric1',
              type: 'Latency',
              spec: {
                type: null,
                spec: { eventType: 'good', metric1: 'metric1', metric2: 'metric2', metricName: 'metric1' }
              }
            }
          ],
          target: { type: null, sloTargetPercentage: 0.0, spec: { startDate: '2021-10-20', endDate: '2021-11-08' } }
        },
        createdAt: 1636432440836,
        lastModifiedAt: 1636432440836
      },
      {
        serviceLevelObjective: {
          orgIdentifier: null,
          projectIdentifier: null,
          identifier: 'First_SLO',
          name: 'First SLO',
          description: '',
          tags: {},
          userJourneyRef: 'userjourney1',
          monitoredServiceRef: 'Service_101_QA',
          healthSourceRef: 'dasdsadsa',
          serviceLevelIndicators: [
            {
              name: 'First_SLO_metric1',
              identifier: 'First_SLO_metric1',
              type: 'Latency',
              spec: {
                type: null,
                spec: { eventType: 'good', metric1: 'metric1', metric2: 'metric2', metricName: 'metric1' }
              }
            }
          ],
          target: { type: null, sloTargetPercentage: 0.0, spec: { periodLength: '30' } }
        },
        createdAt: 1636432407690,
        lastModifiedAt: 1636432407690
      }
    ],
    pageIndex: 0,
    empty: false
  },
  metaData: null,
  correlationId: '63a9bb2b-820e-4832-b200-c5dea88fdd9a'
}
