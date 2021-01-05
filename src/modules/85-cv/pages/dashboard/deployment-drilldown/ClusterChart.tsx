import React, { useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Container } from '@wings-software/uicore'
import type { LogAnalysisClusterChartDTO } from 'services/cv'

export interface ClusterChartProps {
  data: LogAnalysisClusterChartDTO[]
}

export const mapRisk = (risk: number): Highcharts.PointOptionsObject => {
  if (risk > 1) {
    risk = risk / 100
  }
  risk = Math.max(Math.min(risk, 1), 0)
  if (risk < 0.3) {
    return {
      color: '#F3FFE5',
      marker: {
        lineWidth: 1,
        lineColor: 'var(--green-450)',
        radius: 9
      }
    }
  } else {
    return {
      color: risk < 0.6 ? 'var(--yellow-500)' : 'var(--red-500)',
      marker: {
        radius: 7
      }
    }
  }
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
        data: data.map(val =>
          Object.assign(
            {},
            {
              x: val.x,
              y: val.y
            },
            mapRisk(val.risk ?? 0)
          )
        )
      }
    ])
  }, [data])
  return (
    <Container style={{ padding: '0 10%' }}>
      <HighchartsReact highcharts={Highcharts} options={chartConfig} />
    </Container>
  )
}

export const chartOptions = (series: Highcharts.SeriesScatterOptions[]) => {
  return {
    chart: {
      renderTo: 'chart',
      spacingRight: 100,
      spacingLeft: 100,
      height: 120
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
        return `<div><p>x: ${this.x && this.x.toFixed(5)}</p><br /><p>y: ${this.y && this.y.toFixed(5)}</p></div>`
      }
    }
  }
}
