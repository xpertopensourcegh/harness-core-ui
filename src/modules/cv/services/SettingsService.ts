import xhr from '@wings-software/xhr-async'
import type { ResponseWrapper } from 'modules/common/utils/HelperTypes'
import type { RestResponsePageResponseService } from '@wings-software/swagger-ts/definitions'

const Endpoints = {
  fetchServices: (appId: string, accId: string ) => `https://localhost:9090/api/services?accountId=${accId}&appId=${appId}`
}

export async function fetchServices(
  appId: string,
  group = 'XHR_SERVICES_GROUP',
  accId: string
): Promise<ResponseWrapper<RestResponsePageResponseService>> {
  return await xhr.get(Endpoints.fetchServices(appId, accId), { group }).as('services')
}
