import type { SeriesScatterOptions } from 'highcharts'

export interface ChangeTimelineProps {
  deploymentSeries?: SeriesScatterOptions
  infrastructureSeries?: SeriesScatterOptions
  incidents?: SeriesScatterOptions
  labelWidth?: number
}
