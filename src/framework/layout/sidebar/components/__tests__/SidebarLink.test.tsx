import React from 'react'
import { render } from '@testing-library/react'
import { HashRouter, Route } from 'react-router-dom'
import { SidebarLink } from '../SidebarLink'

describe('SidebarLink tests', () => {
  test('default ', () => {
    const { container, getByText } = render(
      <HashRouter>
        <Route path="*">
          <SidebarLink label="sample" href="/sample" selected={true} icon="cross" />
        </Route>
      </HashRouter>
    )
    expect(container).toBeDefined()
    expect(container.querySelector('a[href="sample"]')).toBeDefined()
    expect(getByText('sample')).toBeDefined()
  })
})
