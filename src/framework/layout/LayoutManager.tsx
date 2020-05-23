import React, { useEffect, useState } from 'react'
import type { RouteEntry, ApplicationState } from 'framework'
import { PageLayout } from './PageLayout'
import { Modules } from 'modules'
import { useApplicationStateWriter } from 'framework/hooks/useApplicationState'

/**
 * LayoutManger handles page layout. It's responsible for composing
 * the right Layout for a page when a route is mounted.
 */
export const LayoutManager: React.FC<{ routeEntry?: RouteEntry }> = ({ children, routeEntry }) => {
  const updateApplicationState = useApplicationStateWriter()
  const LayoutComponent = routeEntry && (routeEntry?.layout || PageLayout.DefaultLayout)
  const [mounted, setMounted] = useState(false)

  console.log('LAYOUT MANAGER')
  useEffect(() => {
    if (!mounted) {
      updateApplicationState((previousState: ApplicationState) => ({
        ...previousState,
        modules: Modules
      }))
      setMounted(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{!mounted ? null : LayoutComponent ? <LayoutComponent>{children}</LayoutComponent> : children}</>
}
