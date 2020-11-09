export default {
  type: 'DockerRegistry',
  STEP_ONE: {
    NAME: 'CONNECTOR DETAILS'
  },
  STEP_TWO: {
    NAME: 'AUTHENTICATION',
    Heading: 'Authentication',
    SAVE_CREDENTIALS_AND_CONTINUE: 'SAVE CREDENTIALS AND CONTINUE',
    CONTINUE: 'CONTINUE',
    BACK: 'BACK',
    ENCRYPTED_KEY: 'Encrypte Key',
    AUTH_TYPE: {
      DELEGATE_LABEL: 'Use delegate',
      ENCRYPTED_KEY_LABEL: 'Use encrypted key'
    },
    HOW_TO_PROCEED: 'How would you like to proceed?',
    DELEGATE_SELECTION_LABEL: 'Select Delegate',
    VALIDATION: {
      delegateSelector: 'Delegate Tag is required',
      password: 'Secret key is required'
    }
  },
  STEP_THREE: {
    NAME: 'VERIFY CONNECTION'
  },
  INSTALL_DELEGATE_STEP: 'Install delegate'
}
