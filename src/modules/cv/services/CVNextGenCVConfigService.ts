import xhr from '@wings-software/xhr-async'
import type {
  MetricPack,
  DSConfig,
  RestResponseListDSConfig,
  RestResponseListString,
  RestResponseSetAppdynamicsValidationResponse,
  RestResponseListSplunkSavedSearch,
  RestResponseSplunkSampleResponse,
  RestResponseCVHistogram
} from '@wings-software/swagger-ts/definitions'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

export const Endpoints = {
  upsertDSConfig: (accountId: string) => `/cv-nextgen/ds-config?accountId=${accountId}`,
  deleteDSConfig: (accountId: string, identifier: string, dataSourceConnectorId: string, productName?: string) =>
    `/cv-nextgen/ds-config?accountId=${accountId}&connectorId=${dataSourceConnectorId}&identifier=${identifier}${
      productName ? `&productName=${productName}` : ''
    }`,
  fetchDSConfigs: (accountId: string, dataSourceConnectorId: string, productName: string) =>
    `/cv-nextgen/ds-config?accountId=${accountId}&connectorId=${dataSourceConnectorId}&productName=${productName}`,
  fetchDSProducts: (accountId: string, dataSourceConnectorId: string) =>
    `/cv-nextgen/cv-config/product-names?accountId=${accountId}&connectorId=${dataSourceConnectorId}`,
  metricPack: (accountId: string, projectId: string, dataSourceType: DSConfig['type']) =>
    `/cv-nextgen/metric-pack?accountId=${accountId}&projectIdentifier=${projectId}&dataSourceType=${dataSourceType}`,
  validateAppDMetrics: (
    accountId: string,
    connectorId: string,
    projectId: string,
    appId: number,
    tierId: number,
    guid: string
  ) =>
    `/cv-nextgen/appdynamics/metric-data?accountId=${accountId}&connectorId=${connectorId}&projectIdentifier=${projectId}&appdAppId=${appId}&appdTierId=${tierId}&requestGuid=${guid}`,
  fetchSplunkGraphDetails: (accountId: string, dataSourceId: string, query: string) =>
    `/cv-nextgen/splunk/histogram?accountId=${accountId}&connectorId=${dataSourceId}&query=${query}`,
  fetchSplunkSampleLogs: (accountId: string, dataSourceId: string, query: string) =>
    `/cv-nextgen/splunk/samples?accountId=${accountId}&connectorId=${dataSourceId}&query=${query}`,
  fetchSplunkSavedSearches: (accountId: string, dataSourceId: string, requestGUID: string) =>
    `/cv-nextgen/splunk/saved-searches?accountId=${accountId}&connectorId=${dataSourceId}&requestGuid=${requestGUID}`
}

export async function fetchQueriesFromSplunk({
  accountId,
  dataSourceId,
  requestGUID = new Date().getTime().toString(),
  xhrGroup
}: {
  accountId: string
  dataSourceId: string
  requestGUID?: string
  xhrGroup: string
}): ServiceResponse<RestResponseListSplunkSavedSearch> {
  return xhr.get(Endpoints.fetchSplunkSavedSearches(accountId, dataSourceId, requestGUID), { group: xhrGroup })
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
}): ServiceResponse<void> {
  return xhr.post(Endpoints.metricPack(accountId, projectId, dataSourceType), { data: payload, group })
}

export async function validateMetricsApi({
  accountId,
  connectorId,
  projectId,
  appId,
  metricPacks,
  tierId,
  guid,
  xhrGroup
}: {
  accountId: string
  connectorId: string
  projectId: string
  appId: number
  metricPacks: MetricPack[]
  tierId: number
  guid: string
  xhrGroup: string
}): ServiceResponse<RestResponseSetAppdynamicsValidationResponse> {
  return xhr.post(Endpoints.validateAppDMetrics(accountId, connectorId, projectId, appId, tierId, guid), {
    group: xhrGroup,
    data: metricPacks
  })
}

export async function fetchSplunkSampleLogs({
  accountId,
  dataSourceId,
  query,
  xhrGroup
}: {
  accountId: string
  dataSourceId: string
  query: string
  xhrGroup: string
}): ServiceResponse<RestResponseSplunkSampleResponse> {
  return xhr.get(Endpoints.fetchSplunkSampleLogs(accountId, dataSourceId, query), { group: xhrGroup })
}

export async function fetchSplunkSampleGraph({
  accountId,
  dataSourceId,
  query,
  xhrGroup
}: {
  accountId: string
  dataSourceId: string
  query: string
  xhrGroup: string
}): ServiceResponse<RestResponseCVHistogram> {
  return xhr.get(Endpoints.fetchSplunkGraphDetails(accountId, dataSourceId, query), { group: xhrGroup })
}
