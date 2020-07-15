import type { Route, RouteURLArgs } from 'framework/exports'
import { loggerFor } from 'framework/logging/logging'
import { ModuleName } from 'framework/types/ModuleName'
import SessionToken from './SessionToken'

const logger = loggerFor(ModuleName.FRAMEWORK)

export function buildLoginUrlFrom401Response(message?: string): string {
  const { href } = window.location
  const prefix = message ? `/#/login?message=${encodeURIComponent(message)}&returnUrl=` : '/#/login?returnUrl='

  return href.includes(prefix) ? href : prefix + encodeURIComponent(href)
}

/**
 * Utility function to create a link to a route. This is an alias of
 * `Route.url()` with an extra nullable validation for params fields.
 * @param route Route entry object.
 * @param params Route entry's url() parameters.
 * @params ignoreBaseName true to ignore basename (Used to generate link to use with
 * React Router's history.push/replace).
 */
export function linkTo(route: Route, params?: RouteURLArgs, ignoreBaseName?: boolean): string {
  const accountId = SessionToken.accountId()
  const basename =
    (!ignoreBaseName && location.href.split('/#/')[0].replace(`${location.protocol}//${location.host}`, '')) || false

  if (params) {
    const nullableFields = Object.keys(params).filter(key => params[key] === null || params[key] === undefined)
    if (nullableFields?.length) {
      const { module, pageId, path, title } = route

      logger.warn(`Calling linkTo() with problematic null/undefined arguments (${nullableFields.join(', ')}).`, {
        module,
        pageId,
        path,
        title
      })
    }
  }

  // Authenticated route paths are always prefixed with `/account/:accountId`
  return (
    `${
      route.authenticated === false ? '' : `${basename ? `${location.origin}${basename}/#` : ''}/account/${accountId}`
    }` + route.url(params)
  )
}
