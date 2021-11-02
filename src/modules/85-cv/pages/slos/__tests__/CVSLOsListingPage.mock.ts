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
      type: 'ratio',
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
