export default {
  STEP_ONE: {
    name: 'SPECIFY MANIFEST SERVER',
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
    filePath: 'File/Folder path',
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
