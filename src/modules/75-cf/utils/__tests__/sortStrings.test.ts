import { sortStrings } from '@cf/utils/sortStrings'

describe('sortStrings', () => {
  test('it should sort all lowercase', () => {
    expect(sortStrings(['xyz', 'jkl', 'abc'])).toEqual(['abc', 'jkl', 'xyz'])
  })

  test('it should sort all uppercase', () => {
    expect(sortStrings(['XYZ', 'JKL', 'ABC'])).toEqual(['ABC', 'JKL', 'XYZ'])
  })

  test('it should sort mixed-case', () => {
    expect(sortStrings(['xyz', 'JKL', 'abc'])).toEqual(['abc', 'JKL', 'xyz'])
  })

  test('it should handle accented characters', () => {
    expect(sortStrings(['xyz', 'ÁBD', 'abc', 'âbä'])).toEqual(['âbä', 'abc', 'ÁBD', 'xyz'])
  })
})
