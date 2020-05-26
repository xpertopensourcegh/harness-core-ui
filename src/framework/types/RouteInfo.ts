import type { KVO, PageLayout, ModuleName, NavIdentifier } from 'framework'

/** Optional arguments passed into RouteInfo url() generator */
export type RouteInfoURLArgs = KVO<string | number> | undefined

/**
 * RouteInfo represents a route alongside its page binding.
 */
export interface RouteInfo {
  /** Nav identifier - which NaveEntry this route belongs to */
  navId: NavIdentifier

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
  url: (params?: RouteInfoURLArgs) => string

  /** Page layout. Defaulted to Framework `PageLayout.DefaultLayout` */
  layout?: PageLayout

  /** If set to `false`, the route does not require users to be logged in (use for unauth routes
   * like Registration, Reset Password, etc...). Default is `true` */
  authenticated?: boolean

  /** Optional validation to see if current user is allowed to access the route (TBD in the future) */
  // isAuthorized?: () => boolean
}
