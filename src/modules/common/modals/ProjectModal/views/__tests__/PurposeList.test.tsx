import React from 'react'

import { render, queryByText } from '@testing-library/react'
import type { Project } from 'services/cd-ng'
import { TestWrapper } from 'modules/common/utils/testUtils'
import PurposeList from '../PurposeList'
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

describe('PurposeList test', () => {
  test('initializes ok ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <PurposeList data={project} />
      </TestWrapper>
    )
    expect(queryByText(container, i18n.newProjectWizard.purposeList.name)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
