import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import * as cvServices from 'services/cv'
import NewRelicMappedMetric from '../NewRelicMappedMetric'
import { connectorIdentifier, formikValues, mappedMetricsMap } from './NewRelicMappedMetric.mock'

describe('NewRelicMappedMetric component', () => {
  const refetchMock = jest.fn()

  beforeAll(() => {
    jest
      .spyOn(cvServices, 'useGetMetricPacks')
      .mockImplementation(() => ({ loading: false, error: null, data: {}, refetch: refetchMock } as any))
    jest
      .spyOn(cvServices, 'useGetLabelNames')
      .mockImplementation(() => ({ loading: false, error: null, data: {}, refetch: refetchMock } as any))
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('should render with data', () => {
    const { container } = render(
      <TestWrapper>
        <NewRelicMappedMetric
          setMappedMetrics={jest.fn()}
          selectedMetric={'newRelic new'}
          formikValues={formikValues as any}
          formikSetField={jest.fn()}
          connectorIdentifier={connectorIdentifier}
          mappedMetrics={mappedMetricsMap}
          createdMetrics={['newRelic', 'newRelic new']}
          isValidInput={true}
          setCreatedMetrics={jest.fn()}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
