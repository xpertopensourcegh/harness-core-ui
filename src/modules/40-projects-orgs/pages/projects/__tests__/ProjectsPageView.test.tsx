import React from 'react'
import { fireEvent, getByText, queryByText, render, RenderResult, waitFor } from '@testing-library/react'

import { act } from 'react-dom/test-utils'
import { findDialogContainer, findPopoverContainer, TestWrapper, UseGetMockData } from '@common/utils/testUtils'
import type { ResponsePageOrganization } from 'services/cd-ng'
import { orgMockData } from '@projects-orgs/pages/organizations/__tests__/OrganizationsMockData'
import ProjectsListPage from '../ProjectsPage'
import { createMockData, OrgMockData, projectMockData, projectPageMock } from './ProjectPageMock'
import { defaultAppStoreValues } from './DefaultAppStoreData'

const getProjectList = jest.fn()
const deleteProject = jest.fn()
const getProject = jest.fn()
const getOrg = jest.fn()
const deleteProjectMock = (): Promise<{ status: string }> => {
  deleteProject()
  return Promise.resolve({ status: 'SUCCESS' })
}
jest.mock('services/cd-ng', () => ({
  useGetOrganizationList: () => jest.fn(),
  usePostProject: jest.fn().mockImplementation(() => createMockData),
  useGetProjectList: jest.fn().mockImplementation(args => {
    getProjectList(args)
    return { ...projectPageMock, refetch: jest.fn(), error: null }
  }),
  useDeleteProject: jest.fn().mockImplementation(() => ({ mutate: deleteProjectMock })),
  usePutProject: jest.fn().mockImplementation(() => createMockData),
  useGetProject: jest.fn().mockImplementation(args => {
    getProject(args)
    return { ...projectMockData, refetch: jest.fn(), error: null, loading: false }
  }),
  useGetOrganization: jest.fn().mockImplementation(args => {
    getOrg(args)
    return { ...OrgMockData, refetch: jest.fn(), error: null, loading: false }
  }),
  useGetUsers: () => jest.fn(),
  useGetInvites: () => jest.fn(),
  useSendInvite: () => jest.fn(),
  useGetRoles: () => jest.fn()
}))

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as object),
  useRouteParams: () => ({
    params: {
      accountId: 'testAcc'
    },
    query: {
      orgId: 'testOrg'
    }
  })
}))

describe('Project Page List', () => {
  let container: HTMLElement | undefined
  let getAllByText: RenderResult['getAllByText'] | undefined
  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ProjectsListPage orgMockData={orgMockData as UseGetMockData<ResponsePageOrganization>} />
      </TestWrapper>
    )
    container = renderObj.container
    getAllByText = renderObj.getAllByText
  })

  test('Create Project and Close', async () => {
    expect(container).toMatchSnapshot()
    await act(async () => {
      const newProject = getAllByText?.('New Project')[0]
      expect(newProject).toBeDefined()
      fireEvent.click(newProject!)
      await waitFor(() => getByText(document.body, 'ABOUT THE PROJECT'))
      let form = findDialogContainer()
      expect(form).toBeTruthy()
      fireEvent.click(form?.querySelector('[icon="cross"]')!)
      form = findDialogContainer()
      expect(form).not.toBeTruthy()
    })
  }),
    test('Whole Modal Test', async () => {
      expect(container).toMatchSnapshot()
      const newProject = getAllByText?.('New Project')[0]
      expect(newProject).toBeDefined()
      fireEvent.click(newProject!)
      await waitFor(() => getByText(document.body, 'ABOUT THE PROJECT'))
      let form = findDialogContainer()
      expect(form).toBeTruthy()
      fireEvent.change(form?.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
      fireEvent.change(form?.querySelector('input[name="orgIdentifier"]')!, {
        target: { value: 'testOrg' }
      })
      fireEvent.click(form?.querySelector('button[type="submit"]')!)
      await waitFor(() => getByText(document.body, 'INVITE COLLABORATORS'))
      fireEvent.click(getByText(document.body, 'Back')!)
      await waitFor(() => getByText(document.body, 'EDIT PROJECT'))
      fireEvent.click(form?.querySelector('button[type="submit"]')!)
      await waitFor(() => getByText(document.body, 'INVITE COLLABORATORS'))
      fireEvent.click(queryByText(document.body, 'Save and Continue')!)
      await waitFor(() => getByText(document.body, 'Which Harness modules would you like to enable for this project?'))
      fireEvent.click(form?.querySelector('[icon="cross"]')!)
      form = findDialogContainer()
      expect(form).not.toBeTruthy()
    }),
    test('Invite Collaborators', async () => {
      const menu = container?.querySelectorAll("[icon='more']")[1]
      fireEvent.click(menu!)
      const popover = findPopoverContainer()
      const invite = getByText(popover as HTMLElement, 'Invite Collaborators')
      await act(async () => {
        fireEvent.click(invite)
        await waitFor(() => getByText(document.body, 'INVITE COLLABORATORS'))
        let form = findDialogContainer()
        expect(form).toBeTruthy()
        fireEvent.click(form?.querySelector('[icon="cross"]')!)
        form = findDialogContainer()
        expect(form).not.toBeTruthy()
      })
    }),
    test('Delete Project From Menu', async () => {
      deleteProject.mockReset()
      const menu = container?.querySelectorAll("[icon='more']")[0]
      fireEvent.click(menu!)
      const popover = findPopoverContainer()
      const deleteMenu = getByText(popover as HTMLElement, 'Delete')
      await act(async () => {
        fireEvent.click(deleteMenu!)
        await waitFor(() => getByText(document.body, 'Delete Project'))
        const form = findDialogContainer()
        expect(form).toBeTruthy()
        const deleteBtn = queryByText(form as HTMLElement, 'Delete')
        fireEvent.click(deleteBtn!)
        expect(deleteProject).toBeCalled()
      })
    }),
    test('Edit Project', async () => {
      const menu = container?.querySelectorAll("[icon='more']")[2]
      fireEvent.click(menu!)
      const popover = findPopoverContainer()
      const edit = getByText(popover as HTMLElement, 'Edit')
      await act(async () => {
        fireEvent.click(edit)
        await waitFor(() => getByText(document.body, 'EDIT PROJECT'))
        const form = findDialogContainer()
        expect(form).toBeTruthy()
        fireEvent.click(form?.querySelector('button[type="submit"]')!)
      })
    }),
    test('Toggle between grid and list view', async () => {
      const list = container?.querySelectorAll("[icon='list']")[0]
      const grid = container?.querySelectorAll("[icon='grid-view']")[0]
      await act(async () => {
        fireEvent.click(list!)
        expect(container).toMatchSnapshot()
        fireEvent.click(grid!)
        expect(container).toMatchSnapshot()
      })
    })
})
