import type { Route, NestedRoute } from '../types/Route'
import { loggerFor } from '../logging/logging'
import SessionToken from './SessionToken'
import { ModuleName } from '../types/ModuleName'

const logger = loggerFor(ModuleName.FRAMEWORK)

export const AUTH_ROUTE_PATH_PREFIX = '/account/:accountId'

export function buildLoginUrlFrom401Response(message?: string): string {
  const { href } = window.location
  const prefix = message ? `/#/login?message=${encodeURIComponent(message)}&returnUrl=` : '/#/login?returnUrl='

  return href.includes(prefix) ? href : prefix + encodeURIComponent(href)
}

/**
 * Prefix an authenticated route's `path` with `/account/:accountId`.
 */
export function routePath(route: Pick<Route, 'authenticated' | 'path'>): string {
  return route.authenticated === false
    ? route.path
    : `${route.path.startsWith(AUTH_ROUTE_PATH_PREFIX) ? '' : AUTH_ROUTE_PATH_PREFIX}${route.path}`
}

/**
 * Normalize route URL used when contructing route URL in a route definition's url() function.
 * @param route Route informaiton.
 * @param url Constructed URL.
 */
export function routeURL<T>(route: Route<T> | NestedRoute<T>, url: string): string {
  if (!url || url.split('/').find(word => /null|undefined/i.test(word))) {
    logger.warn(`Route url is constructed with problematic null/undefined argument(s) (${url}).`)
  }

  // Authenticated route paths are always prefixed with `/account/:accountId`
  return `${route.authenticated === false ? '' : `/account/${SessionToken.accountId()}`}${url}`
}
