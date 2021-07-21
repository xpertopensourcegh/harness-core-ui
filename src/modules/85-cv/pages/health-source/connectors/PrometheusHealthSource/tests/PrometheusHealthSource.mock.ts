export const MockManualQueryData = {
  isEdit: true,
  healthSourceList: [
    {
      name: 'prometheus',
      identifier: 'prometheus',
      type: 'Prometheus',
      spec: {
        connectorRef: 'prometheusConnector',
        metricDefinitions: [
          {
            query: 'count(container_cpu_load_average_10s{container="cv-demo",namespace="cv-demo"})',
            serviceIdentifier: 'todolist',
            envIdentifier: 'production',
            isManualQuery: false,
            groupName: 'group1',
            metricName: 'NoLongerManualQuery',
            serviceInstanceFieldName: 'alertname',
            prometheusMetric: 'container_cpu_load_average_10s',
            serviceFilter: [
              { labelName: 'container', labelValue: 'cv-demo', queryFilterString: 'container="cv-demo"' }
            ],
            envFilter: [{ labelName: 'namespace', labelValue: 'cv-demo', queryFilterString: 'namespace="cv-demo"' }],
            additionalFilters: null,
            aggregation: 'count',
            riskProfile: {
              category: 'Infrastructure',
              metricType: 'INFRA',
              thresholdTypes: ['ACT_WHEN_LOWER', 'ACT_WHEN_HIGHER']
            }
          }
        ]
      },
      service: 'todolist',
      environment: 'production'
    }
  ],
  monitoringSourceName: 'todolist',
  monitoredServiceIdentifier: 'todolist',
  healthSourceName: 'prometheus',
  healthSourceIdentifier: 'prometheus',
  sourceType: 'Prometheus',
  connectorRef: {
    label: 'prometheusConnector',
    value: 'prometheusConnector',
    scope: 'project',
    live: true,
    connector: {
      name: 'prometheusConnector',
      identifier: 'prometheusConnector',
      description: null,
      orgIdentifier: 'the_monopoly',
      projectIdentifier: 'conglomerate',
      tags: {},
      type: 'Prometheus',
      spec: { url: 'http://35.226.185.156:8080/', delegateSelectors: [] }
    }
  },
  product: {}
}
