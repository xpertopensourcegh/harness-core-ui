import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route as ReactRoute, Switch, Redirect } from 'react-router-dom'
import { RestfulProvider } from 'restful-react'
import { FocusStyleManager } from '@blueprintjs/core'
import type { Route } from 'framework/exports'
import { LayoutManager } from 'framework/layout/LayoutManager'
import { RouteMounter } from '../route/RouteMounter'
import { routeRegistry } from 'framework/registry'
import { AppStoreProvider } from '../hooks/useAppStore'
import 'modules/common/services'
import './app.scss'
import SessionToken from 'framework/utils/SessionToken'

FocusStyleManager.onlyShowFocusOnTabs()

// Authenticated routes are prefixed with `/account/:accountId` by default
const prefixPath = (route: Route): string =>
  route.authenticated === false ? route.path : `/account/:accountId${route.path}`

const App: React.FC = () => {
  const accountId = SessionToken.accountId()
  const token = SessionToken.getToken()
  const [activeRoute, setActiveRoute] = useState<Route>()
  const basename = location.href.split('/#/')[0].replace(`${location.protocol}//${location.host}`, '')

  const getRequestOptions = React.useCallback((): Partial<RequestInit> => {
    const headers: RequestInit['headers'] = { 'content-type': 'application/json' }

    if (token && token.length > 0) {
      headers.Authorization = `Bearer ${token}`
    }

    return { headers }
  }, [token])

  return (
    <AppStoreProvider>
      <RestfulProvider base="/" requestOptions={getRequestOptions} queryParams={{ accountId }}>
        <HashRouter basename={basename}>
          <LayoutManager route={activeRoute}>
            <Switch>
              <Redirect exact from="/" to={`/account/${accountId}/dashboard`} />
              {Object.values(routeRegistry).map(route => (
                <ReactRoute path={prefixPath(route)} key={route.path}>
                  <RouteMounter route={route} onEnter={setActiveRoute} />
                </ReactRoute>
              ))}
            </Switch>
          </LayoutManager>
        </HashRouter>
      </RestfulProvider>
    </AppStoreProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('react-root'))
