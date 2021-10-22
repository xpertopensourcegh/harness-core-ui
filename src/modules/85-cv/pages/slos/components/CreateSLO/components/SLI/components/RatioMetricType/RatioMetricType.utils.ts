import type { SelectOption } from '@wings-software/uicore'

export const getMetricOneOptions = (): SelectOption[] => {
  return [{ label: 'Metric 1', value: 'metric1' }]
}

export const getMetricTwoOptions = (): SelectOption[] => {
  return [{ label: 'Metric 2', value: 'metric2' }]
}

export const getEventTypeOptions = (): SelectOption[] => {
  return [{ label: 'Good', value: 'good' }]
}
