export default function getLogAnalysisLineChartOptions(): Highcharts.Options {
  const data = [
    { x: 0, y: Math.random() * 5 },
    { x: 1, y: Math.random() * 5 },
    { x: 2, y: Math.random() * 5 },
    { x: 3, y: Math.random() * 10 },
    { x: 4, y: Math.random() * 5 },
    { x: 5, y: Math.random() * 5 },
    { x: 6, y: Math.random() * 5 },
    { x: 7, y: Math.random() * 5 },
    { x: 8, y: Math.random() * 5 },
    { x: 9, y: Math.random() * 5 },
    { x: 10, y: Math.random() * 5 },
    { x: 11, y: Math.random() * 5 },
    { x: 12, y: Math.random() * 5 },
    { x: 13, y: Math.random() * 6 },
    { x: 14, y: Math.random() * 6 },
    { x: 15, y: Math.random() * 6 }
  ]
  return {
    chart: {
      renderTo: 'chart',
      margin: [0, 10, 0, 10],
      backgroundColor: 'transparent'
    },
    credits: undefined,
    title: {
      text: ''
    },
    legend: {
      enabled: false
    },
    xAxis: {
      labels: { enabled: false },
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      title: {
        text: ''
      }
    },
    yAxis: {
      labels: { enabled: false },
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
      },
      line: {
        marker: {
          enabled: false
        }
      }
    },
    tooltip: {
      outside: true
    },
    subtitle: undefined,
    series: [
      {
        type: 'line',
        name: 'Installation',
        data,
        zoneAxis: 'x',
        zones: [
          {
            value: data[Math.floor(Math.random() * 14)].x,
            color: 'var(--blue-500)'
          },
          {
            color: 'var(--red-500)'
          }
        ]
      }
    ]
  }
}
