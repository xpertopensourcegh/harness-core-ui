import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from 'modules/common/utils/testUtils'

import OrgsProjectsListPage from '../OrgsProjectsPage'
import { defaultAppStoreValues } from './DefaultAppStoreData'

describe('Orgs Project Page List', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/organizations/:orgIdentifier/projects"
        pathParams={{ accountId: 'testAcc', orgIdentifier: 'testOrg' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <OrgsProjectsListPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
