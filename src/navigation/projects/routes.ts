import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import i18n from './routes.i18n'

export const routeProjects: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.PROJECTS,
  path: '/projects',
  title: i18n.project,
  pageId: 'projects',
  url: () => routeURL(routeProjects, '/projects'),
  component: React.lazy(() => import('@common/pages/ProjectsPage/ProjectsPage'))
}
