import { routeRegistry } from 'framework/registry'

describe('routeRegistry Tests', () => {
  test('All routes must have unique path', () => {
    const paths = Object.values(routeRegistry).map(({ path }) => path)
    expect(paths.length).toEqual(new Set(paths).size)
  })

  test('All routes must have unique pageId', () => {
    const pageIds = Object.values(routeRegistry).map(({ pageId }) => pageId)
    expect(pageIds.length).toEqual(new Set(pageIds).size)
  })

  test('All routes must have path start with / except 404 route', () => {
    const invalidPaths = Object.values(routeRegistry).filter(({ path }) => !path.startsWith('/'))

    // only "Page Not Found" should be in invalidPaths
    expect(invalidPaths.length).toEqual(1)
    expect(invalidPaths[0].path).toEqual('*')
  })
})
