import type { XhrResponse } from '@wings-software/xhr-async'

interface XhrHookResponseExtra {
  errors?: unknown
  success?: boolean
}

export type ServiceResponse<T, U extends string = 'response'> = Promise<
  Omit<XhrResponse<T>, 'response'> & Partial<Record<U, T>> & XhrHookResponseExtra
>
