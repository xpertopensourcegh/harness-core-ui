import React from 'react'
import { Route, ModuleName, PageLayout, SidebarIdentifier, RouteURLArgs } from 'framework/exports'
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

export const routePipelineCanvas: Route = {
  module: ModuleName.CD,
  layout: PageLayout.BlankLayout,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  path: '/projects/:projectId/pipelines/:pipelineId/',
  title: i18n.pipelineStudio,
  pageId: 'pipelines-canvas',
  url: (params: RouteURLArgs) =>
    params ? `/projects/${params.projectId}/pipelines/${params.pipelineId}/` : '/projects/-1/pipelines/-1/',
  component: React.lazy(() => import('./pages/pipelines/PipelineStudio'))
}
