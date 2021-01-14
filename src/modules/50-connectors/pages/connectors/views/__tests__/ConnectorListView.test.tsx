import React from 'react'
import { render, waitFor, queryByText, act, fireEvent } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'

import {
  connectorsData,
  catalogueData,
  statisticsMockData,
  filters
} from '@connectors/pages/connectors/__tests__/mockData'
import ConnectorsListView from '../ConnectorsListView'

jest.mock('react-timeago', () => () => 'dummy date')

const fetchConnectors = () => Promise.resolve(connectorsData)

const reloadTestConnection = jest.fn()
jest.mock('services/cd-ng', () => ({
  useGetConnectorStatistics: jest.fn().mockImplementation(() => Promise.resolve(statisticsMockData)),
  useGetConnectorCatalogue: jest.fn().mockImplementation(() => Promise.resolve(catalogueData)),
  useGetConnectorListV2: jest.fn().mockImplementation(() => ({ mutate: fetchConnectors })),
  useGetFilterList: jest.fn().mockImplementation(() => {
    return { data: filters, loading: false }
  }),
  usePostFilter: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useUpdateFilter: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useDeleteFilter: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),

  useDeleteConnector: jest.fn().mockImplementation(() => Promise.resolve()),
  useGetTestConnectionResult: jest.fn().mockImplementation(() => {
    return { data: {}, refetch: reloadTestConnection, error: null }
  })
}))

describe('Connectors List Test', () => {
  const props = {
    data: connectorsData.data as any,
    reload: jest.fn(),
    openConnectorModal: jest.fn(),
    gotoPage: jest.fn()
  }
  const setup = () =>
    render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsListView {...props} />
      </TestWrapper>
    )

  test('Initial render should match snapshot', async () => {
    const { container } = setup()

    await waitFor(() => queryByText(container, 'Connectors'))
    expect(container).toMatchSnapshot()
  })

  test('Click on Test button', async () => {
    const { container, getAllByText } = setup()

    await waitFor(() => queryByText(container, 'Connectors'))
    const testBtn = getAllByText('TEST')[0]

    act(async () => {
      await fireEvent.click(testBtn)
    })

    expect(container).toMatchSnapshot()
  })
})
