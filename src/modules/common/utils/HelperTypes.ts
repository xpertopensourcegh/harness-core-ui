import type { XhrResponse } from '@wings-software/xhr-async'

interface XhrHookResponseExtra {
  error?: string
  errors?: unknown
  success?: boolean
}

export type ResponseWrapper<T, U extends string = 'response'> = Omit<XhrResponse<T>, 'response'> &
  Partial<Record<U, T>> &
  XhrHookResponseExtra
