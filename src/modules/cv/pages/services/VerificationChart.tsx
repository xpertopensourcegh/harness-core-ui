import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'

const highchartOptions = () => {
  const distance = 12 * 60 * 60 * 1000
  const start = Date.now()
  const end = start + distance
  const dataPassed = [...Array(20).keys()].map(() => ({
    x: start + Math.floor(Math.random() * distance),
    y: Math.floor(Math.random() * 2)
  }))
  const dataFailed = [...Array(10).keys()].map(() => ({
    x: start + Math.floor(Math.random() * distance),
    y: Math.ceil(Math.random() * 2)
  }))
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
      gridLineWidth: 0,
      title: {
        enabled: false
      },
      categories: ['Functional test', 'Load Test', 'Smoke Test']
    },
    xAxis: {
      type: 'datetime',
      min: start,
      max: end,
      tickWidth: false,
      title: {
        enabled: false
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        name: 'Passed',
        type: 'scatter',
        color: 'var(--green-400)',
        marker: {
          radius: 6
        },
        data: dataPassed
      },
      {
        name: 'Failed',
        type: 'scatter',
        color: 'var(--red-500)',
        marker: {
          symbol: 'circle',
          radius: 6
        },
        data: dataFailed
      }
    ],
    tooltip: {
      formatter: function (): any {
        return `<b>${(this as any)?.series.name}</b>`
      }
    }
  }
}

export default function VerificationChart() {
  return <HighchartsReact highcharts={Highcharts} options={highchartOptions()} />
}
