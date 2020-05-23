import type { RouteEntry, RouteEntryURLArgs } from 'framework/types/route-types'
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
 * `RouteEntry.url()` with an extra nullable validation for params fields.
 * @param routeEntry Route entry object.
 * @param params Route entry's url() parameters.
 */
export function linkTo(routeEntry: RouteEntry, params?: RouteEntryURLArgs): string {
  if (params) {
    const nullableFields = Object.keys(params).filter(key => params[key] === null || params[key] === undefined)
    if (nullableFields?.length) {
      const { module, pageId, path, title } = routeEntry

      logger.warn(`Calling linkTo() with problematic null/undefined arguments (${nullableFields.join(', ')}).`, {
        module,
        pageId,
        path,
        title
      })
    }
  }
  return routeEntry.url(params)
}
