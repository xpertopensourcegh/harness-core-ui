import type { ThirdPartyApiCallLog } from '@wings-software/swagger-ts/definitions'
import type { ResponseWrapper } from 'modules/common/utils/HelperTypes'
import xhr from '@wings-software/xhr-async'

export const Endpoints = {
  callLogs: (entityIdentifier: string, appId: string) =>
    `https://localhost:9090/api/activities/${encodeURI(entityIdentifier)}/api-call-logs?appId=${appId}`
}

export async function fetchApiCallLogs({
  entityIdentifier,
  appId,
  xhrGroup
}: {
  entityIdentifier: string
  appId: string
  xhrGroup: string
}): Promise<ResponseWrapper<ThirdPartyApiCallLog[]>> {
  return xhr.get(Endpoints.callLogs(entityIdentifier, appId), { group: xhrGroup })
}
