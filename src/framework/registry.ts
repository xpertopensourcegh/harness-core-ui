import type { RouteRegistry, SidebarRegistry, Route } from 'framework/exports'
import * as CommonRoute from 'navigation/common/routes'
import * as UserRoute from 'navigation/user/routes'
import * as UserSidebar from 'navigation/user/sidebar/sidebar'
import * as DXRoute from 'navigation/dx/routes'
import * as DXSidebar from 'navigation/dx/sidebar/sidebar'
import * as CVRoute from 'navigation/cv/routes'
import * as CVSidebar from 'navigation/cv/sidebar/sidebar'
import * as CDRoute from 'navigation/cd/routes'
import * as CDSidebar from 'navigation/cd/sidebar/sidebar'
import * as CIRoute from 'navigation/ci/routes'
import * as CISidebar from 'navigation/ci/sidebar/sidebar'
import * as CFRoute from 'navigation/cf/routes'
import * as CFSidebar from 'navigation/cf/sidebar/sidebar'
import * as ProjectRoute from 'navigation/projects/routes'
import * as ProjectSidebar from 'navigation/projects/sidebar/sidebar'
import * as AccountsRoute from 'navigation/accounts/routes'
import * as AccountsSidebar from 'navigation/accounts/sidebar/sidebar'

/**
 * routeRegistry stores routes from all Modules.
 */
export const routeRegistry: RouteRegistry = Object.assign(
  Object.entries(
    Object.assign(
      {},
      CDRoute,
      DXRoute,
      CVRoute,
      CIRoute,
      CFRoute,
      CommonRoute,
      ProjectRoute,
      AccountsRoute,
      UserRoute
    ) as Record<string, Route>
  ).reduce((_routes: Record<string, Route>, [key, value]) => {
    if (value !== CommonRoute.routePageNotFound) {
      _routes[key] = value
    }
    return _routes
  }, {}),
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
  ProjectSidebar.Projects,
  CDSidebar.Deployments,
  CISidebar.CIHome,
  CFSidebar.CFHome,
  CVSidebar.CVDashboard,
  AccountsSidebar.Account,
  UserSidebar.UserProfile
]
