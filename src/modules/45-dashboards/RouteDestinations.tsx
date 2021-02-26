import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import routes from '@common/RouteDefinitions'
import type { SidebarContext } from '@common/navigation/SidebarProvider'
import { accountPathProps } from '@common/utils/routeUtils'
import { RouteWithLayout } from '@common/router'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { MinimalLayout } from '@common/layouts'
import DashboardsSideNav from './components/SideNav/SideNav'
// import { ModuleName, useAppStore } from 'framework/exports'
import HomePage from './pages/home/HomePage'
import DashboardViewPage from './pages/dashboardView/DashboardView'

const RedirectToHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()

  return <Redirect to={routes.toCustomDasboardHome(params)} />
}

const DashboardsSideNavProps: SidebarContext = {
  navComponent: DashboardsSideNav,
  subtitle: 'CUSTOM',
  title: 'Dashboards'
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
      sidebarProps={DashboardsSideNavProps}
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
