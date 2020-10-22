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
  component: React.lazy(() => import('modules/ci/pages/home/CIHomePage'))
}

export const routeCIOverview: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/overview/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-overview',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCIOverview, `/ci/overview/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('modules/ci/pages/overview/CIOverviewPage'))
}

export const routeCIBuilds: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds',
  title: i18n.ci,
  pageId: 'ci-builds',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCIBuilds, `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds`),
  component: React.lazy(() => import('modules/ci/pages/builds/CIBuildsPage'))
}

export const routeCIBuildPipelineGraph: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  buildIdentifier: string
}> = {
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier/pipeline/graph',
  title: i18n.buildPipelineGraph,
  url: ({ orgIdentifier, projectIdentifier, buildIdentifier }) =>
    routeURL(
      routeCIBuildPipelineGraph,
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/pipeline/graph`
    ),
  component: React.lazy(() => import('modules/ci/pages/build/sections/pipeline-graph/BuildPipelineGraph')),
  isDefault: true
}

export const routeCIBuildPipelineLog: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  buildIdentifier: string
}> = {
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier/pipeline/log',
  title: i18n.buildPipelineLog,
  url: ({ orgIdentifier, projectIdentifier, buildIdentifier }) =>
    routeURL(
      routeCIBuildPipelineLog,
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/pipeline/log`
    ),
  component: React.lazy(() => import('modules/ci/pages/build/sections/pipeline-log/BuildPipelineLog'))
}

export const routeCIBuildInputs: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  buildIdentifier: string
}> = {
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier/inputs',
  title: i18n.buildInputs,
  url: ({ orgIdentifier, projectIdentifier, buildIdentifier }) =>
    routeURL(
      routeCIBuildInputs,
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/inputs`
    ),
  component: React.lazy(() => import('modules/ci/pages/build/sections/inputs/BuildInputs'))
}

export const routeCIBuildCommits: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  buildIdentifier: string
}> = {
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier/commits',
  title: i18n.buildCommits,
  url: ({ orgIdentifier, projectIdentifier, buildIdentifier }) =>
    routeURL(
      routeCIBuildCommits,
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/commits`
    ),
  component: React.lazy(() => import('modules/ci/pages/build/sections/commits/BuildCommits'))
}

export const routeCIBuildTests: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  buildIdentifier: string
}> = {
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier/tests',
  title: i18n.buildTests,
  url: ({ orgIdentifier, projectIdentifier, buildIdentifier }) =>
    routeURL(
      routeCIBuildTests,
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/tests`
    ),
  component: React.lazy(() => import('modules/ci/pages/build/sections/tests/BuildTests'))
}

export const routeCIBuildArtifacts: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  buildIdentifier: string
}> = {
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier/artifacts',
  title: i18n.buildArtifacts,
  url: ({ orgIdentifier, projectIdentifier, buildIdentifier }) =>
    routeURL(
      routeCIBuildArtifacts,
      `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/artifacts`
    ),
  component: React.lazy(() => import('modules/ci/pages/build/sections/artifacts/BuildArtifacts'))
}

export const routeCIBuild: Route<{ orgIdentifier: string; projectIdentifier: string; buildIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier',
  title: i18n.ci,
  pageId: 'ci-build',
  url: ({ orgIdentifier, projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuild, `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}`),
  component: React.lazy(() => import('modules/ci/pages/build/CIBuildPage')),
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
  component: React.lazy(() => import('modules/ci/pages/admin/build-settings/CIBuildSettingsPage'))
}

export const routeCIAdminGovernance: Route<{ projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/admin/governance/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-admin-governance',
  url: ({ projectIdentifier }) => routeURL(routeCIOverview, `/ci/admin/governance/projects/${projectIdentifier}`),
  component: React.lazy(() => import('modules/ci/pages/admin/governance/CIGovernancePage'))
}

export const routeCIAdminResources: Route<{ projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/admin/resources/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-admin-resources',
  url: ({ projectIdentifier }) => routeURL(routeCIOverview, `/ci/admin/resources/projects/${projectIdentifier}`),
  component: React.lazy(() => import('modules/ci/pages/admin/resources/CIResourcesPage'))
}
