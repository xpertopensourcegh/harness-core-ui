import React from 'react'
import { Route, ModuleName, PageLayout, SidebarIdentifier } from 'framework/exports'
import i18n from './routes.i18n'

export const routeDeployments: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/deployments',
  title: i18n.deployments,
  pageId: 'deployments',
  url: () => '/deployments',
  component: React.lazy(() => import('./pages/deployments/DeploymentsPage'))
}

export const routeResources: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/resources',
  title: i18n.resources,
  pageId: 'resources',
  url: () => '/resources',
  component: React.lazy(() => import('./pages/Resources/ResourcesPage'))
}

export const routeAboutPipelines: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/pipelines/about',
  title: i18n.deployments,
  pageId: 'pipelines-about',
  url: () => '/pipelines/about',
  component: React.lazy(() => import('./pages/pipelines/AboutPipelinesPage'))
}

export const routeExecutionGraphPipelines: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/pipelines/execution',
  title: i18n.deployments,
  pageId: 'pipelines-execution',
  url: () => '/pipelines/execution',
  component: React.lazy(() => import('./pages/pipelines/ExecutionGraph/ExecutionGraph'))
}
