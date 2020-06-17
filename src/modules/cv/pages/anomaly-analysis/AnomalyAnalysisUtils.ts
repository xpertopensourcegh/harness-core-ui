export const anomaliesConfig = {
  name: 'Activity Verification',
  from: new Date().toLocaleDateString(),
  to: new Date().toLocaleDateString(),
  riskScore: 0.8,
  service: 'Delegate',
  environment: 'Production',
  activityIdentifier: 'Build 77',
  activityType: 'Config Change',
  anomalies: [
    {
      from: new Date().toLocaleDateString(),
      to: new Date().toLocaleDateString(),
      DataSources: 'Splunk',
      status: 'open',
      info: {
        metric: {
          name: ' Metric data 1 '
        },
        log: {
          name: ' log data 1 '
        }
      }
    },
    {
      from: new Date().toLocaleDateString(),
      to: new Date().toLocaleDateString(),
      DataSources: 'Splunk',
      status: 'closed',
      info: {
        metric: {
          name: ' Metric data 2 '
        },
        log: {
          name: ' log data 2'
        }
      }
    }
  ]
}
