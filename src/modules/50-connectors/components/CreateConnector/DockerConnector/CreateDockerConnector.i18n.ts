export default {
  type: 'DockerRegistry',
  STEP_ONE: {
    NAME: 'CONNECTOR DETAILS'
  },
  STEP_TWO: {
    NAME: 'AUTHENTICATION',
    Heading: 'Authentication',
    SAVE_CREDENTIALS_AND_CONTINUE: 'SAVE CREDENTIALS AND CONTINUE',
    BACK: 'BACK',
    DockerRegistryURL: 'Docker Registry URL',
    validation: {
      dockerUrl: 'Docker Registry URL is required',
      username: 'Username is required',
      passwordRef: 'Password is required'
    }
  },
  STEP_THREE: {
    NAME: 'VERIFY CONNECTION'
  }
}
