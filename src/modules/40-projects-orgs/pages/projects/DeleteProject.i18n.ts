export default {
  confirmDelete: (name: string) => `Are you sure you want to delete the Project '${name}'?`,
  confirmDeleteTitle: 'Delete Project',
  delete: 'Delete',
  cancel: 'Cancel',
  successMessage: (name: string) => `Project ${name} is deleted`
}
