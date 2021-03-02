import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import routes from '@common/RouteDefinitions'

import { accountPathProps } from '@common/utils/routeUtils'
import { RouteWithLayout } from '@common/router'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { MinimalLayout } from '@common/layouts'

import HomePage from './pages/home/HomePage'
import DashboardViewPage from './pages/dashboardView/DashboardView'

const RedirectToHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()

  return <Redirect to={routes.toCustomDasboardHome(params)} />
}

const viewPathProps: { viewId: string } = {
  viewId: ':viewId'
}

export default (
  <>
    <Route path={routes.toCustomDasboard({ ...accountPathProps })} exact>
      <RedirectToHome />
    </Route>
    <RouteWithLayout
      layout={MinimalLayout}
      // sidebarProps={DashboardsSideNavProps}
      path={routes.toCustomDasboardHome({ ...accountPathProps })}
      exact
    >
      <HomePage />
    </RouteWithLayout>
    <RouteWithLayout
      layout={MinimalLayout}
      // sidebarProps={DashboardsSideNavProps}
      path={routes.toViewCustomDashboard({ ...accountPathProps, ...viewPathProps })}
      exact
    >
      <DashboardViewPage />
    </RouteWithLayout>
  </>
)
