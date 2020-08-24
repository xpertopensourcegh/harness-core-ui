import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import i18n from './routes.i18n'

export const routeCIHome: Route = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/home',
  title: i18n.ci,
  pageId: 'ci-home',
  url: () => routeURL(routeCIHome, '/ci/home'),
  component: React.lazy(() => import('./pages/home/CIHomePage'))
}

export const routeCIOverview: Route<{ projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/overview/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-overview',
  url: ({ projectIdentifier }) => routeURL(routeCIOverview, `/ci/overview/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/overview/CIOverviewPage'))
}

export const routeCIBuilds: Route<{ projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/builds/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-builds',
  url: ({ projectIdentifier }) => routeURL(routeCIOverview, `/ci/builds/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/builds/CIBuildsPage'))
}

export const routeCIAdminBuildSettings: Route<{ projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/admin/build-settings/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-admin-build-settings',
  url: ({ projectIdentifier }) => routeURL(routeCIOverview, `/ci/admin/build-settings/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/admin/build-settings/CIBuildSettingsPage'))
}

export const routeCIAdminGovernance: Route<{ projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/admin/governance/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-admin-governance',
  url: ({ projectIdentifier }) => routeURL(routeCIOverview, `/ci/admin/governance/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/admin/governance/CIGovernancePage'))
}

export const routeCIAdminResources: Route<{ projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/admin/resources/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-admin-resources',
  url: ({ projectIdentifier }) => routeURL(routeCIOverview, `/ci/admin/resources/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/admin/resources/CIResourcesPage'))
}
