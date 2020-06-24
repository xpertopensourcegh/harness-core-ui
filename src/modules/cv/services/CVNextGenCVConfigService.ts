import xhr from '@wings-software/xhr-async'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import type {
  MetricPack,
  DSConfig,
  RestResponseListDSConfig,
  RestResponseListString
} from '@wings-software/swagger-ts/definitions'

export const Endpoints = {
  upsertDSConfig: (accountId: string) => `/api/cv-nextgen/ds-config?accountId=${accountId}`,
  deleteDSConfig: (accountId: string, identifier: string, dataSourceConnectorId: string, productName?: string) =>
    `/api/cv-nextgen/ds-config?accountId=${accountId}&connectorId=${dataSourceConnectorId}&identifier=${identifier}${
      productName ? `&productName=${productName}` : ''
    }`,
  fetchDSConfigs: (accountId: string, dataSourceConnectorId: string, productName: string) =>
    `/api/cv-nextgen/ds-config?accountId=${accountId}&connectorId=${dataSourceConnectorId}&productName=${productName}`,
  fetchDSProducts: (accountId: string, dataSourceConnectorId: string) =>
    `/api/cv-nextgen/cv-config/product-names?accountId=${accountId}&connectorId=${dataSourceConnectorId}`,
  metricPack: (accountId: string, projectId: string, dataSourceType: DSConfig['type']) =>
    `/api/cv-nextgen/metric-pack/metric-packs?accountId=${accountId}&projectIdentifier=${projectId}&dataSourceType=${dataSourceType}`
}

export async function fetchQueriesFromSplunk({ accountId, dataSourceId = '', xhrGroup }: any) {
  const url = `/api/cv-nextgen/splunk/saved-searches?accountId=${accountId}&connectorId=${dataSourceId}`
  return await xhr.get(url, { group: xhrGroup })
}

export async function fetchConfigs({
  accountId,
  dataSourceConnectorId,
  productName
}: {
  accountId: string
  dataSourceConnectorId: string
  productName: string
}): ServiceResponse<RestResponseListDSConfig> {
  return xhr.get(Endpoints.fetchDSConfigs(accountId, dataSourceConnectorId, productName))
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
  productName,
  identifier,
  dataSourceConnectorId,
  group
}: {
  accountId: string
  productName?: string
  identifier: string
  dataSourceConnectorId: string
  group: string
}): ServiceResponse<void> {
  return xhr.delete(Endpoints.deleteDSConfig(accountId, identifier, dataSourceConnectorId, productName), {
    group
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
  dataSourceType: DSConfig['type']
  group: string
}): ServiceResponse<MetricPack[]> {
  return xhr.get(Endpoints.metricPack(accountId, projectId, dataSourceType), { group })
}

export async function fetchProducts({
  accountId,
  dataSourceConnectorId,
  group
}: {
  group: string
  accountId: string
  dataSourceConnectorId: string
}): ServiceResponse<RestResponseListString> {
  return xhr.get(Endpoints.fetchDSProducts(accountId, dataSourceConnectorId), { group })
}

export async function saveGlobalMetricPacks({
  payload,
  accountId,
  projectId,
  dataSourceType,
  group
}: {
  accountId: string
  projectId: string
  dataSourceType: DSConfig['type']
  group: string
  payload: any
}) {
  return xhr.post(Endpoints.metricPack(accountId, projectId, dataSourceType), { data: payload, group })
}
