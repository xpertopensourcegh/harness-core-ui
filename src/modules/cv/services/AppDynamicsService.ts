import xhr from '@wings-software/xhr-async'
import type { ResponseWrapper } from 'modules/common/utils/HelperTypes'
import type {
  RestResponseListNewRelicApplication,
  RestResponseSetAppdynamicsTier
} from '@wings-software/swagger-ts/definitions'

export const Endpoints = {
  appdApplications: (accountId: string, dataSourceId: string) =>
    `/appdynamics/applications?accountId=${accountId}&settingId=${dataSourceId}`,
  appdTier: (accountId: string, dataSourceId: string, appDynamicsAppId: string) =>
    `/appdynamics/tiers?accountId=${accountId}&settingId=${dataSourceId}&appDynamicsAppId=${appDynamicsAppId}`
}

export async function fetchAppDynamicsApplications({
  accountId,
  dataSourceId,
  xhrGroup = 'XHR_APPD_APPS_GROUP'
}: {
  accountId: string
  dataSourceId: string
  xhrGroup: string
}): Promise<ResponseWrapper<RestResponseListNewRelicApplication>> {
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
}): Promise<ResponseWrapper<RestResponseSetAppdynamicsTier>> {
  return await xhr.get(Endpoints.appdTier(accountId, datasourceId, appDynamicsAppId), { group: xhrGroup }).as('tiers')
}
