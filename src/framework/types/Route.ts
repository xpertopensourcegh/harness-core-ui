import type { PageLayout, ModuleName, SidebarIdentifier } from 'framework/exports'

/** Optional arguments passed into Route url() generator */
export type RouteURLArgs = Record<string, string | number | null | undefined> | undefined

/**
 * Route represents a route alongside its page binding.
 */
export interface Route {
  /** Sidebar identifier - which SidebarEntry this route belongs to */
  sidebarId: SidebarIdentifier

  /** Route path */
  path: string

  /** Page component: Actual component to be mounted under route */
  component: React.ReactNode | JSX.Element

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
  url: (params?: RouteURLArgs) => string

  /** Page layout. Defaulted to Framework `PageLayout.DefaultLayout` */
  layout?: PageLayout

  /** If set to `false`, the route does not require users to be logged in (use for unauth routes
   * like Registration, Reset Password, etc...). Default is `true` */
  authenticated?: boolean

  /** Optional validation to see if current user is allowed to access the route (TBD in the future) */
  // isAuthorized?: () => boolean

  /* Optional arguments to convey type param when multiple options are available for same route */
  type?: string
}
