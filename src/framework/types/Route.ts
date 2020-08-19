import type { PageLayout, ModuleName, SidebarIdentifier } from 'framework/exports'

/**
 * Route represents a route alongside its page binding.
 */
export interface Route<T = undefined> {
  /** Sidebar identifier - which SidebarEntry this route belongs to */
  sidebarId: SidebarIdentifier

  /** Route path */
  path: string

  /** Page component: Actual component to be mounted under route */
  component: React.FC

  /** Module name */
  module: ModuleName

  /** Page title */
  title: string

  /** Page id: a unique identifier to differentiate a page from others */
  pageId: string

  /**
   * Route url generator: Generate a url link to the route.
   *
   * TODO: Require strong type for params to eleminate wrong parameter
   * passing (like accountId is passed as null or underfined while it
   * must be non-nullable).
   * */
  url: T extends undefined ? () => string : (params: T) => string

  /** Page layout. Defaulted to Framework `PageLayout.DefaultLayout` */
  layout?: PageLayout

  /** If set to `false`, the route does not require users to be logged in (use for unauth routes
   * like Registration, Reset Password, etc...). Default is `true` */
  authenticated?: boolean

  /** Optional validation to see if current user is allowed to access the route (TBD in the future) */
  // isAuthorized?: () => boolean

  /* Optional arguments to convey type param when multiple options are available for same route */
  type?: string

  /** Nested routes  */
  nestedRoutes?: NestedRoute<T>[]
}

/**
 * NestedRoute represents a single nested route. A nested route can have its own nested routes.
 */
export interface NestedRoute<T = undefined>
  extends Pick<Route<T>, 'path' | 'title' | 'url' | 'component' | 'authenticated'> {
  /** If set to true, the nested route is mounted as the default child of the parent route.
   */
  isDefault?: boolean

  /** Nested routes inside a nested route */
  nestedRoutes?: NestedRoute[]
}
