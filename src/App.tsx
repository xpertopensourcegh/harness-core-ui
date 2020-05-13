import React from 'react';
import { Route, Switch, RouteProps } from 'react-router-dom';

import Authentication from 'modules/common/Authentication';

import Dashboard from 'modules/common/pages/Dashboard/Dashboard';
import PipelineStudio from 'modules/cd/pages/PipelineStudio/PipelineStudio';

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!Authentication.isAuthenticated()) {
          window.location.href = `/#/login?returnUrl=${location.pathname}`;
          return null;
        }
        return children;
      }}
    />
  );
};

const App: React.FC = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/">
        <Dashboard />
      </PrivateRoute>
      <PrivateRoute path="/pipeline-studio">
        <PipelineStudio />
      </PrivateRoute>
      <Route path="*">
        <div>404 Page Not Found</div>
      </Route>
    </Switch>
  );
};

export default App;
