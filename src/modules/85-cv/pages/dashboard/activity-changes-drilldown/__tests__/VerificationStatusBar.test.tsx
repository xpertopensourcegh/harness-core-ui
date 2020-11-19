import React from 'react'
import { render } from '@testing-library/react'
import VerificationStatusBar, { mapStatus } from '../VerificationStatusBar'

jest.mock('moment', () => {
  const original = jest.requireActual('moment')
  original().__proto__.format = () => 'XX:YY'
  return original
})

describe('VerificationStatusBar', () => {
  test('matches snapshot', () => {
    const { container } = render(
      <VerificationStatusBar
        cumulativeRisk={0.3}
        remainingTimeMs={60000}
        scoresAfterChanges={[]}
        scoresBeforeChanges={[]}
        status="IN_PROGRESS"
        startTime={1605190944097}
        dropDownContent={<div>drop down content</div>}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('mapStatus works correctly', () => {
    expect(mapStatus('IN_PROGRESS', 60000)).toEqual('in-progress (1 minutes remaining)')
    expect(mapStatus('VERIFICATION_PASSED')).toEqual('passed')
    expect(mapStatus('ERROR')).toEqual('failed')
    expect(mapStatus('VERIFICATION_FAILED')).toEqual('failed')
  })
})
