import { Routes } from '../route/Routes'

describe('Routes Tests', () => {
  test('Routes must not have duplicate paths', () => {
    const paths = Object.values(Routes).map(({ path }) => path)
    expect(paths.length).toEqual(new Set(paths).size)
  })
})
