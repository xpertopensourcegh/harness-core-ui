import React from 'react'
import { render, waitFor } from '@testing-library/react'
import * as dashboardServices from 'services/dashboard-service'
import { TestWrapper } from '@common/utils/testUtils'
import LandingDashboardContext, { DashboardTimeRange } from '@common/factories/LandingDashboardContext'
import type { ResponseExecutionResponseCountOverview } from 'services/dashboard-service'
import OverviewGlanceCards from '../OverviewGlanceCards'

import overviewCountMock from './overviewMock.json'

const getData = jest.fn(() => {
  return Promise.resolve(overviewCountMock)
})

jest
  .spyOn(dashboardServices, 'useGetCounts')
  .mockImplementation(() => ({ mutate: getData, refetch: getData, data: overviewCountMock } as any))

describe('OverviewGlanceCards', () => {
  test('OverviewGlanceCards rendering', async () => {
    const { container, queryByText } = render(
      <TestWrapper>
        <LandingDashboardContext.Provider
          value={{
            selectedTimeRange: DashboardTimeRange['30Days'],
            selectTimeRange: () => void 0,
            scope: { accountIdentifier: 'testAccount' }
          }}
        >
          <OverviewGlanceCards glanceCardData={overviewCountMock as ResponseExecutionResponseCountOverview} />
        </LandingDashboardContext.Provider>
      </TestWrapper>
    )

    await waitFor(() => expect(queryByText('projectsText')).toBeInTheDocument())
    expect(getData).toBeCalledTimes(0)

    expect(queryByText('+137')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
