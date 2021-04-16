import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ActivityProgressIndicator from '../ActivityProgressIndicator'

describe('ActivityProgressIndicator', () => {
  test('shows correct message when not started', () => {
    const { getByText } = render(
      <TestWrapper>
        <ActivityProgressIndicator data={null} />
      </TestWrapper>
    )
    expect(getByText('cv.dashboard.notStarted')).toBeDefined()
  })

  test('shows correct message when verifications are in progress', () => {
    const { getByText } = render(
      <TestWrapper>
        <ActivityProgressIndicator
          data={{
            aggregatedStatus: 'IN_PROGRESS',
            durationMs: 120000,
            passed: 0,
            progress: 2,
            progressPercentage: 10,
            remainingTimeMs: 60000,
            risk: 'LOW',
            startTime: 1605187103793,
            total: 2
          }}
        />
      </TestWrapper>
    )
    expect(getByText('2/2 cv.verifications inprogress (1 cv.activitychanges.minutesremaining)')).toBeDefined()
  })

  test('shows correct message when verification is done', () => {
    const { getByText } = render(
      <TestWrapper>
        <ActivityProgressIndicator
          data={{
            aggregatedStatus: 'ERROR',
            durationMs: 120000,
            passed: 1,
            progress: 2,
            progressPercentage: 100,
            remainingTimeMs: 60000,
            risk: 'LOW',
            startTime: 1605187103793,
            total: 2
          }}
        />
      </TestWrapper>
    )
    expect(getByText('1/2 cv.verifications passed')).toBeDefined()
  })
})
