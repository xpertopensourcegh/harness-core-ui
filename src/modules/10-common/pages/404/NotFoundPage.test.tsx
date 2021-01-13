import React from 'react'
import { render } from '@testing-library/react'

import NotFoundPage from './NotFoundPage'

describe('NotFoundPage', () => {
  test('render', () => {
    const { container } = render(<NotFoundPage />)
    expect(container).toMatchSnapshot()
  })
})
