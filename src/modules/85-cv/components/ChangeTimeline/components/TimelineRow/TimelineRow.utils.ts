import type { SeriesScatterOptions } from 'highcharts'
import { cloneDeep } from 'lodash-es'
import { EventTimelineHighChartsConfig } from './TimelineRow.constants'

export function getEventTimelineConfig(
  series: SeriesScatterOptions[],
  onClickDataPoint?: () => void,
  onClickPlot?: () => void
): Highcharts.Options {
  const scatterPlotConfigObject = cloneDeep(EventTimelineHighChartsConfig)
  scatterPlotConfigObject.series = series

  if (scatterPlotConfigObject.plotOptions?.scatter?.events) {
    scatterPlotConfigObject.plotOptions.scatter.events.click = onClickDataPoint
  }

  if (scatterPlotConfigObject.chart?.events) {
    scatterPlotConfigObject.chart.events.click = onClickPlot
  }

  return scatterPlotConfigObject
}
