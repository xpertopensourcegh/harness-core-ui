export interface IsAnomaliesDataAvailable {
  isTimeSeriesAnomaliesAvailable: boolean
  isLogsAnomaliesAvailable: boolean
  isTotalAnomaliesAvailable: boolean
  isLowestHealthScoreAvailable: boolean
}

export interface AnomaliesCardProps {
  timeRange?: { startTime: number; endTime: number }
  lowestHealthScoreForTimeRange?: number
  timeFormat: string
  serviceIdentifier?: string
  environmentIdentifier?: string
  monitoredServiceIdentifier?: string
}
