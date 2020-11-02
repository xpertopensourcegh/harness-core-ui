import React from 'react'
import { Route, ModuleName, PageLayout, SidebarIdentifier, routeURL, NestedRoute } from 'framework/exports'
import i18n from './routes.i18n'

export const routeCIHome: Route = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/home',
  title: i18n.ci,
  pageId: 'ci-home',
  url: () => routeURL(routeCIHome, '/ci/home'),
  component: React.lazy(() => import('@ci/pages/home/CIHomePage'))
}

export const routeCIDashboard: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/dashboard/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.ciDashboard,
  pageId: 'ci-dashboard',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCIDashboard, `/ci/dashboard/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@ci/pages/dashboard/CIDashboardPage'))
}

export const routeCIPipelines: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.pipelines,
  pageId: 'ci-pipelines',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCIPipelines, `/ci/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@pipeline/pages/pipelines/PipelinesPage'))
}

export const routeCIPipelineStudioUI: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
}> = {
  path: '/ci/pipeline-studio/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/ui/',
  title: i18n.pipelineStudio,
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier }) =>
    routeURL(
      routeCIPipelineStudioUI,
      `/ci/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/ui/`
    ),
  component: React.lazy(() => import('@pipeline/components/PipelineStudio/StageBuilder/StageBuilder')),
  isDefault: true
}

export const routeCIPipelineStudioYaml: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
}> = {
  path: '/ci/pipeline-studio/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/yaml/',
  title: i18n.pipelineStudio,
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier }) =>
    routeURL(
      routeCIPipelineStudioYaml,
      `/ci/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/yaml/`
    ),
  component: React.lazy(() => import('@pipeline/components/PipelineStudio/PipelineYamlView/PipelineYamlView'))
}

export const routeCIPipelineStudio: Route<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
}> = {
  module: ModuleName.CI,
  layout: PageLayout.BlankLayout,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/pipeline-studio/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/',
  title: i18n.pipelineStudio,
  pageId: 'ci-pipeline-studio',
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier }) =>
    routeURL(
      routeCIPipelineStudio,
      `/ci/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/`
    ),
  component: React.lazy(() => import('@ci/pages/pipeline-studio/CIPipelineStudio')),
  nestedRoutes: [routeCIPipelineStudioYaml, routeCIPipelineStudioUI]
}

export const routePipelineDeploymentList: NestedRoute<{
  projectIdentifier: string
  orgIdentifier: string
  pipelineIdentifier: string
}> = {
  path: '/ci/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/executions',
  title: i18n.pipelineExecution,
  url: ({ projectIdentifier, orgIdentifier, pipelineIdentifier }) =>
    routeURL(
      routePipelineDeploymentList,
      `/ci/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions`
    ),
  component: React.lazy(() => import('@pipeline/pages/pipeline-deployment-list/PipelineDeploymentList')),
  isDefault: true
}

export const routeCIBuilds: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds',
  title: i18n.ci,
  pageId: 'ci-builds',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCIBuilds, `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds`),
  component: React.lazy(() => import('@ci/pages/builds/CIBuildsPage'))
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
  component: React.lazy(() => import('@ci/pages/build/sections/pipeline-graph/BuildPipelineGraph')),
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
  component: React.lazy(() => import('@ci/pages/build/sections/pipeline-log/BuildPipelineLog'))
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
  component: React.lazy(() => import('@ci/pages/build/sections/inputs/BuildInputs'))
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
  component: React.lazy(() => import('@ci/pages/build/sections/commits/BuildCommits'))
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
  component: React.lazy(() => import('@ci/pages/build/sections/tests/BuildTests'))
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
  component: React.lazy(() => import('@ci/pages/build/sections/artifacts/BuildArtifacts'))
}

export const routeCIBuild: Route<{ orgIdentifier: string; projectIdentifier: string; buildIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier',
  title: i18n.ci,
  pageId: 'ci-build',
  url: ({ orgIdentifier, projectIdentifier, buildIdentifier }) =>
    routeURL(routeCIBuild, `/ci/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}`),
  component: React.lazy(() => import('@ci/pages/build/CIBuildPage')),
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
  url: ({ projectIdentifier }) => routeURL(routeCIDashboard, `/ci/admin/build-settings/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@ci/pages/admin/build-settings/CIBuildSettingsPage'))
}

export const routeCIAdminGovernance: Route<{ projectIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/admin/governance/projects/:projectIdentifier',
  title: i18n.ci,
  pageId: 'ci-admin-governance',
  url: ({ projectIdentifier }) => routeURL(routeCIDashboard, `/ci/admin/governance/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@ci/pages/admin/governance/CIGovernancePage'))
}

export const routeCIAdminResourcesConnectors: NestedRoute<{ projectIdentifier: string; orgIdentifier: string }> = {
  path: '/ci/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier/connectors',
  title: i18n.resourcesConnectors,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCIAdminResourcesConnectors,
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors`
    ),
  component: React.lazy(() => import('@connectors/pages/connectors/ConnectorsPage')),
  isDefault: true
}

export const routeCIAdminResourcesSecretsListing: NestedRoute<{ projectIdentifier: string; orgIdentifier: string }> = {
  path: '/ci/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier/secrets',
  title: i18n.resourcesSecrets,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCIAdminResourcesConnectors,
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets`
    ),
  component: React.lazy(() => import('@secrets/pages/secrets/SecretsPage'))
}
export const routeCIAdminResourcesConnectorDetails: NestedRoute<{
  projectIdentifier: string
  orgIdentifier: string
}> = {
  path: '/ci/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier/connectors/:connectorId',
  title: i18n.resourcesConnectorDetails,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCIAdminResourcesConnectors,
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors/:connectorId`
    ),
  component: React.lazy(() => import('@connectors/pages/connectors/ConnectorDetailsPage'))
}

export const routeCIAdminResourcesSecretDetails: NestedRoute<{ projectIdentifier: string; orgIdentifier: string }> = {
  path: '/ci/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier/secrets/:secretId',
  title: i18n.resourcesSecretDetails,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCIAdminResourcesConnectors,
      `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets/:secretId`
    ),
  component: React.lazy(() => import('@secrets/pages/secretDetails/SecretDetails'))
}

export const routeCIAdminResources: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  module: ModuleName.CI,
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  path: '/ci/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.resources,
  pageId: 'ci-admin-resources',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(routeCIAdminResources, `/ci/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@ci/pages/admin/resources/CIResourcesPage')),
  nestedRoutes: [
    routeCIAdminResourcesConnectors,
    routeCIAdminResourcesConnectorDetails,
    routeCIAdminResourcesSecretsListing,
    routeCIAdminResourcesSecretDetails
  ]
}
