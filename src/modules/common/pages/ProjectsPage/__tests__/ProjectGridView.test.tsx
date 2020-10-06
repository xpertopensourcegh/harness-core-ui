import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper, UseGetMockData } from 'modules/common/utils/testUtils'
import type { ResponsePageProject } from 'services/cd-ng'
import ProjectGridView from '../views/ProjectGridView/ProjectGridView'

import { projectPageMock } from './ProjectPageMock'
import { defaultAppStoreValues } from './DefaultAppStoreData'

describe('Project Grid', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectGridView mockData={projectPageMock as UseGetMockData<ResponsePageProject>} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
