export function shouldShowError(e: any): boolean {
  if (e?.message === 'Failed to fetch: The user aborted a request.') {
    return false
  }

  return true
}
