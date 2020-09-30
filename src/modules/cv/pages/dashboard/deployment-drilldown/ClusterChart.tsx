import React, { useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Container } from '@wings-software/uikit'
import type { LogAnalysisClusterChartDTO } from 'services/cv'
import { getColorValue } from 'modules/common/components/HeatMap/ColorUtils'

export interface ClusterChartProps {
  data: LogAnalysisClusterChartDTO[]
}

export default function ClusterChart({ data }: ClusterChartProps) {
  const chartConfig = useMemo(() => {
    return chartOptions([
      {
        type: 'scatter',
        marker: {
          radius: 8,
          symbol: 'circle'
        },
        data: data.map(val => ({
          x: val.x,
          y: val.y,
          color: getColorValue(val.risk ?? 0)
        }))
      }
    ])
  }, [data])
  return (
    <Container style={{ margin: '0 20%' }}>
      <HighchartsReact highcharts={Highcharts} options={chartConfig} />
    </Container>
  )
}

const chartOptions = (series: Highcharts.SeriesScatterOptions[]) => {
  return {
    chart: {
      renderTo: 'chart',
      height: 170
    },
    credits: {
      enabled: false
    },
    title: {
      text: undefined
    },
    yAxis: {
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      labels: { enabled: false },
      title: {
        enabled: false
      }
    },
    xAxis: {
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      labels: { enabled: false },
      title: {
        enabled: false
      }
    },
    legend: {
      enabled: false
    },
    series,
    tooltip: {
      formatter: function (this: any): any {
        return `<div><p>x: ${this.x}</p><br /><p>y: ${this.y}</p></div>`
      }
    }
  }
}
