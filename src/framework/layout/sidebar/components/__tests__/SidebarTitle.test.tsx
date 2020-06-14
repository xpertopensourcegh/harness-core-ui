import React from 'react'

import { render } from '@testing-library/react'
import { SidebarTitle } from '../SidebarTitle'

describe('SidebarTitle tests', () => {
  test('default layout ', () => {
    const { container, getByText } = render(<SidebarTitle upperText="upper" lowerText="lower" />)
    expect(container).toBeDefined()
    expect(getByText('upper')).toBeDefined()
    expect(getByText('lower')).toBeDefined()
  })
})
