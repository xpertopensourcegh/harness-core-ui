import type { ReactNode } from 'react'
import type { UseGetReturn } from 'restful-react'
import type { CloudMetricsHealthSourceProps } from '@cv/components/CloudMetricsHealthSource/CloudMetricsHealthSource.type'
import type { DatadogDashboardDetail } from 'services/cv'
import { DatasourceTypeEnum } from '@cv/pages/monitored-service/components/ServiceHealth/components/MetricsAndLogs/MetricsAndLogs.types'

export const DefaultSourceData = {
  accountId: '1234_accountId',
  projectIdentifier: '1234_projectid',
  orgIdentifier: '1234_orgId',
  identifier: 'MOCK_IDENTIFIER',
  product: 'test',
  name: 'test',
  selectedDashboards: [],
  selectedMetrics: new Map(),
  type: 'STACKDRIVER',
  mappedServicesAndEnvs: new Map(),
  isEdit: false
}

export const mockQueryValue = 'MOCK_TEST_QUERY'
export const mockCloudMetricHealthSourceProps = (
  metricContentDetails: ReactNode
): CloudMetricsHealthSourceProps<DatadogDashboardDetail> => {
  return {
    addManualQueryTitle: 'cv.monitoringSources.datadog.manualInputQueryModal.modalTitle',
    dataSourceType: DatasourceTypeEnum.DATADOG_METRICS,
    selectedMetricInfo: {
      query: mockQueryValue,
      queryEditable: false,
      timeseriesData: []
    },
    onFetchTimeseriesData: jest.fn(),
    timeseriesDataLoading: true,
    connectorRef: DefaultSourceData.identifier,
    onWidgetMetricSelected: jest.fn(),
    onNextClicked: jest.fn(),
    manualQueries: [],
    metricDetailsContent: metricContentDetails,
    dashboards: [],
    dashboardDetailMapper: jest.fn(),
    dashboardDetailRequest: {
      data: { data: [] },
      refetch: jest.fn() as unknown
    } as UseGetReturn<any, any, any>
  }
}
