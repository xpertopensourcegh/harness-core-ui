import xhr from '@wings-software/xhr-async'
import type { RestResponsePageResponseService } from '@wings-software/swagger-ts/definitions'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

export const Endpoints = {
  fetchAnomalies: (
    accountId: string,
    env: string,
    service: string,
    category: string,
    startTime: number,
    endTime: number
  ) =>
    `/cv-nextgen/anomaly?accountId=${accountId}&envIdentifier=${env}&serviceIdentifier=${service}` +
    `&category=${category}&startTimeMs=${startTime}&endTimeMs=${endTime}`,
  fetchTimeseries: (
    accountId: string,
    env: string,
    service: string,
    cvConfigId: string,
    metricName: string,
    startTime: number,
    endTime: number
  ) =>
    `/cv-nextgen/timeseries/metric-group-data?accountId=${accountId}&envIdentifier=${env}&serviceIdentifier=${service}` +
    `&cvConfigId=${cvConfigId}&metricName=${metricName}&startTimeEpochMillis=${startTime}&endTimeEpochMillis=${endTime}`
}

export async function fetchAnomalies(props: {
  accountId: string
  env: string
  service: string
  category: string
  startTime: number
  endTime: number
  xhrGroup?: string
}): ServiceResponse<RestResponsePageResponseService> {
  const { accountId, env, service, category, startTime, endTime, xhrGroup = 'XHR_ANOMALIES' } = props
  return xhr.get(Endpoints.fetchAnomalies(accountId, env, service, category, startTime, endTime), { group: xhrGroup })
}

export async function fetchTimeseries(props: {
  accountId: string
  env: string
  service: string
  cvConfigId: string
  metricName: string
  startTime: number
  endTime: number
  xhrGroup?: string
}): ServiceResponse<{ resource: any }> {
  const { accountId, env, service, cvConfigId, metricName, startTime, endTime, xhrGroup = 'XHR_ANOMALIES' } = props
  return xhr.get(Endpoints.fetchTimeseries(accountId, env, service, cvConfigId, metricName, startTime, endTime), {
    group: xhrGroup
  })
}
