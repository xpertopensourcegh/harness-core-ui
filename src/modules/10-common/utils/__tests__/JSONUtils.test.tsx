import { sanitize } from '../JSONUtils'

describe('YamlUtils Test', () => {
  test('Check sanitize method', () => {
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
    const output = sanitize(input)
    expect(output?.a).toBe(undefined)
    expect(output?.b).toBe(undefined)
    expect(output?.c?.d?.e).toBe(undefined)
    expect(output?.f[0]?.g?.h).toBe(undefined)
    expect(output?.x).toBe(undefined)
  })

  test('Check sanitize method with custom yaml sanity config', () => {
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
    const output = sanitize(input, {
      removeEmptyString: false,
      removeEmptyArray: false,
      removeEmptyObject: false
    })
    expect(output?.a).toBe('')
    expect(JSON.stringify(output?.b) === JSON.stringify({})).toBeTruthy()
    expect(output?.c?.d?.e).toBe('')
    expect(output?.f[0]?.g?.h).toBe('')
    expect(JSON.stringify(output?.x) === JSON.stringify([])).toBeTruthy()
  })
})
