import type { ThirdPartyApiCallLog } from '@wings-software/swagger-ts/definitions'
import xhr from '@wings-software/xhr-async'
import type { ServiceResponse } from '@common/services/ServiceResponse'

export const Endpoints = {
  callLogs: (entityIdentifier: string, appId: string) =>
    `/api/activities/${encodeURI(entityIdentifier)}/api-call-logs?appId=${appId}`
}

export async function fetchApiCallLogs({
  entityIdentifier,
  appId,
  xhrGroup
}: {
  entityIdentifier: string
  appId: string
  xhrGroup: string
}): ServiceResponse<ThirdPartyApiCallLog[]> {
  return xhr.get(Endpoints.callLogs(entityIdentifier, appId), { group: xhrGroup })
}
