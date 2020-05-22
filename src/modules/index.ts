/*
 * This file exports Modules integration points for Framework to consume.
 */
import type { ModuleRoutes, RouteEntry, KVO } from 'framework'
import * as DXRoutes from './dx/routes'
import * as CommonRoutes from './common/routes'
import * as CVRoutes from './cv/routes'

export const Routes: Readonly<ModuleRoutes> = Object.assign(
  Object.entries(Object.assign({}, DXRoutes, CVRoutes, CommonRoutes)).reduce(
    (_routes: KVO<RouteEntry>, [key, value]) => {
      if (value !== CommonRoutes.CommonPageNotFoundRoute) {
        _routes[key] = value
      }
      return _routes
    },
    {}
  ),
  // PageNotFoundRoute is the last
  { CommonPageNotFoundRoute: CommonRoutes.CommonPageNotFoundRoute }
)

window.Routes = Routes

export const Modules = [{}]
