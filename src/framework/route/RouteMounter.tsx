import { Text } from '@wings-software/uikit'
import type { RouteInfo } from 'framework'
import { buildLoginUrlFrom401Response } from 'framework/utils/framework-utils'
import SessionToken from 'framework/utils/SessionToken'
import React, { Suspense, useEffect, useState } from 'react'
import type { AppStore } from '../types/AppStore'
import i18n from './RouteMounter.i18n'
import css from './RouteMounter.module.scss'
import { useAppStoreWriter } from 'framework/hooks/useAppStore'

const Loading = <Text className={css.loading}>{i18n.loading}</Text>
let activeRoute: RouteInfo

interface RouteMounterProps {
  routeInfo: RouteInfo
  onEnter?: (routeInfo: RouteInfo) => void
  onExit?: (routeInfo: RouteInfo) => void
}

export const RouteMounter: React.FC<RouteMounterProps> = ({ routeInfo, onEnter, onExit }) => {
  const [mounted, setMounted] = useState(false)
  const { title, component: page, pageId } = routeInfo
  const PageComponent = page as React.ElementType
  const updateApplicationState = useAppStoreWriter()

  useEffect(() => {
    // TODO: Add accountName into title
    document.title = `Harness | ${title}`
    document.body.setAttribute('page-id', pageId)

    onEnter?.(routeInfo)
    activeRoute = routeInfo

    if (!mounted) {
      if (routeInfo.authenticated !== false && !SessionToken.isAuthenticated()) {
        window.location.href = buildLoginUrlFrom401Response()
        return
      } else {
        setMounted(true)
        updateApplicationState((previousState: AppStore) => ({
          ...previousState,
          routeInfo: routeInfo
        }))
      }
    }

    return () => {
      onExit?.(routeInfo)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Suspense fallback={Loading}>{mounted ? <PageComponent /> : null}</Suspense>
}

/**
 * Utility to test if a route is active.
 * @param routeInfo Route to test.
 * @returns true if the route is active.
 */
export function isRouteActive(routeInfo: RouteInfo): boolean {
  return routeInfo === activeRoute
}
