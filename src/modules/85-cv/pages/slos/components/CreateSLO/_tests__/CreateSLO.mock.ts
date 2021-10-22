export const initialFormData = {
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
    spec: {
      periodLength: '',
      startDate: '',
      endDate: '',
      sloTargetPercentage: ''
    }
  }
}
