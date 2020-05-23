/*
 * This file exports Modules integration points (Framework to consume).
 */
import type { ModuleRoutes, RouteEntry, KVO } from 'framework'
import { DXRoutes, DXModules } from 'modules/dx'
import { CVRoutes, CVModules } from 'modules/cv'
import { CommonRoutes, CommonModules } from 'modules/common'

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

export const Modules = [DXModules.DXDashboardModule, CommonModules.CommonProjectModule, CVModules.CVHomeModule]
