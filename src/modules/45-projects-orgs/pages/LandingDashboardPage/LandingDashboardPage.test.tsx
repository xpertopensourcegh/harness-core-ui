import { render } from '@testing-library/react'
import React from 'react'
import routes from '@common/RouteDefinitions'
import * as dashboardServices from 'services/dashboard-service'
import { TestWrapper } from '@common/utils/testUtils'
import overviewCountMock from '@projects-orgs/components/OverviewGlanceCards/__tests__/overviewMock.json'
import LandingDashboardPage from './LandingDashboardPage'

const getData = jest.fn(() => {
  return Promise.resolve(overviewCountMock)
})

jest
  .spyOn(dashboardServices, 'useGetCounts')
  .mockImplementation(() => ({ mutate: getData, refetch: getData, data: overviewCountMock } as any))

describe('Landing Dashboard Page', () => {
  test('render', async () => {
    const { findByText } = render(
      <TestWrapper path={routes.toLandingDashboard({ accountId: ':accountId' })} pathParams={{ accountId: 'dummy' }}>
        <LandingDashboardPage />
      </TestWrapper>
    )

    expect(findByText('projectsOrgs.landingDashboard.welcomeMessageWithoutName')).toBeDefined()
    expect(findByText('projectsOrgs.welcomeSecondLine')).toBeDefined()
    expect(findByText('projectLabel')).toBeDefined()
  })
})
