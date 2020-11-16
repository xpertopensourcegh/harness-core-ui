import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ConnectorsPage from '../ConnectorsPage'
import { ManualK8s, catalogueData } from './mockData'

jest.mock('react-timeago', () => () => 'dummy date')

describe('Connectors Page Test', () => {
  test('render k8s manual config  connector row', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage
          mockData={{
            data: ManualK8s as any,
            loading: false
          }}
          catalogueMockData={{
            data: catalogueData as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    const newConnectorBtn = getByText('New Connector')
    fireEvent.click(newConnectorBtn)
    await waitFor(() => queryByText(container, 'Connectors'))
    expect(container).toMatchSnapshot()
  })
})
