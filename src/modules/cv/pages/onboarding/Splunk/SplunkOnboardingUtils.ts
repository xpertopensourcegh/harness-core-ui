import type { SplunkSavedSearch, DSConfig } from '@wings-software/swagger-ts/definitions'
import type { SelectOption } from '@wings-software/uikit'
import cloneDeep from 'lodash/cloneDeep'
import type { YAxisOptions, XAxisOptions } from 'highcharts'

export const SplunkColumnChartOptions: Highcharts.Options = {
  chart: {
    renderTo: 'chart',
    margin: 0
  },
  title: {
    text: undefined
  },
  yAxis: {
    title: {
      enabled: false
    } as YAxisOptions,
    gridLineWidth: 0
  },
  xAxis: {
    title: {
      enabled: false
    } as XAxisOptions,
    labels: {
      enabled: false
    },
    tickLength: 0,
    lineWidth: 0,
    gridLineWidth: 0
  },
  legend: {
    enabled: false
  },
  series: [],
  tooltip: {
    headerFormat: ' '
  },
  credits: {
    enabled: false
  }
}

export interface SplunkDSConfig extends DSConfig {
  query?: string
  serviceInstanceIdentifier?: string
  eventType?: string
  serviceIdentifier?: string
}

export const splunkInitialQuery: SplunkDSConfig = {
  serviceIdentifier: '',
  envIdentifier: '',
  serviceInstanceIdentifier: '',
  query: '',
  eventType: 'Quality'
}

export function transformQueriesFromSplunk(splunkSavedQueries: SplunkSavedSearch[]): SelectOption[] {
  return !splunkSavedQueries?.length
    ? []
    : splunkSavedQueries
        .filter(query => query?.title && query?.searchQuery)
        .map((query: SplunkSavedSearch) => ({
          label: query.title || '',
          value: query.searchQuery || ''
        }))
}

export function transformSavedQueries(savedQueries: any) {
  return savedQueries.map((query: any) => {
    return query
  })
}

export function createDefaultConfigObjectBasedOnSelectedQueries(queries: SelectOption[]): SplunkDSConfig[] {
  return queries.map(query => {
    const q = cloneDeep(splunkInitialQuery)
    q.identifier = query.label
    q.query = query.value as string
    return q
  })
}
