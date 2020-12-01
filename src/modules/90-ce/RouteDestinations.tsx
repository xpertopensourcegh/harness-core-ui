import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'
import { RouteWithLayout } from '@common/router'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'

import { MinimalLayout } from '@common/layouts'
import CEDashboardPage from './pages/dashboard/CEDashboardPage'

const RedirectToCEHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()

  return <Redirect to={routes.toCEHome(params)} />
}

export default (
  <Route path={routes.toCE({ ...accountPathProps })}>
    <Route path={routes.toCE({ ...accountPathProps })} exact>
      <RedirectToCEHome />
    </Route>
    <RouteWithLayout layout={MinimalLayout} exact path={routes.toCEHome({ ...accountPathProps })}>
      <CEDashboardPage />
    </RouteWithLayout>
  </Route>
)
