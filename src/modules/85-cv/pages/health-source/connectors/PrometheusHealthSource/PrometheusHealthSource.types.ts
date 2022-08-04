import type { FailMetricThresholdSpec, MetricThreshold, MetricThresholdSpec } from 'services/cv'
import type { CriteriaThresholdValues } from '../../common/MetricThresholds/MetricThresholds.types'

interface CriteriaPercentageType {
  criteriaPercentageType?: CriteriaThresholdValues
}

export type PrometheusMetricThresholdType = Omit<MetricThreshold, 'groupName'> & {
  criteria: MetricThreshold['criteria'] & CriteriaPercentageType
  metricType?: string
  spec?: MetricThresholdSpec & FailMetricThresholdSpec
}

export interface MetricThresholdsState {
  ignoreThresholds: PrometheusMetricThresholdType[]
  failFastThresholds: PrometheusMetricThresholdType[]
}

export type PrometheusMetricPacksType = Array<{
  identifier: string
  metricThresholds: PrometheusMetricThresholdType[]
}>
