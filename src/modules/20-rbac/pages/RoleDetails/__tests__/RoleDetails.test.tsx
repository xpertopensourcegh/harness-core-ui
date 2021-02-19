import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import RoleDetails from '../RoleDetails'
import { permissionListMockData, resourceTypesMockData, roleMockData } from './mock'

jest.useFakeTimers()

jest.mock('services/cd-ng', () => ({
  useGetResourceTypes: jest.fn().mockImplementation(() => {
    return { data: resourceTypesMockData, refetch: jest.fn(), error: null }
  })
}))

jest.mock('services/rbac', () => ({
  useGetRole: jest.fn().mockImplementation(() => {
    return { data: roleMockData, refetch: jest.fn(), error: null }
  }),
  useUpdateRole: jest.fn().mockImplementation(() => jest.fn()),
  useGetPermissionList: jest.fn().mockImplementation(() => {
    return { data: permissionListMockData, refetch: jest.fn(), error: null }
  })
}))

jest.mock('react-timeago', () => () => 'dummy date')

describe('Role Details Page', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <RoleDetails />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
