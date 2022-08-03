import type { SelectOption, SelectProps } from '@harness/uicore'
import type {
  MetricThresholdType as AppDMetricThresholdType,
  MetricThresholdType
} from '../../connectors/AppDynamics/AppDHealthSource.types'

export interface SelectItem {
  label: string
  value: string
}

export interface ThresholdCriteriaPropsType {
  criteriaType?: 'Absolute' | 'Percentage'
  index: number
  thresholdTypeName: string
  replaceFn: (value: AppDMetricThresholdType) => void
  criteriaPercentageType?: string
}

export type ThresholdSelectProps = {
  name: string
  items: SelectItem[]
  onChange?: (value: SelectOption) => void
  key?: string
  disabled?: boolean
  className?: string
} & SelectProps

export interface ThresholdGroupType {
  name: string
  metricType?: string
  index: number
  handleTransactionUpdate: (index: number, value: string, replaceFn: (value: MetricThresholdType) => void) => void
  placeholder: string
  replaceFn: (value: MetricThresholdType) => void
}

export type AvailableThresholdTypes = 'IgnoreThreshold' | 'FailImmediately'
