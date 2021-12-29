import type { MutateMethod } from 'restful-react'
import type {
  CustomHealthSampleDataRequest,
  FetchSampleDataQueryParams,
  ResponseObject,
  TimestampInfo
} from 'services/cv'

export const onFetchRecords = async (
  urlPath?: string,
  endTime?: TimestampInfo,
  startTime?: TimestampInfo,
  getSampleData?: MutateMethod<ResponseObject, CustomHealthSampleDataRequest, FetchSampleDataQueryParams, void>,
  onFetchRecordsSuccess?: (data: { [key: string]: { [key: string]: any } }) => void
): Promise<void> => {
  if (!urlPath || !endTime || !startTime) {
    return
  }

  const payload = {
    method: 'GET' as any,
    urlPath,
    endTime,
    startTime
  }
  const recordsvalue = await getSampleData?.(payload)
  if (recordsvalue?.data) {
    onFetchRecordsSuccess?.(recordsvalue?.data)
  }
}
