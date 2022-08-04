import type { SelectOption, SelectProps } from '@harness/uicore'
import type { MetricThreshold, MetricThresholdCriteria } from 'services/cv'
import type {
  MetricThresholdType as AppDMetricThresholdType,
  MetricThresholdType
} from '../../connectors/AppDynamics/AppDHealthSource.types'

export type AvailableThresholdTypes = MetricThreshold['type']

export type CriteriaThresholdValues = 'greaterThan' | 'lessThan'

export type ThresholdsPropertyNames = 'ignoreThresholds' | 'failFastThresholds'

export interface SelectItem {
  label: string
  value: string
}

export interface ThresholdCriteriaPropsType {
  criteriaType?: MetricThresholdCriteria['type']
  index: number
  thresholdTypeName: ThresholdsPropertyNames
  replaceFn: (value: AppDMetricThresholdType) => void
  criteriaPercentageType?: CriteriaThresholdValues
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
