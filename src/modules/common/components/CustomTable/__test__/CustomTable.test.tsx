import React from 'react'
import { render } from '@testing-library/react'
import { data, columns } from './SampleColumnsData'
import CustomTable from '../CustomTable'
import moment from 'moment-timezone'

jest.spyOn(Date, 'now').mockImplementation(() => 1588885751000)
describe('CustomTable Snapshot', () => {
  moment.tz.setDefault('PST')
  test('should render CustomTable with Proper Data and Columns', () => {
    const { container } = render(<CustomTable data={data} columns={columns} />)
    expect(container).toMatchSnapshot()
  })
})
