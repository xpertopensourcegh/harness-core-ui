import React, { useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Container } from '@wings-software/uicore'
import type { LogAnalysisClusterChartDTO } from 'services/cv'
import { Risk, RiskValues } from '../../../utils/CommonUtils'

export interface ClusterChartProps {
  data: LogAnalysisClusterChartDTO[]
}

export const mapRisk = (risk?: Risk): Highcharts.PointOptionsObject => {
  switch (risk) {
    case RiskValues.LOW:
      return {
        color: '#F3FFE5',
        marker: {
          lineWidth: 1,
          lineColor: 'var(--green-450)',
          radius: 9
        }
      }
    case RiskValues.MEDIUM:
      return {
        color: 'var(--yellow-500)',
        marker: {
          radius: 7
        }
      }
    case RiskValues.HIGH:
      return {
        color: 'var(--red-500)',
        marker: {
          radius: 7
        }
      }
    default:
      return {}
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
            mapRisk(val.risk)
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
