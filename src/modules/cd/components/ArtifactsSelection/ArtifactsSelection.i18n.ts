export default {
  addPrimarySourceLable: '+ Add Primary Artifact',
  addSideCarLable: '+ Add Sidecar',
  primaryLabel: 'Primary Artifact',
  sidecarLabel: 'Sidecar',

  artifactTable: {
    type: 'TYPE',
    server: 'SERVER',
    artifactSource: 'ARTIFACT SOURCE CONFIGURATION',
    id: 'ID'
  },
  info:
    'Specify the locations of the artifacts for this service. Harness will fetch the artifacts at the time of deployments. For every pipeline execution, you will specify the build/tag that you want to deploy. Leave the artifacts section empty if your artifactsd are referenced in the manifest files.'
}
