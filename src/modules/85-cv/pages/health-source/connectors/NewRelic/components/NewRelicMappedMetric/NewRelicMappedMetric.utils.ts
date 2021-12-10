import type { ResponseListTimeSeriesSampleDTO } from 'services/cv'

export const getOptionsForChart = (
  newRelicTimeSeriesData: ResponseListTimeSeriesSampleDTO | null
): (number | undefined)[][] => {
  return newRelicTimeSeriesData?.data?.map(el => [el?.timestamp, el?.metricValue]) || []
}
