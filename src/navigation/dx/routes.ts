import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import i18n from './routes.i18n'

export const routeDashboard: Route = {
  sidebarId: SidebarIdentifier.DASHBOARD,
  path: '/dashboard',
  title: i18n.dashboard,
  pageId: 'dashboard',
  url: () => routeURL(routeDashboard, '/dashboard'),
  component: React.lazy(() => import('@connectors/pages/dashboard/DashboardPage')),
  module: ModuleName.DX
}
