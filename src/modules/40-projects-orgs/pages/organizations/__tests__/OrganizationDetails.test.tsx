import React from 'react'
import { act, fireEvent, getAllByText, render, RenderResult, waitFor } from '@testing-library/react'
import { findDialogContainer, TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'

import OrganizationDetailsPage from '../OrganizationDetails/OrganizationDetailsPage'
import { getOrgAggregateMockData as getOrgMockData } from './OrganizationsMockData'

jest.mock('services/cd-ng', () => ({
  useGetOrganizationAggregateDTO: jest.fn().mockImplementation(() => {
    return { ...getOrgMockData, refetch: jest.fn(), error: null, loading: false }
  }),
  useGetUsers: () => jest.fn(),
  useGetInvites: () => jest.fn(),
  useSendInvite: () => jest.fn(),
  useGetRoles: () => jest.fn()
}))
describe('Organization Details', () => {
  let container: HTMLElement
  let getByText: RenderResult['getByText']
  let getByTestId: RenderResult['getByTestId']
  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path="/account/:accountId/organizations/:orgIdentifier"
        pathParams={{ accountId: 'testAcc', orgIdentifier: 'testOrg' }}
      >
        <OrganizationDetailsPage />
      </TestWrapper>
    )
    container = renderObj.container
    getByText = renderObj.getByText
    getByTestId = renderObj.getByTestId
  })
  test('Render', async () => {
    expect(container).toMatchSnapshot()
  })
  test('View Projects', async () => {
    const viewProjects = getByText('View Projects')
    fireEvent.click(viewProjects)
    await waitFor(() => getByTestId('location'))
    expect(
      getByTestId('location').innerHTML.endsWith(
        `${routes.toProjects({ accountId: 'testAcc' })}?orgId=${
          getOrgMockData.data.data.organizationResponse.organization.identifier
        }`
      )
    ).toBeTruthy()
  })
  test('Manage Organizations', async () => {
    const back = getByText('Manage Organizations /')
    fireEvent.click(back)
    await waitFor(() => getByTestId('location'))
    expect(getByTestId('location').innerHTML.endsWith(routes.toOrganizations({ accountId: 'testAcc' }))).toBeTruthy()
  })
  test('Route Resources', async () => {
    const resources = getByText('Resources')
    fireEvent.click(resources)
    await waitFor(() => getByTestId('location'))
    expect(
      getByTestId('location').innerHTML.endsWith(
        routes.toOrgResources({
          accountId: 'testAcc',
          orgIdentifier: getOrgMockData.data.data.organizationResponse.organization.identifier
        })
      )
    ).toBeTruthy()
  })
  test('Route Governance', async () => {
    const governance = getByText('Governance')
    fireEvent.click(governance)
    await waitFor(() => getByTestId('location'))
    expect(
      getByTestId('location').innerHTML.endsWith(
        routes.toOrgGovernance({
          accountId: 'testAcc',
          orgIdentifier: getOrgMockData.data.data.organizationResponse.organization.identifier
        })
      )
    ).toBeTruthy()
  })
  test('Route Git Sync', async () => {
    const git = getByText('Git Sync')
    fireEvent.click(git)
    await waitFor(() => getByTestId('location'))
    expect(
      getByTestId('location').innerHTML.endsWith(
        routes.toOrgGitSync({
          accountId: 'testAcc',
          orgIdentifier: getOrgMockData.data.data.organizationResponse.organization.identifier
        })
      )
    ).toBeTruthy()
  }),
    test('Click on Add Admin', async () => {
      const plus = getAllByText(container, '+')[0]
      await act(async () => {
        fireEvent.click(plus)
        await waitFor(() => getAllByText(document.body, 'Invite Collaborators')[0])
      })
      const form = findDialogContainer()
      expect(form).toBeTruthy()
    }),
    test('Click on Add Collaborator', async () => {
      const plus = getAllByText(container, '+')[1]
      await act(async () => {
        fireEvent.click(plus)
        await waitFor(() => getAllByText(document.body, 'Invite Collaborators')[0])
      })
      const form = findDialogContainer()
      expect(form).toBeTruthy()
    })
})
