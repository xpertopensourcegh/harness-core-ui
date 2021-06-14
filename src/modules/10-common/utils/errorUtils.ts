export function shouldShowError(e: any): boolean {
  const hideMessagesForStatusCodes = [502, 503]
  if (
    e?.message === 'Failed to fetch: The user aborted a request.' ||
    e?.message === 'Failed to fetch: Failed to fetch' ||
    e?.message === 'Failed to fetch: 504 Gateway Timeout' ||
    hideMessagesForStatusCodes.includes(e?.status)
  ) {
    return false
  }
  return true
}

/* TODO Don't see proper types for this new errors format, replace Record<string, any> with more stricter type when available */
export function getErrorInfoFromErrorObject(error: Record<string, any>): string {
  /* TODO @vardan extend this to N errors instead of first error */
  return error?.data?.message || error?.data?.errors?.[0]?.error
    ? `${error?.data.errors[0].fieldId} ${error?.data.errors[0]?.error}`
    : error?.message || ''
}
