export default {
  addPrimarySourceLable: '+ Add Primary Artifact',
  addSideCarLable: '+ Add Sidecar',
  primaryLabel: 'Primary Artifact',
  sidecarLabel: 'Sidecar',
  modalHeading: 'Select your artifact server type',
  modalSubHeading: 'Start by selecting your artifact server type.',
  specifyArtifactServer: 'SPECIFY ARTIFACT SERVER',
  existingDocker: {
    connectorLabel: 'Docker artifact server',
    connectorPlaceholder: 'Select docker artifact server',
    imageName: 'Docker image path',
    imageNamePlaceholder: 'Enter the docker artifact path here',
    sidecarId: 'Give your sidecar artifact a name',
    sidecarIdPlaceholder: 'Specify artifact identifier name',
    addnewConnector: 'New Artifact Server',
    editModalTitle: 'Artifact Source Configuration',
    save: 'Save',
    submit: 'Submit'
  },
  artifactTable: {
    type: 'TYPE',
    server: 'SERVER',
    artifactSource: 'ARTIFACT SOURCE CONFIGURATION',
    imagePath: 'IMAGE PATH'
  },
  validation: {
    connectorId: 'Docker artifact server is a required field',
    imagePath: 'Image path is a required field',
    sidecarId: 'Sidecar identifier is a required field'
  },
  info:
    'Specify the locations of the artifacts for this service. Harness will fetch the artifacts at the time of deployments. For every pipeline execution, you will specify the build/tag that you want to deploy. Leave the artifacts section empty if your artifactsd are referenced in the manifest files.'
}
