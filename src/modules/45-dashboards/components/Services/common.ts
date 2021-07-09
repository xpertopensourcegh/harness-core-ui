import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { noop } from 'lodash-es'
import type { Module } from '@common/interfaces/RouteInterfaces'
import { TIME_RANGE_ENUMS } from '@dashboards/components/TimeRangeSelector/TimeRangeSelector'

export enum Views {
  LIST,
  INSIGHT
}

export type ParamsType = {
  orgIdentifier: string
  projectIdentifier: string
  accountId: string
  module: Module
}

export interface ServiceStore {
  view: Views
  setView: Dispatch<SetStateAction<Views>>
}

export const ServiceStoreContext = createContext({
  view: Views.INSIGHT,
  setView: noop
})

export const useServiceStore = (): ServiceStore => useContext(ServiceStoreContext)

export const DeploymentsTimeRangeContext = createContext<{
  timeRange: TIME_RANGE_ENUMS
  setTimeRange: (timeRange: TIME_RANGE_ENUMS) => void
}>({
  timeRange: TIME_RANGE_ENUMS.SIX_MONTHS,
  setTimeRange: noop
})

export interface NumberFormatterOptions {
  truncate?: boolean
}

export const numberFormatter: (value?: number, options?: NumberFormatterOptions) => string = (
  value?: number,
  options = { truncate: true }
) => {
  if (value === undefined) {
    return ''
  }
  const truncateOptions = [
    { value: 1000000, suffix: 'm' },
    { value: 1000, suffix: 'k' }
  ]
  if (options.truncate) {
    for (const truncateOption of truncateOptions) {
      if (value >= truncateOption.value) {
        const truncatedValue = value / truncateOption.value
        if (truncatedValue % 1 !== 0) {
          return `${truncatedValue.toFixed(1)}${truncateOption.suffix}`
        }
        return `${truncatedValue}${truncateOption.suffix}`
      }
    }
  }
  return `${value % 1 === 0 ? value : value.toFixed(1)}`
}
