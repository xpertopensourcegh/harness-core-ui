import React from 'react'
import { waitFor, render, fireEvent } from '@testing-library/react'
import type { UseMutateReturn } from 'restful-react'
import * as cvService from 'services/cv'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import type { GCOMonitoringSourceInfo } from '../../GoogleCloudOperationsMonitoringSourceUtils'
import { ReviewGCOMonitoringSource } from '../ReviewGCOMonitoringSource'
import { GCOProduct } from '../../GoogleCloudOperationsMonitoringSourceUtils'

const MockData: GCOMonitoringSourceInfo = {
  selectedDashboards: [],
  manuallyInputQueries: [],
  metricPacks: [],
  product: GCOProduct.CLOUD_METRICS,
  selectedMetrics: new Map([
    [
      'metric_1',
      {
        service: { label: 'service_1', value: 'service_1' },
        environment: { label: 'env_1', value: 'env_1' },
        dashboardName: 'dashboard_1',
        metricName: 'metric_1',
        query: '{"asdads": "asdasd"}',
        metricTags: { 'solo-dolo': '' },
        riskCategory: 'Performance/Throughput',
        higherBaselineDeviation: true,
        lowerBaselineDeviation: false,
        isManualQuery: false
      }
    ],
    [
      'metric_2',
      {
        service: { label: 'service_1', value: 'service_1' },
        environment: { label: 'env_1', value: 'env_1' },
        dashboardName: 'dashboard_4',
        metricName: 'metric_2',
        query: '{"asdads": "asdasd"}',
        metricTags: { 'solo-dolo': '' },
        riskCategory: 'Performance/Other',
        higherBaselineDeviation: true,
        lowerBaselineDeviation: true,
        isManualQuery: false
      }
    ],
    [
      'metric_3',
      {
        service: { label: 'service_2', value: 'service_2' },
        environment: { label: 'env_1', value: 'env_1' },
        dashboardName: 'dashboard_6',
        metricName: 'metric_4',
        query: '{"asdads": "asdasd"}',
        metricTags: { 'solo-dolo': '' },
        riskCategory: 'Errors',
        higherBaselineDeviation: true,
        lowerBaselineDeviation: true,
        isManualQuery: false
      }
    ]
  ])
}

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVActivitySourceSetup({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: 'loading',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_ORG'
  }
}

describe('Unit tests for ReviewMonitoringSource', () => {
  test('Ensure payload is correct depending on provided data', async () => {
    const useSaveDataSourceCVConfigsSpy = jest.spyOn(cvService, 'useSaveDataSourceCVConfigs')
    const mutateMockFn = jest.fn()
    useSaveDataSourceCVConfigsSpy.mockReturnValue({
      mutate: mutateMockFn as any
    } as UseMutateReturn<any, any, any, any, any>)

    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <ReviewGCOMonitoringSource data={MockData} onSubmit={jest.fn()} onPrevious={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(container.querySelectorAll('[role="row"]').length).toBe(4)
    expect(container).toMatchSnapshot()

    const submitButton = container.querySelector('button[type="submit"]')
    if (!submitButton) {
      throw Error('submit button was not found')
    }
    fireEvent.click(submitButton)
    await waitFor(() => expect(mutateMockFn).toHaveBeenCalledTimes(1))
    expect(mutateMockFn).toHaveBeenCalledWith([
      {
        accountId: undefined,
        connectorIdentifier: undefined,
        envIdentifier: 'env_1',
        identifier: undefined,
        metricDefinitions: [
          {
            dashboardName: 'dashboard_1',
            jsonMetricDefinition: {
              asdads: 'asdasd'
            },
            metricName: 'metric_1',
            metricTags: ['solo-dolo'],
            riskProfile: {
              category: 'Performance',
              metricType: 'THROUGHPUT',
              thresholdTypes: ['ACT_WHEN_HIGHER']
            }
          },
          {
            dashboardName: 'dashboard_4',
            jsonMetricDefinition: {
              asdads: 'asdasd'
            },
            metricName: 'metric_2',
            metricTags: ['solo-dolo'],
            riskProfile: {
              category: 'Performance',
              metricType: 'OTHER',
              thresholdTypes: ['ACT_WHEN_LOWER', 'ACT_WHEN_HIGHER']
            }
          }
        ],
        metricPacks: [],
        projectIdentifier: undefined,
        serviceIdentifier: 'service_1',
        type: 'STACKDRIVER'
      },
      {
        accountId: undefined,
        connectorIdentifier: undefined,
        envIdentifier: 'env_1',
        identifier: undefined,
        metricDefinitions: [
          {
            dashboardName: 'dashboard_6',
            jsonMetricDefinition: {
              asdads: 'asdasd'
            },
            metricName: 'metric_4',
            metricTags: ['solo-dolo'],
            riskProfile: {
              category: 'Errors',
              metricType: 'OTHER',
              thresholdTypes: ['ACT_WHEN_LOWER', 'ACT_WHEN_HIGHER']
            }
          }
        ],
        metricPacks: [],
        projectIdentifier: undefined,
        serviceIdentifier: 'service_2',
        type: 'STACKDRIVER'
      }
    ])
  })
})
