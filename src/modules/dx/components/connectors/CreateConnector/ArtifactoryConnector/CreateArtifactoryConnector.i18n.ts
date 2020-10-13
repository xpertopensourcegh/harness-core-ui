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
    validation: {
      artifactoryServerURL: 'Artifactory URL is required',
      passwordRef: 'Password is required'
    }
  },
  STEP_THREE: {
    NAME: 'VERIFY CONNECTION'
  }
}
