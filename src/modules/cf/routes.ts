import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import i18n from './routes.i18n'

export const routeCFHome: Route = {
  module: ModuleName.CF,
  sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
  path: '/cf/home',
  title: i18n.cf,
  pageId: 'cf-home',
  url: () => routeURL(routeCFHome, '/cf/home'),
  component: React.lazy(() => import('./pages/home/CFHomePage'))
}

export const routeCFDashboard: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CF,
  sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
  path: '/cf/dashboard/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.dashboard,
  pageId: 'cf-dashboard',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCFDashboard, `/cf/dashboard/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/dashboard/CFDashboardPage'))
}

export const routeCFFeatureFlags: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CF,
  sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
  path: '/cf/feature-flags/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.featureFlags,
  pageId: 'cf-feature-flags',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCFDashboard, `/cf/feature-flags/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/feature-flags/CFFeatureFlagsPage'))
}

export const routeCFFeatureFlagsDetail: Route<{
  orgIdentifier: string
  projectIdentifier: string
  featureFlagIdentifier: string
}> = {
  module: ModuleName.CF,
  sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
  path: '/cf/feature-flags/orgs/:orgIdentifier/projects/:projectIdentifier/feature-flags/:featureFlagIdentifier',
  title: i18n.featureFlags,
  pageId: 'cf-feature-flags-detail',
  url: ({ orgIdentifier, projectIdentifier, featureFlagIdentifier }) =>
    routeURL(
      routeCFFeatureFlagsDetail,
      `/cf/feature-flags/orgs/${orgIdentifier}/projects/${projectIdentifier}/feature-flags/${featureFlagIdentifier}`
    ),
  component: React.lazy(() => import('./pages/feature-flags-detail/CFFeatureFlagsDetailPage'))
}

export const routeCFTargets: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CF,
  sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
  path: '/cf/targets/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.targets,
  pageId: 'cf-targets',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCFDashboard, `/cf/targets/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/targets/CFTargetsPage'))
}

export const routeCFWorkflows: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CF,
  sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
  path: '/cf/workflows/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.workflows,
  pageId: 'cf-workflows',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCFDashboard, `/cf/workflows/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('./pages/workflows/CFWorkflowsPage'))
}

// export const routeCFAdminBuildSettings: Route<{ projectIdentifier: string }> = {
//   module: ModuleName.CF,
//   sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
//   path: '/cf/admin/build-settings/projects/:projectIdentifier',
//   title: i18n.cf,
//   pageId: 'cf-admin-build-settings',
//   url: ({ projectIdentifier }) => routeURL(routeCFDashboard, `/cf/admin/build-settings/projects/${projectIdentifier}`),
//   component: React.lazy(() => import('./pages/admin/build-settings/CFBuildSettingsPage'))
// }

// export const routeCFAdminGovernance: Route<{ projectIdentifier: string }> = {
//   module: ModuleName.CF,
//   sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
//   path: '/cf/admin/governance/projects/:projectIdentifier',
//   title: i18n.cf,
//   pageId: 'cf-admin-governance',
//   url: ({ projectIdentifier }) => routeURL(routeCFDashboard, `/cf/admin/governance/projects/${projectIdentifier}`),
//   component: React.lazy(() => import('./pages/admin/governance/CFGovernancePage'))
// }

// export const routeCFAdminResources: Route<{ projectIdentifier: string }> = {
//   module: ModuleName.CF,
//   sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
//   path: '/cf/admin/resources/projects/:projectIdentifier',
//   title: i18n.cf,
//   pageId: 'cf-admin-resources',
//   url: ({ projectIdentifier }) => routeURL(routeCFDashboard, `/cf/admin/resources/projects/${projectIdentifier}`),
//   component: React.lazy(() => import('./pages/admin/resources/CFResourcesPage'))
// }
