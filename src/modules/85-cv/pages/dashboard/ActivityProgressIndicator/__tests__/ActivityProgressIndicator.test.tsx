import React from 'react'
import { render } from '@testing-library/react'
import ActivityProgressIndicator from '../ActivityProgressIndicator'

describe('ActivityProgressIndicator', () => {
  test('shows correct message when progress percentage is invalid', () => {
    const { getByText } = render(
      <ActivityProgressIndicator
        data={{
          progressPercentage: -1
        }}
      />
    )
    expect(getByText('Not started')).toBeDefined()
  })

  test('ActivityProgressIndicator shows correct message when percentage is less then 100', () => {
    const { getByText } = render(
      <ActivityProgressIndicator
        data={{
          aggregatedStatus: 'IN_PROGRESS',
          durationMs: 120000,
          passed: 0,
          progress: 2,
          progressPercentage: 10,
          remainingTimeMs: 60000,
          riskScore: 0.3,
          startTime: 1605187103793,
          total: 2
        }}
      />
    )
    expect(getByText('2 verifications in progress (1 minutes remaining)')).toBeDefined()
  })

  test('ActivityProgressIndicator shows correct message when percentage equals 100', () => {
    const { getByText } = render(
      <ActivityProgressIndicator
        data={{
          aggregatedStatus: 'IN_PROGRESS',
          durationMs: 120000,
          passed: 1,
          progress: 2,
          progressPercentage: 100,
          remainingTimeMs: 60000,
          riskScore: 0.3,
          startTime: 1605187103793,
          total: 2
        }}
      />
    )
    expect(getByText('1/2 verifications passed')).toBeDefined()
  })
})
