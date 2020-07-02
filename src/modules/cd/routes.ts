import React from 'react'
import { Route, ModuleName, PageLayout, SidebarIdentifier, RouteURLArgs } from 'framework/exports'
import i18n from './routes.i18n'

export const routeDeployments: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/org/:orgIdentifier/projects/:projectIdentifier/deployments',
  title: i18n.deployments,
  pageId: 'deployments',
  url: (params: RouteURLArgs) =>
    params ? `/org/${params.orgIdentifier}/projects/${params.projectIdentifier}/deployments` : '',
  component: React.lazy(() => import('./pages/deployments/DeploymentsPage'))
}

export const routeProjectOverview: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/org/:orgIdentifier/projects/:projectIdentifier/project-overview',
  title: i18n.overview,
  pageId: 'project-overview',
  url: (params: RouteURLArgs) =>
    params ? `/org/${params.orgIdentifier}/projects/${params.projectIdentifier}/project-overview` : '',
  component: React.lazy(() => import('./pages/project-overview/ProjectOverview'))
}
export const routeCDProjects: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/cd-projects',
  title: i18n.projects,
  pageId: 'cd-projects',
  url: () => '/cd-projects',
  component: React.lazy(() => import('../common/pages/ProjectsPage/ProjectsPage'))
}

export const routePipelineCanvas: Route = {
  module: ModuleName.CD,
  layout: PageLayout.BlankLayout,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  path: '/org/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/',
  title: i18n.pipelineStudio,
  pageId: 'pipelines-studio',
  url: (params: RouteURLArgs) =>
    params
      ? `/org/${params.orgIdentifier}/projects/${params.projectIdentifier}/pipelines/${params.pipelineIdentifier}/`
      : '',
  component: React.lazy(() => import('./pages/pipelines/PipelineStudio'))
}

export const routePipelines: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  layout: PageLayout.DefaultLayout,
  path: '/org/:orgIdentifier/projects/:projectIdentifier/pipelines',
  title: i18n.pipelines,
  pageId: 'pipelines',
  url: (params: RouteURLArgs) =>
    params ? `/org/${params.orgIdentifier}/projects/${params.projectIdentifier}/pipelines` : '',
  component: React.lazy(() => import('./pages/pipeline-list/PipelineList'))
}
