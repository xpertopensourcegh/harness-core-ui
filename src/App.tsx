import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from 'modules/common/PrivateRoute';
import RedirectRoute from 'modules/common/RedirectRoute';

import CDRoutes from 'modules/cd/routes';
import Dashboard from 'modules/common/pages/Dashboard/Dashboard';

const App: React.FC = () => {
  return (
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
  );
};

export default App;
