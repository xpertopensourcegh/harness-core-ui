import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import VerificationStatusBar, { mapStatus } from '../VerificationStatusBar'

jest.mock('moment', () => {
  const original = jest.requireActual('moment')
  original().__proto__.format = () => 'XX:YY'
  return original
})

describe('VerificationStatusBar', () => {
  test('matches snapshot', () => {
    const { container } = render(
      <TestWrapper>
        <VerificationStatusBar
          cumulativeRisk={0.3}
          remainingTimeMs={60000}
          scoresAfterChanges={[]}
          scoresBeforeChanges={[]}
          status="IN_PROGRESS"
          startTime={1605190944097}
          dropDownContent={<div>drop down content</div>}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('mapStatus works correctly', () => {
    expect(mapStatus('IN_PROGRESS', jest.fn().mockReturnValue('in-progress'), 60000)).toEqual(
      'in-progress (1 in-progress)'
    )
    expect(mapStatus('VERIFICATION_PASSED', jest.fn().mockReturnValue('passed'))).toEqual('passed')
    expect(mapStatus('ERROR', jest.fn().mockReturnValue('error'))).toEqual('error')
    expect(mapStatus('VERIFICATION_FAILED', jest.fn().mockReturnValue('failed'))).toEqual('failed')
  })
})
