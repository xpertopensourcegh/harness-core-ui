import React, { useState, useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route as ReactRoute, Switch, Redirect } from 'react-router-dom'
import { RestfulProvider } from 'restful-react'
import { FocusStyleManager } from '@blueprintjs/core'
import type { Route } from 'framework/exports'
import { LayoutManager } from 'framework/layout/LayoutManager'
import { routeRegistry } from 'framework/registry'
import SessionToken from 'framework/utils/SessionToken'
import { routePath } from 'framework/utils/framework-utils'
import languageLoader from 'strings/languageLoader'
import type { LangLocale } from 'strings/languageLoader'
import { RouteMounter } from '../route/RouteMounter'
import { AppStoreProvider } from '../hooks/useAppStore'
import { StringsContext } from '../strings/String'
import '@common/services'
import './App.scss'

FocusStyleManager.onlyShowFocusOnTabs()

interface AppProps {
  strings: Record<string, any>
}

function App(props: AppProps): React.ReactElement {
  const token = SessionToken.getToken()
  const [activeRoute, setActiveRoute] = useState<Route>()
  const getRequestOptions = React.useCallback((): Partial<RequestInit> => {
    const headers: RequestInit['headers'] = {}

    if (token && token.length > 0) {
      headers.Authorization = `Bearer ${token}`
    }

    return { headers }
  }, [token])
  const sortedRoutes = useMemo(
    () =>
      Object.values(routeRegistry)
        .filter(route => !!route.sidebarId) // mount non-nested routes only
        .sort((a, b) => (a.path.length > b.path.length ? -1 : a.path.length < b.path.length ? 1 : a > b ? -1 : 1)),
    []
  )

  return (
    <AppStoreProvider>
      <StringsContext.Provider value={props.strings}>
        <RestfulProvider base="/" requestOptions={getRequestOptions}>
          <HashRouter>
            <LayoutManager route={activeRoute}>
              <Switch>
                <ReactRoute exact path="/" component={RedirectRoot} />
                {sortedRoutes.map(route => (
                  <ReactRoute path={routePath(route)} key={route.path}>
                    <RouteMounter route={route} onEnter={setActiveRoute} />
                  </ReactRoute>
                ))}
              </Switch>
            </LayoutManager>
          </HashRouter>
        </RestfulProvider>
      </StringsContext.Provider>
    </AppStoreProvider>
  )
}

const RedirectRoot: React.FC = () => {
  const accountId = SessionToken.accountId()

  useEffect(() => {
    return () => window.location.reload()
  }, [accountId])

  return <Redirect exact from="/" to={`/account/${accountId}/dashboard`} />
}

;(async () => {
  const lang: LangLocale = 'en'

  const strings = await languageLoader(lang)

  ReactDOM.render(<App strings={strings} />, document.getElementById('react-root'))
})()
