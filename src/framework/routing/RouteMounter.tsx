import { Text } from '@wings-software/uikit'
import type { RouteEntry } from 'framework'
import React, { Suspense, useLayoutEffect } from 'react'
import i18n from './RouteMounter.i18n'
import css from './RouteMounter.module.scss'

const Loading = <Text className={css.loading}>{i18n.loading}</Text>

interface RouteMounterProps {
  routeEntry: RouteEntry
  onEnter?: (routeEntry: RouteEntry) => void
  onExit?: (routeEntry: RouteEntry) => void
}

export const RouteMounter: React.FC<RouteMounterProps> = ({ routeEntry, onEnter, onExit }) => {
  const { title, page, pageId } = routeEntry
  const PageComponent = page as React.ElementType

  useLayoutEffect(() => {
    // TODO: Add accountName into title
    // const titleFromAccount = `Harness | ${title} ${accountName ? ' - ' + accountName : ''}`
    document.title = `Harness | ${title}`
    document.body.setAttribute('page-id', pageId)

    onEnter?.(routeEntry)

    return () => {
      onExit?.(routeEntry)
    }
  }, [pageId, title, routeEntry, onEnter, onExit])

  return (
    <Suspense fallback={Loading}>
      <PageComponent />
    </Suspense>
  )
}
