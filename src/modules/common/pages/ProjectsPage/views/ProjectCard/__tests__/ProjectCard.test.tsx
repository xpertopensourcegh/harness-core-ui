import React from 'react'

import { render } from '@testing-library/react'
import ProjectCard from '../ProjectCard'
import type { ProjectDTO } from 'services/cd-ng'

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

describe('ProjectCard test', () => {
  test('initializes ok ', async () => {
    const { container } = render(<ProjectCard data={project} />)
    expect(container).toMatchSnapshot()
  })
})
