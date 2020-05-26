import { RouteInfo, ModuleName, NavIdentifier } from 'framework'
import React from 'react'
import i18n from './routes.i18n'

export const routeDashboard: RouteInfo = {
  navId: NavIdentifier.DASHBOARD,
  path: '/dashboard',
  title: i18n.dashboard,
  pageId: 'dashboard',
  url: () => '/dashboard',
  component: React.lazy(() => import('./pages/dashboard/Dashboard')),
  module: ModuleName.DX
}
