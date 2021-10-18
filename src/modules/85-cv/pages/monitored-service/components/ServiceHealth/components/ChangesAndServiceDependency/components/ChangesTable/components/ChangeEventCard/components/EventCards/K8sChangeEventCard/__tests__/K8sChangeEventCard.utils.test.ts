import { createK8ChangeInfoData } from '../K8sChangeEventCard.utils'
import { mockK8sChangeResponse } from './K8sChangeEventCard.mock'

describe('Validate Utils', () => {
  test('should createK8ChangeInfoData', () => {
    expect(createK8ChangeInfoData(mockK8sChangeResponse.metadata)).toEqual({
      summary: {
        kind: null,
        namespace: 'ingress-nginx',
        reason: null,
        workload: 'ingress-controller-leader-nginx'
      },
      triggerAt: '1st Jan 12:00 AM'
    })
  })
})
