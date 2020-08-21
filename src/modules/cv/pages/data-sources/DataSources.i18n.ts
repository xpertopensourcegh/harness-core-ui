export default {
  addDataSourceTitle: 'Select Data Source',
  editDataSourceTitle: 'Edit Data Source',
  connectors: {
    AppDynamics: {
      title: 'AppDynamics',
      icon: 'service-appdynamics'
    },
    Splunk: {
      title: 'Splunk',
      icon: 'service-splunk-with-name',
      iconSize: 40
    }
  },
  tableColumns: {
    name: 'Name',
    dateCreated: 'Date Created',
    dateModified: 'Date Modified'
  },
  tableActionButtonText: {
    edit: 'Edit',
    view: 'View',
    delete: 'Delete'
  },
  confirmationModalText: {
    titleText: 'Delete Data Source',
    contentText: 'Are you sure you want to delete this Data Source?',
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Delete Data Source'
  },
  editDataSourceButtonText: 'Edit Data Source',
  createDataSourceText: 'New Data Source'
}
