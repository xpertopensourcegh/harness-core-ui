import React, { createContext, useContext } from 'react'
import { render } from 'mustache'
import { get } from 'lodash-es'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StringsMap = Record<string, Record<string, any>>

export const StringsContext = createContext<StringsMap>({})

export interface UseStringsReturn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getString(key: string, vars?: Record<string, any>): string
}

export function useStrings(namespace = 'global'): UseStringsReturn {
  const strings = useContext(StringsContext)

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getString(key: string, vars: Record<string, any> = {}) {
      const template = get(strings[namespace] || strings.global, key)

      if (typeof template !== 'string') {
        throw new Error(`No valid template with id "${key}" found in any namespace`)
      }

      return render(template, vars)
    }
  }
}

export interface StringProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  namespace: string
  stringID: string
  vars?: Record<string, any>
  useRichText?: boolean
}

export function String(props: StringProps): React.ReactElement | null {
  const { namespace, stringID, vars, useRichText, ...rest } = props
  const { getString } = useStrings(namespace)

  try {
    const text = getString(stringID, vars)

    return useRichText ? <span {...rest} dangerouslySetInnerHTML={{ __html: text }} /> : <span {...rest}>{text}</span>
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      return <span style={{ color: 'var(--red-500)' }}>{e.message}</span>
    }

    return null
  }
}

String.defaultProps = {
  namespace: 'global'
}
