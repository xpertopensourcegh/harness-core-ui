import type { SplunkSavedSearch } from '@wings-software/swagger-ts/definitions'
import type { SelectOption } from '@wings-software/uikit'
import { Utils } from '@wings-software/uikit'
import cloneDeep from 'lodash/cloneDeep'
import type { YAxisOptions, XAxisOptions } from 'highcharts'
import type { DSConfig } from 'services/cv'
import i18n from './SplunkMainSetupView.i18n'

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
  tooltip: {
    formatter: function () {
      if (!this.point) {
        return
      }
      return `Time: ${new Date(this.x).toLocaleString()}<br/>Log Count: ${this.y}`
    }
  },
  legend: {
    enabled: false
  },
  series: [],
  credits: {
    enabled: false
  }
}

export interface SplunkDSConfig extends DSConfig {
  query?: string
  queryName?: string
  serviceInstanceIdentifier?: string
  eventType?: string
  serviceIdentifier?: string
  id?: string
  isValid?: boolean
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

export function transformSavedQueries(savedQueries: DSConfig[]): SplunkDSConfig[] {
  return savedQueries.map((query: DSConfig) => {
    const splunkQuery = query as SplunkDSConfig
    splunkQuery.queryName = query.identifier
    splunkQuery.id = Utils.randomId()
    return splunkQuery
  })
}

export function transformToSaveConfig(createdConfigs: DSConfig): SplunkDSConfig {
  const splunkConfig = cloneDeep(createdConfigs) as SplunkDSConfig
  splunkConfig.identifier = splunkConfig.queryName
  delete splunkConfig.queryName
  delete splunkConfig.id
  delete splunkConfig.isValid
  return splunkConfig
}

export function createDefaultSplunkDSConfig(
  accountId: string,
  dataSourceId: string,
  productName: string,
  projectIdentifier: string,
  orgIdentifier: string,
  queryName?: string,
  query?: string
): SplunkDSConfig {
  return {
    serviceIdentifier: '',
    serviceInstanceIdentifier: '',
    eventType: i18n.splunkEntityTypeOptions.errors,
    type: 'SPLUNK',
    projectIdentifier,
    orgIdentifier,
    accountId,
    connectorIdentifier: dataSourceId,
    productName,
    query,
    id: Utils.randomId(),
    queryName: queryName ?? i18n.defaultQueryName,
    isValid: true
  }
}

export function createDefaultConfigObjectBasedOnSelectedQueries(
  queries: SelectOption[],
  dataSourceId: string,
  accId: string,
  productName: string,
  projectIdentifier: string,
  orgIdentifier: string
): SplunkDSConfig[] {
  const defaultQueries = queries?.map(query => {
    return createDefaultSplunkDSConfig(
      accId,
      dataSourceId,
      productName,
      projectIdentifier,
      orgIdentifier,
      query.label,
      query.value as string
    )
  })

  if (!defaultQueries?.length) {
    defaultQueries.push(createDefaultSplunkDSConfig(accId, dataSourceId, productName, projectIdentifier, orgIdentifier))
  }

  return defaultQueries
}
