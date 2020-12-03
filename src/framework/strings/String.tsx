import React from 'react'
import { render } from 'mustache'
import { get } from 'lodash-es'

import { useAppStore } from 'framework/AppStore/AppStoreContext'

export interface UseStringsReturn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getString(key: string, vars?: Record<string, any>): string
}

export function useStrings(namespace = 'global'): UseStringsReturn {
  const { strings } = useAppStore()

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

export interface StringProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  namespace: string
  stringID: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vars?: Record<string, any>
  useRichText?: boolean
  tagName: keyof JSX.IntrinsicElements
}

export function String(props: StringProps): React.ReactElement | null {
  const { namespace, stringID, vars, useRichText, tagName: Tag, ...rest } = props
  const { getString } = useStrings(namespace)

  try {
    const text = getString(stringID, vars)

    return useRichText ? (
      <Tag {...(rest as unknown)} dangerouslySetInnerHTML={{ __html: text }} />
    ) : (
      <Tag {...(rest as unknown)}>{text}</Tag>
    )
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      return <Tag style={{ color: 'var(--red-500)' }}>{e.message}</Tag>
    }

    return null
  }
}

String.defaultProps = {
  namespace: 'global',
  tagName: 'span'
}
