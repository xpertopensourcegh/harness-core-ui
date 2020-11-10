import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import { Container, ModalProvider } from '@wings-software/uikit'
import { Classes } from '@blueprintjs/core'
import * as framework from 'framework/route/RouteMounter'
import * as cvService from 'services/cv'
import ServiceHeatMap from '../ServiceHeatMap'

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue([])
}))
jest.mock('../../analysis-drilldown-view/MetricAnalysisView/MetricAnalysisView', () => () => (
  <Container className="metricAnalysisView" />
))
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
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
    useGetHeatmapSpy.mockReturnValue({
      response: {},
      refetch: refetchMock as unknown
    } as UseGetReturn<any, unknown, any, unknown>)
    const { container, getByText } = render(
      <ModalProvider>
        <ServiceHeatMap startTime={1604451600000} endTime={1604471400000} />
      </ModalProvider>
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
