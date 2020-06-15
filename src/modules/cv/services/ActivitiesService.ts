import type { ThirdPartyApiCallLog } from '@wings-software/swagger-ts/definitions'
import type { ServiceResponse } from 'modules/common/services/ServiceResponse'
import xhr from '@wings-software/xhr-async'

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
