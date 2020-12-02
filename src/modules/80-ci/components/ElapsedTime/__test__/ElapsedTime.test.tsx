import React from 'react'
import { render } from '@testing-library/react'
import ElapsedTime from '../ElapsedTime'

describe('ElapsedTime snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(<ElapsedTime startTime={1606585312000} endTime={1606585313000} />)
    expect(container).toMatchSnapshot()
  })
})
