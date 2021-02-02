import React from 'react'
import {
  render,
  waitFor,
  queryByText,
  fireEvent,
  findByText as findByTextAlt,
  findByText
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import routes from '@common/RouteDefinitions'
import { TestWrapper } from '@common/utils/testUtils'
import ConnectorsPage from '../ConnectorsPage'

import { connectorsData, catalogueData, statisticsMockData, filters } from './mockData'

jest.mock('react-timeago', () => () => 'dummy date')

const fetchConnectors = () => Promise.resolve(connectorsData)

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
  useGetTestConnectionResult: jest.fn().mockImplementation(() => Promise.resolve()),
  useDeleteConnector: jest.fn().mockImplementation(() => Promise.resolve())
}))

describe('Connectors Page Test', () => {
  const props = {
    mockData: {
      data: connectorsData as any,
      loading: false
    },
    catalogueMockData: {
      data: catalogueData as any,
      loading: false
    },
    statisticsMockData: {
      data: statisticsMockData as any,
      loading: false
    }
  }
  const setup = () =>
    render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage {...props} />
      </TestWrapper>
    )

  test('Initial render should match snapshot', async () => {
    const { container, getByText } = setup()
    const newConnectorBtn = getByText('New Connector')
    fireEvent.click(newConnectorBtn)
    await waitFor(() => queryByText(container, 'Connectors'))
    expect(container).toMatchSnapshot()
  })

  test('Render and check connector rows', async () => {
    const { findByText: findByConnectorText } = setup()
    connectorsData?.data?.content?.forEach(connector => {
      expect(findByConnectorText(connector?.connector?.name)).toBeDefined()
    })
  })

  test('Select and apply a filter', async () => {
    const renderProps = {
      ...Object.assign(props, {
        filtersMockData: {
          data: filters as any,
          loading: false
        }
      })
    }
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage {...renderProps} />
      </TestWrapper>
    )
    await act(async () => {
      const filterSelectorDropdown = container.querySelectorAll('.bp3-input-action [data-icon="caret-down"]')
      expect(filterSelectorDropdown[0]).toBeDefined()
      fireEvent.click(filterSelectorDropdown[0])
      await waitFor(() => expect(document.body.querySelector(`[class*="bp3-menu"]`)).not.toBeNull())
      const menu = document.body.querySelector(`[class*="bp3-menu"]`)
      if (!menu) {
        throw new Error('brp3 menu not rendered.')
      }
      fireEvent.click(menu.children[0])
    })
    expect(container).toMatchSnapshot()
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('Render filter panel', async () => {
    const renderProps = {
      ...Object.assign(props, {
        filtersMockData: {
          data: filters as any,
          loading: false
        }
      })
    }
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage {...renderProps} />
      </TestWrapper>
    )
    await act(async () => {
      const filterBtn = container?.querySelector('#ngfilterbtn')
      fireEvent.click(filterBtn!)
      await waitFor(() => {
        const portal = document.getElementsByClassName('bp3-portal')[0]
        expect(portal).toBeDefined()
        expect(portal).toMatchSnapshot()
      })
    })
  })

  test('Render and check create connector drawer', async () => {
    const { container } = setup()
    const newConnectorBtn = container?.querySelector('#newConnectorBtn')
    fireEvent.click(newConnectorBtn!)
    const portal = document.getElementsByClassName('bp3-portal')[0]
    expect(portal).toBeDefined()
    const ybOption = await waitFor(() => findByTextAlt(portal as HTMLElement, 'Create via YAML Builder'))
    expect(ybOption).toBeDefined()
    fireEvent.click(ybOption)
    expect(portal).toMatchSnapshot()
  })

  test('Filter connector by name', async () => {
    const { container } = setup()
    const input = container.querySelector('#filterConnectorByName')
    expect(input).toBeDefined()
    waitFor(() =>
      fireEvent.change(input!, {
        target: { value: 'SomeConnector' }
      })
    )
    expect(container).toMatchSnapshot()
  })

  test('Test Create Connector Panel', async () => {
    const { getByText, getByTestId } = setup()
    fireEvent.click(getByText('New Connector'))
    const portal = document.getElementsByClassName('bp3-portal')[0]
    expect(portal).toBeDefined()
    const createViaYBBtn = await findByText(portal as HTMLElement, 'YAML')
    expect(createViaYBBtn).toBeDefined()
    fireEvent.click(createViaYBBtn)
    expect(
      getByTestId('location').innerHTML.endsWith(routes.toCreateConnectorFromYaml({ accountId: 'dummy' }))
    ).toBeTruthy()
  })
})
