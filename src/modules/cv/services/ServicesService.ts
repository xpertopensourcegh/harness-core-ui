import xhr from '@wings-software/xhr-async'
import type { RestResponsePageResponseService } from '@wings-software/swagger-ts/definitions'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

const Endpoints = {
  fetchHeatmap: ({ accountId, envIdentifier, serviceIdentifier, projectIdentifier, startTimeMS, endTimeMS }: any) =>
    `/cv-nextgen/heatmap` +
    `?accountId=${accountId}&envIdentifier=${envIdentifier}&projectIdentifier=${projectIdentifier}&serviceIdentifier=${serviceIdentifier}&startTimeMs=${startTimeMS}&endTimeMs=${endTimeMS}`
}

export async function fetchHeatmap(props: {
  accountId: string
  envIdentifier: string
  serviceIdentifier: string
  projectIdentifier: string
  startTimeMS: number
  endTimeMS: number
  group?: string
}): ServiceResponse<RestResponsePageResponseService> {
  const { group = 'XHR_SERVICE_DASHBOARD', ...restProps } = props
  return await xhr.get(Endpoints.fetchHeatmap(restProps), { group })
}
