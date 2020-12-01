import React from 'react'
import { act, fireEvent, getByText, render, waitFor } from '@testing-library/react'
import { findDialogContainer, findPopoverContainer, TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import ProjectDetails from '../views/ProjectDetails/ProjectDetails'
import { createMockData, OrgMockData, projectMockData, projectMockDataWithModules } from './ProjectPageMock'

const getProject = jest.fn()
const deleteProject = jest.fn()
const getOrg = jest.fn()
const deleteProjectMock = (): Promise<{ status: string }> => {
  deleteProject()
  return Promise.resolve({ status: 'SUCCESS' })
}

let noModule = false

jest.mock('services/cd-ng', () => ({
  useDeleteProject: jest.fn().mockImplementation(() => ({ mutate: deleteProjectMock })),
  usePutProject: jest.fn().mockImplementation(() => createMockData),
  useGetProject: jest.fn().mockImplementation(args => {
    getProject(args)

    return {
      ...(noModule ? projectMockData : projectMockDataWithModules),
      refetch: jest.fn(),
      error: null,
      loading: false
    }
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

describe('Project Details', () => {
  test('render with modules and edit menu', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/org/:orgIdentifier/project/:projectIdentifier"
        pathParams={{ accountId: 'testAcc', orgIdentifier: 'Cisco_Meraki', projectIdentifier: 'Portal' }}
      >
        <ProjectDetails />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    const menu = container?.querySelectorAll("[icon='more']")[0]
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
    test('render with no modules and invite collaborators', async () => {
      noModule = true
      const { container } = render(
        <TestWrapper
          path="/account/:accountId/org/:orgIdentifier/project/:projectIdentifier"
          pathParams={{ accountId: 'testAcc', orgIdentifier: 'Cisco_Meraki', projectIdentifier: 'Portal' }}
        >
          <ProjectDetails />
        </TestWrapper>
      )
      expect(container).toMatchSnapshot()
      const menu = container?.querySelectorAll("[icon='more']")[0]
      fireEvent.click(menu!)
      const popover = findPopoverContainer()
      const invite = getByText(popover as HTMLElement, 'Invite Collaborators')
      await act(async () => {
        fireEvent.click(invite)
        await waitFor(() => getByText(document.body, 'INVITE COLLABORATORS'))
        let form = findDialogContainer()
        expect(form).toBeTruthy()
        await waitFor(() => fireEvent.click(form?.querySelector('[icon="cross"]')!))
        form = findDialogContainer()
        expect(form).not.toBeTruthy()
      })
    }),
    test('Manage Organizations', async () => {
      const { container, getByTestId } = render(
        <TestWrapper
          path="/account/:accountId/org/:orgIdentifier/project/:projectIdentifier"
          pathParams={{ accountId: 'testAcc', orgIdentifier: 'Cisco_Meraki', projectIdentifier: 'Portal' }}
        >
          <ProjectDetails />
        </TestWrapper>
      )
      const back = getByText(container, 'Manage Projects /')
      fireEvent.click(back)
      await waitFor(() => getByTestId('location'))
      expect(getByTestId('location').innerHTML.endsWith(routes.toProjects({ accountId: 'testAcc' }))).toBeTruthy()
    })
})
