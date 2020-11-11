export default {
  validation: {
    name: 'Name is a required field',
    identifier: 'Identifier is required',
    validIdRegex: 'Identifier can only contain alphanumerics, _ and $'
  },
  addDescription: '+ description',
  addTags: '+ tag',
  remove: 'remove',
  description: 'description',
  tags: 'Tags',
  heading: 'Monitoring Source Type',
  name: 'Name your monitoring source',
  selectConnector: 'Select connector',
  NEXT: 'Next',
  AppD: {
    iconLabel: 'AppDynamics',
    connectToMonitoringSource: 'Connect to your AppDynamics monitoring source',
    firstTimeText: 'First time? You can setup a new connector to AppDynamics. It takes 2 minutes.',
    selectProduct: 'Select the AppDyanamics Product that you would like to select applications from',
    createConnector: '+ new AppDynamics Connector',
    product: {
      applicationMonitoring: 'Application Monitoring',
      businessMonitoring: 'Business Performance Monitoring',
      machineMonitoring: 'Machine Monitoring',
      endUserMonitoring: 'End User Moniorting'
    }
  }
}
