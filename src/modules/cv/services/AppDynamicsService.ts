import xhr from '@wings-software/xhr-async'
import type {
  RestResponseListNewRelicApplication,
  RestResponseSetAppdynamicsTier
} from '@wings-software/swagger-ts/definitions'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

export const Endpoints = {
  appdApplications: (accountId: string, dataSourceId: string, orgId: string, projectId: string) =>
    `/cv-nextgen/appdynamics/applications?accountId=${accountId}&connectorId=${dataSourceId}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`,
  appdTier: (accountId: string, dataSourceId: string, appDynamicsAppId: number, orgId: string, projectId: string) =>
    `/cv-nextgen/appdynamics/tiers?accountId=${accountId}&connectorId=${dataSourceId}&appDynamicsAppId=${appDynamicsAppId}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`
}

export async function fetchAppDynamicsApplications({
  accountId,
  dataSourceId,
  orgId,
  projectId,
  xhrGroup = 'XHR_APPD_APPS_GROUP'
}: {
  accountId: string
  dataSourceId: string
  orgId: string
  projectId: string
  xhrGroup: string
}): ServiceResponse<RestResponseListNewRelicApplication> {
  return await xhr
    .get(Endpoints.appdApplications(accountId, dataSourceId, orgId, projectId), { group: xhrGroup })
    .as('apps')
}

export async function getAppDynamicsTiers({
  accountId,
  datasourceId,
  appDynamicsAppId,
  orgId,
  projectId,
  xhrGroup = 'XHR_APPD_TIERS_GROUP'
}: {
  accountId: string
  datasourceId: string
  orgId: string
  projectId: string
  appDynamicsAppId: number
  xhrGroup: string
}): ServiceResponse<RestResponseSetAppdynamicsTier> {
  return await xhr
    .get(Endpoints.appdTier(accountId, datasourceId, appDynamicsAppId, orgId, projectId), { group: xhrGroup })
    .as('tiers')
}
