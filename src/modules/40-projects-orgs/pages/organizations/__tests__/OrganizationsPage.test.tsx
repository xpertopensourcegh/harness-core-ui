import React from 'react'
import { fireEvent, getByText, queryByText, render, RenderResult, waitFor, findAllByText } from '@testing-library/react'

import { act } from 'react-dom/test-utils'
import { findDialogContainer, findPopoverContainer, TestWrapper } from '@common/utils/testUtils'
import {
  orgMockData,
  getOrgMockData,
  createOrgMockData
} from '@projects-orgs/pages/organizations/__tests__/OrganizationsMockData'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import OrganizationsPage from '../OrganizationsPage'

const getOrganizationList = jest.fn()
const deleteOrganization = jest.fn()
const getOrg = jest.fn()
const editOrg = jest.fn()
const deleteOrganizationMock = (): Promise<{ status: string }> => {
  deleteOrganization()
  return Promise.resolve({ status: 'SUCCESS' })
}
jest.mock('services/cd-ng', () => ({
  usePostOrganization: jest.fn().mockImplementation(() => createOrgMockData),
  useGetOrganizationList: jest.fn().mockImplementation(args => {
    getOrganizationList(args)
    return { ...orgMockData, refetch: jest.fn(), error: null }
  }),
  useDeleteOrganization: jest.fn().mockImplementation(() => ({ mutate: deleteOrganizationMock })),
  usePutOrganization: jest.fn().mockImplementation(args => {
    editOrg(args)
    return createOrgMockData
  }),
  useGetOrganization: jest.fn().mockImplementation(args => {
    getOrg(args)
    return { ...getOrgMockData, refetch: jest.fn(), error: null, loading: false }
  })
}))
jest.useFakeTimers()

describe('Org Page List', () => {
  let container: HTMLElement | undefined
  let getAllByText: RenderResult['getAllByText'] | undefined
  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path="/account/:accountId/projects"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <OrganizationsPage />
      </TestWrapper>
    )
    container = renderObj.container
    getAllByText = renderObj.getAllByText
  })

  test('Create New Org', async () => {
    expect(container).toMatchSnapshot()
    const newOrg = getAllByText?.('+ New Organization')[0]
    await act(async () => {
      if (newOrg) fireEvent.click(newOrg)
      await waitFor(() => findAllByText(document.body, 'ABOUT THE ORGANIZATION'))
    })
    let form = findDialogContainer()
    expect(form).toBeTruthy()
    await act(async () => {
      fireEvent.click(form?.querySelector('[icon="cross"]')!)
    })
    form = findDialogContainer()
    expect(form).not.toBeTruthy()
  }),
    test('Delete Organization From Menu', async () => {
      deleteOrganization.mockReset()
      const menu = container?.querySelectorAll("[icon='more']")[0]
      fireEvent.click(menu!)
      const popover = findPopoverContainer()
      const deleteMenu = getByText(popover as HTMLElement, 'Delete')
      await act(async () => {
        fireEvent.click(deleteMenu!)
        await waitFor(() => getByText(document.body, 'Delete Organization'))
      })
      const form = findDialogContainer()
      expect(form).toBeTruthy()
      const deleteBtn = queryByText(form as HTMLElement, 'Delete')
      await act(async () => {
        fireEvent.click(deleteBtn!)
      })
      expect(deleteOrganization).toBeCalled()
    }),
    test('Edit Organization', async () => {
      const menu = container?.querySelectorAll("[icon='more']")[1]
      fireEvent.click(menu!)
      const popover = findPopoverContainer()
      const edit = getByText(popover as HTMLElement, 'Edit')
      await act(async () => {
        fireEvent.click(edit)
        await waitFor(() => getByText(document.body, 'EDIT ORGANIZATION'))
      })
      const form = findDialogContainer()
      expect(form).toBeTruthy()
      await act(async () => {
        fireEvent.click(form?.querySelector('button[type="submit"]')!)
      })
      expect(editOrg).toHaveBeenCalled()
    })
})
