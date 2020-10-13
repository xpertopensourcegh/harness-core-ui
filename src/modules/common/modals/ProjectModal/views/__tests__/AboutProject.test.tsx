import React from 'react'

import { render, queryByText } from '@testing-library/react'
import type { Project, ResponseOrganization, ResponsePageOrganization, ResponseProject } from 'services/cd-ng'
import { TestWrapper, UseGetMockData } from 'modules/common/utils/testUtils'
import { orgMockData } from './OrgMockData'
import i18n from '../../../../pages/ProjectsPage/ProjectsPage.i18n'
import StepProject from '../StepAboutProject'
import EditProject from '../EditProject'

const project: Project = {
  accountIdentifier: 'testAcc',
  orgIdentifier: 'testOrg',
  identifier: 'test',
  name: 'test',
  color: '#e6b800',
  modules: ['CD'],
  description: 'test',
  tags: ['tag1', 'tag2'],
  owners: ['testAcc']
}

const projectMockData: UseGetMockData<ResponseProject> = {
  data: {
    status: 'SUCCESS',
    data: {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'test',
      name: 'test modified',
      color: '#0063F7',
      modules: ['CD', 'CV'],
      description: 'refetch returns new data',
      owners: ['testAcc'],
      tags: [],
      lastModifiedAt: 1602158268618
    },
    metaData: undefined,
    correlationId: '88124a30-e021-4890-8466-c2345e1d42d6'
  }
}

const editOrgMockData: UseGetMockData<ResponseOrganization> = {
  data: {
    status: 'SUCCESS',
    data: {
      accountIdentifier: 'testAcc',
      identifier: 'testOrg',
      name: 'Org Name',
      color: '#004fc4',
      description: 'Description',
      tags: ['tag1', 'tag2'],
      lastModifiedAt: 1602148957762
    },
    metaData: undefined,
    correlationId: '9f77f74d-c4ab-44a2-bfea-b4545c6a4a39'
  }
}

describe('About Project test', () => {
  test('create project ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <StepProject orgMockData={orgMockData as UseGetMockData<ResponsePageOrganization>} />
      </TestWrapper>
    )
    expect(queryByText(container, i18n.newProjectWizard.aboutProject.name)).toBeDefined()
    expect(container).toMatchSnapshot()
  }),
    test('edit project ', async () => {
      const { container } = render(
        <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
          <EditProject
            identifier={project.identifier}
            orgIdentifier={project.accountIdentifier}
            editOrgMockData={editOrgMockData}
            projectMockData={projectMockData}
          />
        </TestWrapper>
      )
      expect(queryByText(container, i18n.newProjectWizard.aboutProject.name)).toBeDefined()
      expect(container).toMatchSnapshot()
    })
})
