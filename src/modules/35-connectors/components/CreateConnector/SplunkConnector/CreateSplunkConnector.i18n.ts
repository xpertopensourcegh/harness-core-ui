export default {
  wizardStepName: {
    connectorDetails: 'Connector Details',
    credentials: 'Credentials'
  },
  connectionDetailsHeader: 'Splunk Connection Details',
  testConnection: 'Test Connection',
  continue: 'Continue',
  close: 'Close',
  back: 'Back',
  connectAndSave: 'Connect and Save',
  verifyConnection: 'Verify connection',
  Url: 'Url',
  Username: 'Username',
  Password: 'Password',
  errorUpdate: 'Unable to update connector',
  errorCreate: 'Unable to create connector',
  showSuccessCreated: (name: string) => `Connector '${name}' created successfully`,
  showSuccessUpdated: (name: string) => `Connector '${name}' updated successfully`
}
