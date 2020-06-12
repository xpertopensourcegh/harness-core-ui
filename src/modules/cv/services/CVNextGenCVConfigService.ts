import xhr from '@wings-software/xhr-async'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import type { CVConfig, RestResponseListCVConfig, MetricPack, DSConfig } from '@wings-software/swagger-ts/definitions'

export const Endpoints = {
  upsertDSConfig: (accountId: string) => `https://localhost:9090/api/cv-nextgen/dsconfig?accountId=${accountId}`,
  nextgenCVConfigList: (accountId: string, dataSourceConnectorId: string) =>
    `https://localhost:9090/api/cv-nextgen/cv-config/list?accountId=${accountId}&connectorId=${dataSourceConnectorId}`,
  metricPack: (accountId: string, projectId: string, dataSourceType: CVConfig['type']) =>
    `https://localhost:9090/api/cv-nextgen/metric-pack/metric-packs?accountId=${accountId}&projectIdentifier=${projectId}&dataSourceType=${dataSourceType}`
}

export async function fetchQueriesFromSplunk({ accountId, dataSourceId = '', xhrGroup }: any) {
  const url = `https://localhost:9090/api/cv-nextgen/splunk/saved-searches?accountId=${accountId}&connectorId=${dataSourceId}`
  return await xhr.get(url, { group: xhrGroup })
}

export async function fetchConfigs({
  accountId,
  dataSourceConnectorId
}: {
  accountId: string
  dataSourceConnectorId: string
}): ServiceResponse<RestResponseListCVConfig> {
  return xhr.get(Endpoints.nextgenCVConfigList(accountId, dataSourceConnectorId))
}

export async function upsertDSConfig({
  accountId,
  group,
  config
}: {
  accountId: string
  group: string
  config: DSConfig
}): ServiceResponse<void> {
  return xhr.put(Endpoints.upsertDSConfig(accountId), {
    group,
    data: config
  })
}

export async function deleteConfigs({
  accountId,
  group,
  configsToDelete
}: {
  accountId: string
  group: string
  configsToDelete: string[]
}): ServiceResponse<RestResponseListCVConfig> {
  return xhr.delete(Endpoints.saveDSConfig(accountId), {
    group,
    data: configsToDelete
  })
}

export async function fetchMetricPacks({
  accountId,
  projectId,
  dataSourceType,
  group
}: {
  accountId: string
  projectId: string
  dataSourceType: CVConfig['type']
  group: string
}): ServiceResponse<MetricPack[]> {
  return xhr.get(Endpoints.metricPack(accountId, projectId, dataSourceType), { group })
}
