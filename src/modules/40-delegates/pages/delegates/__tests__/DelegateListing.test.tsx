import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import DelegatesListing from '../DelegateListing'
import Delegatesmock from './Delegatesmock.json'

jest.mock('modules/10-common/components/YAMLBuilder/YamlBuilder', () => {
  const ComponentToMock = () => <div>yamlDiv</div>
  return ComponentToMock
})

jest.mock('services/portal', () => ({
  useGetDelegatesStatusV2: () => ({
    data: Delegatesmock,
    refetch: jest.fn()
  }),
  useDeleteDelegate: () => ({
    mutate: jest.fn()
  })
}))

jest.mock('../../../modals/DeleteDelegateModal/useDeleteDelegateModal', () => ({
  useDeleteDelegateModal: () => ({ openDialog: jest.fn() })
}))

describe('Delegates Listing', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/delegates" pathParams={{ accountId: 'dummy' }}>
        <DelegatesListing />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
