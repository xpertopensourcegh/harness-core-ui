import xhr from '@wings-software/xhr-async'
import type { RestResponsePageResponseSettingAttribute } from '@wings-software/swagger-ts/definitions'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

const Endpoints = {
  fetchServices: (appId: string, accId: string, orgId: string, projectId: string) =>
    `/ng/api/services?accountId=${accId}&appId=${appId}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`,
  createService: (accId: string) => `/ng/api/services?accountId=${accId}`,
  fetchEnvironments: (accId: string, orgId: string, projectId: string) =>
    `/ng/api/environments?accountId=${accId}&orgIdentifier=${orgId}&projectIdentifier=${projectId}`,
  createEnvironment: (accId: string) => `/ng/api/environments?accountId=${accId}`,
  fetchConnectors: (accountId: string) => `/ng/api/accounts/${accountId}/connectors`
}

export async function fetchServices(
  appId: string,
  group = 'XHR_SERVICES_GROUP',
  accId: string,
  orgId: string,
  projectId: string
): ServiceResponse<any> {
  return await xhr.get(Endpoints.fetchServices(appId, accId, orgId, projectId), { group }).as('services')
}

export async function createService(
  identifier: string,
  accId: string,
  orgIdentifier: string,
  projectIdentifier: string,
  group = 'XHR_SERVICES_GROUP'
) {
  return await xhr.post(Endpoints.createService(accId), {
    group,
    data: {
      identifier,
      orgIdentifier,
      projectIdentifier
    }
  })
}

export async function fetchEnvironments(
  accId: string,
  orgId: string,
  projectId: string,
  group = 'XHR_SERVICES_GROUP'
): ServiceResponse<any> {
  return await xhr.get(Endpoints.fetchEnvironments(accId, orgId, projectId), { group }).as('environments')
}

export async function createEnvironment(
  identifier: string,
  accId: string,
  orgIdentifier: string,
  projectIdentifier: string,
  type: string,
  group = 'XHR_SERVICES_GROUP'
) {
  return await xhr.post(Endpoints.createEnvironment(accId), {
    group,
    data: {
      identifier,
      name: identifier,
      orgIdentifier,
      projectIdentifier,
      type
    }
  })
}

export async function fetchConnectors(accountId: string): ServiceResponse<RestResponsePageResponseSettingAttribute> {
  return await xhr.get(Endpoints.fetchConnectors(accountId))
}
