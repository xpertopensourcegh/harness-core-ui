import {
  getManuallyCreatedQueries,
  getSelectedDashboards,
  mapDatadogMetricHealthSourceToDatadogMetricSetupSource,
  mapDatadogMetricSetupSourceToDatadogHealthSource,
  mapSelectedWidgetDataToDatadogMetricInfo
} from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/DatadogMetricsHealthSource.utils'
import {
  DatadogMetricsHealthSourceMock,
  DatadogMetricsMockHealthSourceData,
  DatadogMetricsSetupSource,
  EXPECTED_DATADOG_METRIC_INFO,
  MOCK_MANUAL_QUERIES_LIST,
  MOCK_SELECTED_DASHBOARDS_WIDGETS,
  MOCK_SELECTED_WIDGET_DATA
} from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/tests/mock'

describe('Validate DatadogMetricsHealthSource Utils', () => {
  test('validate health source data to DatadogSetupSource mapping', () => {
    expect(mapDatadogMetricHealthSourceToDatadogMetricSetupSource(DatadogMetricsMockHealthSourceData)).toEqual(
      DatadogMetricsSetupSource
    )
  })
  test('validate DatadogSetupSource to HealthSource mapping', () => {
    expect(mapDatadogMetricSetupSourceToDatadogHealthSource(DatadogMetricsSetupSource)).toEqual(
      DatadogMetricsHealthSourceMock
    )
  })
  test('it should return expected number of manual queries', () => {
    expect(getManuallyCreatedQueries(DatadogMetricsSetupSource.metricDefinition)).toEqual(MOCK_MANUAL_QUERIES_LIST)
  })
  test('it should extract selected dashboards from source data and map them to MetricDashboardItems', () => {
    expect(getSelectedDashboards(DatadogMetricsSetupSource)).toEqual(MOCK_SELECTED_DASHBOARDS_WIDGETS)
  })

  test('it should map SelectedMetricWidgetData to DatadogMetricInfo', () => {
    expect(
      mapSelectedWidgetDataToDatadogMetricInfo(
        MOCK_SELECTED_WIDGET_DATA,
        'avg:datadog.agent.running{*}.rollup(avg,60)',
        []
      )
    ).toEqual(EXPECTED_DATADOG_METRIC_INFO)
  })
})
