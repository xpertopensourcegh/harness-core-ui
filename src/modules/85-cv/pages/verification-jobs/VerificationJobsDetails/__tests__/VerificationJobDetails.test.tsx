import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { noop } from 'lodash-es'

import { TestWrapper } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'

import VerificationJobsDetails from '../VerificationJobsDetails'

jest.mock('services/cv', () => ({
  useListAllSupportedDataSource: jest.fn().mockImplementation(() => ({
    refetch: jest.fn(),
    data: null
  })),
  useListAllActivitySources: jest.fn().mockImplementation(() => ({}))
}))

describe('VerificationJobsDetails', () => {
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
        <VerificationJobsDetails onNext={() => noop} stepData={{}} />
      </TestWrapper>
    )
    await waitFor(() => expect(queryByText(container, 'Create your verification job')).not.toBeNull())
    expect(container).toMatchSnapshot()
  })
})
