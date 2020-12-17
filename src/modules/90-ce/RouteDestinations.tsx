import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import routes from '@common/RouteDefinitions'
import SidebarProvider from '@common/navigation/SidebarProvider'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { RouteWithLayout } from '@common/router'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'

import { MinimalLayout } from '@common/layouts'
import CESideNav from '@ce/components/CESideNav/CESideNav'
import CEHomePage from './pages/home/CEHomePage'
import CEDashboardPage from './pages/dashboard/CEDashboardPage'

const RedirectToCEHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()

  return <Redirect to={routes.toCEHome(params)} />
}

export default (
  <Route path={routes.toCE({ ...accountPathProps })}>
    <SidebarProvider navComponent={CESideNav} subtitle="CONTINUOUS" title="Efficiency">
      <Route path={routes.toCE({ ...accountPathProps })} exact>
        <RedirectToCEHome />
      </Route>
      <RouteWithLayout path={routes.toCEHome({ ...accountPathProps })} exact>
        <CEHomePage />
      </RouteWithLayout>
      <RouteWithLayout path={routes.toCEDashboard({ ...accountPathProps, ...projectPathProps })} exact>
        <CEDashboardPage />
      </RouteWithLayout>
      <RouteWithLayout path={routes.toCECostOptimizationDashboard({ ...accountPathProps, ...projectPathProps })} exact>
        <CEDashboardPage />
      </RouteWithLayout>
      <RouteWithLayout layout={MinimalLayout} exact path={routes.toCEHome({ ...accountPathProps })}>
        <CEDashboardPage />
      </RouteWithLayout>
    </SidebarProvider>
  </Route>
)
