export default {
  confirmDelete: (name: string) => `Are you sure you want to delete the secret '${name}'?`,
  confirmDeleteTitle: 'Delete Secret',
  btnDelete: 'Delete',
  btnCancel: 'Cancel',
  table: {
    secret: 'SECRET',
    secretManager: 'DETAILS',
    lastActivity: 'LAST ACTIVITY',
    status: 'STATUS'
  },
  tags: 'TAGS',
  newSecret: {
    button: 'New Secret',
    text: 'Text',
    file: 'File',
    ssh: 'SSH Credential',
    yaml: 'Create via YAML Builder'
  },
  incompleteSecret: 'Incomplete Secret',
  typeText: 'Text',
  typeFile: 'File',
  typeSSH: 'Execution Credential',
  testconnection: 'TEST CONNECTION',
  stepTitleVerify: 'Verify Connection'
}
