export default {
  addRepositoryButton: '+ Add Repository',
  addRepositoryText: 'Specify your Git server, repository, branch to sync your entities to',
  addFolderButton: '+ Add Folder',
  saveButton: 'Save',
  cancelButton: 'Cancel',
  validation: {
    gitConnectorId: 'Git Server is required',
    repo: 'Repository name is required',
    branch: 'Branch name is required'
  },
  heading: {
    gitServer: 'GIT SERVER',
    gitrepo: 'REPOSITORY',
    branch: 'BRANCH',
    rootFolders: 'SYNC ROOT FOLDER',
    default: 'DEFAULT',
    description: {
      rootFolders: 'Anything in these folders will be synced to the project',
      default: 'Any new entities created via Harness user interface/apis will be synced to this folder'
    }
  },
  toaster: {
    success: 'Git-sync connector saved successfully',
    error: 'Error while saving git-sync connector'
  },
  placeholders: {
    repoName: 'Repo name',
    brachName: 'Branch name',
    rootFolder: 'Root folder path'
  }
}
