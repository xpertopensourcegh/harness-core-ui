import type { RouteRegistry, NavRegistry, Route } from 'framework'
import * as CommonRoute from 'modules/common/routes'
import * as CommonNav from 'modules/common/nav/nav'
import * as DXRoute from 'modules/dx/routes'
import * as DXNav from 'modules/dx/nav/nav'
import * as CVRoute from 'modules/cv/routes'
import * as CVNav from 'modules/cv/nav/nav'
import * as CDRoute from 'modules/cd/routes'
import * as CDNav from 'modules/cd/nav/nav'

/**
 * routeRegistry stores routes from all Modules.
 */
export const routeRegistry: RouteRegistry = Object.assign(
  Object.entries(Object.assign({}, CDRoute, DXRoute, CVRoute, CommonRoute) as Record<string, Route>).reduce(
    (_routes: Record<string, Route>, [key, value]) => {
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
 *
 * Order of items in registry represents other of the nav icon in the global nav.
 */
export const navRegistry: NavRegistry = [
  DXNav.navDashboard,
  CommonNav.navProjects,
  CDNav.navDeployments,
  CVNav.navContinuousVerification,
  CommonNav.navSettings,
  CommonNav.navUserProfile
]
