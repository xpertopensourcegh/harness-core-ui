import React from 'react'
import { render } from '@testing-library/react'
import VerificationStatusCard from '../VerificationStatusCard'

describe('VerificationStatusCard', () => {
  test('matches snapshot when status = IN_PROGRESS', () => {
    const { container } = render(<VerificationStatusCard status="IN_PROGRESS" />)
    expect(container).toMatchSnapshot()
  })

  test('matches snapshot when status = VERIFICATION_FAILED', () => {
    const { container } = render(<VerificationStatusCard status="VERIFICATION_FAILED" />)
    expect(container).toMatchSnapshot()
  })

  test('matches snapshot when status = VERIFICATION_PASSED', () => {
    const { container } = render(<VerificationStatusCard status="VERIFICATION_PASSED" />)
    expect(container).toMatchSnapshot()
  })
})
