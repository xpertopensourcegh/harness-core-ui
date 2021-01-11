import { getConfig, getUsingFetch, GetUsingFetchProps } from 'services/config'
import type { GetTokenQueryParams } from 'services/logs'

/**
 * Generate token
 *
 * Generate an account level token to be used for log APIs
 *
 * TODO: consider remove this once DTO is ready
 */
export const getTokenPromise = (
  props: GetUsingFetchProps<string, void, GetTokenQueryParams, void>,
  signal?: RequestInit['signal']
) => getUsingFetch<string, void, GetTokenQueryParams, void>(getConfig('log-service'), `/token`, props, signal)

/**
 * Fetch logs access token
 */
export const fetchLogsAccessToken = (accountID: string) => {
  return getTokenPromise({ queryParams: { accountID } })
}
