export default {
  harness: 'HARNESS',
  infrastructureProvider: 'INFRASTRUCTURE PROVIDER',
  changeSource: {
    heading: 'CHANGE SOURCES',
    info: 'Change Sources provide the details of deployment and infrastructure change',
    noActivitySource: 'Don’t have a Change Source? ',
    skip: 'Skip to Monitoring Sources',
    content: {
      heading: {
        start: 'Let’s get you started'
      },
      info: 'Select your Change Source'
    }
  },
  monitoringSource: {
    heading: 'MONITORING SOURCES',
    info:
      'Verification Monitoring Sources provide the metrics and log data that CV uses to score the risk of your deployment and infrastructure',
    content: {
      heading: 'Select your Monitoring Source ',
      info:
        'Monitoring Sources provide the metrics and log data that CV uses to score the risk of your deployment and infrastructure'
    }
  },
  verificationJob: {
    heading: 'VERIFICATION JOBS',
    info:
      'Verification Jobs score the risk of changes coming in from Change Sources using data from verification Monitoring Sources.'
  },
  NEXT: 'Next'
}
