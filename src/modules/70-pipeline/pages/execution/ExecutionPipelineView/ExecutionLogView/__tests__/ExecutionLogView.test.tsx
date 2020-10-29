import React from 'react'
import { render } from '@testing-library/react'

import ExecutionLogView from '../ExecutionLogView'

describe('<ExecutionLogView /> tests', () => {
  test('snapshot test', () => {
    const { container } = render(<ExecutionLogView />)
    expect(container).toMatchSnapshot()
  })
})
