export default {
  STEP_ONE: {
    name: 'SPECIFY MANIFEST SERVER',
    select: 'Select GIT Server',
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
  ]
}
