import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import SLOCardContent from '../SLOCard/SLOCardContent'
import type { SLOCardContentProps } from '../CVSLOsListingPage.types'
import { testWrapperProps, dashboardWidgetsContent } from './CVSLOsListingPage.mock'

jest.mock('@cv/pages/slos/SLOCard/ErrorBudgetGauge.tsx', () => ({
  __esModule: true,
  default: function ErrorBudgetGauge() {
    return <span data-testid="error-budget-gauge" />
  }
}))

const ComponentWrapper: React.FC<SLOCardContentProps> = props => {
  return (
    <TestWrapper {...testWrapperProps}>
      <SLOCardContent {...props} />
    </TestWrapper>
  )
}

describe('Test cases for SLOCardContent component', () => {
  test('Render sample card', () => {
    render(<ComponentWrapper serviceLevelObjective={dashboardWidgetsContent} />)

    expect(screen.getByText('cv.SLOPerformanceTrend')).toBeInTheDocument()
    expect(screen.queryByText('cv.errorBudgetRemaining')).not.toBeInTheDocument()
    expect(screen.queryByText('cv.errorBudgetBurnDown')).not.toBeInTheDocument()
    expect(screen.queryByTestId('error-budget-gauge')).not.toBeInTheDocument()
  })

  test('Toggle the SLO and Error budget', () => {
    render(<ComponentWrapper serviceLevelObjective={dashboardWidgetsContent} />)

    userEvent.click(screen.getByText('cv.errorBudget'))

    expect(screen.getByText('cv.errorBudgetRemaining')).toBeInTheDocument()
    expect(screen.getByText('cv.errorBudgetBurnDown')).toBeInTheDocument()
    expect(screen.queryByTestId('error-budget-gauge')).toBeInTheDocument()
    expect(screen.queryByText('cv.SLOPerformanceTrend')).not.toBeInTheDocument()

    userEvent.click(screen.getByText('cv.SLO'))

    expect(screen.getByText('cv.SLOPerformanceTrend')).toBeInTheDocument()
  })
})
