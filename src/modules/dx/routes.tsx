import type { RouteEntry } from 'framework'
import React from 'react'
import i18n from './routes.i18n'

export const DashboardRoute: RouteEntry = {
  path: '/dashboard',
  title: i18n.dashboard,
  pageId: 'dashboard',
  url: () => '/dashboard',
  page: React.lazy(() => import('./pages/dashboard/Dashboard'))
}
