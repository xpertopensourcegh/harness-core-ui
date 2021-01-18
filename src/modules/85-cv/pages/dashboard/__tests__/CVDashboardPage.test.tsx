import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CVDashboardPage from '../CVDashboardPage'

jest.mock('../CategoryRiskCards/CategoryRiskCards', () => ({
  CategoryRiskCardsWithApi: function RiskCardsMock() {
    return <div className="test-category-risk-cards" />
  }
}))

jest.mock('../ActivityVerifications/ActivityVerifications', () => () => <div className="test-activity-verifications" />)

jest.mock('../RecentActivityChanges/RecentActivityChanges', () => () => (
  <div className="test-recent-activity-changes" />
))

describe('CVDashboardPage', () => {
  test('renders subcomponents correctly', () => {
    const { container } = render(
      <TestWrapper>
        <CVDashboardPage />
      </TestWrapper>
    )
    expect(container.querySelector('.test-category-risk-cards')).toBeTruthy()
    expect(container.querySelector('.test-activity-verifications')).toBeTruthy()
    expect(container.querySelector('.test-recent-activity-changes')).toBeTruthy()
  })
})
