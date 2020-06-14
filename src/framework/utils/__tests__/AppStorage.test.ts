import AppStorage from '../AppStorage'

describe('AppStorage tests', () => {
  test('init', () => {
    AppStorage.set('sample', 'value')
    expect(AppStorage.has('sample')).toBeTruthy()
    expect(AppStorage.getAll()).toBeDefined()
    expect(AppStorage.get('sample')).toBeDefined()
    AppStorage.remove('sample')
    expect(AppStorage.has('sample')).toBeFalsy()
  })
})
