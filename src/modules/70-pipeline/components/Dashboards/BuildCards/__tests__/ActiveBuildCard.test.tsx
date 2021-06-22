import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ActiveBuildCard from '../ActiveBuildCard'

describe('ActiveBuildCard', () => {
  test('matches snapshot when status=PENDING', () => {
    const { container } = render(
      <TestWrapper>
        <ActiveBuildCard title="test-Pipeline1" message="build message" status="ASYNCWAITING" />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('matches snapshot when status=RUNNING', () => {
    const { container } = render(
      <TestWrapper>
        <ActiveBuildCard title="test-Pipeline1" message="build message" status="RUNNING" />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
