import React from 'react'

import { render, queryByText } from '@testing-library/react'
import type { ProjectDTO } from 'services/cd-ng'
import PurposeList from '../PurposeList'
import i18n from '../../../../pages/ProjectsPage/ProjectsPage.i18n'

const project: ProjectDTO = {
  id: 'testId',
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
    const { container } = render(<PurposeList data={project} />)
    expect(queryByText(container, i18n.newProjectWizard.purposeList.name)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
