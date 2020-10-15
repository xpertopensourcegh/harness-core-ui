import React from 'react'
import { render } from '@testing-library/react'

import ExecutionInputsView from '../ExecutionInputsView'

describe('<ExecutionInputsView /> tests', () => {
  test('snapshot test', () => {
    const { container } = render(<ExecutionInputsView />)
    expect(container).toMatchSnapshot()
  })
})
