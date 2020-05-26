import React from 'react'
import { RouteInfo, ModuleName, PageLayout, NavIdentifier } from 'framework'
import i18n from './module.i18n'

export const routeDeployments: RouteInfo = {
  module: ModuleName.CD,
  navId: NavIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/deployments',
  title: i18n.deployments,
  pageId: 'deployments',
  url: () => '/deployments',
  component: React.lazy(() => import('./pages/deployments/DeploymentsPage'))
}
