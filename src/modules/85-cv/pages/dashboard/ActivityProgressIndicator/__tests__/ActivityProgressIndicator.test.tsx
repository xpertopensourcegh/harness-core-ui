import React from 'react'
import { render } from '@testing-library/react'
import ActivityProgressIndicator from '../ActivityProgressIndicator'

describe('ActivityProgressIndicator', () => {
  test('shows correct message when not started', () => {
    const { getByText } = render(<ActivityProgressIndicator data={null} />)
    expect(getByText('Not started')).toBeDefined()
  })

  test('shows correct message when verifications are in progress', () => {
    const { getByText } = render(
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
    )
    expect(getByText('2/2 verifications in progress (1 minutes remaining)')).toBeDefined()
  })

  test('shows correct message when verification is done', () => {
    const { getByText } = render(
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
    )
    expect(getByText('1/2 verifications passed')).toBeDefined()
  })
})
