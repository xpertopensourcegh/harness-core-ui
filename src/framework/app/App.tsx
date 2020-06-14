import { FocusStyleManager } from '@blueprintjs/core'
import type { Route } from 'framework/exports'
import { LayoutManager } from 'framework/layout/LayoutManager'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route as ReactRoute, Switch, Redirect } from 'react-router-dom'
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
  const [activeRoute, setActiveRoute] = useState<Route>()

  return (
    <AppStoreProvider>
      <HashRouter>
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
    </AppStoreProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('react-root'))
