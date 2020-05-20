import type { KVO } from 'framework'

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
  url: (params: KVO<string | number>, queryParams?: KVO<string | number>) => string

  /** Page component: Actual component to be mounted under route */
  page: React.ElementType

  /** Page layout */
  layout?: React.ElementType
}
