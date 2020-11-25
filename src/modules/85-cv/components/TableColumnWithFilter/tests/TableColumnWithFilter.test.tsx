import { fireEvent, render, waitFor } from '@testing-library/react'
import React from 'react'
import { TableColumnWithFilter } from '../TableColumnWithFilter'

describe('Unit tests for TableWithColumnFilter', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  test('Ensure column name is rendered and function is called on rendered', async () => {
    const onFilterMock = jest.fn()
    const { container, getByText } = render(<TableColumnWithFilter onFilter={onFilterMock} columnName="Column1" />)
    await waitFor(() => expect(getByText('Column1')).not.toBeNull())
    const filterInput = container.querySelector('input')
    if (!filterInput) {
      throw Error('Filter input was not found.')
    }

    fireEvent.change(filterInput, { target: { value: 'solo-dolo' } })
    jest.runAllTimers()
    await waitFor(() => expect(onFilterMock).toHaveBeenCalledTimes(1))
    expect(onFilterMock).toHaveBeenCalledWith('solo-dolo')
  })
})
