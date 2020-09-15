import React from 'react'

import { render, queryByText } from '@testing-library/react'
import type { Project, ResponseDTONGPageResponseOrganization } from 'services/cd-ng'
import { TestWrapper, UseGetMockData } from 'modules/common/utils/testUtils'
import AboutProject from '../AboutProject'
import orgmockData from './OrgMockData.json'
import i18n from '../../../../pages/ProjectsPage/ProjectsPage.i18n'

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

describe('About Project test', () => {
  test('create project ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <AboutProject data={{}} orgmockData={orgmockData as UseGetMockData<ResponseDTONGPageResponseOrganization>} />
      </TestWrapper>
    )
    expect(queryByText(container, i18n.newProjectWizard.aboutProject.name)).toBeDefined()
    expect(container).toMatchSnapshot()
  }),
    test('edit project ', async () => {
      const { container } = render(
        <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
          <AboutProject
            data={project}
            orgmockData={orgmockData as UseGetMockData<ResponseDTONGPageResponseOrganization>}
          />
        </TestWrapper>
      )
      expect(queryByText(container, i18n.newProjectWizard.aboutProject.edit)).toBeDefined()
      expect(container).toMatchSnapshot()
    })
})
