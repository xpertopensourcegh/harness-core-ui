import type { KVO } from 'framework'

export interface RouteEntry {
  /** Route path */
  path: string

  /** Page title */
  title: string

  /** Page id, must be unique */
  pageId: string

  /** Generate a url link from parameters and query parameters */
  url: (params: KVO<string | number>, queryParams?: KVO<string | number>) => string

  /** Page to be mounted under route */
  page: React.ElementType

  /** Page layout */
  layout?: React.ElementType
}
