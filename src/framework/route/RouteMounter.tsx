import { Text, ModalProvider } from '@wings-software/uikit'
import React, { Suspense, useEffect, useState } from 'react'
import * as queryString from 'query-string'
import { Route as ReactRoute, Switch, matchPath } from 'react-router'
import { Redirect } from 'react-router-dom'
import SessionToken from 'framework/utils/SessionToken'
import { useAppStoreWriter } from 'framework/hooks/useAppStore'
import type { Route } from 'framework/exports'
import { buildLoginUrlFrom401Response, routePath } from 'framework/utils/framework-utils'
import type { RouteParams } from 'framework/types/RouteParams'
import i18n from './RouteMounter.i18n'
import css from './RouteMounter.module.scss'

const Loading = <Text className={css.loading}>{i18n.loading}</Text>
let activeRouteParams: RouteParams

interface RouteMounterProps {
  route: Route
  onEnter?: (route: Route) => void
  onExit?: (route: Route) => void
}

function updateTitle(title: string): void {
  document.title = `Harness | ${title}`
}

function updateRouteParams(path: string): void {
  const match = matchPath('/' + location.href.split('/#/')[1], {
    path,
    exact: true
  })
  const params = match?.params || {}
  const query = queryString.parse(window.location.href.split('?')[1])

  activeRouteParams = { params: { ...params, accountId: (params as { accountId: string }).accountId || '' }, query }
}

function renderPageChildren(route: Route): React.ReactNode {
  const { nestedRoutes } = route

  if (nestedRoutes?.length) {
    const nestedRouteDefinitions: React.ReactNode[] = []

    nestedRoutes.forEach(nestedRoute => {
      const { title, component: NestedPageComponent, isDefault } = nestedRoute
      const path = routePath(route)
      const nestedPath = routePath({ path: nestedRoute.path, authenticated: route.authenticated })

      if (isDefault) {
        nestedRouteDefinitions.push(<Redirect exact from={path} to={nestedPath} key="redirect" />)
      }

      const NestedContainer: React.FC = () => {
        updateRouteParams(nestedPath)

        useEffect(() => {
          updateTitle(title)
        }, [])

        return <NestedPageComponent>{renderPageChildren(Object.assign({}, route, nestedRoute))}</NestedPageComponent>
      }

      nestedRouteDefinitions.push(<ReactRoute exact path={nestedPath} component={NestedContainer} key={nestedPath} />)
    })

    return <Switch>{nestedRouteDefinitions}</Switch>
  }
}

export const RouteMounter: React.FC<RouteMounterProps> = ({ route, onEnter, onExit }) => {
  const [mounted, setMounted] = useState(false)
  const { title, component: PageComponent, pageId } = route
  const updateApplicationState = useAppStoreWriter()

  updateRouteParams(routePath(route))

  useEffect(() => {
    updateTitle(title)
    document.body.setAttribute('page-id', pageId)

    onEnter?.(route)

    if (!mounted) {
      if (route.authenticated !== false && !SessionToken.isAuthenticated()) {
        window.location.href = buildLoginUrlFrom401Response()
        return
      } else {
        setMounted(true)
        updateApplicationState({ route })
      }
    }

    return () => {
      onExit?.(route)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense fallback={Loading}>
      {mounted ? (
        <ModalProvider>
          <PageComponent>{renderPageChildren(route)}</PageComponent>
        </ModalProvider>
      ) : null}
    </Suspense>
  )
}

/**
 * Utility to test if a route is active.
 * @param route Route to test.
 * @param exact Flag to match exact route path (default is true). Pass exact
 * as false when testing a route which has nested routes.
 * @returns true if the route is active.
 */
export function isRouteActive<T>(route: Route<T>, exact = true): boolean {
  return !!matchPath('/' + location.href.split('/#/')[1], {
    path: routePath(route),
    exact
  })
}

/**
 * Get active route params.
 * @returns RouteParams object of the active route.
 */
export function routeParams(): RouteParams {
  return activeRouteParams
}
