import React from 'react'
import { render } from '@testing-library/react'
import { data, columns } from './SampleColumnsData'
import CustomTable from '../CustomTable'

describe('CustomTable Snapshot', () => {
  test('should render CustomTable with Proper Data and Columns', () => {
    const { container } = render(<CustomTable data={data} columns={columns} />)
    expect(container).toMatchSnapshot()
  })
})
