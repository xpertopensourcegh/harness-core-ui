import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { PrometheusMonitoringSource } from '../PrometheusMonitoringSource'
import { transformPrometheusDSConfigIntoPrometheusSetupSource } from '../utils'
import type { PrometheusDSConfig } from '../constants'

const MockDSConfig: PrometheusDSConfig = {
  accountId: 'kmpySmUISimoRrJL6NL73w',
  orgIdentifier: 'harness_test',
  projectIdentifier: 'raghu_p',
  productName: 'apm',
  connectorIdentifier: 'prometheus1',
  identifier: 'Prometheus',
  monitoringSourceName: 'Prometheus',
  metricDefinitions: [
    {
      query: 'metric3{container="cv-demo",namespace="cv-demo"}',
      serviceIdentifier: 'cvng',
      envIdentifier: 'qa',
      groupName: 'group2',
      metricName: 'metric3',
      serviceInstanceFieldName: 'cloud_google_com_gke_os_distribution',
      prometheusMetric: 'container_cpu_usage_seconds_total',
      serviceFilter: [{ labelName: 'container', labelValue: 'cv-demo' }],
      envFilter: [{ labelName: 'namespace', labelValue: 'cv-demo' }],
      additionalFilters: [],
      aggregation: 'stddev',
      riskProfile: {
        category: 'Performance',
        metricType: 'ERROR',
        thresholdTypes: ['ACT_WHEN_LOWER', 'ACT_WHEN_HIGHER']
      },
      isManualQuery: false
    },
    {
      query: 'metric2{container="cv-demo",namespace="cv-demo"}',
      serviceIdentifier: 'cvng',
      envIdentifier: 'qa',
      groupName: 'group2',
      metricName: 'metric2',
      serviceInstanceFieldName: 'cloud_google_com_gke_os_distribution',
      prometheusMetric: 'container_cpu_usage_seconds_total',
      serviceFilter: [{ labelName: 'container', labelValue: 'cv-demo' }],
      envFilter: [{ labelName: 'namespace', labelValue: 'cv-demo' }],
      additionalFilters: [],
      aggregation: 'stddev',
      riskProfile: {
        category: 'Performance',
        metricType: 'ERROR',
        thresholdTypes: ['ACT_WHEN_LOWER', 'ACT_WHEN_HIGHER']
      },
      isManualQuery: false
    },
    {
      query: 'metric1{container="cv-demo",namespace="cv-demo",container="cv-demo"}',
      serviceIdentifier: 'cvng',
      envIdentifier: 'qa',
      groupName: 'group1',
      metricName: 'metric1',
      serviceInstanceFieldName: 'app',
      prometheusMetric: 'container_cpu_usage_seconds_total',
      serviceFilter: [{ labelName: 'container', labelValue: 'cv-demo' }],
      envFilter: [{ labelName: 'namespace', labelValue: 'cv-demo' }],
      additionalFilters: [{ labelName: 'container', labelValue: 'cv-demo' }],
      aggregation: 'count',
      riskProfile: { category: 'Errors', metricType: 'ERROR', thresholdTypes: ['ACT_WHEN_HIGHER'] },
      isManualQuery: false
    }
  ],
  type: 'PROMETHEUS'
}

