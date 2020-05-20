import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { FocusStyleManager } from '@blueprintjs/core'
import PrivateRoute from 'framework/PrivateRoute'
import RedirectRoute from 'framework/RedirectRoute'

import CDRoutes from 'modules/cd/routes'
import Dashboard from 'modules/common/pages/Dashboard/Dashboard'
import './App.scss'

FocusStyleManager.onlyShowFocusOnTabs()

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <HashRouter>
        <Switch>
          <PrivateRoute exact path="/" component={RedirectRoute} />

          <PrivateRoute path="/account/:accountId/dashboard">
            <Dashboard />
          </PrivateRoute>

          <CDRoutes />

          <Route path="/login">
            <div>
              Oops. It seems you are not logged in. <br />
              Login is not implemented in v2. You need to visit <a href="/#/login">v1 Login</a>.
            </div>
          </Route>

          <Route path="*">
            <div>404 Page Not Found</div>
          </Route>
        </Switch>
      </HashRouter>
    </RecoilRoot>
  )
}

ReactDOM.render(<App />, document.getElementById('react-root'))
