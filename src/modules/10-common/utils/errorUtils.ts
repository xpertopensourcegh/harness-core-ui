const HTTP_STATUS_OK = 200

export function shouldShowError(e: any): boolean {
  if (e?.status !== HTTP_STATUS_OK) {
    return false
  }
  if (
    e?.message === 'Failed to fetch: The user aborted a request.' ||
    e?.message === 'Failed to fetch: Failed to fetch' ||
    e?.message === 'Failed to fetch: 504 Gateway Timeout'
  ) {
    return false
  }
  return true
}
