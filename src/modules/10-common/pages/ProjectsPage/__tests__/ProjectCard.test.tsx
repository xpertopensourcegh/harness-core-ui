import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ProjectCard from '../views/ProjectCard/ProjectCard'
import { defaultAppStoreValues, project } from './DefaultAppStoreData'

describe('Project Card test', () => {
  test('initializes ok ', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectCard data={project} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  }),
    test('Preview is ok', async () => {
      const { container } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <ProjectCard data={project} isPreview={true} />
        </TestWrapper>
      )
      expect(container).toMatchSnapshot()
    })
})
