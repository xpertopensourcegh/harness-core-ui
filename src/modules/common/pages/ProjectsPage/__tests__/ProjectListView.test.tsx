import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper, UseGetMockData } from 'modules/common/utils/testUtils'
import type { ResponsePageProject } from 'services/cd-ng'
import ProjectListView from '../views/ProjectListView/ProjectListView'

import { projectPageMock } from './ProjectPageMock'
import { defaultAppStoreValues } from './DefaultAppStoreData'

jest.mock('react-timeago', () => () => 'dummy date')

describe('Project List', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectListView mockData={projectPageMock as UseGetMockData<ResponsePageProject>} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
