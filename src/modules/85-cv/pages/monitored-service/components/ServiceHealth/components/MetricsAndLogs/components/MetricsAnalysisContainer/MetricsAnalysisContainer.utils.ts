import { get } from 'lodash-es'
import type { MetricData, RestResponsePageTimeSeriesMetricDataDTO } from 'services/cv'

export function generatePointsForTimeSeries(
  data: RestResponsePageTimeSeriesMetricDataDTO
  // startTime: number,
  // endTime: number
): RestResponsePageTimeSeriesMetricDataDTO {
  if (!data?.resource?.content?.length) {
    return data
  }

  const content = data.resource.content
  // const timeRange = Math.floor((endTime - startTime) / 60000)
  for (const analysis of content) {
    if (!analysis?.metricDataList?.length) {
      continue
    }

    analysis.metricDataList.sort((a: MetricData, b: MetricData) => {
      if (!a?.timestamp) {
        return b?.timestamp ? -1 : 0
      }
      if (!b?.timestamp) {
        return 1
      }
      return a.timestamp - b.timestamp
    })

    // TODO verify if its required.
    // const filledMetricData: MetricData[] = []
    // let metricDataIndex = 0

    // for (let i = 0; i < timeRange; i++) {
    //   const currTime = startTime + 60000 * i
    //   const instantData = analysis.metricDataList[metricDataIndex]
    //   if (instantData?.timestamp && instantData.timestamp === currTime) {
    //     filledMetricData.push(analysis.metricDataList[metricDataIndex])
    //     metricDataIndex++
    //   } else {
    //     filledMetricData.push({ timestamp: currTime, value: undefined })
    //   }
    // }

    // analysis.metricDataList = filledMetricData
  }

  return data
}

export function getErrorMessage(errorObj?: any): string | undefined {
  return get(errorObj, 'data.detailedMessage') || get(errorObj, 'data.message')
}
