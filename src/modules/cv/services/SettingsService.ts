import xhr from '@wings-software/xhr-async'
import type { ResponseWrapper } from 'modules/common/utils/HelperTypes'
import type { RestResponsePageResponseService } from '@wings-software/swagger-ts/definitions'

const Endpoints = {
  fetchServices: (appId: string) => `/services?&appId=${appId}`
}

export async function fetchServices(
  appId: string,
  group = 'XHR_SERVICES_GROUP'
): Promise<ResponseWrapper<RestResponsePageResponseService>> {
  return await xhr.get(Endpoints.fetchServices(appId), { group }).as('services')
}
