import { Route, ModuleName, NavIdentifier } from 'framework'
import React from 'react'
import i18n from './dx.i18n'

export const routeDashboard: Route = {
  navId: NavIdentifier.DASHBOARD,
  path: '/dashboard',
  title: i18n.dashboard,
  pageId: 'dashboard',
  url: () => '/dashboard',
  component: React.lazy(() => import('./pages/dashboard/Dashboard')),
  module: ModuleName.DX
}
