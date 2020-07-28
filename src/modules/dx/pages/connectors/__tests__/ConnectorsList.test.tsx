import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from 'modules/common/utils/testUtils'
import ConnectorsList from '../ConnectorsList'
import mockData from '../__tests__/mockData'

jest.mock('react-timeago', () => () => 'dummy date')

describe('Secrets List', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsList
          mockData={{
            data: mockData as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'dummyid'))
    expect(container).toMatchSnapshot()
  })
})
