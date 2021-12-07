import type { SelectOption } from '@wings-software/uicore'
import type { FormikProps } from 'formik'
import type { HealthSourceSpec } from 'services/cv'
import type { UpdatedHealthSource } from '@cv/pages/health-source/HealthSourceDrawer/HealthSourceDrawerContent.types'

export interface DatadogLogsHealthSourceProps {
  data: any
  onSubmit: (formdata: DatadogLogsSetupSource, updatedHealthSource: UpdatedHealthSource) => Promise<void>
}

export type DatadogLogsInfo = {
  metricName: string
  serviceInstanceIdentifierTag?: string
  indexes?: SelectOption[]
  query: string
}

export interface DatadogLogsSetupSource {
  isEdit: boolean
  logsDefinitions: Map<string, DatadogLogsInfo>
  healthSourceIdentifier: string
  healthSourceName: string
  product: SelectOption
  connectorRef?: string
}

export type SelectedAndMappedMetrics = {
  selectedMetric: string
  mappedMetrics: Map<string, DatadogLogsInfo>
}

export type UpdateSelectedMetricsMap = {
  updatedMetric: string
  oldMetric: string
  mappedMetrics: Map<string, DatadogLogsInfo>
  formikProps: FormikProps<DatadogLogsInfo | undefined>
}

export interface DatadogLogsQueryDefinition {
  name: string
  query: string
  serviceInstanceIdentifier?: string
  indexes: string[]
}

export type DatadogLogsHealthSpec = HealthSourceSpec & {
  feature: string
  queries: DatadogLogsQueryDefinition[]
}
