import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from 'modules/common/utils/testUtils'
import SecretsList from '../views/SecretsListView/SecretsList'

import mockData from './secretsListMock.json'
jest.mock('react-timeago', () => () => 'dummy date')

describe('Secrets List', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <SecretsList secrets={mockData as any} />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'dummyid'))
    expect(container).toMatchSnapshot()
  })
})
