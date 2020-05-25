/*
 * This file exports Modules integration points (Framework to consume).
 */
import type { RouteRegistry, ModuleRegistry, RouteInfo, KVO } from 'framework'
import { DXRoutes, DXModules } from 'modules/dx'
import { CVRoutes, CVModules } from 'modules/cv'
import { CommonRoutes, CommonModules } from 'modules/common'

/**
 * routeRegistry stores all route info from Modules.
 */
export const routeRegistry: RouteRegistry = Object.assign(
  Object.entries(Object.assign({}, DXRoutes, CVRoutes, CommonRoutes)).reduce(
    (_routes: KVO<RouteInfo>, [key, value]) => {
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

/**
 * moduleRegistry stores registed modules. Framework uses the registry to render global nav (modules on the left nav along with their respective menu when one is selected).
 */
export const moduleRegistry: ModuleRegistry = [
  DXModules.DXDashboardModule,
  CommonModules.CommonProjectModule,
  CVModules.CVHomeModule,
  CommonModules.CommonSettingsModule,
  CommonModules.CommonUserProfileModule
]
