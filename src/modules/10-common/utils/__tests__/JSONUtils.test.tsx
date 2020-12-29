import { sanitize } from '../JSONUtils'

const input = {
  a: '',
  b: {},
  c: {
    d: {
      e: ''
    }
  },
  f: [
    {
      g: {
        h: ''
      }
    }
  ],
  z: {},
  x: []
}

describe('YamlUtils Test', () => {
  test('Check sanitize method', () => {
    const output = sanitize(input)
    expect(output?.a).toBe(undefined)
    expect(output?.b).toBe(undefined)
    expect(output?.c?.d?.e).toBe(undefined)
    expect(output?.f[0]?.g?.h).toBe(undefined)
  })
})
