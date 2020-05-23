import type { KVO, PageLayout, ModuleName } from 'framework'

/** Optional arguments passed into RouteEntry url() generator */
export type RouteEntryURLArgs = KVO<string | number> | undefined

/**
 * RouteEntry represents a route alongside its page binding.
 */
export interface RouteEntry {
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
  url: (params?: RouteEntryURLArgs) => string

  /** Page layout. Defaulted to Framework `PageLayout.DefaultLayout` */
  layout?: PageLayout

  /** If set to `false`, the route does not require users to be logged in (use for unauth routes
   * like Registration, Reset Password, etc...). Default is `true` */
  authenticated?: boolean

  /** Optional validation to see if current user is allowed to access the route (TBD in the future) */
  // isAuthorized?: () => boolean
}

/** Type to declare routes in a module. Each entry is represented as { [KEY]: RouteEntry } */
export type ModuleRoutes = Readonly<KVO<RouteEntry>>
