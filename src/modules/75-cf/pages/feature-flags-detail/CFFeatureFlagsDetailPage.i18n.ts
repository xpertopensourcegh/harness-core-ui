export default {
  env: 'Environment',
  flagCreated: 'Feature Flag Created Successfully',
  changeEditEnv: (editEnv: string) => `Flag is currently ${editEnv} for this environment`,
  edit: 'Edit',
  delete: 'Delete',
  archive: 'Archive',
  descOptional: 'Description (optional)',
  flag: 'Flag',
  variation: 'Variation',
  boolean: 'Boolean',
  multivariate: 'Multivariate',
  editVariations: {
    editVariationHeading: 'Edit Variations',
    true: 'True',
    false: 'False',
    defaultRules: 'Default rules for the flag',
    defaultRulesDesc: "Changes will only apply to newly created environments. Existing environments won't be affected",
    defaultFlagOn: 'If the flag is ON, serve',
    defaultFlagOff: 'If the flag is OFF, serve',
    applyEnv: 'Also apply to existing enviroments'
  },
  save: 'Save',
  cancel: 'Cancel',
  targeting: 'Targeting',
  activity: 'Activity Log',
  editRules: 'Edit Rules',
  created: 'Created',
  modified: 'Modified',
  owner: 'Owner',
  creator: 'Creator',
  variations: 'Variations',
  prerequisites: 'Prerequisites',
  prerequisitesWithDesc: "Prerequisites (what's required before the flag is turned on)",
  workflows: 'Workflows',
  workflowsWithDesc: 'Workflows (streamline and automate tasks)',
  addPrerequisites: {
    addPrerequisitesHeading: 'Add Prerequisites',
    addPrerequisitesDesc: 'The following must be met before your flag can be enabled',
    selectFlag: 'Select a Flag',
    selectVariation: 'Select a Variation'
  },
  editDetails: {
    editDetailsHeading: 'Edit Flag Details',
    nameLabel: 'Name',
    tags: 'Tags',
    permaFlag: 'This is a permanent flag'
  }
}
