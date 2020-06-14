import React from 'react'

import { render } from '@testing-library/react'
import { SidebarLink } from '../SidebarLink'

describe('SidebarLink tests', () => {
  test('default ', () => {
    const { container, getByText } = render(<SidebarLink label="sample" href="/sample" selected={true} icon="cross" />)
    expect(container).toBeDefined()
    expect(getByText('sample')).toBeDefined()
  })
})
