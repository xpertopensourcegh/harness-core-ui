import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import { Container } from '@wings-software/uikit'
import { Classes } from '@blueprintjs/core'
import * as cvService from 'services/cv'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import ServiceHeatMap from '../ServiceHeatMap'

jest.mock('../../analysis-drilldown-view/MetricAnalysisView/MetricAnalysisView', () => ({
  MetricAnalysisView: function MockComponent() {
    return <Container className="metricAnalysisView" />
  }
}))
jest.mock('../../analysis-drilldown-view/LogAnalysisView/LogAnalysisView', () => () => (
  <Container className="logAnalysisView" />
))

jest.mock('@common/components/HeatMap/HeatMap', () => (props: any) => (
  <Container
    className="heatmap-common"
    onClick={() =>
      props.onCellClick({ startTime: 1604451600000, endTime: 1604451600000 - 15 * 1000 * 60 }, { name: 'Performance' })
    }
  />
))

describe('Unit tests for Service Heatmap componnt', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('Ensure no data state is rendered when no data is provided', async () => {
    const useGetHeatmapSpy = jest.spyOn(cvService, 'useGetHeatmap')
    const refetchMock = jest.fn()
    useGetHeatmapSpy.mockReturnValue({
      response: {},
      refetch: refetchMock as unknown
    } as UseGetReturn<any, unknown, any, unknown>)
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVServices({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: 'loading',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <ServiceHeatMap startTime={1604451600000} endTime={1604471400000} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const mockHeatMap = container.querySelector('[class*="heatmap-common"]')
    expect(mockHeatMap).not.toBeNull()
    if (!mockHeatMap) {
      throw Error('Heatmap was not rendered.')
    }
    fireEvent.click(mockHeatMap)
    await waitFor(() => expect(document.body.querySelector(`.${Classes.DIALOG}`)).not.toBeNull())
    expect(document.body.querySelector('[class*="categoryAndRiskScore"]')).not.toBeNull()
    expect(getByText('Performance')).not.toBeNull()
  })
})
