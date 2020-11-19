export default {
  NEW_CONNECTOR: 'New Connector',
  DELEGATE_IN_CLUSTER: 'HARNESS DELEGATE RUNNING IN-CLUSTER',
  DELEGATE_OUT_CLUSTER: 'HARNESS DELEGATE RUNNING OUTSIDE YOUR CLUSTER',
  DELEGATE_IN_CLUSTER_INFO:
    'In this method, you would not have to provide the cluster credentials or master URL. You will be required to install a delegate onto your cluster in next step.',
  DELEGATE_OUT_CLUSTER_INFO:
    'In this method, a harness delegate will you the cluster master URL and credentials to connect to your cluster.',
  STEP_ONE: {
    NAME: 'CONNECTOR DETAILS',
    RECOMMENDED: 'Recommended',
    saveAndContinue: 'CONTINUE'
  },
  STEP_TWO: {
    NAME: 'CONNECTION MODE',
    HEADING: 'Connect via Harness Delegate',
    CONNECTOR_NAME_LABEL: 'Give your Kubernetes Connector a name',
    CONNECTOR_NAME_PLACEHOLDER: 'My Kubernetes Connector 1',
    MASTER_URL_LABEL: 'Master URL',
    HOW_TO_PROCEED: 'How would you like to proceed?'
  },
  STEP_INTERMEDIATE: {
    NAME: 'CREDENTIALS',
    HEADING: 'Credentials',
    masterUrl: 'Master URL'
  },
  STEP_THREE: {
    NAME: 'VERIFY CONNECTION',
    STEPS: {
      ONE: 'Checking for delgates ',
      TWO: 'Establising Connection with the Delegate and Kubernetes',
      THREE: 'Verifying Connection'
    },
    VERIFICATION_TIME_TEXT:
      'This process may takea while. You can close your window or wait until verification is completed.',
    INSTALL: {
      INSTALL_TEXT: 'Install your Delegate',
      SUPPORTED_FORMATS: 'Supported Formats',
      DOWNLOAD_BTN_TEXT: 'Download the Harness Delegate',
      DELEGATE_RUN_INFO:
        'Run the following commands (ensure you have kubectl installed and credentials to access your Kubernetes Cluster):',
      COMMAND: 'kubectl apply -f harness-delegate.yaml'
    }
  },
  Search: 'Search',
  NoConnector: 'No connectors found'
}
