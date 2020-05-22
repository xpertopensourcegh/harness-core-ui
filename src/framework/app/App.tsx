import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { FocusStyleManager } from '@blueprintjs/core'
// import AppShell from './AppShell'
import { Routes } from '../routing/Routes'
import { RouteMounter } from '../routing/RouteMounter'
import './App.scss'
import { LayoutManager } from 'framework/layout/LayoutManager'
import type { RouteEntry } from 'framework'

FocusStyleManager.onlyShowFocusOnTabs()

// TODO: Move this thing out
const AppShell: React.FC = ({ children }) => <>{children}</>

const App: React.FC = () => {
  const [activeRouteEntry, setActiveRouteEntry] = useState<RouteEntry>()

  return (
    <HashRouter>
      <AppShell>
        <LayoutManager routeEntry={activeRouteEntry}>
          <Switch>
            {Object.values(Routes).map(routeEntry => (
              <Route path={routeEntry.path} key={routeEntry.path}>
                <RouteMounter routeEntry={routeEntry} onEnter={setActiveRouteEntry} />
              </Route>
            ))}
          </Switch>
        </LayoutManager>
      </AppShell>
    </HashRouter>
  )
}

ReactDOM.render(<App />, document.getElementById('react-root'))
