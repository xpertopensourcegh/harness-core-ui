import type { MultiSelectOption } from '@wings-software/uicore'
import type { SelectOption } from '@pipeline/components/PipelineSteps/Steps/StepsTypes'

export type MapQueryToService = {
  metricName: string
  prometheusMetric?: string
  query: string
  isManualQuery?: boolean
  serviceFilter?: MultiSelectOption[]
  envFilter?: MultiSelectOption[]
  additionalFilter?: MultiSelectOption[]
  aggregator?: string
  riskCategory?: string
  serviceInstance?: string
  recordCount?: number
  lowerBaselineDeviation?: boolean
  higherBaselineDeviation?: boolean
  groupName?: SelectOption
}
