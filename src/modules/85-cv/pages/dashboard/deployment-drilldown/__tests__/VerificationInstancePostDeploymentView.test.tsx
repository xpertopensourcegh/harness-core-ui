import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import get from 'lodash-es/get'
import type { UseGetReturn } from 'restful-react'
import { Container } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import * as cvService from 'services/cv'
import {
  VerificationInstancePostDeploymentView,
  mapMetricsData,
  getSeriesZones
} from '../VerificationInstancePostDeploymentView'

const MockLogData = {
  resource: {
    totalPages: 10,
    totalItems: 100,
    pageItemCount: 10,
    pageSize: 10,
    content: [
      {
        projectIdentifier: '1234_projectIdentifier',
        orgIdentifier: '1234_orgIdentifier',
        environmentIdentifier: '1234_envIdentifier',
        serviceIdentifier: '1234_serviceIdentifier',
        logData: {
          text: '234234234',
          label: '8978yjghfjghf',
          count: 5,
          trend: [
            {
              timestamp: 12143287,
              count: 6
            }
          ],
          tag: 'KNOWN'
        }
      }
    ],
    pageIndex: 0,
    empty: false
  }
}

const MockTimeSeriesData = {
  resource: {
    totalPages: 10,
    totalItems: 100,
    pageItemCount: 10,
    pageSize: 10,
    content: [
      {
        projectIdentifier: '1234_projectIdentifier',
        orgIdentifier: '1234_orgIdentifier',
        environmentIdentifier: '1234_envIdentifier',
        serviceIdentifier: '1234_serviceIdentifier',
        metricType: 'INFRA',
        category: 'PERFORMANCE',
        groupName: 'groupname',
        metricName: 'metricname',
        metricDataList: [
          {
            timestamp: 12143287,
            value: 56,
            risk: 'LOW_RISK'
          }
        ]
      }
    ],
    pageIndex: 0,
    empty: false
  }
}

const MockData = {
  metaData: {},
  resource: {
    activityType: 'KUBERNETES',
    activityId: '1234_asdad',
    activityName: '7 Normal kubernetes events',
    activityStartTime: 1609953840000,
    environmentIdentifier: 'Prod',
    environmentName: null,
    serviceIdentifier: 'todolist',
    endTime: 1609954740000,
    remainingTimeMs: 0,
    overallRisk: 0,
    preActivityRisks: [
      { category: 'Errors', risk: -1.0 },
      { category: 'Performance', risk: 0.0 },
      { category: 'Infrastructure', risk: -1.0 }
    ],
    postActivityRisks: [
      { category: 'Errors', risk: -1.0 },
      { category: 'Performance', risk: 0.0 },
      { category: 'Infrastructure', risk: -1.0 }
    ],
    progressPercentage: 100,
    status: 'VERIFICATION_PASSED'
  },
  responseMessages: []
}

jest.mock('moment', () => {
  const original = jest.requireActual('moment')
  original().__proto__.format = () => 'XX:YY'
  return original
})

jest.mock('@cv/components/ActivitiesTimelineView/ActivitiesTimelineViewSection', () => () => (
  <Container className="activitiestimeline" />
))

jest.mock('react-monaco-editor', () => (props: any) => (
  <Container className="monaco-editor">
    <button className="monaco-editor-onChangebutton" onClick={() => props.onChange('{ "sdfsdffdf": "2132423" }')} />
  </Container>
))

jest.mock('@cv/components/EventDetailsForChange/EventDetailsForChange', () => ({
  ...(jest.requireActual('@cv/components/EventDetailsForChange/EventDetailsForChange') as any),
  EventDetailsForChange: function MockEventDetails() {
    return <Container className="eventDetails" />
  }
}))

describe('VerificationInstancePostDeploymentView', () => {
  test('mapMetricsData works correctly', () => {
    const data = mapMetricsData(
      {
        resource: {
          content: [
            {
              groupName: 'testGroupName',
              metricName: 'testMetricName',
              metricDataList: [
                { timestamp: 1605541814220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605541874220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605541934220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605541994220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605542054220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605542114220, value: 10, risk: 'LOW_RISK' },

                { timestamp: 1605542174220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605542234220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605542294220, value: 10, risk: 'LOW_RISK' }
              ]
            }
          ]
        }
      },
      1605541814220,
      1605542294220
    )
    expect(data[0].transactionName).toEqual('testGroupName')
    expect(data[0].metricName).toEqual('testMetricName')
    expect(get(data[0], 'seriesData[0].series[0].type')).toEqual('line')
  })

  test('getSeriesZones works correctly', () => {
    const zones = getSeriesZones([
      { timestamp: 100, risk: 'LOW_RISK' },
      { timestamp: 200, risk: 'LOW_RISK' },
      { timestamp: 300, risk: 'HIGH_RISK' },
      { timestamp: 400, risk: 'HIGH_RISK' },
      { timestamp: 500, risk: 'LOW_RISK' }
    ])
    expect(zones.length).toEqual(3)
    expect(zones[0].value).toEqual(200)
    expect(zones[1].value).toEqual(400)
    expect(zones[2].value).toEqual(500)
  })

  test('Ensure kubernetes vents link is displayed for a kubernetes event', async () => {
    jest.spyOn(cvService, 'useGetActivityVerificationResult').mockReturnValue({
      data: MockData,
      refetch: jest.fn() as unknown
    } as UseGetReturn<any, any, any, any>)

    const { container } = render(
      <TestWrapper>
        <VerificationInstancePostDeploymentView
          selectedActivityId="1234_activity_id"
          activityStartTime={undefined as unknown as number}
          durationMs={15}
          environmentIdentifier="1234_envIdentifier"
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const button = container.querySelector('[class*="kubernetesButton"]')
    if (!button) {
      throw Error('button was not rendered')
    }
    fireEvent.click(button)
    await waitFor(() => expect(document.body.querySelector('.eventDetails')).not.toBeNull())
  })

  test('Ensure that logs tab is rendered properly', async () => {
    jest.spyOn(cvService, 'useGetActivityVerificationResult').mockReturnValue({
      data: MockData
    } as UseGetReturn<any, any, any, any>)

    const refetchMock = jest.fn()
    jest.spyOn(cvService, 'useGetActivityLogs').mockReturnValue({
      data: MockLogData,
      refetch: refetchMock as unknown
    } as UseGetReturn<any, any, any, any>)

    jest.spyOn(cvService, 'useGetActivityMetrics').mockReturnValue({
      data: MockTimeSeriesData,
      refetch: jest.fn() as unknown
    } as UseGetReturn<any, any, any, any>)

    jest.spyOn(cvService, 'useGetTagCountForActivity').mockReturnValue({
      data: null
    } as UseGetReturn<any, any, any, any>)

    const { container, getByText } = render(
      <TestWrapper>
        <VerificationInstancePostDeploymentView
          selectedActivityId="1234_activity_id"
          activityStartTime={1609946640000}
          durationMs={15}
          environmentIdentifier="1234_envIdentifier"
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    fireEvent.click(getByText('pipeline.verification.analysisTab.logs'))
    await waitFor(() => expect(container.querySelector('[class*="frequencyChart"]')).not.toBeNull())
    fireEvent.click(getByText('2'))
    await waitFor(() => expect(refetchMock).toHaveBeenCalledTimes(1))
  })
})
