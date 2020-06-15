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
    `/api/appdynamics/applications?accountId=${accountId}&settingId=${dataSourceId}`,
  appdTier: (accountId: string, dataSourceId: string, appDynamicsAppId: number) =>
    `/api/appdynamics/tiers?accountId=${accountId}&settingId=${dataSourceId}&appdynamicsAppId=${appDynamicsAppId}`,
  validateAppDMetrics: (
    accountId: string,
    connectorId: string,
    projectId: string,
    appId: number,
    tierId: number,
    guid: string
  ) =>
    `/api/appdynamics/metric-data?accountId=${accountId}&connectorId=${connectorId}&projectIdentifier=${projectId}&appdAppId=${appId}&appdTierId=${tierId}&requestGuid=${guid}`
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
  appDynamicsAppId: number
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
