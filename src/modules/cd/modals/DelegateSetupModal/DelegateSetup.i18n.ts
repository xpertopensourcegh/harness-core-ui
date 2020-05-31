export default {
  DELEGATE_IN_CLUSTER: 'Connect through a harness delegate running in-cluster',
  DELEGATE_OUT_CLUSTER: 'Connect through a harnesss delegate outside your cluster',
  DELEGATE_IN_CLUSTER_INFO:
    'In this method, you would not have to provide the cluster credentials or master URL. You will be required to install a delegate onto your cluster in next step.',
  DELEGATE_OUT_CLUSTER_INFO:
    'In this method, a harness delegate will you the cluster master URL and credentials to connect to your cluster.',
  STEP_ONE: {
    NAME: 'Create a New Kubernetes Connector',
    RECOMMENDED: 'Recommended'
  },
  STEP_TWO: {
    NAME: 'New Kubernetes Connector',
    CONNECTOR_NAME_LABEL: 'Give your Kubernetes Connector a name',
    CONNECTOR_NAME_PLACEHOLDER: 'My Kubernetes Connector 1',
    MASTER_URL_LABEL: 'Master URL',
    MASTER_URL_PLACEHOLDER: '/url'
  },
  STEP_THREE: {
    NAME: 'Verify Connection',
    STEPS: {
      ONE: 'Install Delegate',
      TWO: 'Establising Connection with the Delegate and Kubernetes',
      THREE: 'Checking for heartbeat',
      FOUR: 'Verifying Connection'
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
  }
}
