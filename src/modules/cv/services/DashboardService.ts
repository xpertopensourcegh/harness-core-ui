import xhr from '@wings-software/xhr-async'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import type { RestResponsePageResponseService } from '@wings-software/swagger-ts/definitions'

const Endpoints = {
  fetchHeatmapSummary: ({ accId, env, service, startTime, endTime }: any) =>
    `/api/ts-service-guard/cv-nextgen/heatmap` +
    `?accountId=${accId}&envIdentifier=${env}&serviceIdentifier=${service}&startTimeMs=${startTime}&endTimeMs=${endTime}`
}

export async function fetchHeatmapSummary(props: {
  accId: string
  env: string
  service: string
  startTime: number
  endTime: number
  group?: string
}): ServiceResponse<RestResponsePageResponseService> {
  const { group = 'XHR_SERVICE_DASHBOARD', ...restProps } = props
  return await xhr.get(Endpoints.fetchHeatmapSummary(restProps), { group })
}
