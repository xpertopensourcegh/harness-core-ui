export const formFormik = {
  values: {
    type: 'application',
    name: 'Service101_Prod',
    identifier: 'Service101_Prod',
    serviceRef: 'Service101',
    environmentRef: 'Prod',
    sources: {
      healthSources: [],
      changeSources: []
    }
  }
}

export const editModeProps = {
  formik: formFormik,
  tableData: [{ name: 'oldAppd' }],
  isEdit: true,
  rowData: { name: 'appd' }
}

export const createModeProps = {
  formik: formFormik,
  tableData: [],
  isEdit: false,
  rowData: null
}

export const serviceFormik = {
  isEdit: false,
  name: 'Service_101_Prod',
  identifier: 'Service_101_Prod',
  description: '',
  tags: {},
  serviceRef: 'Service_101',
  type: 'Application',
  environmentRef: 'Prod',
  sources: {
    healthSources: [
      {
        name: 'test appd',
        identifier: 'dasdasdasda',
        type: 'AppDynamics',
        spec: {
          applicationName: 'cv-app',
          tierName: 'python-tier',
          feature: 'Application Monitoring',
          connectorRef: 'account.appdtest',
          metricPacks: [{ identifier: 'Errors' }]
        }
      }
    ],
    changeSources: [
      {
        name: 'Harness CD Next Gen',
        identifier: 'harness_cd_next_gen',
        type: 'HarnessCDNextGen',
        enabled: true,
        category: 'Deployment',
        spec: {}
      }
    ]
  },
  dependencies: []
}
