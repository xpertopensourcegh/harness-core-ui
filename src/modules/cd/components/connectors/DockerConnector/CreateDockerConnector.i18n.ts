export default {
  type: 'DockerRegistry',
  STEP_ONE: {
    NAME: 'CONNECTOR DETAILS'
  },
  STEP_TWO: {
    NAME: 'AUTHENTICATION',
    Heading: 'Authentication',
    SAVE_CREDENTIALS_AND_CONTINUE: 'SAVE CREDENTIALS AND CONTINUE',
    DockerRegistryURL: 'Docker Registry URL',
    validation: {
      dockerUrl: 'Docker Registry URL is required',
      username: 'Username is required'
    }
  },
  STEP_THREE: {
    NAME: 'VERIFY CONNECTION'
  },
  STEP_FOUR: {
    name: 'ARTIFACT SOURCE',
    imageName: 'Docker image path',
    imageNamePlaceholder: 'Enter the docker artifact path here',
    save: 'Save'
  }
}
