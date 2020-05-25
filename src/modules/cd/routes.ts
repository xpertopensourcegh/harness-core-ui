import React from 'react'
import { RouteInfo, ModuleName, PageLayout } from 'framework'
import i18n from './routes.i18n'

export const CDDeployments: RouteInfo = {
  module: ModuleName.CD,
  layout: PageLayout.DefaultLayout,
  path: '/deployments',
  title: i18n.deployments,
  pageId: 'deployments',
  url: () => '/deployments',
  component: React.lazy(() => import('./pages/deployments/DeploymentsPage'))
}
