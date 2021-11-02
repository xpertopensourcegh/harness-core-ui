export const mockedMonitoredServiceData = {
  status: 'SUCCESS',
  data: {
    totalPages: 0,
    totalItems: 0,
    pageItemCount: 0,
    pageSize: 100,
    content: [{ name: 'monitored-service-1', identifier: 'monitored-service-identifier' }],
    pageIndex: 0,
    empty: false
  },
  metaData: {},
  correlationId: '3156d84c-bc28-4177-8682-8441876d3449'
}

export const monitoredServiceDataById = {
  status: 'SUCCESS',
  data: {
    createdAt: 1635830142579,
    lastModifiedAt: 1635830142579,
    monitoredService: {
      orgIdentifier: 'default',
      projectIdentifier: 'Harshil',
      identifier: 'test1_env2',
      name: 'test1_env2',
      type: 'Application',
      description: '',
      serviceRef: 'test1',
      environmentRef: 'env2',
      tags: {},
      sources: {
        healthSources: [
          { name: 'health-source-1', identifier: 'health-source-1', spec: {} },
          { name: 'health-source-2', identifier: 'health-source-2', spec: {} }
        ],
        changeSources: [
          {
            name: 'Harness CD Next Gen',
            identifier: 'harness_cd_next_gen',
            type: 'HarnessCDNextGen',
            enabled: true,
            spec: {},
            category: 'Deployment'
          }
        ]
      },
      dependencies: []
    }
  },
  metaData: {},
  correlationId: 'c12bd062-2623-40d9-bf24-668b44dd1ab6'
}

export const expectedMonitoredServiceOptions = [
  {
    label: 'monitored-service-1',
    value: 'monitored-service-identifier'
  }
]

export const expectedHealthSourcesOptions = [
  {
    label: 'health-source-1',
    value: 'health-source-1'
  },
  {
    label: 'health-source-2',
    value: 'health-source-2'
  }
]
