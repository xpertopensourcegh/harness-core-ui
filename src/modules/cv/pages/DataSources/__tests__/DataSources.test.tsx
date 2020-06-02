import React from 'react'
import { render } from '@testing-library/react'

import DataSources from '../DataSources'

describe('DataSources', () => {
  test('default snapshot', () => {
    const { container } = render(<DataSources />)
    expect(container).toMatchSnapshot()
  })
})
