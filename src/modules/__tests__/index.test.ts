import { routeRegistry } from 'modules'

describe('routeRegistry Tests', () => {
  test('All routes must have unique path', () => {
    const paths = Object.values(routeRegistry).map(({ path }) => path)
    expect(paths.length).toEqual(new Set(paths).size)
  })

  test('All routes must have unique pageId', () => {
    const pageIds = Object.values(routeRegistry).map(({ pageId }) => pageId)
    expect(pageIds.length).toEqual(new Set(pageIds).size)
  })
})
