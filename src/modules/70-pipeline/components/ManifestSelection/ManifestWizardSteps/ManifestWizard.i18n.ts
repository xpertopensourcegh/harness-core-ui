export default {
  STEP_ONE: {
    name: 'SPECIFY MANIFEST SERVER',
    addnewConnector: 'New Manifest Server',
    idPlaceholder: 'Give name to your manifest config',
    select: 'GIT Server',
    gitServerPlaceholder: 'Select GIT Server',
    title: 'Source Repository',
    saveAndContinue: 'Save and Continue'
  },
  STEP_TWO: {
    name: 'MANIFEST SOURCE',
    title: 'Configure Manifest Source',
    manifestInputType: 'Manifest Format',
    manifestIdentifier: 'Identifier can only contain alphanumerics, _ and $',
    filePath: 'File/Folder path',
    filePathPlaceholder: 'Enter overrides file path',
    fetchValue: 'Branch Name',
    manifestId: 'Manifest Identifier',
    gitFetchTypeLabel: 'Commit ID',
    branchLabel: 'Branch',
    branchPlaceholder: 'Enter branch name here',
    commitLabel: 'Commit ID',
    commitPlaceholder: 'Enter Commit ID here',
    back: 'Back',
    submit: 'Submit'
  },
  MANIFEST_TYPES: [
    {
      label: 'Kubernetes Resources Specs in YAML format'
    },
    {
      label: 'Values Overrides'
    }
  ],
  gitFetchTypes: [
    {
      label: 'Latest from Branch'
    },
    {
      label: 'Specific Commit ID'
    }
  ],
  validation: {
    gitServer: 'Git server is a required field',
    identifier: 'Manifest Identifier is a required field',
    manifestType: 'Manifest format is a required field',
    filePath: 'Manifest file path is a required field'
  }
}
