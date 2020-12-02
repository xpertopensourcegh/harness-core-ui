import React from 'react'
import { render } from '@testing-library/react'
import BuildInputs from '../BuildInputs'

describe('BuildInputs snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(<BuildInputs />)
    expect(container).toMatchSnapshot()
  })
})
