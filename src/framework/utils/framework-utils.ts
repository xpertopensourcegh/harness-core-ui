import type { RouteInfo, RouteInfoURLArgs } from 'framework'
import { loggerFor } from 'framework'
import { ModuleName } from 'framework/types/ModuleName'

const logger = loggerFor(ModuleName.FRAMEWORK)

export function buildLoginUrlFrom401Response(message?: string): string {
  const { href } = window.location
  const prefix = message ? `/#/login?message=${encodeURIComponent(message)}&returnUrl=` : '/#/login?returnUrl='

  return href.includes(prefix) ? href : prefix + encodeURIComponent(href)
}

/**
 * Utility function to create a link to a route. This is an alias of
 * `RouteInfo.url()` with an extra nullable validation for params fields.
 * @param routeInfo Route entry object.
 * @param params Route entry's url() parameters.
 */
export function linkTo(routeInfo: RouteInfo, params?: RouteInfoURLArgs): string {
  if (params) {
    const nullableFields = Object.keys(params).filter(key => params[key] === null || params[key] === undefined)
    if (nullableFields?.length) {
      const { module, pageId, path, title } = routeInfo

      logger.warn(`Calling linkTo() with problematic null/undefined arguments (${nullableFields.join(', ')}).`, {
        module,
        pageId,
        path,
        title
      })
    }
  }
  return routeInfo.url(params)
}
