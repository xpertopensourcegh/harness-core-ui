import React from 'react'

import { render } from '@testing-library/react'
import { BlankLayout } from '../EmptyLayout'

describe('BlankLayout tests', () => {
  test('default layout ', () => {
    const { container } = render(<BlankLayout />)
    const els = container.getElementsByClassName('sidebar')
    expect(els.length).not.toBeGreaterThan(0)
  })
})
