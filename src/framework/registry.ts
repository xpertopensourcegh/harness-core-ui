import type { RouteRegistry, NavRegistry, RouteInfo } from 'framework'
import * as CommonRoute from 'modules/common/routes'
import * as CommonNav from 'modules/common/nav'
import * as DXRoute from 'modules/dx/routes'
import * as DXNav from 'modules/dx/nav'
import * as CVRoute from 'modules/cv/routes'
import * as CVNav from 'modules/cv/nav'
import * as CDRoute from 'modules/cd/routes'
import * as CDNav from 'modules/cd/nav'

/**
 * routeRegistry stores routes from all Modules.
 */
export const routeRegistry: RouteRegistry = Object.assign(
  Object.entries(Object.assign({}, CDRoute, DXRoute, CVRoute, CommonRoute) as Record<string, RouteInfo>).reduce(
    (_routes: Record<string, RouteInfo>, [key, value]) => {
      if (value !== CommonRoute.routePageNotFound) {
        _routes[key] = value
      }
      return _routes
    },
    {}
  ),
  // PageNotFoundRoute must be the last (its routing path is `*`)
  { routePageNotFound: CommonRoute.routePageNotFound }
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
