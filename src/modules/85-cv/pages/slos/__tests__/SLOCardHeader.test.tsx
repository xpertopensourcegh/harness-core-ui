import React from 'react'
import { render, screen } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import SLOCardHeader from '../SLOCard/SLOCardHeader'
import type { SLOCardHeaderProps } from '../CVSLOsListingPage.types'
import { testWrapperProps, dashboardWidgetsContent } from './CVSLOsListingPage.mock'

const ComponentWrapper: React.FC<SLOCardHeaderProps> = props => {
  return (
    <TestWrapper {...testWrapperProps}>
      <SLOCardHeader {...props} />
    </TestWrapper>
  )
}

describe('Test cases for SLOCardHeader component', () => {
  test('Render sample card', () => {
    const onDelete = jest.fn()
    const { container } = render(
      <ComponentWrapper serviceLevelObjective={dashboardWidgetsContent} onDelete={onDelete} />
    )

    expect(screen.getByText(dashboardWidgetsContent.title)).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('Without monitoredServiceIdentifier, Options button should be rendered', () => {
    const onDelete = jest.fn()
    const { container } = render(
      <ComponentWrapper serviceLevelObjective={dashboardWidgetsContent} onDelete={onDelete} />
    )

    expect(container.querySelector('[data-icon="Options"]')).toBeInTheDocument()
  })

  test('With monitoredServiceIdentifier, Options button should not be rendered', () => {
    const onDelete = jest.fn()
    const { container } = render(
      <ComponentWrapper
        onDelete={onDelete}
        serviceLevelObjective={dashboardWidgetsContent}
        monitoredServiceIdentifier="monitored_service_identifier"
      />
    )

    expect(container.querySelector('[data-icon="Options"]')).not.toBeInTheDocument()
  })
})
