import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { getUsers } from 'services/UserService';

export default function App(): React.ReactElement {
  useEffect(() => {
    getUsers({ accountId: 'kmpySmUISimoRrJL6NL73w' });
  }, []);

  return (
    <Switch>
      <Route path="/">
        <div>Hello World</div>
      </Route>
    </Switch>
  );
}
