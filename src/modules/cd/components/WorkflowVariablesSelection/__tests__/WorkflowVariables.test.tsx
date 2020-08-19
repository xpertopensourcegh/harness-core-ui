import React from 'react'
import { render } from '@testing-library/react'
import WorkflowVariables from '../WorkflowVariables'

describe('WorkflowVariables Snapshot', () => {
  test('should render WorkflowVariables component', () => {
    const { container } = render(<WorkflowVariables />)
    expect(container).toMatchSnapshot()
  })
})
