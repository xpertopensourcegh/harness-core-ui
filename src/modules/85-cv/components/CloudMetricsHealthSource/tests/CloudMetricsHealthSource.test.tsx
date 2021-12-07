import React, { useEffect } from 'react'
import { cloneDeep } from 'lodash-es'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { SetupSourceTabs } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import { testWrapperProps } from '@cv/pages/monitored-service/CVMonitoredService/__test__/CVMonitoredService.test'
import type { MetricDashboardWidgetNavProps } from '@cv/components/MetricDashboardWidgetNav/MetricDashboardWidgetNav.type'
import type { StringKeys } from 'framework/strings'
import { DatasourceTypeEnum } from '@cv/pages/monitored-service/components/ServiceHealth/components/MetricsAndLogs/MetricsAndLogs.types'
import type { MetricsValidationChartProps } from '@cv/components/CloudMetricsHealthSource/components/validationChart/MetricsValidationChart'
import type { MetricsConfigureRiskProfileProps } from '@cv/components/CloudMetricsHealthSource/components/metricsConfigureRiskProfile/MetricsConfigureRiskProfile'
import type { ExtendedMonacoEditorProps } from '@common/components/MonacoEditor/MonacoEditor'
import {
  DefaultSourceData,
  mockCloudMetricHealthSourceProps,
  mockQueryValue
} from '@cv/components/CloudMetricsHealthSource/tests/mock'
import CloudMetricsHealthSource from '../CloudMetricsHealthSource'

jest.mock('@cv/hooks/IndexedDBHook/IndexedDBHook', () => ({
  useIndexedDBHook: jest.fn().mockReturnValue({ isInitializingDB: false, dbInstance: { get: jest.fn() } }),
  CVObjectStoreNames: {}
}))

const mockMetricDashboardWidgetNav = jest.fn()
jest.mock(
  '@cv/components/MetricDashboardWidgetNav/MetricDashboardWidgetNav.tsx',
  () => (props: MetricDashboardWidgetNavProps<any>) => {
    mockMetricDashboardWidgetNav(props)
    return <></>
  }
)

const mockMetricsValidationChart = jest.fn()
jest.mock(
  '@cv/components/CloudMetricsHealthSource/components/validationChart/MetricsValidationChart.tsx',
  () => (props: MetricsValidationChartProps) => {
    mockMetricsValidationChart(props)
    // we should mock onRetry call, so we can validate CloudMetricsHealthSource component reacts on it
    useEffect(() => {
      props.onRetry()
    }, [])
    return <></>
  }
)

const mockMetricsConfigureRiskProfile = jest.fn()
jest.mock(
  '@cv/components/CloudMetricsHealthSource/components/metricsConfigureRiskProfile/MetricsConfigureRiskProfile.tsx',
  () => (props: MetricsConfigureRiskProfileProps) => {
    mockMetricsConfigureRiskProfile(props)
    return <></>
  }
)
const mockMonacoEditor = jest.fn()
jest.mock('@common/components/MonacoEditor/MonacoEditor.tsx', () => (props: ExtendedMonacoEditorProps) => {
  mockMonacoEditor(props)
  return <></>
})

function WrapperComponent(content: React.ReactElement): JSX.Element {
  return (
    <TestWrapper {...testWrapperProps}>
      <SetupSourceTabs data={cloneDeep(DefaultSourceData)} tabTitles={['MapMetrics']} determineMaxTab={() => 0}>
        {content}
      </SetupSourceTabs>
    </TestWrapper>
  )
}

describe('Unit tests for CloudMetricsHealthSource', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Ensure props are passed properly to child component', async () => {
    const mockAddQueryTitle: StringKeys = 'cv.monitoringSources.datadog.manualInputQueryModal.modalTitle'

    render(WrapperComponent(<CloudMetricsHealthSource {...mockCloudMetricHealthSourceProps(<></>)} />))
    expect(mockMetricDashboardWidgetNav).toHaveBeenNthCalledWith(1, {
      connectorIdentifier: DefaultSourceData.identifier,
      addManualQueryTitle: mockAddQueryTitle,
      dashboardDetailsRequest: expect.any(Object),
      dashboardWidgetMapper: expect.any(Function),
      dashboards: [],
      manuallyInputQueries: [],
      onSelectMetric: expect.any(Function),
      showSpinnerOnLoad: expect.any(Boolean)
    })
    expect(mockMetricsValidationChart).toHaveBeenNthCalledWith(1, {
      error: undefined,
      isQueryExecuted: false,
      loading: true,
      onRetry: expect.any(Function),
      queryValue: mockQueryValue,
      sampleData: {}
    })
    expect(mockMetricsConfigureRiskProfile).toHaveBeenNthCalledWith(1, {
      dataSourceType: DatasourceTypeEnum.DATADOG_METRICS
    })
    expect(mockMonacoEditor).toHaveBeenCalledTimes(0)
  })

  test('Should pass error to ValidationChart when retrieving timeseries data request fails', async () => {
    const mockErrorMessage = 'Mock error message'

    const propsWithMockError = {
      ...mockCloudMetricHealthSourceProps(<></>),
      timeseriesDataError: mockErrorMessage
    }
    render(WrapperComponent(<CloudMetricsHealthSource {...propsWithMockError} />))
    expect(mockMetricsValidationChart).toHaveBeenNthCalledWith(1, {
      error: mockErrorMessage,
      isQueryExecuted: expect.any(Boolean),
      loading: expect.any(Boolean),
      onRetry: expect.any(Function),
      queryValue: expect.any(String),
      sampleData: expect.any(Object)
    })
  })

  test('Should call onFetchTimeseriesData when retry button is clicked and query exists', async () => {
    const mockOnFetchTimeseriesData = jest.fn()
    render(
      WrapperComponent(
        <CloudMetricsHealthSource
          {...mockCloudMetricHealthSourceProps(<></>)}
          selectedMetricInfo={{ query: 'test_query' }}
          onFetchTimeseriesData={mockOnFetchTimeseriesData}
        />
      )
    )
    expect(mockOnFetchTimeseriesData).toHaveBeenCalledTimes(1)
  })
  test("Should not call onFetchTimeseriesData when retry button is clicked and query doesn't exist", async () => {
    const mockOnFetchTimeseriesData = jest.fn()
    render(
      WrapperComponent(
        <CloudMetricsHealthSource
          {...mockCloudMetricHealthSourceProps(<></>)}
          selectedMetricInfo={{ query: undefined }}
          onFetchTimeseriesData={mockOnFetchTimeseriesData}
        />
      )
    )
    expect(mockOnFetchTimeseriesData).toHaveBeenCalledTimes(0)
  })
})
