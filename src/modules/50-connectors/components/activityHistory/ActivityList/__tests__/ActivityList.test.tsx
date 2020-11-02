import React from 'react'
import { MemoryRouter } from 'react-router'
import { render } from '@testing-library/react'
import ActivityList from '../ActivityList'
import connectivitySummary from '../../ActivityHistory/__tests__/mockData/connectivitySummary.json'
import activityData from '../../ActivityHistory/__tests__/mockData/activityData.json'

describe('Activity List', () => {
  test('render all activity', () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <ActivityList
          activityList={activityData as any}
          connectivitySummary={connectivitySummary as any}
          entityIdentifier="entityId"
          dateRange={[('From' as unknown) as Date, ('To' as unknown) as Date]}
          refetchActivities={jest.fn()}
          refetchConnectivitySummary={jest.fn()}
          showConnectivityChecks={true}
          showOtherActivity={true}
        />
      </MemoryRouter>
    )
    expect(getByText('Connectivity Check')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  test('render only connectivity check activity', () => {
    const { container } = render(
      <MemoryRouter>
        <ActivityList
          activityList={activityData as any}
          connectivitySummary={connectivitySummary as any}
          entityIdentifier="entityId"
          dateRange={[('From' as unknown) as Date, ('To' as unknown) as Date]}
          refetchActivities={jest.fn()}
          refetchConnectivitySummary={jest.fn()}
          showConnectivityChecks={true}
          showOtherActivity={false}
        />
      </MemoryRouter>
    )

    expect(container).toMatchSnapshot()
  })
})
