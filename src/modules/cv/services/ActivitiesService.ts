import type { ThirdPartyApiCallLog } from '@wings-software/swagger-ts/definitions'
import type { ResponseWrapper } from 'modules/common/utils/HelperTypes'
import xhr from '@wings-software/xhr-async'

export async function fetchApiCallLogs({
  stateExecutionId,
  queryParams = '',
  xhrGroup
}: {
  stateExecutionId: string
  queryParams: string
  xhrGroup: string
}): Promise<ResponseWrapper<ThirdPartyApiCallLog[]>> {
  const url = `https://localhost:9090/api/activities/${encodeURI(stateExecutionId)}/api-call-logs?${queryParams}`
  return xhr.get(url, { group: xhrGroup })
}
