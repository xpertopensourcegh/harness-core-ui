export default {
  pageHeading: 'Map your query to a Harness service and environment',
  thirdPartyCallLogText: 'View Third Party Call Logs',
  addQueryButtonLabel: 'Add Query',
  createNew: 'Create New',
  manuallyInputQueryButtonText: '+ Manually input query',
  addSavedSearchPlaceholder: 'Add Splunk Saved Search',
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
    query: 'Query is required.',
    queryName: 'Query Name is required.',
    serviceIdentifier: 'Service is required.',
    serviceInstanceFieldName: 'Service Instance Field is required.',
    isValidConfig: 'Splunk configuration is invalid. Please fix the query.'
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
  validationResultTitle: 'Validation Result',
  addQueryForm: {
    submitText: 'Submit',
    cancelText: 'Cancel'
  }
}
