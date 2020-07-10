export const timeSeriesChartConfig = {
  chart: {
    zoomType: 'x',
    height: 70,
    backgroundColor: '',
    type: 'line',
    spacing: [4, 2, 4, 2]
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    line: {
      marker: {
        enabled: false
      }
    }
  },
  title: {
    text: ''
  },
  xAxis: {
    type: '',
    labels: {
      enabled: false
    },
    tickLength: 0,
    lineWidth: 0,
    gridLineWidth: 0
  },
  yAxis: {
    title: {
      text: ''
    },
    labels: {
      enabled: false
    },
    lineWidth: 0,
    tickLength: 0,
    gridLineWidth: 0
  },
  series: [
    {
      type: 'line',
      name: 'Average Response Time (ms)',
      zoneAxis: 'x',
      zones: [
        {
          color: 'var(--green-500)',
          value: 6
        },
        {
          color: 'var(--red-500)'
        }
      ],
      data: [
        [2, 0.7537],
        [4, 0.7537],
        [6, 0.7559],
        [8, 0.7631]
      ]
    }
  ],
  annotations: [
    {
      shapes: [
        {
          point: 0.7559,
          type: 'rect',
          width: 200,
          height: 100,
          fill: 'red'
        }
      ]
    }
  ],
  credits: {
    enabled: false
  }
}

export const dummyConfigForTimeline = {
  chart: {
    zoomType: 'x',
    height: 30,
    backgroundColor: '',
    type: 'line',
    spacing: [4, 2, 4, 2]
  },
  xAxis: [
    {
      showEmpty: true,
      min: 5,
      max: 10,
      tickLength: 0,
      lineWidth: 0,
      gridLineWidth: 0
    }
  ],
  yAxis: {
    title: {
      text: ''
    },
    labels: {
      enabled: false
    },
    lineWidth: 0,
    tickLength: 0,
    gridLineWidth: 0
  },
  series: [{}],
  legend: {
    enabled: false
  },
  plotOptions: {
    line: {
      marker: {
        enabled: false
      }
    }
  },
  title: {
    text: ''
  },
  credits: {
    enabled: false
  }
}

export const anomaliesConfig = {
  name: 'ACTIVITY VERIFICATION',
  from: new Date().toDateString(),
  to: new Date().toDateString(),
  riskScore: 0.8,
  service: 'Delegate',
  environment: 'Production',
  activityIdentifier: 'Build 77',
  activityType: 'Config Change',
  activityDetail: ['TAG 1', 'TAG 2'],
  anomalies: [
    {
      id: 123,
      from: new Date().toDateString(),
      to: new Date().toDateString(),
      DataSources: 'Splunk',
      status: 'Open',
      engine: 'Learning Engine',
      anomaly: 'Performance',
      risk: 0.9,
      duration: '10 mins',
      info: {
        metric: {
          anomalous: [
            {
              id: 1,
              datasourceName: 'APPDYNAMICS',
              name: 'Login',
              metric: 'Throughput',
              options: timeSeriesChartConfig
            },
            {
              id: 2,
              datasourceName: 'Splunk',
              name: 'Login',
              metric: 'Response Time',
              options: timeSeriesChartConfig
            },
            {
              id: 3,
              datasourceName: 'APPDYNAMICS',
              name: 'Checkout',
              metric: 'Stall',
              options: timeSeriesChartConfig
            }
          ],
          all: [
            {
              id: 4,
              datasourceName: 'APPDYNAMICS',
              name: 'Login',
              metric: 'Throughput',
              options: timeSeriesChartConfig
            },
            {
              id: 5,
              datasourceName: 'Splunk',
              name: 'Login',
              metric: 'Response Time',
              options: timeSeriesChartConfig
            },
            {
              id: 6,
              datasourceName: 'APPDYNAMICS',
              name: 'Checkout',
              metric: 'Stall',
              options: timeSeriesChartConfig
            }
          ]
        },
        log: {
          name: ' log data 1 '
        }
      }
    },
    {
      id: 124,
      from: new Date().toDateString(),
      to: new Date().toDateString(),
      DataSources: 'AppD',
      engine: 'Learning Engine',
      status: 'Closed',
      duration: '10 mins',
      risk: 0.3,
      anomaly: 'Performance',
      info: {
        metric: {
          anomalous: [
            {
              id: 7,
              datasourceName: 'APPDYNAMICS',
              name: 'Login',
              metric: 'Response Time',
              options: timeSeriesChartConfig
            },
            {
              id: 8,
              datasourceName: 'Splunk',
              name: 'Login',
              metric: 'Response Time',
              options: timeSeriesChartConfig
            },
            {
              id: 9,
              datasourceName: 'APPDYNAMICS',
              name: 'Checkout',
              metric: 'Stall',
              options: timeSeriesChartConfig
            }
          ],
          all: [
            {
              id: 4,
              datasourceName: 'APPDYNAMICS',
              name: 'Login',
              metric: 'Throughput',
              options: timeSeriesChartConfig
            }
          ]
        },
        log: {
          name: ' log data 2'
        }
      }
    }
  ]
}
