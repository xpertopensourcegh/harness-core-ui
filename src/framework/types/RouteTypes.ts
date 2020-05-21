import type { KVO } from 'framework'

/** Optional arguments passed into RouteEntry url() generator */
export type RouteEntryURLArgs = KVO<string | number>

/**
 * RouteEntry represents a route alongside with its page binding.
 */
export interface RouteEntry {
  /** Route path */
  path: string

  /** Page title */
  title: string

  /** Page id: a unique identifier to differentiate a page from others */
  pageId: string

  /** Page url generator: Generate a url link from parameters and query parameters */
  url: (params: RouteEntryURLArgs) => string

  /** Page component: Actual component to be mounted under route */
  page: React.ReactNode

  /** Page layout */
  layout?: React.ReactNode
}

export type ModuleRouteEntries = KVO<RouteEntry>
