import React from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom'

import PrivateRoute from 'common/PrivateRoute'
import RedirectRoute from 'common/RedirectRoute'

import CDRoutes from 'modules/cd/routes'
import Dashboard from 'common/pages/Dashboard/Dashboard'
import './App.scss'

const App: React.FC = () => {
  return (
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
  )
}

export default App
