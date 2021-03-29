import { useState } from 'react'

export interface UseBooleanStatusReturn {
  state: boolean
  toggle(): void
  open(): void
  close(): void
}

export function useBooleanStatus(init?: boolean): UseBooleanStatusReturn {
  const [state, setState] = useState(!!init)

  return {
    state,
    toggle() {
      setState(s => !s)
    },
    open() {
      setState(true)
    },
    close() {
      setState(false)
    }
  }
}
