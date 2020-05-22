import React from 'react'
import type { RouteEntry } from 'framework'
import { Layout } from './Layout'

/**
 * LayoutManger handles UI application layout. It's responsible for using
 * the right Layout for a page when a route is mounted.
 */
export const LayoutManager: React.FC<{ routeEntry?: RouteEntry }> = ({ children, routeEntry }) => {
  const PageLayout = routeEntry && (routeEntry?.layout || Layout.DefaultLayout)

  return <>{PageLayout ? <PageLayout>{children}</PageLayout> : children}</>
}
