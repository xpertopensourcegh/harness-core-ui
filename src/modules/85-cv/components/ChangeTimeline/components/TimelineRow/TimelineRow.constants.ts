export const EventTimelineHighChartsConfig: Highcharts.Options = {
  chart: {
    type: 'scatter',
    renderTo: 'chart',
    height: 20,
    backgroundColor: 'transparent'
  },
  credits: {
    enabled: false
  },
  title: {
    text: ''
  },
  legend: {
    enabled: false
  },
  xAxis: {
    title: {
      text: null
    },
    labels: {
      enabled: false
    },
    tickLength: 0,
    lineWidth: 2,
    lineColor: 'var(--grey-100)',
    gridLineWidth: 0
  },
  yAxis: {
    max: 0,
    min: 0,
    labels: {
      enabled: false
    },
    title: {
      text: null
    },
    tickWidth: 0,
    tickLength: 0,
    maxPadding: 0,
    gridLineWidth: 0,
    lineWidth: 0
  },
  tooltip: {
    outside: true
  },
  plotOptions: {
    scatter: {
      events: {},
      marker: {
        radius: 5
      }
    }
  },
  series: []
}
