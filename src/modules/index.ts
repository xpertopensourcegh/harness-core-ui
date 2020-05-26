/*
 * This file exports Modules integration points (Framework to consume).
 */
import type { RouteRegistry, NavRegistry, RouteInfo, KVO } from 'framework'
import { CommonRoute, CommonNav } from 'modules/common'
import { DXRoute, DXNav } from 'modules/dx'
import { CVRoute, CVNav } from 'modules/cv'
import { CDRoute, CDNav } from 'modules/cd'

/**
 * routeRegistry stores all route info from Modules.
 */
export const routeRegistry: RouteRegistry = Object.assign(
  Object.entries(Object.assign({}, CDRoute, DXRoute, CVRoute, CommonRoute) as KVO<RouteInfo>).reduce(
    (_routes: KVO<RouteInfo>, [key, value]) => {
      if (value !== CommonRoute.routePageNotFound) {
        _routes[key] = value
      }
      return _routes
    },
    {}
  ),
  // PageNotFoundRoute must be the last (its routing path is `*`)
  { CommonPageNotFound: CommonRoute.routePageNotFound }
)

/**
 * navRegistry stores registed NavEntry extensions from Modules. Framework uses the registry to
 * render global nav (modules on the left nav along with their respective menu when one is selected).
 */
export const navRegistry: NavRegistry = [
  DXNav.navDashboard,
  CommonNav.navProjects,
  CDNav.navDeployments,
  CVNav.navContinuousVerification,
  CommonNav.navSettings,
  CommonNav.navUserProfile
]

// export const moduleNavEntries = {
//   Dashboard: {},
//   Projects: {
//     Routes: [CommonRoutes.CommonProject, CommonRoutes.CommonOrg]
//   },
//   Deployments: {
//     Routes: CDRoutes
//   },
//   ContinuousVerification: {},

//   Settings: {},
//   UserProfile: {
//     Routes: [CommonRoutes.CommonUserProfile]
//   }
// }

// Or predefine 6 nav entries
// Then in each route definition, tide them into a nav entry
