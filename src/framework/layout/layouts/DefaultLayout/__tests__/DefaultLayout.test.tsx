import React from 'react'

import { render } from '@testing-library/react'
import { DefaultLayout, NoMenuLayout } from '../DefaultLayout'

describe('DefaultLayout tests', () => {
  test('default layout ', () => {
    const { container } = render(<DefaultLayout />)
    const els = container.getElementsByClassName('sidebar')
    expect(els).toBeDefined()
  })

  test('no menu layout', () => {
    const { container } = render(<NoMenuLayout />)
    const els = container.getAttribute('withoutMenu')
    expect(els).toBeDefined()
  })
})
