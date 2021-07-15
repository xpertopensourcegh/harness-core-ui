export const HealthSourceList = [
  {
    name: 'dasdsadasd',
    identifier: 'dasdsadasd',
    type: 'AppDynamics',
    spec: {
      connectorRef: 'AppD_Connector',
      feature: 'Application Monitoring',
      applicationName: 'Harness-Dev',
      tierName: 'manager',
      metricPacks: [{ identifier: 'Performance' }]
    },
    service: 'TestDemo',
    environment: 'TestDemo101'
  },
  {
    name: 'AppD 101',
    identifier: 'AppD_101',
    type: 'AppDynamics' as any,
    spec: {
      connectorRef: 'AppD_Connector_102',
      feature: 'Application Monitoring',
      applicationName: 'Harness-Dev',
      tierName: 'manager',
      metricPacks: [{ identifier: 'Errors' }, { identifier: 'Performance' }]
    },
    service: 'TestDemo',
    environment: 'TestDemo101'
  }
]
