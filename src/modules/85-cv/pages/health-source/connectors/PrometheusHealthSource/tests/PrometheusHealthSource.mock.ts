/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

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
            identifier: 'My Identifier',
            serviceInstanceFieldName: 'alertname',
            prometheusMetric: 'container_cpu_load_average_10s',
            serviceFilter: [
              { labelName: 'container', labelValue: 'cv-demo', queryFilterString: 'container="cv-demo"' }
            ],
            envFilter: [{ labelName: 'namespace', labelValue: 'cv-demo', queryFilterString: 'namespace="cv-demo"' }],
            additionalFilters: null,
            aggregation: 'count',
            sli: { enabled: true },
            analysis: {
              liveMonitoring: { enabled: true },
              deploymentVerification: { enabled: true, serviceInstanceFieldName: 'serviceInstanceFieldName' },
              riskProfile: {
                category: 'Infrastructure',
                metricType: 'INFRA',
                thresholdTypes: ['ACT_WHEN_LOWER', 'ACT_WHEN_HIGHER']
              }
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
  connectorRef: 'prometheusConnector',
  product: {}
}

const mockPromethesuTemplate = {
  type: 'Prometheus',
  identifier: 'prometheus',
  name: 'prometheus',
  spec: {
    connectorRef: '<+input>',
    feature: 'apm',
    metricDefinitions: [
      {
        metricName: 'Prometheus Metric',
        identifier: 'prometheus_metric',
        serviceFilter: [],
        isManualQuery: true,
        query: '<+input>',
        envFilter: [],
        additionalFilters: [],
        groupName: 'g1',
        sli: { enabled: true },
        analysis: {
          riskProfile: { category: 'Performance', metricType: 'ERROR', thresholdTypes: ['ACT_WHEN_HIGHER'] },
          liveMonitoring: { enabled: true },
          deploymentVerification: {
            enabled: true,
            serviceInstanceFieldName: '<+monitoredService.variables.serviceLabelInstance>'
          }
        }
      }
    ]
  }
}
export const MockTemplateQueryData = {
  connectorRef: '<+input>',
  isEdit: true,
  healthSourceList: [mockPromethesuTemplate],
  serviceRef: '<+input>',
  environmentRef: 'prod',
  monitoredServiceRef: { name: 'prometheus', identifier: 'prometheus' },
  existingMetricDetails: mockPromethesuTemplate,
  healthSourceName: 'prometheus',
  healthSourceIdentifier: 'prometheus',
  sourceType: 'Prometheus',
  product: { label: 'apm', value: 'Prometheus' }
}

export const submitTemplateData = [
  {
    ...MockTemplateQueryData
  },
  {
    ...mockPromethesuTemplate
  }
]

export const MockManualQueryDataWithoutIdentifier = {
  ...MockManualQueryData,
  healthSourceList: [
    {
      ...MockManualQueryData.healthSourceList[0],
      spec: {
        ...MockManualQueryData.healthSourceList[0].spec,
        metricDefinitions: [
          {
            ...MockManualQueryData.healthSourceList[0].spec.metricDefinitions[0],
            identifier: undefined
          }
        ]
      }
    }
  ]
}

export const MockManualQueryDataForCreate = {
  ...MockManualQueryData,
  isEdit: false,
  healthSourceList: []
}

export const MockManualQueryDataForIdentifierCheck = {
  ...MockManualQueryData,
  healthSourceList: [
    {
      ...MockManualQueryData.healthSourceList[0],
      spec: {
        ...MockManualQueryData.healthSourceList[0].spec,
        metricDefinitions: [
          {
            ...MockManualQueryData.healthSourceList[0].spec.metricDefinitions[0],
            metricName: 'Test 1',
            identifier: 'aa'
          },
          {
            ...MockManualQueryData.healthSourceList[0].spec.metricDefinitions[0],
            metricName: 'Test 2',
            identifier: 'aa'
          }
        ]
      }
    }
  ]
}
