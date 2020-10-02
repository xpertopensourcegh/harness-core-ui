import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper, UseGetMockData } from 'modules/common/utils/testUtils'
import orgmockData from 'modules/common/modals/ProjectModal/views/__tests__/OrgMockData.json'
import type { ResponsePageOrganization } from 'services/cd-ng'
import ProjectsListPage from '../ProjectsPage'
import { defaultAppStoreValues } from './DefaultAppStoreData'

describe('Project Page List', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectsListPage orgMockData={orgmockData as UseGetMockData<ResponsePageOrganization>} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
