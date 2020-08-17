export default {
  STEP_THREE_VERIFICATION_TIME_TEXT: 'STEP_THREE.VERIFICATION_TIME_TEXT',
  STEPS: {
    ONE: 'Install Harness Delegate',
    TWO_HIDDEN: 'Establishing Connection',
    TWO: 'Establishing Connection between Delegate and Kubernetes Cluster',
    THREE: 'Verify Connection'
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
  },
  verifyConnectionText: 'Verify Connection to',
  RETEST: 'RETEST CONNECTION'
}
