import React from 'react'
import type { UseGetReturn, UseMutateReturn } from 'restful-react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { Container } from '@wings-software/uikit'
import { InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import { TestWrapper } from '@common/utils/testUtils'
import * as cvService from 'services/cv'
import * as cdService from 'services/cd-ng'
import { FieldNames, MapGCOMetricsToServices } from '../MapGCOMetricsToServices'

const MockQuery = `{}`

jest.mock('lodash-es', () => ({
  ...(jest.requireActual('lodash-es') as object),
  debounce: jest.fn(fn => fn),
  noop: jest.fn()
}))

jest.mock('react-monaco-editor', () => () => <Container className="monaco-editor" />)

const MockValidationResponse = {
  metaData: {},
  resource: [
    {
      txnName: 'kubernetes.io/container/cpu/core_usage_time',
      metricName: 'kubernetes.io/container/cpu/core_usage_time',
      metricValue: 7.050477594430973,
      timestamp: 1607599980000
    },
    {
      txnName: 'kubernetes.io/container/cpu/core_usage_time',
      metricName: 'kubernetes.io/container/cpu/core_usage_time',
      metricValue: 12.149014549984008,
      timestamp: 1607599920000
    },
    {
      txnName: 'kubernetes.io/container/cpu/core_usage_time',
      metricName: 'kubernetes.io/container/cpu/core_usage_time',
      metricValue: 12.151677124512961,
      timestamp: 1607599860000
    }
  ]
}

describe('Unit tests for MapGCOMetricsToServices', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    const getEnvironmentSpy = jest.spyOn(cdService, 'useGetEnvironmentListForProject')
    getEnvironmentSpy.mockReturnValue({
      data: {
        content: [
          {
            accountId: 'kmpySmUISimoRrJL6NL73w',
            deleted: false,
            description: null,
            identifier: 'Qe',
            name: 'Qe',
            orgIdentifixer: 'harness_test',
            projectIdentifier: 'raghu_p',
            tags: {},
            type: 'PreProduction'
          }
        ]
      }
    } as UseGetReturn<any, any, any, any>)

    const getServiceSpy = jest.spyOn(cdService, 'useGetServiceListForProject')
    getServiceSpy.mockReturnValue({
      data: {
        content: [
          {
            accountId: 'kmpySmUISimoRrJL6NL73w',
            deleted: false,
            description: null,
            identifier: 'verification',
            name: 'verification',
            orgIdentifier: 'harness_test',
            projectIdentifier: 'raghu_p',
            tags: {},
            version: 0
          }
        ]
      }
    } as UseGetReturn<any, any, any, any>)
  })
  test('Ensure validation api is called on query input', async () => {
    const getMetricPackSpy = jest.spyOn(cvService, 'useGetMetricPacks')
    getMetricPackSpy.mockReturnValue({
      data: { resource: [{ identifier: 'Errors' }, { identifier: 'Performance' }] }
    } as UseGetReturn<any, unknown, any, unknown>)

    const sampleDataSpy = jest.spyOn(cvService, 'useGetStackdriverSampleData')
    const mutateMock = jest.fn().mockReturnValue(
      Promise.resolve({
        ...MockValidationResponse
      })
    )

    sampleDataSpy.mockReturnValue({ mutate: mutateMock as unknown } as UseMutateReturn<any, unknown, any, unknown, any>)
    const { container } = render(
      <TestWrapper>
        <MapGCOMetricsToServices
          data={{ connectorRef: { value: '1234_connectorIden' } }}
          onNext={jest.fn()}
          onPrevious={jest.fn()}
        />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    await setFieldValue({ container, type: InputTypes.TEXTAREA, fieldId: FieldNames.QUERY, value: MockQuery })

    await waitFor(() => expect(mutateMock).toHaveBeenCalledTimes(1))
    expect(container.querySelector('[class*="highcharts"]')).not.toBeNull()

    const viewQuery = container.querySelector('a[role="button"]')
    if (!viewQuery) {
      throw new Error('View query button not rendered.')
    }
    fireEvent.click(viewQuery)
    await waitFor(() => expect(document.body.querySelector('[class*="monaco-editor"]')).not.toBeNull())
  })
})
