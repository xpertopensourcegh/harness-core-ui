import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper, UseGetMockData } from 'modules/common/utils/testUtils'
import { orgMockData } from 'modules/common/modals/ProjectModal/views/__tests__/OrgMockData'
import type { ResponsePageOrganization } from 'services/cd-ng'
import { ModuleName } from 'framework/types/ModuleName'
import ProjectsListPage from '../ProjectsPage'
import { defaultAppStoreValues } from './DefaultAppStoreData'

const onNewProjectCreated = jest.fn()
const onCardClick = jest.fn()
const onRowClick = jest.fn()

describe('Project Page List', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectsListPage
          orgMockData={orgMockData as UseGetMockData<ResponsePageOrganization>}
          onNewProjectCreated={onNewProjectCreated}
          onCardClick={onCardClick}
          onRowClick={onRowClick}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  }),
    test('render', async () => {
      const { container } = render(
        <TestWrapper
          path="/account/:accountId/projects"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <ProjectsListPage
            module={ModuleName.CD}
            orgMockData={orgMockData as UseGetMockData<ResponsePageOrganization>}
            onNewProjectCreated={onNewProjectCreated}
            onCardClick={onCardClick}
            onRowClick={onRowClick}
          />
        </TestWrapper>
      )
      expect(container).toMatchSnapshot()
    })
})
