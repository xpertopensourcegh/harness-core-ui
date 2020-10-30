import React from 'react'
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react'

import { act } from 'react-dom/test-utils'
import { TestWrapper, UseGetMockData } from '@common/utils/testUtils'
import type { ResponsePageProject } from 'services/cd-ng'

import ProjectListView from '@projects-orgs/pages/projects/views/ProjectListView/ProjectListView'
import { projectPageMock } from './ProjectPageMock'
import { defaultAppStoreValues } from './DefaultAppStoreData'

jest.mock('react-timeago', () => () => 'dummy date')

const openProjectModal = jest.fn()
const closeModal = jest.fn()
const collaboratorModal = jest.fn()

jest.mock('@projects-orgs/modals/ProjectModal/useProjectModal', () => ({
  useProjectModal: () => ({ openProjectModal: openProjectModal, closeProjectModal: closeModal })
}))

jest.mock('@projects-orgs/modals/ProjectModal/useCollaboratorModal', () => ({
  useCollaboratorModal: () => ({ openCollaboratorModal: collaboratorModal, closeCollaboratorModal: closeModal })
}))

const showEditProject = jest.fn().mockImplementation(project => openProjectModal(project))
const collaborators = jest.fn(project => collaboratorModal(project))

describe('Project List', () => {
  let container: HTMLElement | undefined
  let getAllByText: RenderResult['getAllByText'] | undefined
  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectListView
          mockData={projectPageMock as UseGetMockData<ResponsePageProject>}
          showEditProject={showEditProject}
          collaborators={collaborators}
        />
      </TestWrapper>
    )
    container = renderObj.container
    getAllByText = renderObj.getAllByText
    await waitFor(() => getAllByText?.('PROJECT'))
  })
  test('render', async () => {
    expect(container).toMatchSnapshot()
  })
  test('click on Edit Project', async () => {
    const menu = container?.querySelectorAll("[icon='more']")[0]
    fireEvent.click(menu!)
    const editMenu = getAllByText?.('Edit')[0]
    expect(editMenu).toBeDefined()
    await act(async () => {
      fireEvent.click(editMenu!)
    })
    expect(showEditProject).toBeCalled()
  }),
    test('click on Collaborators', async () => {
      const menu = container?.querySelectorAll("[icon='more']")[0]
      fireEvent.click(menu!)
      const colMenu = getAllByText?.('Invite Collaborators')[0]
      expect(colMenu).toBeDefined()
      await act(async () => {
        fireEvent.click(colMenu!)
      })
      expect(collaboratorModal).toBeCalled()
    }),
    test('Delete', async () => {
      const menu = container?.querySelectorAll("[icon='more']")[0]
      fireEvent.click(menu!)
      const delMenu = getAllByText?.('Delete')[0]
      expect(delMenu).toBeDefined()
      await act(async () => {
        fireEvent.click(delMenu!)
      })
      expect(collaboratorModal).toBeCalled()
    })
})
