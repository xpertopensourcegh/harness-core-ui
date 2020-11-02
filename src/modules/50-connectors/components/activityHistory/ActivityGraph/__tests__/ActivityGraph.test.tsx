import React from 'react'
import { MemoryRouter } from 'react-router'
import { render } from '@testing-library/react'
import ActivityGraph from '../ActivityGraph'
import summaryData from './mockData.json'

import i18n from '../ActivityGraph.i18n'

jest.mock('services/cd-ng', () => ({
  useGetActivitiesSummary: jest.fn().mockImplementation(() => {
    return { ...summaryData, refetch: jest.fn(), error: null }
  })
}))

describe('Activity Graph', () => {
  test('render data for days', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ActivityGraph
          entityIdentifier="entityId"
          dataFormat="DAY"
          dateRange={[('From' as unknown) as Date, ('To' as unknown) as Date]}
          refetchActivities={jest.fn()}
          refetchConnectivitySummary={jest.fn()}
          setShowConnectivityChecks={jest.fn()}
          setShowOtherActivity={jest.fn()}
        />
      </MemoryRouter>
    )
    expect(getByText(i18n.ConnectionSuccessful)).toBeDefined()
    expect(getByText(i18n.ConnectionFailed)).toBeDefined()
    expect(getByText(i18n.HeartbeatFailure)).toBeDefined()
  })
})
