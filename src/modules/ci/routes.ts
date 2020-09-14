import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL, NestedRoute } from 'framework/exports'
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
  path: '/ci/projects/:projectIdentifier/builds',
  title: i18n.ci,
  pageId: 'ci-builds',
  url: ({ projectIdentifier }) => routeURL(routeCIBuilds, `/ci/projects/${projectIdentifier}/builds`),
  component: React.lazy(() => import('./pages/builds/CIBuildsPage'))
}

export const routeCIBuildPipelineGraph: NestedRoute<{ projectIdentifier: string; buildIdentifier: string }> = {
  path: '/ci/projects/:projectIdentifier/builds/:buildIdentifier/pipeline/graph',
  title: i18n.buildPipelineGraph,
  url: ({ projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuildPipelineGraph, `/ci/projects/${projectIdentifier}/builds/${buildIdentifier}/pipeline/graph`),
  component: React.lazy(() => import('./pages/build/sections/pipeline-graph/BuildPipelineGraph')),
  isDefault: true
}

export const routeCIBuildPipelineLog: NestedRoute<{ projectIdentifier: string; buildIdentifier: string }> = {
  path: '/ci/projects/:projectIdentifier/builds/:buildIdentifier/pipeline/log',
  title: i18n.buildPipelineLog,
  url: ({ projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuildPipelineLog, `/ci/projects/${projectIdentifier}/builds/${buildIdentifier}/pipeline/log`),
  component: React.lazy(() => import('./pages/build/sections/pipeline-log/BuildPipelineLog'))
}

export const routeCIBuildInputs: NestedRoute<{ projectIdentifier: string; buildIdentifier: string }> = {
  path: '/ci/projects/:projectIdentifier/builds/:buildIdentifier/inputs',
  title: i18n.buildInputs,
  url: ({ projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuildInputs, `/ci/projects/${projectIdentifier}/builds/${buildIdentifier}/inputs`),
  component: React.lazy(() => import('./pages/build/sections/inputs/BuildInputs'))
}

export const routeCIBuildCommits: NestedRoute<{ projectIdentifier: string; buildIdentifier: string }> = {
  path: '/ci/projects/:projectIdentifier/builds/:buildIdentifier/commits',
  title: i18n.buildCommits,
  url: ({ projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuildCommits, `/ci/projects/${projectIdentifier}/builds/${buildIdentifier}/commits`),
  component: React.lazy(() => import('./pages/build/sections/commits/BuildCommits'))
}

export const routeCIBuildTests: NestedRoute<{ projectIdentifier: string; buildIdentifier: string }> = {
  path: '/ci/projects/:projectIdentifier/builds/:buildIdentifier/tests',
  title: i18n.buildTests,
  url: ({ projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuildTests, `/ci/projects/${projectIdentifier}/builds/${buildIdentifier}/tests`),
  component: React.lazy(() => import('./pages/build/sections/tests/BuildTests'))
}

export const routeCIBuildArtifacts: NestedRoute<{ projectIdentifier: string; buildIdentifier: string }> = {
  path: '/ci/projects/:projectIdentifier/builds/:buildIdentifier/artifacts',
  title: i18n.buildArtifacts,
  url: ({ projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuildArtifacts, `/ci/projects/${projectIdentifier}/builds/${buildIdentifier}/artifacts`),
  component: React.lazy(() => import('./pages/build/sections/artifacts/BuildArtifacts'))
}

export const routeCIBuild: Route<{ projectIdentifier: string; buildIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/projects/:projectIdentifier/builds/:buildIdentifier',
  title: i18n.ci,
  pageId: 'ci-build',
  url: ({ projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuild, `/ci/projects/${projectIdentifier}/builds/${buildIdentifier}`),
  component: React.lazy(() => import('./pages/build/CIBuildPage')),
  nestedRoutes: [
    routeCIBuildPipelineGraph,
    routeCIBuildPipelineLog,
    routeCIBuildInputs,
    routeCIBuildCommits,
    routeCIBuildTests,
    routeCIBuildArtifacts
  ]
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
