import React from 'react'
import { render, RenderResult, waitFor } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import { accountPathProps, serviceAccountProps } from '@common/utils/routeUtils'
import { TestWrapper } from '@common/utils/testUtils'
import type { ResponseBoolean } from 'services/cd-ng'
import { serviceAccountsAggregate, apiKeyListAggregate, mockResponse } from './ServiceAccountDetailsMock'
import ServiceAccountDetails from '../ServiceAccountDetails'

const deleteServiceAccount = jest.fn()
const deleteServiceAccountMock = (): ResponseBoolean => {
  deleteServiceAccount()
  return mockResponse
}

jest.mock('services/cd-ng', () => ({
  useListAggregatedServiceAccounts: jest.fn().mockImplementation(() => {
    return { data: serviceAccountsAggregate, refetch: jest.fn(), error: null, loading: false }
  }),
  useListAggregatedApiKeys: jest.fn().mockImplementation(() => {
    return { data: apiKeyListAggregate, refetch: jest.fn(), error: null, loading: false }
  }),
  useDeleteApiKey: jest.fn().mockImplementation(() => ({ mutate: deleteServiceAccountMock }))
}))

describe('Service Account Details Page Test', () => {
  let container: HTMLElement
  let getAllByText: RenderResult['getAllByText']

  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path={routes.toServiceAccountDetails({ ...accountPathProps, ...serviceAccountProps })}
        pathParams={{ accountId: 'testAcc', serviceAccountIdentifier: 'serviceAccountId' }}
      >
        <ServiceAccountDetails />
      </TestWrapper>
    )
    container = renderObj.container
    getAllByText = renderObj.getAllByText
    await waitFor(() => getAllByText('accessControl'))
  })
  test('render data', () => {
    expect(container).toMatchSnapshot()
  })
})
