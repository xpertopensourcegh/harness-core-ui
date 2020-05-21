import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { FocusStyleManager } from '@blueprintjs/core'
import PrivateRoute from 'framework/PrivateRoute'
import RedirectRoute from 'framework/RedirectRoute'

import CDRoutes from 'modules/cd/routes'
import Dashboard from 'modules/common/pages/Dashboard/Dashboard'
import { Layout } from 'framework'
import './App.scss'

FocusStyleManager.onlyShowFocusOnTabs()

if (process.env.WEBPACK_DEV_SERVER) {
  console.log('HEY HEY HEY')
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
        <PrivateRoute exact path="/" component={RedirectRoute} />

        <PrivateRoute path="/account/:accountId/dashboard">
          <Layout.DefaultLayout>
            <Dashboard />
          </Layout.DefaultLayout>
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

ReactDOM.render(<App />, document.getElementById('react-root'))
