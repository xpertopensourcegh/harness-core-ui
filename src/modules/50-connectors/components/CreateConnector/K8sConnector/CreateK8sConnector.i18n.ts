export default {
  STEP_THREE: {
    STEPS: {
      ONE: 'Checking for delgates ',
      TWO: 'Establising Connection with the Delegate and Kubernetes',
      THREE: 'Verifying Connection'
    },
    VERIFICATION_TIME_TEXT:
      'This process may take a while. You can close your window or wait until verification is completed.',
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
