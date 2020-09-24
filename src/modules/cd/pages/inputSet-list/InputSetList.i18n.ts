export default {
  newInputSet: '+ New Input Set',
  inputSet: 'Input Set',
  description: 'Description',
  actions: 'Actions',
  edit: 'Edit',
  clone: 'Clone',
  delete: 'Delete',
  runPipeline: 'Run Pipeline',
  addInputSet: 'Add Input Set',
  confirmDeleteTitle: 'Delete Input Set',
  deleteButton: 'Delete',
  cancel: 'Cancel',
  inputFieldSummary: 'Input Field Summary',
  lastUpdatedBy: 'Last Updated By',
  createdBy: 'Created By',
  inputSetDeleted: (name: string) => `Input Set "${name}" deleted`,
  confirmDelete: (name: string) => `Are you sure want to delete Input Set "${name}"`,
  aboutInputSets:
    'Input sets are collections of variables/values that should be provided to a pipeline before execution.',
  overlayInputSet: 'Overlay Input Set',
  searchInputSet: 'Search Input Set'
}
