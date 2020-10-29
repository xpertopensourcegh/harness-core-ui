import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper, UseGetMockData } from '@common/utils/testUtils'
import type { ResponsePageOrganization } from 'services/cd-ng'
import { orgMockData } from './OrganizationsMockData'
import OrganizationsPage from '../OrganizationsPage'

describe('Project Page List', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/projects" pathParams={{ accountId: 'testAcc' }}>
        <OrganizationsPage orgMockData={orgMockData as UseGetMockData<ResponsePageOrganization>} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
