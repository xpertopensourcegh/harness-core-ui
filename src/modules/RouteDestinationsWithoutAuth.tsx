import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import NotFoundPage from '@common/pages/404/NotFoundPage'
import routes from '@common/RouteDefinitions'
import SessionToken from 'framework/utils/SessionToken'
import LoginPage from '@common/pages/login/LoginPage'

const RedirectToHome = (): React.ReactElement => {
  const accountId = SessionToken.accountId()

  return <Redirect to={routes.toProjects({ accountId })} />
}

const RouteDestinationsWithoutAuth: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <RedirectToHome />
      </Route>
      {__DEV__ ? (
        <Route path={routes.toLogin()}>
          <LoginPage />
        </Route>
      ) : null}
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  )
}

export default RouteDestinationsWithoutAuth
