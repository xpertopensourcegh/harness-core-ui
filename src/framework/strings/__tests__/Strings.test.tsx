/* eslint-disable string-exists-in-yaml */
import React from 'react'
import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

import strings from 'strings/strings.en.yaml'

import { String, useStrings } from '../String'
import { AppStoreContext as StringsContext, AppStoreContextProps } from '../../AppStore/AppStoreContext'

const value: AppStoreContextProps = {
  strings,
  featureFlags: {},
  updateAppStore: jest.fn()
}
describe('String tests', () => {
  test('renders strings with simple id', () => {
    const { container } = render(
      <StringsContext.Provider value={value}>
        <String stringID="harness" />
      </StringsContext.Provider>
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <span>
          Harness
        </span>
      </div>
    `)
  })

  test('renders error when key not found', () => {
    const { container } = render(
      <StringsContext.Provider value={value}>
        <String stringID="harnes" />
      </StringsContext.Provider>
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <span>
          No valid template with id "harnes" found in any namespace
        </span>
      </div>
    `)
  })

  test('renders strings with nested value', () => {
    const { container } = render(
      <StringsContext.Provider
        value={{
          ...value,
          strings: {
            global: { a: { b: 'Test Value 1' } },
            namespace: { a: { b: 'Test Value 2' } }
          }
        }}
      >
        <String stringID="a.b" />
      </StringsContext.Provider>
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <span>
          Test Value 1
        </span>
      </div>
    `)
  })

  test('renders strings with override value', () => {
    const { container } = render(
      <StringsContext.Provider
        value={{
          ...value,
          strings: {
            global: { a: { b: 'Test Value 1' } },
            namespace: { a: { b: 'Test Value 2' } }
          }
        }}
      >
        <String stringID="a.b" namespace="namespace" />
      </StringsContext.Provider>
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <span>
          Test Value 2
        </span>
      </div>
    `)
  })

  test('renders strings with global fallback', () => {
    const { container } = render(
      <StringsContext.Provider
        value={{
          ...value,
          strings: {
            global: { a: { b: 'Test Value 1' } }
          }
        }}
      >
        <String stringID="a.b" namespace="namespace" />
      </StringsContext.Provider>
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <span>
          Test Value 1
        </span>
      </div>
    `)
  })
})

describe('useString tests', () => {
  describe('getString', () => {
    test('works with simple id', () => {
      const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
        <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
      )
      const { result } = renderHook(() => useStrings(), { wrapper })

      expect(result.current.getString('harness')).toBe(strings.global.harness)
    })

    test('works with nested values', () => {
      const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
        <StringsContext.Provider value={{ ...value, strings: { global: { a: { b: 'Test Value' } } } }}>
          {children}
        </StringsContext.Provider>
      )
      const { result } = renderHook(() => useStrings(), { wrapper })

      expect(result.current.getString('a.b')).toBe('Test Value')
    })

    test('works with overrides ', () => {
      const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
        <StringsContext.Provider
          value={{
            ...value,
            strings: {
              global: { a: { b: 'Test Value 1' } },
              namespace: { a: { b: 'Test Value 2' } }
            }
          }}
        >
          {children}
        </StringsContext.Provider>
      )
      const { result } = renderHook(() => useStrings('namespace'), { wrapper })

      expect(result.current.getString('a.b')).toBe('Test Value 2')
    })

    test('works with global fallback', () => {
      const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
        <StringsContext.Provider value={{ ...value, strings: { global: { a: { b: 'Test Value' } } } }}>
          {children}
        </StringsContext.Provider>
      )
      const { result } = renderHook(() => useStrings('namespace'), { wrapper })

      expect(result.current.getString('a.b')).toBe('Test Value')
    })

    test('throws when key not found', () => {
      const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
        <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
      )
      const { result } = renderHook(() => useStrings(), { wrapper })

      expect(() => result.current.getString('harnes')).toThrowError(
        'No valid template with id "harnes" found in any namespace'
      )
    })
  })
})
