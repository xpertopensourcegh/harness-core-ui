import React from 'react'
import { Route, ModuleName, PageLayout, NavIdentifier } from 'framework'
import i18n from './cd.i18n'

export const routeDeployments: Route = {
  module: ModuleName.CD,
  navId: NavIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/deployments',
  title: i18n.deployments,
  pageId: 'deployments',
  url: () => '/deployments',
  component: React.lazy(() => import('./pages/deployments/DeploymentsPage'))
}
