import React from 'react'
import { buildLoginUrlFrom401Response } from '../framework-utils'
import { Route, ModuleName, PageLayout, SidebarIdentifier } from '../../exports'

describe('framework util tests', () => {
  test('buildLoginUrlFrom401Response test', () => {
    const url = buildLoginUrlFrom401Response('fake message')
    expect(url).toBeDefined()
  })

  test('Route url() test', () => {
    const Foo: React.FC = () => <div />
    const sampleRoute: Route = {
      module: ModuleName.COMMON,
      sidebarId: SidebarIdentifier.NONE,
      layout: PageLayout.BlankLayout,
      path: '/sample',
      title: 'Sample Page',
      pageId: 'sample',
      url: () => '/login',
      component: Foo,
      authenticated: false
    }

    const link = sampleRoute.url()
    expect(link).toBeDefined()
  })
})
