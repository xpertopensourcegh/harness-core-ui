export default {
  pageHeading: 'Map your query to a Harness service and environment',
  thirdPartyCallLogText: 'View Third Party Call Logs',
  addQueryButtonLabels: {
    splunkQuery: 'Splunk Query',
    customQuery: 'Custom Query'
  },
  fieldLabels: {
    queryName: 'Query Name',
    query: 'Query',
    eventType: 'Event Type',
    serviceInstanceFieldName: 'Service Instance Field Name',
    service: 'Service',
    environment: 'Environment'
  },
  fieldValidations: {
    envIdentifier: 'Environment is required.',
    eventType: 'Event Type is required.',
    query: 'Query Name is required.',
    serviceIdentifier: 'Service is required.',
    serviceInstanceFieldName: 'Service Instance Field is required.'
  },
  placeholders: {
    queryName: 'Enter Query Name',
    query: 'Enter a query',
    environment: 'Select an Environment',
    serviceInstanceFieldName: {
      noData: 'Please provide a query',
      default: 'Please select instance identifier'
    },
    serviceIdentifier: 'Select a Service'
  },
  errorMessages: {
    noSampleLogs: 'No logs were found for the given query',
    noQueryData: 'No data for the given query'
  },
  nextButton: 'Next',
  validationResultTitle: 'Validation Result'
}
