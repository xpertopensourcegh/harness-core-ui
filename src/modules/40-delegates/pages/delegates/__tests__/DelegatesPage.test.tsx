import React from 'react'
import { fireEvent, render, wait } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import DelegatesPage from '../DelegatesPage'

describe('Delegates Page', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/delegates" pathParams={{ accountId: 'dummy' }}>
        <DelegatesPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('click of new delegate button', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/delegates" pathParams={{ accountId: 'dummy' }}>
        <DelegatesPage />
      </TestWrapper>
    )
    const buttonDelegate = container?.querySelector('#delegateButton')
    fireEvent.click(buttonDelegate!)
    await wait()
    expect(container).toMatchSnapshot()
  })
})
