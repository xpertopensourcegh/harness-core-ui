import type { PointMarkerOptionsObject, SeriesScatterOptions } from 'highcharts'
export interface TimelineRowProps {
  labelWidth?: number
  timelineSeries?: SeriesScatterOptions[]
  labelName: string
  min?: number
  max?: number
  isLoading?: boolean
  noDataMessage?: string | null
}

export interface PointMarkerOptionsObjectCustom extends PointMarkerOptionsObject {
  custom: {
    count?: number
    startTime: number
    endTime: number
    color: string
    toolTipLabel: string
  }
}
