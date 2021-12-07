import type React from 'react'
import type { FormikProps } from 'formik'
import type { DatadogMetricInfo } from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/DatadogMetricsHealthSource.type'

export interface DatadogMetricsDetailsContentProps {
  selectedMetric?: string
  selectedMetricData?: DatadogMetricInfo
  metricHealthDetailsData: Map<string, DatadogMetricInfo>
  setMetricHealthDetailsData: React.Dispatch<React.SetStateAction<Map<string, DatadogMetricInfo>>>
  formikProps: FormikProps<DatadogMetricInfo>
  metricTags: string[]
  activeMetrics: string[]
}
