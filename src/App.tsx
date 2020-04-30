import React from 'react';
import { Route, Switch } from 'react-router-dom';

export default function App(): React.ReactElement {
  return (
    <div>
      <Switch>
        <Route path="/">
          <div>Hello World</div>
        </Route>
      </Switch>
    </div>
  );
}
