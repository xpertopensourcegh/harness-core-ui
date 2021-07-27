import React from 'react'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'
import { RouteWithLayout } from '@common/router'
import { MinimalLayout } from '@common/layouts'
import HomePage from './pages/home/HomePage'
import DashboardViewPage from './pages/dashboardView/DashboardView'

const viewPathProps: { viewId: string } = {
  viewId: ':viewId'
}

export default (
  <>
    <RouteWithLayout layout={MinimalLayout} path={routes.toCustomDashboard({ ...accountPathProps })} exact>
      <HomePage />
    </RouteWithLayout>
    <RouteWithLayout
      layout={MinimalLayout}
      path={routes.toViewCustomDashboard({ ...accountPathProps, ...viewPathProps })}
      exact
    >
      <DashboardViewPage />
    </RouteWithLayout>
  </>
)
