import React from 'react'

import { render } from '@testing-library/react'
import { SidebarMounter } from '../Sidebar'

describe('common sidebar tests', () => {
  test('init', () => {
    const { container } = render(<SidebarMounter />)
    expect(container).toBeDefined()
  })
})
