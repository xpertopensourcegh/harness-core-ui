import { StringUtils } from '@common/exports'
import { createRequestBodyPayload, renderItemByType } from '../RequestUtils'

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

  test('Test renderItemByType method', () => {
    expect(renderItemByType({ name: 'Sample', key: 'SampleKey' })).toBe('name : Sample, key : SampleKey')
    expect(renderItemByType('Sample')).toBe('Sample')
    expect(renderItemByType(['Sample', 'Key'])).toBe('Sample, Key')
    expect(renderItemByType(1)).toBe('1')
    expect(renderItemByType(true)).toBe('true')
  })
})
