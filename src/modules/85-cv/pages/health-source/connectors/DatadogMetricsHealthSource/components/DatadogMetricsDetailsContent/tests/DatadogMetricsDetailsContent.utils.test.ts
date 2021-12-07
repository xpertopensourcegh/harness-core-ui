import {
  DatadogMetricsQueryBuilder,
  DatadogMetricsQueryExtractor,
  mapMetricTagsHostIdentifierKeysOptions
} from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/components/DatadogMetricsDetailsContent/DatadogMetricsDetailsContent.utils'
import {
  MOCK_QUERY_OUTPUT,
  MOCK_ACTIVE_METRIC,
  MOCK_AGGREGATION,
  MOCK_ACTIVE_METRICS,
  MOCK_METRIC_TAGS_WITH_DUPLICATES,
  EXPECTED_METRIC_SELECT_OPTIONS
} from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/components/DatadogMetricsDetailsContent/tests/mock'

describe('Validate Utils', () => {
  test('should create query with provided activeMetric and aggregation', () => {
    expect(DatadogMetricsQueryBuilder(MOCK_ACTIVE_METRIC, MOCK_AGGREGATION).query).toEqual(MOCK_QUERY_OUTPUT)
  })
  test('should extract activeMetrics and aggregation from provided query', () => {
    expect(DatadogMetricsQueryExtractor(MOCK_QUERY_OUTPUT, MOCK_ACTIVE_METRICS)).toEqual({
      aggregation: MOCK_AGGREGATION,
      activeMetric: MOCK_ACTIVE_METRIC
    })
  })
  test('should map tags to SelectOptions, remove duplicates if exists and add host', () => {
    expect(mapMetricTagsHostIdentifierKeysOptions(MOCK_METRIC_TAGS_WITH_DUPLICATES)).toEqual(
      EXPECTED_METRIC_SELECT_OPTIONS
    )
  })
})
