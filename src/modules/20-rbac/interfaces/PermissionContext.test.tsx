import { shallowCompare } from './PermissionsContext'

describe('shallowCompare', () => {
  test('check behaviour', () => {
    expect(shallowCompare({ a: 1, b: 2 }, { a: 1, b: 2 }, ['a', 'b'])).toBe(true)
    expect(shallowCompare({ a: 1, b: 3 }, { a: 1, b: 2 }, ['a', 'b'])).toBe(false)
    expect(shallowCompare({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 }, ['a', 'b'])).toBe(true)
    expect(shallowCompare({}, {}, [])).toBe(true)
    expect(shallowCompare({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 }, ['a', 'b', 'c'])).toBe(false)
  })
})
