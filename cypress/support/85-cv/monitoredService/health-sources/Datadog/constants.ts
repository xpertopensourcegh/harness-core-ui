/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

const projectIdentifier = 'project1'
const orgIdentifier = 'default'
const accountId = 'accountId'
const dataSourceType = 'DATADOG_METRICS'
const selectedDashboardId = 'gas-53u-ruk'
const configuredMetric = 'datadog.agent.python.version'
export const connectorIdentifier = 'datadog'
export const selectedDashboardName = "praveen's Timeboard 5 Apr 2019 18:16"

export const dashboards = {
  dashboardsAPI: `/cv/api/datadog-metrics/dashboards?routingId=${accountId}&accountId=${accountId}&projectIdentifier=${projectIdentifier}&orgIdentifier=${orgIdentifier}&connectorIdentifier=${connectorIdentifier}&pageSize=7&offset=0&tracingId=*`,
  dashboardsResponse: {
    status: 'SUCCESS',
    data: {
      totalPages: 2,
      totalItems: 14,
      pageItemCount: 7,
      pageSize: 7,
      content: [
        { id: 'a97-8cs-426', name: 'test', path: '/dashboard/a97-8cs-426/test' },
        {
          id: 'c8p-tpb-fn4',
          name: "praveen's Screenboard 11 Apr 2019 17:46",
          path: '/dashboard/c8p-tpb-fn4/praveens-screenboard-11-apr-2019-1746'
        },
        {
          id: 'iph-s8x-tu9',
          name: "pranjal's Timeboard 7 May 2019 15:32",
          path: '/dashboard/iph-s8x-tu9/pranjals-timeboard-7-may-2019-1532'
        },
        {
          id: 'gas-53u-ruk',
          name: "praveen's Timeboard 5 Apr 2019 18:16",
          path: '/dashboard/gas-53u-ruk/praveens-timeboard-5-apr-2019-1816'
        },
        {
          id: 'vxi-z6n-udt',
          name: "praveen's Timeboard 20 Dec 2018 12:25",
          path: '/dashboard/vxi-z6n-udt/praveens-timeboard-20-dec-2018-1225'
        },
        {
          id: '8i3-d5k-7wq',
          name: "parnian's Timeboard 18 Jul 2018 15:05",
          path: '/dashboard/8i3-d5k-7wq/parnians-timeboard-18-jul-2018-1505'
        },
        {
          id: 'jgw-pbc-evf',
          name: "praveen's Timeboard 18 Jul 2018 15:01",
          path: '/dashboard/jgw-pbc-evf/praveens-timeboard-18-jul-2018-1501'
        }
      ],
      pageIndex: 0,
      empty: false
    },
    metaData: null,
    correlationId: 'eafd4a53-f439-4202-91ae-6d59efa2195c'
  }
}

export const metrics = {
  getMetricsCall: `/cv/api/metric-pack?routingId=${accountId}&projectIdentifier=${projectIdentifier}&orgIdentifier=${orgIdentifier}&accountId=${accountId}&dataSourceType=${dataSourceType}`,
  getMetricsResponse: {
    metaData: {},
    resource: [
      {
        uuid: '5r4EUPHhRFaXtb6L7IHAkA',
        accountId: '${accountId}',
        orgIdentifier,
        projectIdentifier: 'Harshil',
        dataSourceType,
        identifier: 'Errors',
        category: 'Errors',
        metrics: [
          {
            name: 'Errors',
            type: 'ERROR',
            path: null,
            validationPath: null,
            responseJsonPath: null,
            validationResponseJsonPath: null,
            thresholds: [],
            included: false
          }
        ],
        thresholds: null
      },
      {
        uuid: 'MGTNKXwYTrGfC27sch_u4Q',
        accountId: '${accountId}',
        orgIdentifier,
        projectIdentifier: 'Harshil',
        dataSourceType,
        identifier: 'Infrastructure',
        category: 'Infrastructure',
        metrics: [
          {
            name: 'Infrastructure',
            type: 'INFRA',
            path: null,
            validationPath: null,
            responseJsonPath: null,
            validationResponseJsonPath: null,
            thresholds: [],
            included: false
          }
        ],
        thresholds: null
      },
      {
        uuid: 'yqsrmlaBR-2Y4oawK9iYaQ',
        accountId: '${accountId}',
        orgIdentifier,
        projectIdentifier: 'Harshil',
        dataSourceType,
        identifier: 'Performance',
        category: 'Performance',
        metrics: [
          {
            name: 'Throughput',
            type: 'THROUGHPUT',
            path: null,
            validationPath: null,
            responseJsonPath: null,
            validationResponseJsonPath: null,
            thresholds: [],
            included: false
          },
          {
            name: 'Response Time',
            type: 'RESP_TIME',
            path: null,
            validationPath: null,
            responseJsonPath: null,
            validationResponseJsonPath: null,
            thresholds: [],
            included: false
          },
          {
            name: 'Other',
            type: 'ERROR',
            path: null,
            validationPath: null,
            responseJsonPath: null,
            validationResponseJsonPath: null,
            thresholds: [],
            included: false
          }
        ],
        thresholds: null
      }
    ],
    responseMessages: []
  }
}

