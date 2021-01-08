import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import DelegateDetails from '../DelegateDetails'
import Delegatesmock from './Delegatesmock.json'

const mockGetCallFunction = jest.fn()
jest.mock('services/portal', () => ({
  getDelegateProfilesV2: jest.fn().mockImplementation(args => {
    mockGetCallFunction(args)
    return []
  })
}))

describe('Delegates Details Page', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/delegates" pathParams={{ accountId: 'dummy' }}>
        <DelegateDetails delegate={Delegatesmock.resource.delegates[0]} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
