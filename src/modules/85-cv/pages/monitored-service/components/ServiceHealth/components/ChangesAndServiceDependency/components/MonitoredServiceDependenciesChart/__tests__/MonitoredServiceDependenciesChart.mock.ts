export const mockedServiceDependencies = {
  metaData: {},
  resource: {
    nodes: [
      {
        identifierRef: 'service106_Test_env_102',
        serviceRef: 'service106',
        environmentRef: 'Test_env_102',
        riskScore: -1,
        riskLevel: 'NO_ANALYSIS',
        anomalousMetricsCount: 0,
        anomalousLogsCount: 0,
        changeCount: 0
      },
      {
        identifierRef: 'Test_Service_103_Test_env_102',
        serviceRef: 'Test_Service_103',
        environmentRef: 'Test_env_102',
        riskScore: -1,
        riskLevel: 'NO_ANALYSIS',
        anomalousMetricsCount: 0,
        anomalousLogsCount: 0,
        changeCount: 0
      },
      {
        identifierRef: 'service105_Test_env_102',
        serviceRef: 'service105',
        environmentRef: 'Test_env_102',
        riskScore: -1,
        riskLevel: 'NO_ANALYSIS',
        anomalousMetricsCount: 0,
        anomalousLogsCount: 0,
        changeCount: 0
      },
      {
        identifierRef: 'service107_Test_env_102',
        serviceRef: 'service107',
        environmentRef: 'Test_env_102',
        riskScore: -1,
        riskLevel: 'NO_ANALYSIS',
        anomalousMetricsCount: 0,
        anomalousLogsCount: 0,
        changeCount: 0
      },
      {
        identifierRef: 'Test_Service_104_Test_env_102',
        serviceRef: 'Test_Service_104',
        environmentRef: 'Test_env_102',
        riskScore: 0,
        riskLevel: 'LOW',
        anomalousMetricsCount: 0,
        anomalousLogsCount: 0,
        changeCount: 0
      }
    ],
    edges: [
      {
        from: 'service106_Test_env_102',
        to: 'Test_Service_104_Test_env_102'
      },
      {
        from: 'service105_Test_env_102',
        to: 'Test_Service_104_Test_env_102'
      },
      {
        from: 'service107_Test_env_102',
        to: 'Test_Service_104_Test_env_102'
      },
      {
        from: 'Test_Service_103_Test_env_102',
        to: 'Test_Service_104_Test_env_102'
      }
    ]
  },
  responseMessages: []
}

export const mockedDependenciesResults = {
  data: [
    {
      from: 'service106_Test_env_102',
      to: 'Test_Service_104_Test_env_102'
    },
    {
      from: 'service105_Test_env_102',
      to: 'Test_Service_104_Test_env_102'
    },
    {
      from: 'service107_Test_env_102',
      to: 'Test_Service_104_Test_env_102'
    },
    {
      from: 'Test_Service_103_Test_env_102',
      to: 'Test_Service_104_Test_env_102'
    }
  ],
  nodes: [
    {
      icon: 'cd-main',
      id: 'service106_Test_env_102',
      name: 'service106',
      status: 'NO_ANALYSIS'
    },
    {
      icon: 'cd-main',
      id: 'Test_Service_103_Test_env_102',
      name: 'Test_Service_103',
      status: 'NO_ANALYSIS'
    },
    {
      icon: 'cd-main',
      id: 'service105_Test_env_102',
      name: 'service105',
      status: 'NO_ANALYSIS'
    },
    {
      icon: 'cd-main',
      id: 'service107_Test_env_102',
      name: 'service107',
      status: 'NO_ANALYSIS'
    },
    {
      icon: 'cd-main',
      id: 'Test_Service_104_Test_env_102',
      name: 'Test_Service_104',
      status: 'LOW'
    }
  ]
}
