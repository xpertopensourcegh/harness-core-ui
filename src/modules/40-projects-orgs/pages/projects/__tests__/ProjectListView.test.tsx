import React from 'react'
import { fireEvent, getByText, queryByText, render, RenderResult, waitFor } from '@testing-library/react'

import { act } from 'react-dom/test-utils'
import { findDialogContainer, TestWrapper } from '@common/utils/testUtils'

import ProjectListView from '@projects-orgs/pages/projects/views/ProjectListView/ProjectListView'
import routes from '@common/RouteDefinitions'
import { projectPageMock } from './ProjectPageMock'
import { defaultAppStoreValues } from './DefaultAppStoreData'

jest.mock('react-timeago', () => () => 'dummy date')

const openProjectModal = jest.fn()
const closeModal = jest.fn()
const collaboratorModal = jest.fn()
const deleteProject = jest.fn()
const deleteProjectMock = (): Promise<{ status: string }> => {
  deleteProject()
  return Promise.resolve({ status: 'SUCCESS' })
}

jest.mock('@projects-orgs/modals/ProjectModal/useProjectModal', () => ({
  useProjectModal: () => ({ openProjectModal: openProjectModal, closeProjectModal: closeModal })
}))

jest.mock('@projects-orgs/modals/ProjectModal/useCollaboratorModal', () => ({
  useCollaboratorModal: () => ({ openCollaboratorModal: collaboratorModal, closeCollaboratorModal: closeModal })
}))

const showEditProject = jest.fn().mockImplementation(project => openProjectModal(project))
const collaborators = jest.fn(project => collaboratorModal(project))
jest.mock('services/cd-ng', () => ({
  useDeleteProject: jest.fn().mockImplementation(() => ({ mutate: deleteProjectMock })),
  useGetProjectList: jest.fn().mockImplementation(() => {
    return { ...projectPageMock, refetch: jest.fn(), error: null }
  })
}))
describe('Project List', () => {
  let container: HTMLElement
  let getAllByText: RenderResult['getAllByText']
  let getByTestId: RenderResult['getByTestId']

  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectListView showEditProject={showEditProject} collaborators={collaborators} />
      </TestWrapper>
    )
    container = renderObj.container
    getAllByText = renderObj.getAllByText
    getByTestId = renderObj.getByTestId
    await waitFor(() => getAllByText('PROJECT'))
  })
  test('render', async () => {
    expect(container).toMatchSnapshot()
  })
  test('click on Edit Project', async () => {
    const menu = container.querySelectorAll("[icon='more']")[0]
    fireEvent.click(menu!)
    const editMenu = getAllByText('Edit')[0]
    expect(editMenu).toBeDefined()
    await act(async () => {
      fireEvent.click(editMenu!)
    })
    expect(showEditProject).toBeCalled()
  }),
    test('click on Collaborators', async () => {
      collaboratorModal.mockReset()
      const menu = container.querySelectorAll("[icon='more']")[0]
      fireEvent.click(menu!)
      const colMenu = getAllByText('Invite Collaborators')[0]
      expect(colMenu).toBeDefined()
      await act(async () => {
        fireEvent.click(colMenu!)
      })
      expect(collaboratorModal).toBeCalled()
    }),
    test('Delete', async () => {
      deleteProject.mockReset()
      const menu = container.querySelectorAll("[icon='more']")[0]
      fireEvent.click(menu!)
      const delMenu = getAllByText('Delete')[0]
      expect(delMenu).toBeDefined()
      await act(async () => {
        fireEvent.click(delMenu!)
        await waitFor(() => getByText(document.body, 'Delete Project'))
        const form = findDialogContainer()
        expect(form).toBeTruthy()
        const deleteBtn = queryByText(form as HTMLElement, 'Delete')
        fireEvent.click(deleteBtn!)
        expect(deleteProject).toBeCalled()
      })
    }),
    test('Click row', async () => {
      const row = container.getElementsByClassName('row card clickable')[0]
      await fireEvent.click(row!)
      await waitFor(() => getByTestId('location'))
      expect(
        getByTestId('location').innerHTML.endsWith(
          routes.toProjectDetails({
            orgIdentifier: 'testOrg',
            projectIdentifier: 'test',
            accountId: 'testAcc'
          })
        )
      ).toBeTruthy()
    })
})
