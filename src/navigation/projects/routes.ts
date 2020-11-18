import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import { NoMenuLayout } from 'framework/layout/layouts/DefaultLayout/DefaultLayout'
import i18n from './routes.i18n'

export const routeProjectDetails: Route<{
  projectIdentifier: string
  orgIdentifier: string
}> = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.PROJECTS,
  path: '/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.projectDetails,
  layout: NoMenuLayout,
  pageId: 'projectDetails',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(routeProjectDetails, `/org/${orgIdentifier}/project/${projectIdentifier}`),
  component: React.lazy(() => import('@projects-orgs/pages/projects/views/ProjectDetails/ProjectDetails'))
}

export const routeProjects: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.PROJECTS,
  path: '/projects',
  title: i18n.project,
  pageId: 'projects',
  layout: NoMenuLayout,
  url: () => routeURL(routeProjects, '/projects'),
  component: React.lazy(() => import('@projects-orgs/pages/projects/ProjectsPage'))
}
