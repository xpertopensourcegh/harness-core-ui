import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import OrganizationDetailsPage from '../OrganizationDetails/OrganizationDetailsPage'
import { getOrgMockData } from './OrganizationsMockData'

jest.mock('services/cd-ng', () => ({
  useGetOrganization: jest.fn().mockImplementation(() => {
    return { ...getOrgMockData, refetch: jest.fn(), error: null, loading: false }
  })
}))
describe('Organization Details', () => {
  test('Render', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/organizations/:orgIdentifier"
        pathParams={{ accountId: 'testAcc', orgIdentifier: 'testOrg' }}
      >
        <OrganizationDetailsPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
