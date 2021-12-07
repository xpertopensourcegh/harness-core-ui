import type { SelectOption } from '@wings-software/uicore'
import { Comparators } from './SLI.types'

export enum SLIMetricEnum {
  THRESHOLD = 'Threshold',
  RATIO = 'Ratio'
}

export enum SLITypeEnum {
  AVAILABILITY = 'Availability',
  LATENCY = 'Latency'
}

export const comparatorOptions: SelectOption[] = [
  {
    label: '<',
    value: Comparators.LESS
  },
  {
    label: '>',
    value: Comparators.GREATER
  },
  {
    label: '<=',
    value: Comparators.LESS_EQUAL
  },
  {
    label: '>=',
    value: Comparators.GREATER_EQUAL
  }
]

export const defaultOption: SelectOption = {
  label: '',
  value: ''
}
