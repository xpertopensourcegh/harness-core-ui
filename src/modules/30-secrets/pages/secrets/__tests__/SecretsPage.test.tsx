import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import SecretsPage from '../SecretsPage'

import mockData from './secretsListMock.json'

jest.mock('../views/SecretsListView/SecretsList', () => () => null)

describe('Secrets Page', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <SecretsPage mock={{ loading: false, data: mockData as any }} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('render loading', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <SecretsPage mock={{ loading: true }} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('render error', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <SecretsPage mock={{ loading: false, error: { message: 'Something Went Wrong' } as any }} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
