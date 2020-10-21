import React from 'react'
import { fireEvent, getByText, render, RenderResult, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { findDialogContainer, findPopoverContainer, TestWrapper } from 'modules/common/utils/testUtils'
import { projectPageMock } from './ProjectPageMock'
import OrgsProjectsListPage from '../OrgsProjectsPage'
import { defaultAppStoreValues } from './DefaultAppStoreData'

const getProjectList = jest.fn()
const deleteProject = jest.fn()

jest.mock('services/cd-ng', () => ({
  useGetOrganizationList: () => jest.fn(),
  usePostProject: () => jest.fn(),
  useGetProjectList: jest.fn().mockImplementation(args => {
    getProjectList(args)
    return { ...projectPageMock, refetch: jest.fn(), error: null }
  }),
  useDeleteProject: jest.fn().mockImplementation(() => ({ mutate: deleteProject })),
  usePutProject: () => jest.fn(),
  useGetProject: () => jest.fn(),
  useGetOrganization: () => jest.fn(),
  useGetUsers: () => jest.fn(),
  useGetInvites: () => jest.fn(),
  useSendInvite: () => jest.fn(),
  useGetRoles: () => jest.fn()
}))

describe('Orgs Project Page List', () => {
  let container: HTMLElement | undefined
  let getAllByText: RenderResult['getAllByText'] | undefined
  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path="/account/:accountId/organizations/:orgIdentifier/projects"
        pathParams={{ accountId: 'testAcc', orgIdentifier: 'testOrg' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <OrgsProjectsListPage />
      </TestWrapper>
    )
    container = renderObj.container
    getAllByText = renderObj.getAllByText
    await waitFor(() => getAllByText?.('Org Name / PROJECTS'))
  })
  test('render', async () => {
    expect(container).toMatchSnapshot()
  }),
    test('New Project', async () => {
      const newProject = getAllByText?.('New Project')[0]
      expect(newProject).toBeDefined()
      fireEvent.click(newProject!)
      await waitFor(() => getByText(document.body, 'ABOUT THE PROJECT'))
      const form = findDialogContainer()
      expect(form).toBeTruthy()
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
    })
})
