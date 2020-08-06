export default {
  confirmDelete: (name: string) => `Are you sure you want to delete the secret '${name}'?`,
  confirmDeleteTitle: 'Delete Secret',
  btnDelete: 'Delete',
  btnCancel: 'Cancel',
  table: {
    secret: 'SECRET',
    secretManager: 'DETAILS',
    lastActivity: 'LAST ACTIVITY'
  },
  newSecret: {
    button: 'New Secret',
    text: 'Text',
    file: 'File',
    yaml: 'Create via YAML Builder'
  }
}
