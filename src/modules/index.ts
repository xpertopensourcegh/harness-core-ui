/*
 * This file exports Modules integration points (Framework to consume).
 */
import type { ModuleRoutes, RouteEntry, KVO } from 'framework'
import * as DXRoutes from './dx/routes'
import * as CommonRoutes from './common/routes'
import * as CVRoutes from './cv/routes'

export const Routes: Readonly<ModuleRoutes> = Object.assign(
  Object.entries(Object.assign({}, DXRoutes, CVRoutes, CommonRoutes)).reduce(
    (_routes: KVO<RouteEntry>, [key, value]) => {
      if (value !== CommonRoutes.CommonPageNotFound) {
        _routes[key] = value
      }
      return _routes
    },
    {}
  ),
  // PageNotFoundRoute must be the last (its routing path is `*`)
  { CommonPageNotFound: CommonRoutes.CommonPageNotFound }
)

export const Modules = [{}]
