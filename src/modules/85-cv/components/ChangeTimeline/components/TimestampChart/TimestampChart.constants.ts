export const TimestampChartHighchartOptions: Highcharts.Options = {
  chart: {
    height: 35,
    type: 'line',
    backgroundColor: ''
  },
  credits: { enabled: false },
  title: {
    text: ''
  },
  legend: {
    enabled: false
  },
  xAxis: {
    lineWidth: 0,
    tickLength: 0,
    gridLineWidth: 0,
    title: {
      text: ''
    },
    labels: {
      formatter: function () {
        const timeString = new Date(this.value).toLocaleTimeString()
        const millisecondIndex = timeString.lastIndexOf(':')
        return `${timeString.substring(0, millisecondIndex)}${timeString.substring(millisecondIndex + 3)}`
      },
      y: 0,
      style: {
        color: 'var(--grey-300)'
      }
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
  series: []
}
