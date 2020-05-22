import type { KVO, Layout } from 'framework'

/** Optional arguments passed into RouteEntry url() generator */
export type RouteEntryURLArgs = KVO<string | number> | undefined

/**
 * RouteEntry represents a route alongside its page binding.
 */
export interface RouteEntry {
  /** Route path */
  path: string

  /** Page title */
  title: string

  /** Page id: a unique identifier to differentiate a page from others */
  pageId: string

  /** Page url generator: Generate a url link from parameters and query parameters */
  url: (params?: RouteEntryURLArgs) => string

  /** Page component: Actual component to be mounted under route */
  page: React.ReactNode

  /** Page layout */
  layout?: Layout

  /** If set to `false`, the route does not require users to be logged in (use for unauth routes
   * like Registration, Reset Password, etc...). Default is `true` */
  authenticated?: boolean

  /** Optional verification to see if current user is allowed to access the route. TBD in the future */
  // isAuthorized?: () => boolean
}

/** Type to declare routes in a module. Each entry is represented as { [KEY]: RouteEntry } */
export type ModuleRoutes = Readonly<KVO<RouteEntry>>
