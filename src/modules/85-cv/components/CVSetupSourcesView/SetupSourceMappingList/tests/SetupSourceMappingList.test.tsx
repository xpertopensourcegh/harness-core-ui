import { Classes } from '@blueprintjs/core'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uicore'
import React from 'react'
import { SetupSourceMappingList } from '../SetupSourceMappingList'

jest.mock('@cv/components/TableFilter/TableFilter', () => ({
  ...(jest.requireActual('@cv/components/TableFilter/TableFilter') as any),
  TableFilter: function Mock(props: any) {
    return <Container className="filter" onClick={() => props.onFilter('4')} />
  }
}))

describe('Unit tests for SetupSourceMappingList', () => {
  test('Ensure that when error is passed, the error is displayed', async () => {
    const onClickFn = jest.fn()
    const { container, getByText } = render(
      <SetupSourceMappingList
        tableProps={{ data: [], columns: [] }}
        mappingListHeaderProps={{
          mainHeading: 'main',
          subHeading: 'sub'
        }}
        error={{
          message: 'mockError',
          onClick: onClickFn
        }}
        tableFilterProps={{ isItemInFilter: jest.fn() }}
      />
    )

    await waitFor(() => expect(getByText('mockError')))
    const retryButton = container.querySelector('button')
    if (!retryButton) {
      throw Error('Button was not rendered.')
    }

    fireEvent.click(retryButton)
    await waitFor(() => expect(onClickFn).toHaveBeenCalled())
  })

  test('Ensure that when loading is passed the loading state is rendered', async () => {
    const { container } = render(
      <SetupSourceMappingList<{ c: string; s: string; t: string; y: string }>
        tableProps={{
          data: [],
          columns: [
            { Header: 'asdad', accessor: 'c' },
            { accessor: 's', Header: 'asdsdfad' },
            { accessor: 't', Header: 'sdklfjksl' },
            { accessor: 'y', Header: 'sdlkfjsdlfj' }
          ]
        }}
        tableFilterProps={{ isItemInFilter: jest.fn() }}
        mappingListHeaderProps={{
          mainHeading: 'main',
          subHeading: 'sub'
        }}
        loading={true}
      />
    )

    await waitFor(() => expect(container.querySelectorAll(`[class*="${Classes.SKELETON}"]`).length).toBe(24))
  })

  test('Ensure that when filter is applied the corresponding entries are displayed', async () => {
    const { container, getByText } = render(
      <SetupSourceMappingList<{ c: string; s: string; t: string; y: string }>
        tableProps={{
          data: [
            { c: 'sd', s: 'dsfs', t: 'sdfsdf', y: 'sdfsdfsdf' },
            { c: 's432d', s: 'ds234fs', t: 'sd23fsdf', y: 'sdf243sdfsdf' }
          ],
          columns: [
            { Header: 'asdad', accessor: 'c' },
            { accessor: 's', Header: 'asdsdfad' },
            { accessor: 't', Header: 'sdklfjksl' },
            { accessor: 'y', Header: 'sdlkfjsdlfj' }
          ]
        }}
        mappingListHeaderProps={{
          mainHeading: 'main',
          subHeading: 'sub'
        }}
        tableFilterProps={{
          isItemInFilter: (_, item) => {
            return item.c === 's432d'
          }
        }}
        loading={false}
      />
    )

    await waitFor(() => expect(container.querySelectorAll(`[role="row"]`).length).toBe(3))
    const filter = container.querySelector('.filter')
    if (!filter) {
      throw Error('filter did not render.')
    }

    fireEvent.click(filter)
    await waitFor(() => expect(container.querySelectorAll(`[role="row"]`).length).toBe(2))
    expect(getByText('s432d')).not.toBeNull()
  })
})
