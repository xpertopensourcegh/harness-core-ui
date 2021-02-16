const CLIENT_SERVER_ERROR_CODES = [400, 401, 403, 404, 500, 502, 503, 504]

export function shouldShowError(e: any): boolean {
  if (CLIENT_SERVER_ERROR_CODES.includes(e?.status)) {
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
