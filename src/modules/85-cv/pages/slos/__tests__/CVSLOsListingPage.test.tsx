import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import CVSLOsListingPage from '../CVSLOsListingPage'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVSLOs({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_org'
  }
}

jest.mock('services/cv', () => ({
  useGetMonitoredServiceListEnvironments: jest.fn().mockReturnValue({ loading: false, data: {}, error: null })
}))

describe('Test CVSLOsListingPage component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render CVSLOsListingPage page and display create New SLO Button', async () => {
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <CVSLOsListingPage />
      </TestWrapper>
    )
    expect(getByText('cv.slos.newSLO')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
