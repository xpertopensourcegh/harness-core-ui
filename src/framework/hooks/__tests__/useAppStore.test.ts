import { useAppStoreReader, useAppStoreWriter } from '../useAppStore'

describe('useAppStorage tests', () => {
  test('init test', () => {
    expect(useAppStoreWriter).toBeDefined()
    expect(useAppStoreReader).toBeDefined()
  })
})
