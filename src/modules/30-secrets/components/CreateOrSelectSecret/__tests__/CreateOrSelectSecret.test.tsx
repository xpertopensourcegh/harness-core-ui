import React from 'react'
import { render, wait, fireEvent, act } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'

import CreateOrSelectSecret from '../CreateOrSelectSecret'

import connectorsListMockData from './connectorsListMockdata.json'
import secretsListMockData from './secretsListMockData.json'

const successCallback = jest.fn()

describe('CreateOrSelectSecret', () => {
  test('render', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'dummy' }}>
        <CreateOrSelectSecret
          type="SecretText"
          onSuccess={successCallback}
          connectorsListMockData={connectorsListMockData as any}
          secretsListMockData={secretsListMockData as any}
        />
      </TestWrapper>
    )
    await wait()
    expect(getByText('Create a new secret')).toBeDefined()
    expect(container).toMatchSnapshot()

    const $selectTab = getByText('Select an existing secret')
    await act(async () => {
      fireEvent.click($selectTab)
    })

    const $secret = getByText('demo-1')
    await act(async () => {
      fireEvent.click($secret)
    })
    expect(successCallback).toHaveBeenCalled()
  })
})
