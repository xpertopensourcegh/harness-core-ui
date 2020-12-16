import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uikit'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { projectPathProps, accountPathProps } from '@common/utils/routeUtils'
import { GoogleCloudOperationsMonitoringSource } from '../GoogleCloudOperationsMonitoringSource'

jest.mock('../../SelectProduct/SelectProduct', () => ({
  ...(jest.requireActual('../../SelectProduct/SelectProduct') as object),
  SelectProduct: function WrapperComponent() {
    return <Container className="SelectProduct" />
  }
}))

describe('Unit tests for GoogleCloudOperationsMonitoringSource', () => {
  test('Ensure all tabs are rendered, and tabs can be selected on demand', async () => {
    const { container } = render(
      <TestWrapper
        path={routes.toCVProjectOverview({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <GoogleCloudOperationsMonitoringSource />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="SelectProduct"]')).not.toBeNull())
  })
})
