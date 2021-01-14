import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'

import VerificationJobsSetup from '../VerificationJobsSetup'
jest.mock('services/cv', () => ({
  useGetVerificationJob: jest.fn().mockImplementation(() => ({
    refetch: jest.fn()
  })),
  useListAllSupportedDataSource: jest.fn().mockImplementation(() => ({
    refetch: jest.fn(),
    data: null
  })),
  useListActivitySources: jest.fn().mockImplementation(() => ({}))
}))

describe('VerificationJobsSetup', () => {
  test('Render initiaaly', async () => {
    const { container } = render(
      <TestWrapper
        path={routes.toCVAdminSetupVerificationJob({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <VerificationJobsSetup />
      </TestWrapper>
    )
    await waitFor(() => expect(queryByText(container, 'Verification Jobs')).not.toBeNull())
    expect(container).toMatchSnapshot()
  })
})
