import React from 'react'
import { render } from '@testing-library/react'
import { data, columns } from './SampleColumnsData'
import CustomTable from '../CustomTable'

jest.spyOn(Date, 'now').mockImplementation(() => 1590908200000)
describe('CustomTable Snapshot', () => {
  test('should render CustomTable with Proper Data and Columns', () => {
    const { container } = render(<CustomTable data={data} columns={columns} />)
    expect(container).toMatchSnapshot()
  })
})
