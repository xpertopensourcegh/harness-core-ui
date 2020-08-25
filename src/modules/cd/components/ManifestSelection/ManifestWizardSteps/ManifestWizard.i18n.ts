export default {
  STEP_ONE: {
    name: 'SPECIFY MANIFEST SERVER',
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
    manifestId: 'Maniest Identifier',
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
  ]
}
