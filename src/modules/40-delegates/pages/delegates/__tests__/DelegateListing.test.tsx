import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import DelegatesListing from '../DelegateListing'
import Delegatesmock from './Delegatesmock.json'

describe('Delegates Listing', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/delegates" pathParams={{ accountId: 'dummy' }}>
        <DelegatesListing delegateResponse={Delegatesmock} onClick={() => jest.fn()} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
