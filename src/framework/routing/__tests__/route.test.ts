import { Routes } from '../RoutingTypes'

describe('Routes Tests', () => {
  test('All routes must have unique path', () => {
    const paths = Object.values(Routes).map(({ path }) => path)
    expect(paths.length).toEqual(new Set(paths).size)
  })

  test('All routes must have unique pageId', () => {
    const pageIds = Object.values(Routes).map(({ pageId }) => pageId)
    expect(pageIds.length).toEqual(new Set(pageIds).size)
  })
})
