import { equals, includes, and, or, eq, ge, le, lt, gt } from '../rsql'

describe('rsql', () => {
  test('should generate correct rsql query', () => {
    expect(equals('name', 'john')).toBe('name==john')
    expect(includes('name', ['bruce', 'tony', 'stephen'])).toBe('name=in=(bruce,tony,stephen)')
    expect(and(equals('name', 'john'), includes('age', [10, 20, 30]))).toBe('(name==john;age=in=(10,20,30))')
    expect(or(equals('name', 'john'), includes('age', [10, 20, 30]))).toBe('(name==john,age=in=(10,20,30))')
    expect(and(eq('a', 'b'), gt('c', '1'), lt('d', 2), ge('e', 3), le('f', 4))).toBe(
      '(a==b;c=gt=1;d=lt=2;e=ge=3;f=le=4)'
    )
    expect(() => eq('name', '<special')).toThrow(Error)
  })
})
