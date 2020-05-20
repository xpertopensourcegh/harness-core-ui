import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useAppContext } from 'contexts/AppContext'
import { PageLayout } from 'layouts/PageLayout'
import { PageContextProvider, usePageContext } from 'contexts/PageContext'
import { Text } from '@wings-software/uikit'
import css from './RouteUtils.css'
import i18n from './RouteUtils.i18n'
import { useReactRouter } from 'hooks/useRoute'
import RouteDefinitions, { params } from 'routes/RouteDefinitions'
import { AppStorage } from 'components'

interface RouteProps {
  route: RouteInfo
}

/**
 * RouteMounter mounts a page defined in a route.
 */
function RouteMounter({ route }: RouteProps) {
  const { title, page: PageComponentFromRoute, pageId } = route
  const { activeAccount } = useAppContext()
  const { setPageContext } = usePageContext()
  const Layout = route.layout || PageLayout

  // Update title, page-id when activeAccount is changed, or page is changed
  useEffect(() => {
    const accountName = activeAccount && activeAccount.accountName
    const titleFromAccount = `Harness | ${title} ${accountName ? ' - ' + accountName : ''}`
    document.title = titleFromAccount
    document.body.setAttribute('page-id', pageId)

    setPageContext({ title })
  }, [activeAccount, pageId]) // eslint-disable-line

  return (
    <Layout>
      <PageComponentFromRoute />
    </Layout>
  )
}

export const RouteLoading = () => (
  <Text font="medium" color="grey500" className={css.pageLoading}>
    {i18n.loading}
    <loading-dots>.</loading-dots>
  </Text>
)

/**
 * This component will leverage dynamic component loading to load pages
 * dynamically at runtime to reduce bundle size at startup. For now,
 * it loads the pages statically while waiting for Webpack 4.
 */
export function importRoute(route: RouteInfo) {
  const { path } = route

  return (
    <Route path={path} key={path}>
      <RouteInfoToAppContext />
      <EnsureAppContextAvailability>
        <PageContextProvider>
          <RouteMounter route={route} />
        </PageContextProvider>
      </EnsureAppContextAvailability>
    </Route>
  )
}

/**
 * This component ensures all pages (legacy or new) are receiving the same proper
 * parameters from AppContext (route, params, permissions, featureFlag, etc...).
 * Meaning there will never be a case where appId is null when getting it from route
 * in a page.
 */
export function EnsureAppContextAvailability({ children }): React.ReactNode | null {
  const { initialized } = useAppContext()
  return initialized ? children : null
}
