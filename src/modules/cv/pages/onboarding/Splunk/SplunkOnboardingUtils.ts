import type { SplunkSavedSearch } from '@wings-software/swagger-ts/definitions'
import type { SelectOption } from '@wings-software/uikit'

export const options = {
  chart: {
    type: 'column',
    height: 100
  },
  title: {
    text: ''
  },
  yAxis: {
    title: {
      text: ''
    }
  },
  xAxis: {
    labels: {
      enabled: false
    }
  },
  series: [
    {
      name: '',
      data: [],
      showInLegend: false
    }
  ],
  credits: {
    enabled: false
  },
  Error: false
}

export const splunkInitialQuery = {
  // uuid: new Date().getTime(),
  queryName: '',
  service: '',
  environment: '',
  serviceInstance: '',
  queryString: '',
  eventType: 'Quality',
  graphOptions: { ...options },
  stackTrace: [],
  isOpen: true,
  isAlreadySaved: false
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

export function mapQueries(queries: any) {
  return queries.map((query: any) => {
    const q = { ...splunkInitialQuery }
    q.queryName = query.label
    q.queryString = query.value
    return q
  })
}