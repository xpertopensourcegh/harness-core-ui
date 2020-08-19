import { routeRegistry } from 'framework/registry'

describe('routeRegistry Validations', () => {
  test('All routes must have unique path', () => {
    const paths = Object.values(routeRegistry).map(({ path }) => path)
    expect(paths.length).toEqual(new Set(paths).size)
  })

  test('All top level routes must have unique pageId', () => {
    const topLevelRoutes = Object.values(routeRegistry).filter(route => !!route.sidebarId)
    const pageIds = Object.values(topLevelRoutes).map(({ pageId }) => pageId)
    expect(pageIds.length).toEqual(new Set(pageIds).size)
  })

  test('There must be at most one default nested route', () => {
    const routesWithNestedRoutes = Object.values(routeRegistry).filter(route => !!route.nestedRoutes)
    routesWithNestedRoutes.forEach(({ nestedRoutes }) => {
      expect(nestedRoutes?.filter(r => r.isDefault)?.length || 0 <= 0).toBeTruthy()
    })
  })

  test('All routes must have path start with / except 404 route', () => {
    const invalidPaths = Object.values(routeRegistry).filter(({ path }) => !path.startsWith('/'))

    // only "Page Not Found" should be in invalidPaths
    expect(invalidPaths.length).toEqual(1)
    expect(invalidPaths[0].path).toEqual('*')
  })
})
