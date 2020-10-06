export default {
  overview: 'OVERVIEW',
  newBuild: '+ New Build',
  featureFlag: 'Feature Flags',
  noFeatureFlags: 'There are currently no feature flags',
  searchInputFlag: 'Find a feature flag by Name, ID or Description',
  drawerFilter: 'Filters',
  saveFilters: 'Save Filters',
  details: 'Details',
  status: 'Status',
  results: 'Results',
  owners: 'Owners',
  tags: 'Tags',
  boolean: 'Boolean',
  multivariate: 'Multivariate',
  variations: 'variations',
  delete: 'Delete',
  created: 'Created',
  cancel: 'Cancel',
  selectEnv: 'Select environment',
  edit: 'Edit',
  deleteDialog: {
    textSubject: (flagName: string) => `Are you sure you want to delete ${flagName} flag?`,
    textHeader: 'Delete Flag'
  }
}
