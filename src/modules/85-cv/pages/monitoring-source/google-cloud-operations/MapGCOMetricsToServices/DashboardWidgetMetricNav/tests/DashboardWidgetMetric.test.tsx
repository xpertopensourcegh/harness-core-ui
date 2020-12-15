import React from 'react'
import { waitFor, render, fireEvent } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import { Classes } from '@blueprintjs/core'
import * as cvService from 'services/cv'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { TestWrapper } from '@common/utils/testUtils'
import { DashboardWidgetMetricNav } from '../DashboardWidgetMetricNav'

const MockDashboards: cvService.StackdriverDashboardDTO[] = [
  {
    name: 'dashboard_1',
    path: '/dashboard_1/12'
  },
  {
    name: 'dashboard_2',
    path: '/dashboard_2/23'
  }
]

// const MockWidgetResponse = [
//   {
//     id: 'solo-dolo',
//     isExpanded: true,
//     hasCaret: true,
//     label: 'solo-dolo',
//     childNodes: [
//       { id: 'sdfsd', label: 'sdfsdf', nodeData: '{}' },
//       { id: '1', label: '1', nodeData: '{}' },
//       { id: '2', label: '2', nodeData: '{}' }
//     ]
//   },
//   {
//     id: 'semi-auto',
//     label: 'semi-auto',
//     isExpanded: false,
//     hasCaret: true,
//     childNodes: [
//       { id: '3', label: 'sdfsdf', nodeData: '{}' },
//       { id: '4', label: '4', nodeData: '{}' },
//       { id: '5', label: '5', nodeData: '{}' }
//     ]
//   }
// ]

const MockWidgetResponse: cvService.StackdriverDashboardDetail[] = [
  {
    widgetName: 'widget_1',
    dataSetList: [
      {
        metricName: 'metric_1',
        timeSeriesQuery: { query: '234242' }
      },
      {
        metricName: 'metric_2',
        timeSeriesQuery: { query: '345345345' }
      },
      {
        metricName: 'metric_3',
        timeSeriesQuery: { query: '7578768678' }
      }
    ]
  },
  {
    widgetName: 'bad_widget'
  },
  {
    dataSetList: []
  },
  {
    widgetName: 'widget_2',
    dataSetList: [
      {
        metricName: 'metric_4',
        timeSeriesQuery: { query: '5654grt46' }
      }
    ]
  }
]

const MockWidgetResponse2: cvService.StackdriverDashboardDetail[] = [
  {
    widgetName: 'widget_3',
    dataSetList: [
      {
        metricName: 'metric_5',
        timeSeriesQuery: { query: '9sd9f80' }
      }
    ]
  }
]

const MockConnectorIdentifier = '1234_connectorIdentifier'

describe('unit tests for dashboard widget metric', () => {
  test('Ensure content is rendered', async () => {
    const useGetStackdriverDashboardDetailSpy = jest.spyOn(cvService, 'useGetStackdriverDashboardDetail')
    useGetStackdriverDashboardDetailSpy.mockReturnValue({
      data: { resource: MockWidgetResponse }
    } as UseGetReturn<any, unknown, any, unknown>)
    const mockMetricSelect = jest.fn()
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVActivitySourceEditSetup({
          ...accountPathProps,
          ...projectPathProps,
          activitySource: ':activitySource',
          activitySourceId: ':activitySourceId'
        })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG',
          activitySource: '1234_activitySource',
          activitySourceId: '1234_sourceId'
        }}
      >
        <DashboardWidgetMetricNav
          gcoDashboards={MockDashboards}
          connectorIdentifier={MockConnectorIdentifier}
          onSelectMetric={mockMetricSelect}
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(getByText('widget_1')).not.toBeNull()
    const firstMetric = getByText('metric_2')
    expect(firstMetric).not.toBeNull()

    if (!firstMetric) {
      throw Error('First metric was not rendered.')
    }
    fireEvent.click(firstMetric)
    await waitFor(() => expect(mockMetricSelect).toHaveBeenCalledTimes(2))
    expect(mockMetricSelect).toHaveBeenNthCalledWith(
      1,
      MockWidgetResponse[0]?.dataSetList?.[0].metricName,
      JSON.stringify(MockWidgetResponse[0]?.dataSetList?.[0].timeSeriesQuery),
      MockWidgetResponse[0]?.widgetName
    )

    const secondDashboard = container.querySelectorAll(`li.${Classes.TREE_NODE} .bp3-tree-node-content svg`)
    useGetStackdriverDashboardDetailSpy.mockReturnValue({
      data: { resource: MockWidgetResponse2 }
    } as UseGetReturn<any, unknown, any, unknown>)
    expect(secondDashboard.length).toBe(4)
    fireEvent.click(secondDashboard[3])

    await waitFor(() => expect(getByText(MockWidgetResponse2[0]?.widgetName as string)).not.toBeNull())
  })
})
