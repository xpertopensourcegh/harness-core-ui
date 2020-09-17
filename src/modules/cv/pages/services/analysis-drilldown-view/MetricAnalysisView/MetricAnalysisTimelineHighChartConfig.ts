import type { Options } from 'highcharts'
export default function configureTimelineOptions(points: Array<{ x: number; y: number }>): Options {
  const data = points //points && points.length ? points.map(({ x, y }) => ({ x, y: null })) : [{ x: 0, y: null }]
  const series: Highcharts.SeriesLineOptions[] = [{ type: 'line', data }]
  return {
    chart: {
      height: 35,
      type: 'line',
      backgroundColor: '',
      style: {
        fontFamily: 'var(--font-family)'
      }
    },
    credits: { enabled: false },
    title: {
      text: ''
    },
    legend: {
      enabled: false
    },
    xAxis: {
      lineWidth: 1,
      tickLength: 12,
      gridLineWidth: 0,
      title: {
        text: ''
      },
      min: data[0].x,
      max: data[data.length - 1].x,
      tickPositioner: function () {
        const tickPositions: number[] = []
        tickPositions[0] = data[0].x
        tickPositions[1] = data[Math.floor(data.length * 0.33)].x
        tickPositions[2] = data[Math.floor(data.length * 0.67)].x
        tickPositions[3] = data[data.length - 1].x
        return tickPositions
      },
      labels: {
        formatter: function () {
          const timeString = new Date(this.value).toLocaleTimeString()
          const millisecondIndex = timeString.lastIndexOf(':')
          return `${timeString.substring(0, millisecondIndex)}${timeString.substring(millisecondIndex + 3)}`
        },
        y: 25
      }
    },
    yAxis: {
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      title: {
        text: ''
      }
    },
    plotOptions: {
      series: {
        stickyTracking: false
      }
    },
    subtitle: undefined,
    series
  }
}
