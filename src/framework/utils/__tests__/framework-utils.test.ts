import { buildLoginUrlFrom401Response, linkTo } from '../framework-utils'
import { Route, ModuleName, PageLayout, SidebarIdentifier } from '../../exports'
describe('framework util tests', () => {
  test('buildLoginUrlFrom401Response test', () => {
    const url = buildLoginUrlFrom401Response('fake message')
    expect(url).toBeDefined()
  })

  test('linkTo test', () => {
    const sampleRoute: Route = {
      module: ModuleName.COMMON,
      sidebarId: SidebarIdentifier.NONE,
      layout: PageLayout.BlankLayout,
      path: '/sample',
      title: 'Sample Page',
      pageId: 'sample',
      url: () => '/login',
      component: '<div />',
      authenticated: false
    }

    const link = linkTo(sampleRoute)
    expect(link).toBeDefined()
  })
})
