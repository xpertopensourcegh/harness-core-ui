import { sortOptions, Option } from '@cf/utils/sortOptions'

const makeOpt = (val: string): Option => ({ label: val, value: val })

describe('sortOptions', () => {
  test('it should sort all lowercase', () => {
    const opt1 = makeOpt('abc')
    const opt2 = makeOpt('jkl')
    const opt3 = makeOpt('xyz')

    expect(sortOptions([opt3, opt2, opt1])).toEqual([opt1, opt2, opt3])
  })

  test('it should sort all uppercase', () => {
    const opt1 = makeOpt('ABC')
    const opt2 = makeOpt('JKL')
    const opt3 = makeOpt('XYZ')

    expect(sortOptions([opt3, opt2, opt1])).toEqual([opt1, opt2, opt3])
  })

  test('it should sort mixed-case', () => {
    const opt1 = makeOpt('abc')
    const opt2 = makeOpt('JKL')
    const opt3 = makeOpt('xyz')

    expect(sortOptions([opt3, opt2, opt1])).toEqual([opt1, opt2, opt3])
  })

  test('it should handle accented characters', () => {
    const opt1 = makeOpt('âbä')
    const opt2 = makeOpt('abc')
    const opt3 = makeOpt('ÁBD')
    const opt4 = makeOpt('xyz')

    expect(sortOptions([opt4, opt3, opt1, opt2])).toEqual([opt1, opt2, opt3, opt4])
  })
})
