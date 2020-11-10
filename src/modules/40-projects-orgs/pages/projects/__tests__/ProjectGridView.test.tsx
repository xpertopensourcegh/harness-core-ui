import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { act } from 'react-dom/test-utils'
import { TestWrapper, UseGetMockData } from '@common/utils/testUtils'
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
    const card = container.getElementsByClassName('colorBar')[0]
    await act(async () => {
      fireEvent.click(card)
    })
    expect(container).toMatchSnapshot()
  })
})
