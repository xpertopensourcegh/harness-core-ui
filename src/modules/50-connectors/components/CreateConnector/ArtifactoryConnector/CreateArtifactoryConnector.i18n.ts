export default {
  type: 'ArtifactoryRegistry',
  STEP_ONE: {
    NAME: 'CONNECTOR DETAILS'
  },
  STEP_TWO: {
    NAME: 'AUTHENTICATION',
    Heading: 'Authentication',
    SAVE_CREDENTIALS_AND_CONTINUE: 'SAVE CREDENTIALS AND CONTINUE',
    BACK: 'BACK',
    ArtifactoryServerURL: 'Artifactory URL *',
    Username: 'Username',
    Password: 'Password',
    validation: {
      artifactoryServerURL: 'Artifactory URL is required',
      password: 'Password is required'
    }
  },
  STEP_THREE: {
    NAME: 'VERIFY CONNECTION'
  }
}
