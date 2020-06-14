import type { RouteRegistry, SidebarRegistry, Route } from 'framework/exports'
import * as CommonRoute from 'modules/common/routes'
import * as CommonSidebar from 'modules/common/sidebar/sidebar'
import * as DXRoute from 'modules/dx/routes'
import * as DXSidebar from 'modules/dx/sidebar/sidebar'
import * as CVRoute from 'modules/cv/routes'
import * as CVSidebar from 'modules/cv/sidebar/sidebar'
import * as CDRoute from 'modules/cd/routes'
import * as CDSidebar from 'modules/cd/sidebar/sidebar'

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
 * sidebarRegistry stores registed SidebarEntry from Modules. Framework uses the registry to
 * render sidebar (modules on the left nav along with their respective menu when one is selected).
 *
 * Order of items in registry represents order of the sidebar module icons.
 */
export const sidebarRegistry: SidebarRegistry = [
  DXSidebar.Dashboard,
  CommonSidebar.Projects,
  CDSidebar.Deployments,
  CVSidebar.CVDashboard,
  CommonSidebar.Account,
  CommonSidebar.UserProfile
]