describe('Unit tests for NewRelicMonitoringSources', () => {
  test('Ensure basic render works', async () => {
    const { container, getAllByText } = render(
      <TestWrapper>
        <PrometheusMonitoringSource />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('.bp3-tabs')).not.toBeNull())
    expect(getAllByText('cv.onboarding.monitoringSources.defineMonitoringSource').length).toBe(2)
  })

  test('Ensure edit flow is handled', async () => {
    // withuot data
    expect(
      transformPrometheusDSConfigIntoPrometheusSetupSource({
        accountId: '1234_accountId',
        orgIdentifier: '1234_org',
        projectIdentifier: '1234_project'
      })
    ).toEqual({
      accountId: '1234_accountId',
      identifier: 'Prometheus',
      mappedServicesAndEnvs: new Map([
        [
          'Prometheus Metric',
          {
            isManualQuery: false,
            metricName: 'Prometheus Metric',
            query: ''
          }
        ]
      ]),
      isEdit: false,
      monitoringSourceName: 'Prometheus',
      orgIdentifier: '1234_org',
      productName: 'apm',
      projectIdentifier: '1234_project',
      type: 'PROMETHEUS'
    })
    // with data
    expect(
      transformPrometheusDSConfigIntoPrometheusSetupSource(
        {
          accountId: '1234_accountId',
          orgIdentifier: '1234_org',
          projectIdentifier: '1234_project'
        },
        MockDSConfig
      )
    ).toEqual({
      accountId: 'kmpySmUISimoRrJL6NL73w',
      connectorIdentifier: 'prometheus1',
      connectorRef: {
        label: 'prometheus1',
        value: 'prometheus1'
      },
      identifier: 'Prometheus',
      isEdit: true,
      mappedServicesAndEnvs: new Map([
        [
          'metric3',
          {
            additionalFilter: [],
            aggregator: 'stddev',
            envFilter: [
              {
                label: 'namespace:cv-demo',
                value: 'cv-demo'
              }
            ],
            envIdentifier: {
              label: 'qa',
              value: 'qa'
            },
            groupName: {
              label: 'group2',
              value: 'group2'
            },
            higherBaselineDeviation: true,
            isManualQuery: false,
            lowerBaselineDeviation: true,
            metricName: 'metric3',
            prometheusMetric: 'container_cpu_usage_seconds_total',
            query: 'metric3{container="cv-demo",namespace="cv-demo"}',
            riskCategory: 'Performance/ERROR',
            serviceFilter: [
              {
                label: 'container:cv-demo',
                value: 'cv-demo'
              }
            ],
            serviceIdentifier: {
              label: 'cvng',
              value: 'cvng'
            },
            serviceInstance: 'cloud_google_com_gke_os_distribution'
          }
        ],
        [
          'metric2',
          {
            additionalFilter: [],
            aggregator: 'stddev',
            envFilter: [
              {
                label: 'namespace:cv-demo',
                value: 'cv-demo'
              }
            ],
            envIdentifier: {
              label: 'qa',
              value: 'qa'
            },
            groupName: {
              label: 'group2',
              value: 'group2'
            },
            higherBaselineDeviation: true,
            isManualQuery: false,
            lowerBaselineDeviation: true,
            metricName: 'metric2',
            prometheusMetric: 'container_cpu_usage_seconds_total',
            query: 'metric2{container="cv-demo",namespace="cv-demo"}',
            riskCategory: 'Performance/ERROR',
            serviceFilter: [
              {
                label: 'container:cv-demo',
                value: 'cv-demo'
              }
            ],
            serviceIdentifier: {
              label: 'cvng',
              value: 'cvng'
            },
            serviceInstance: 'cloud_google_com_gke_os_distribution'
          }
        ],
        [
          'metric1',
          {
            additionalFilter: [
              {
                label: 'container:cv-demo',
                value: 'cv-demo'
              }
            ],
            aggregator: 'count',
            envFilter: [
              {
                label: 'namespace:cv-demo',
                value: 'cv-demo'
              }
            ],
            envIdentifier: {
              label: 'qa',
              value: 'qa'
            },
            groupName: {
              label: 'group1',
              value: 'group1'
            },
            higherBaselineDeviation: true,
            isManualQuery: false,
            lowerBaselineDeviation: false,
            metricName: 'metric1',
            prometheusMetric: 'container_cpu_usage_seconds_total',
            query: 'metric1{container="cv-demo",namespace="cv-demo",container="cv-demo"}',
            riskCategory: 'Errors/ERROR',
            serviceFilter: [
              {
                label: 'container:cv-demo',
                value: 'cv-demo'
              }
            ],
            serviceIdentifier: {
              label: 'cvng',
              value: 'cvng'
            },
            serviceInstance: 'app'
          }
        ]
      ]),
      monitoringSourceName: 'Prometheus',
      orgIdentifier: 'harness_test',
      productName: 'apm',
      projectIdentifier: 'raghu_p',
      type: 'PROMETHEUS'
    })
  })
})
