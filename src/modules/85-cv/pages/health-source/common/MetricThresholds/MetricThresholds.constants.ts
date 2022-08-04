import type {
  AvailableThresholdTypes,
  CriteriaThresholdValues,
  ThresholdsPropertyNames
} from './MetricThresholds.types'

interface SelectItem {
  label: string
  value: string
}

export const IgnoreThresholdType = 'Ignore'

export const MetricCriteriaValues: Record<string, 'Absolute' | 'Percentage'> = {
  Absolute: 'Absolute',
  Percentage: 'Percentage'
}

export const MetricTypeValues = {
  Performance: 'Performance',
  Custom: 'Custom',
  Errors: 'Errors'
}

export const MetricTypesForTransactionTextField = [MetricTypeValues.Performance, MetricTypeValues.Errors]

export const CustomMetricDropdownOption: SelectItem = {
  label: MetricTypeValues.Custom,
  value: MetricTypeValues.Custom
}

export const MetricThresholdTypes: Record<string, AvailableThresholdTypes> = {
  IgnoreThreshold: 'IgnoreThreshold',
  FailImmediately: 'FailImmediately'
}

export const MetricThresholdPropertyName: Record<string, ThresholdsPropertyNames> = {
  IgnoreThreshold: 'ignoreThresholds',
  FailFastThresholds: 'failFastThresholds'
}

export const PercentageCriteriaDropdownValues: Record<string, CriteriaThresholdValues> = {
  GreaterThan: 'greaterThan',
  LessThan: 'lessThan'
}

export const FailFastActionValues: Record<
  string,
  'FailImmediately' | 'FailAfterOccurrence' | 'FailAfterConsecutiveOccurrence'
> = {
  FailImmediately: 'FailImmediately',
  FailAfterOccurrences: 'FailAfterOccurrence',
  FailAfterConsecutiveOccurrences: 'FailAfterConsecutiveOccurrence'
}

export const DefaultCustomMetricGroupName = 'Please Select Group Name'
export const ExceptionGroupName = '+ Add New'