export const metricTags = {
  getMetricsTags: `/cv/api/datadog-metrics/metric-tags?routingId=${accountId}&projectIdentifier=${projectIdentifier}&orgIdentifier=${orgIdentifier}&accountId=${accountId}&connectorIdentifier=${connectorIdentifier}&tracingId=*&metric=datadog.agent.python.version`,
  getMetricsTagsResponse: {
    status: 'SUCCESS',
    data: ['agent_version_major:7'],
    metaData: null,
    correlationId: 'd5055d0d-e6d2-4ac5-8f29-c373ad9ae893'
  }
}

export const activeMetrics = {
  getActiveMetrics: `/cv/api/datadog-metrics/active-metrics?routingId=${accountId}&projectIdentifier=${projectIdentifier}&orgIdentifier=${orgIdentifier}&accountId=${accountId}&connectorIdentifier=${connectorIdentifier}&tracingId=*`,
  getActiveMetricsResponse: {
    status: 'SUCCESS',
    data: [configuredMetric],
    metaData: null,
    correlationId: 'eb9d6780-8db5-4f51-b476-aac2f63a00d0'
  }
}

export const dashboardDetails = {
  getDashboardDetails: `/cv/api/datadog-metrics/dashboard-details?routingId=${accountId}&projectIdentifier=${projectIdentifier}&orgIdentifier=${orgIdentifier}&accountId=${accountId}&connectorIdentifier=${connectorIdentifier}&tracingId=*&dashboardId=${selectedDashboardId}&path=${selectedDashboardId}`,
  getDashboardDetailsResponse: {
    status: 'SUCCESS',
    data: [
      {
        widgetName: configuredMetric,
        dataSets: [
          {
            name: `avg:${configuredMetric}{kube_service:cv24-7-test-dev-cv-todolist-cv-24-7-appd}`,
            query: `avg:${configuredMetric}{kube_service:cv24-7-test-dev-cv-todolist-cv-24-7-appd}`
          }
        ]
      }
    ],
    metaData: null,
    correlationId: 'd480b740-f160-48d7-910d-3491c557ff40'
  }
}

export const dataDogMonitoredService = {
  status: 'SUCCESS',
  data: {
    createdAt: 1644978191147,
    lastModifiedAt: 1644978191147,
    monitoredService: {
      orgIdentifier,
      projectIdentifier: 'Harshil',
      identifier: 'service1_env1',
      name: 'service1_env1',
      type: 'Application',
      description: '',
      serviceRef: 'service1',
      environmentRef: 'env1',
      environmentRefList: ['env1'],
      tags: {},
      sources: {
        healthSources: [
          {
            name: 'DD new',
            identifier: 'DD_new',
            type: 'DatadogMetrics',
            spec: {
              connectorRef: 'datadog',
              feature: 'Datadog Cloud Metrics',
              metricDefinitions: [
                {
                  identifier: 'DD metric',
                  metricName: 'DD metric',
                  riskProfile: { category: 'Errors', metricType: 'ERROR', thresholdTypes: ['ACT_WHEN_HIGHER'] },
                  analysis: {
                    liveMonitoring: { enabled: false },
                    deploymentVerification: {
                      enabled: true,
                      serviceInstanceFieldName: '',
                      serviceInstanceMetricPath: null
                    },
                    riskProfile: { category: 'Errors', metricType: 'ERROR', thresholdTypes: ['ACT_WHEN_HIGHER'] }
                  },
                  sli: { enabled: false },
                  dashboardId: null,
                  dashboardName: 'group-1',
                  metricPath: 'DD metric',
                  query: `${configuredMetric}{}.rollup(avg, 60)`,
                  groupingQuery: `${configuredMetric}{}.rollup(avg, 60)`,
                  metric: configuredMetric,
                  aggregation: null,
                  serviceInstanceIdentifierTag: '',
                  metricTags: [''],
                  isManualQuery: false,
                  isCustomCreatedMetric: true
                }
              ]
            }
          }
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
  metaData: null,
  correlationId: '88174d93-852a-4ff5-9dce-60b5e43d27cb'
}
