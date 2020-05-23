import React from 'react'
import type { RouteEntry } from 'framework'
import { PageLayout } from './PageLayout'

/**
 * LayoutManger handles UI application layout. It's responsible for using
 * the right Layout for a page when a route is mounted.
 */
export const LayoutManager: React.FC<{ routeEntry?: RouteEntry }> = ({ children, routeEntry }) => {
  const LayoutComponent = routeEntry && (routeEntry?.layout || PageLayout.DefaultLayout)

  return <>{LayoutComponent ? <LayoutComponent>{children}</LayoutComponent> : children}</>
}
