import xhr from '@wings-software/xhr-async'
import type {
  MetricPack,
  DSConfig,
  RestResponseListDSConfig,
  RestResponseListString,
  RestResponseSetAppdynamicsValidationResponse,
  RestResponseListSplunkSavedSearch
} from '@wings-software/swagger-ts/definitions'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import { getConfig } from 'services/config'

export const Endpoints = {
  upsertDSConfig: (accountId: string, orgId: string, projectId: string) =>
    `${getConfig('cv/api')}/ds-config?accountId=${accountId}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`,
  deleteDSConfig: (
    accountId: string,
    identifier: string,
    dataSourceConnectorId: string,
    orgId: string,
    projectId: string,
    productName?: string
  ) =>
    `${getConfig(
      'cv/api'
    )}/ds-config?accountId=${accountId}&connectorIdentifier=${dataSourceConnectorId}&identifier=${identifier}${
      productName ? `&productName=${productName}` : ''
    }&orgIdentifier=${orgId}&projectIdentifier=${projectId}`,
  fetchDSConfigs: (
    accountId: string,
    dataSourceConnectorId: string,
    productName: string,
    orgId: string,
    projectId: string
  ) =>
    `${getConfig(
      'cv/api'
    )}/ds-config?accountId=${accountId}&connectorIdentifier=${dataSourceConnectorId}&productName=${productName}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`,
  fetchDSProducts: (accountId: string, dataSourceConnectorId: string, orgId: string, projectId: string) =>
    `${getConfig(
      'cv/api'
    )}/cv-config/product-names?accountId=${accountId}&connectorIdentifier=${dataSourceConnectorId}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`,
  metricPack: (accountId: string, projectId: string, dataSourceType: DSConfig['type'], orgId: string) =>
    `${getConfig(
      'cv/api'
    )}/metric-pack?accountId=${accountId}&projectIdentifier=${projectId}&dataSourceType=${dataSourceType}&orgIdentifier=${orgId}`,
  validateAppDMetrics: (
    accountId: string,
    connectorId: string,
    orgId: string,
    projectId: string,
    appId: number,
    tierId: number,
    guid: string
  ) =>
    `${getConfig(
      'cv/api'
    )}/appdynamics/metric-data?accountId=${accountId}&connectorIdentifier=${connectorId}&projectIdentifier=${projectId}&appdAppId=${appId}&appdTierId=${tierId}&requestGuid=${guid}&orgIdentifier=${orgId}`,
  validateSplunkConfig: (
    accountId: string,
    connectorId: string,
    query: string,
    requestGUID: string,
    orgId: string,
    projectId: string
  ) =>
    `${getConfig(
      'cv/api'
    )}/splunk/validation?accountId=${accountId}&connectorIdentifier=${connectorId}&query=${query}&requestGuid=${requestGUID}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`,
  fetchSplunkSavedSearches: (
    accountId: string,
    dataSourceId: string,
    requestGUID: string,
    orgId: string,
    projectId: string
  ) =>
    `${getConfig(
      'cv/api'
    )}/splunk/saved-searches?accountId=${accountId}&connectorIdentifier=${dataSourceId}&requestGuid=${requestGUID}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`
}

export async function fetchQueriesFromSplunk({
  accountId,
  dataSourceId,
  requestGUID = new Date().getTime().toString(),
  projectId,
  orgId,
  xhrGroup
}: {
  accountId: string
  dataSourceId: string
  projectId: string
  orgId: string
  requestGUID?: string
  xhrGroup: string
}): ServiceResponse<RestResponseListSplunkSavedSearch> {
  return xhr.get(Endpoints.fetchSplunkSavedSearches(accountId, dataSourceId, requestGUID, orgId, projectId), {
    group: xhrGroup
  })
}

export async function fetchConfigs({
  accountId,
  dataSourceConnectorId,
  productName,
  projectId,
  orgId
}: {
  accountId: string
  dataSourceConnectorId: string
  projectId: string
  orgId: string
  productName: string
}): ServiceResponse<RestResponseListDSConfig> {
  return xhr.get(Endpoints.fetchDSConfigs(accountId, dataSourceConnectorId, productName, orgId, projectId))
}

export async function upsertDSConfig({
  accountId,
  group,
  config,
  projectId,
  orgId
}: {
  accountId: string
  group: string
  config: DSConfig
  projectId: string
  orgId: string
}): ServiceResponse<void> {
  return xhr.put(Endpoints.upsertDSConfig(accountId, orgId, projectId), {
    group,
    data: config
  })
}

export async function deleteConfigs({
  accountId,
  productName,
  identifier,
  dataSourceConnectorId,
  projectId,
  orgId,
  group
}: {
  accountId: string
  productName?: string
  identifier: string
  dataSourceConnectorId: string
  projectId: string
  orgId: string
  group: string
}): ServiceResponse<void> {
  return xhr.delete(
    Endpoints.deleteDSConfig(accountId, identifier, dataSourceConnectorId, orgId, projectId, productName),
    {
      group
    }
  )
}

export async function fetchMetricPacks({
  accountId,
  projectId,
  orgId,
  dataSourceType,
  group
}: {
  accountId: string
  projectId: string
  orgId: string
  dataSourceType: DSConfig['type']
  group: string
}): ServiceResponse<MetricPack[]> {
  return xhr.get(Endpoints.metricPack(accountId, projectId, dataSourceType, orgId), { group })
}

export async function fetchProducts({
  accountId,
  dataSourceConnectorId,
  group,
  orgId,
  projectId
}: {
  group: string
  accountId: string
  orgId: string
  projectId: string
  dataSourceConnectorId: string
}): ServiceResponse<RestResponseListString> {
  return xhr.get(Endpoints.fetchDSProducts(accountId, dataSourceConnectorId, orgId, projectId), { group })
}

export async function saveGlobalMetricPacks({
  payload,
  accountId,
  projectId,
  orgId,
  dataSourceType,
  group
}: {
  accountId: string
  projectId: string
  dataSourceType: DSConfig['type']
  group: string
  orgId: string
  payload: any
}): ServiceResponse<void> {
  return xhr.post(Endpoints.metricPack(accountId, projectId, dataSourceType, orgId), { data: payload, group })
}

export async function validateMetricsApi({
  accountId,
  connectorId,
  projectId,
  orgId,
  appId,
  metricPacks,
  tierId,
  guid,
  xhrGroup
}: {
  accountId: string
  connectorId: string
  orgId: string
  projectId: string
  appId: number
  metricPacks: MetricPack[]
  tierId: number
  guid: string
  xhrGroup: string
}): ServiceResponse<RestResponseSetAppdynamicsValidationResponse> {
  return xhr.post(Endpoints.validateAppDMetrics(accountId, connectorId, orgId, projectId, appId, tierId, guid), {
    group: xhrGroup,
    data: metricPacks
  })
}

export async function validateSplunkConfig({
  accountId,
  dataSourceId,
  query,
  guid,
  projectId,
  orgId,
  xhrGroup
}: {
  accountId: string
  dataSourceId: string
  guid: string
  query: string
  projectId: string
  orgId: string
  xhrGroup: string
}): ServiceResponse<any> {
  return xhr.get(Endpoints.validateSplunkConfig(accountId, dataSourceId, query, guid, orgId, projectId), {
    group: xhrGroup
  })
}
