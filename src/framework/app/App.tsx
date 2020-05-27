// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// TODO: Import type for recoil when it's merged
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/44756
import { RecoilRoot } from 'recoil'
import { FocusStyleManager } from '@blueprintjs/core'
import type { RouteInfo } from 'framework'
import { LayoutManager } from 'framework/layout/LayoutManager'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { RouteMounter } from '../route/RouteMounter'
import { routeRegistry } from 'framework/registry'
import './app.scss'

FocusStyleManager.onlyShowFocusOnTabs()

// TODO: Move this thing out
const AppShell: React.FC = ({ children }) => {
  return <>{children}</>
}

const App: React.FC = () => {
  const [activeRouteInfo, setActiveRouteInfo] = useState<RouteInfo>()

  return (
    <RecoilRoot>
      <HashRouter>
        <AppShell>
          <LayoutManager routeInfo={activeRouteInfo}>
            <Switch>
              {Object.values(routeRegistry).map(routeInfo => (
                <Route path={routeInfo.path} key={routeInfo.path}>
                  <RouteMounter routeInfo={routeInfo} onEnter={setActiveRouteInfo} />
                </Route>
              ))}
            </Switch>
          </LayoutManager>
        </AppShell>
      </HashRouter>
    </RecoilRoot>
  )
}

ReactDOM.render(<App />, document.getElementById('react-root'))
