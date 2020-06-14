import xhr from '@wings-software/xhr-async'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import type {
  RestResponseListNewRelicApplication,
  RestResponseSetAppdynamicsTier,
  RestResponseSetAppdynamicsValidationResponse,
  MetricPack
} from '@wings-software/swagger-ts/definitions'

export const Endpoints = {
  appdApplications: (accountId: string, dataSourceId: string) =>
    `https://localhost:9090/api/appdynamics/applications?accountId=${accountId}&settingId=${dataSourceId}`,
  appdTier: (accountId: string, dataSourceId: string, appDynamicsAppId: string) =>
    `https://localhost:9090/api/appdynamics/tiers?accountId=${accountId}&settingId=${dataSourceId}&appdynamicsAppId=${appDynamicsAppId}`,
  validateAppDMetrics: (
    accountId: string,
    connectorId: string,
    projectId: string,
    appId: string,
    tierId: string,
    guid: string
  ) =>
    `https://localhost:9090/api/appdynamics/metric-data?accountId=${accountId}&connectorId=${connectorId}&projectId=${projectId}&appdAppId=${appId}&appdTierId=${tierId}&requestGuid=${guid}`
}

export async function fetchAppDynamicsApplications({
  accountId,
  dataSourceId,
  xhrGroup = 'XHR_APPD_APPS_GROUP'
}: {
  accountId: string
  dataSourceId: string
  xhrGroup: string
}): ServiceResponse<RestResponseListNewRelicApplication> {
  return await xhr.get(Endpoints.appdApplications(accountId, dataSourceId), { group: xhrGroup }).as('apps')
}

export async function getAppDynamicsTiers({
  accountId,
  datasourceId,
  appDynamicsAppId,
  xhrGroup = 'XHR_APPD_TIERS_GROUP'
}: {
  accountId: string
  datasourceId: string
  appDynamicsAppId: string
  xhrGroup: string
}): ServiceResponse<RestResponseSetAppdynamicsTier> {
  return await xhr.get(Endpoints.appdTier(accountId, datasourceId, appDynamicsAppId), { group: xhrGroup }).as('tiers')
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
  appId: string
  metricPacks: MetricPack[]
  tierId: string
  guid: string
  xhrGroup: string
}): ServiceResponse<RestResponseSetAppdynamicsValidationResponse> {
  return xhr.post(Endpoints.validateAppDMetrics(accountId, connectorId, projectId, appId, tierId, guid), {
    group: xhrGroup,
    data: metricPacks
  })
}
