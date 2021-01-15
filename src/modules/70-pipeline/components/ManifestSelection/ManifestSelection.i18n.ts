export default {
  addPrimarySourceLable: '+ Add Manifest',
  addFileLabel: '+ Add File',
  manifestTypeLabelPrimary: 'Manifest/Config File',
  modalHeading: 'Select manifest type',
  modalSubHeading: 'Start by selecting your repository type.',
  existingManifest: {
    connectorLabel: 'Manifest Server',
    connectorPlaceholder: 'Select manifest artifact server',
    manifestId: 'Manifest Identifier',
    manifestIdPlaceholder: 'Give name to your manifest config',
    editModalTitle: 'Manifest Source Configuration',
    branchLabel: 'Branch',
    branchPlaceholder: 'Enter branch name here',
    commitLabel: 'Commit ID',
    commitPlaceholder: 'Enter Commit ID here',
    filePath: 'File/Folder path',
    gitFetchTypeLabel: 'Select Git fetch type',
    filePathPlaceholder: 'Enter overrides file path',
    save: 'Save',
    submit: 'Submit'
  },
  manifestTable: {
    type: 'TYPE',
    server: 'SERVER',
    location: 'LOCATION',
    id: 'ID',
    branch: 'BRANCH',
    commit: 'COMMIT'
  },
  gitFetchTypes: [
    {
      label: 'Latest from Branch'
    },
    {
      label: 'Specific Commit ID'
    }
  ],
  validation: {
    connectorId: 'Docker artifact server is a required field'
  },
  info:
    'Specify the locations of the manifests for this service. Harness will fetch the manifests at the time of deployments. You can also store these manifests locally in the harness file store.'
}
