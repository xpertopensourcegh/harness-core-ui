import React from 'react'
import { render } from '@testing-library/react'
import StageSetupShell from '../StageSetupShell'

describe('StageSetupShell Snapshot', () => {
  test('should render ServiceSpecifications component', () => {
    const { container } = render(<StageSetupShell />)
    expect(container).toMatchSnapshot()
  })
})
