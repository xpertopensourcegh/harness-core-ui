import xhr from '@wings-software/xhr-async'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import type { CVConfig, RestResponseListCVConfig, MetricPack } from '@wings-software/swagger-ts/definitions'

export const Endpoints = {
  nextgenCVConfigBatch: (accountId: string) =>
    `https://localhost:9090/api/cv-nextgen/cv-config/batch?accountId=${accountId}`,
  nextgenCVConfigList: (accountId: string, dataSourceConnectorId: string) =>
    `https://localhost:9090/api/cv-nextgen/cv-config/list?accountId=${accountId}&connectorId=${dataSourceConnectorId}`,
  metricPack: (accountId: string, projectId: number, dataSourceType: CVConfig['type'], excludeDetails: boolean) =>
    `https://localhost:9090/api/cv-nextgen/data-source/metric-packs?accountId=${accountId}&projectId=${projectId}&dataSourceType=${dataSourceType}&excludeDetails=${excludeDetails}`
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

export async function saveConfigs({
  accountId,
  group,
  configsToSave
}: {
  accountId: string
  group: string
  configsToSave: CVConfig[]
}): ServiceResponse<RestResponseListCVConfig> {
  return xhr.post(Endpoints.nextgenCVConfigBatch(accountId), {
    group,
    data: configsToSave
  })
}

export async function updateConfigs({
  accountId,
  group,
  configsToUpdate
}: {
  accountId: string
  group: string
  configsToUpdate: CVConfig[]
}): ServiceResponse<RestResponseListCVConfig> {
  return xhr.put(Endpoints.nextgenCVConfigBatch(accountId), {
    group,
    data: configsToUpdate
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
  return xhr.delete(Endpoints.nextgenCVConfigBatch(accountId), {
    group,
    data: configsToDelete
  })
}

export async function fetchMetricPacks({
  accountId,
  projectId,
  dataSourceType,
  excludeDetails,
  group
}: {
  accountId: string
  projectId: number
  dataSourceType: CVConfig['type']
  excludeDetails: boolean
  group: string
}): ServiceResponse<MetricPack[]> {
  return xhr.get(Endpoints.metricPack(accountId, projectId, dataSourceType, excludeDetails), { group })
}
