import { StringUtils } from '@common/exports'
import { createRequestBodyPayload } from '../RequestUtils'

describe('Request utils test', () => {
  test('Test createRequestBodyPayload method', () => {
    const request = createRequestBodyPayload({
      isUpdate: false,
      data: {
        formValues: {
          connectivityStatuses: [{ label: 'SUCCESS', value: 'SUCCESS' }],
          types: [{ label: 'K8sCluster', value: 'K8sCluster' }]
        },
        metadata: { name: 'Sample', visible: 'OnlyCreator', identifier: 'Sample' }
      },
      projectIdentifier: '',
      orgIdentifier: ''
    })
    expect(request.identifier).toBe(StringUtils.getIdentifierFromName(request.name))
  })
})
