import React from 'react'
import { Route, ModuleName, PageLayout, SidebarIdentifier, routeURL, NestedRoute } from 'framework/exports'
import i18n from './routes.i18n'

export const routeCDHome: Route = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/home',
  title: i18n.cd,
  pageId: 'cd-home',
  url: () => routeURL(routeCDHome, '/cd/home'),
  component: React.lazy(() => import('@cd/pages/home/CDHomePage'))
}

export const routeCDDashboard: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/dashboard/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.cdDashboard,
  pageId: 'cd-dashboard',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCDDashboard, `/cd/dashboard/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cd/pages/dashboard/CDDashboardPage'))
}

export const routeCDDeployments: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/deployments/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.deployments,
  pageId: 'cd-deployments',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCDDeployments, `/cd/deployments/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cd/pages/deployments/CDDeploymentsPage'))
}

export const routeCDPipelines: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.pipelines,
  pageId: 'cd-pipelines',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCDPipelines, `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@pipeline/pages/pipelines/PipelinesPage'))
}

export const routeCDPipelineStudioUI: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
}> = {
  path: '/cd/pipeline-studio/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/ui/',
  title: i18n.pipelineStudio,
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier }) =>
    routeURL(
      routeCDPipelineStudioUI,
      `/cd/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/ui/`
    ),
  component: React.lazy(() => import('@pipeline/components/PipelineStudio/StageBuilder/StageBuilder')),
  isDefault: true
}

export const routeCDPipelineStudioYaml: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
}> = {
  path: '/cd/pipeline-studio/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/yaml/',
  title: i18n.pipelineStudio,
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier }) =>
    routeURL(
      routeCDPipelineStudioYaml,
      `/cd/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/yaml/`
    ),
  component: React.lazy(() => import('@pipeline/components/PipelineStudio/PipelineYamlView/PipelineYamlView'))
}

export const routeCDPipelineStudio: Route<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
}> = {
  module: ModuleName.CD,
  layout: PageLayout.BlankLayout,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/pipeline-studio/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/',
  title: i18n.pipelineStudio,
  pageId: 'cd-pipeline-studio',
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier }) =>
    routeURL(
      routeCDPipelineStudio,
      `/cd/pipeline-studio/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/`
    ),
  component: React.lazy(() => import('@cd/pages/pipeline-studio/CDPipelineStudio')),
  nestedRoutes: [routeCDPipelineStudioYaml, routeCDPipelineStudioUI]
}

export const routeCDResourcesConnectors: NestedRoute<{ projectIdentifier: string; orgIdentifier: string }> = {
  path: '/cd/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier/connectors',
  title: i18n.resourcesConnectors,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCDResourcesConnectors,
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors`
    ),
  component: React.lazy(() => import('modules/dx/pages/connectors/ConnectorsPage')),
  isDefault: true
}

export const routeCDResourcesSecretsListing: NestedRoute<{ projectIdentifier: string; orgIdentifier: string }> = {
  path: '/cd/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier/secrets',
  title: i18n.resourcesSecrets,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCDResourcesConnectors,
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets`
    ),
  component: React.lazy(() => import('@secrets/pages/secrets/SecretsPage'))
}
export const routeCDResourcesConnectorDetails: NestedRoute<{ projectIdentifier: string; orgIdentifier: string }> = {
  path: '/cd/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier/connectors/:connectorId',
  title: i18n.resourcesConnectorDetails,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCDResourcesConnectors,
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/connectors/:connectorId`
    ),
  component: React.lazy(() => import('modules/dx/pages/connectors/ConnectorDetailsPage'))
}

export const routeCDResourcesSecretDetails: NestedRoute<{ projectIdentifier: string; orgIdentifier: string }> = {
  path: '/cd/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier/secrets/:secretId',
  title: i18n.resourcesSecretDetails,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCDResourcesConnectors,
      `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}/secrets/:secretId`
    ),
  component: React.lazy(() => import('@secrets/pages/secretDetails/SecretDetails'))
}

export const routeCDResources: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.resources,
  pageId: 'cd-admin-resources',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(routeCDResources, `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cd/pages/admin/resources/CDResourcesPage')),
  nestedRoutes: [
    routeCDResourcesConnectors,
    routeCDResourcesConnectorDetails,
    routeCDResourcesSecretsListing,
    routeCDResourcesSecretDetails
  ]
}

export const routeInputSetList: NestedRoute<{
  projectIdentifier: string
  orgIdentifier: string
  pipelineIdentifier: string
}> = {
  path: '/cd/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/input-sets',
  title: i18n.inputSets,
  url: ({ projectIdentifier, orgIdentifier, pipelineIdentifier }) =>
    routeURL(
      routeInputSetList,
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/input-sets`
    ),
  component: React.lazy(() => import('@pipeline/pages/inputSet-list/InputSetList'))
}

export const routePipelineDeploymentList: NestedRoute<{
  projectIdentifier: string
  orgIdentifier: string
  pipelineIdentifier: string
}> = {
  path: '/cd/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/executions',
  title: i18n.pipelineExecution,
  url: ({ projectIdentifier, orgIdentifier, pipelineIdentifier }) =>
    routeURL(
      routePipelineDeploymentList,
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions`
    ),
  component: React.lazy(() => import('@pipeline/pages/pipeline-deployment-list/PipelineDeploymentList')),
  isDefault: true
}

export const routeCDPipelineExecutionPipline: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
  executionIdentifier: string
}> = {
  path:
    '/cd/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/executions/:executionIdentifier/pipeline',
  title: i18n.pipelineExecution,
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }) =>
    routeURL(
      routeCDPipelineExecution,
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/pipeline`
    ),
  component: React.lazy(() => import('@pipeline/pages/execution/ExecutionPipelineView/ExecutionPipelineView')),
  isDefault: true
}

export const routeCDPipelineExecutionInputs: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
  executionIdentifier: string
}> = {
  path:
    '/cd/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/executions/:executionIdentifier/inputs',
  title: i18n.pipelineExecution,
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }) =>
    routeURL(
      routeCDPipelineExecution,
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/inputs`
    ),
  component: React.lazy(() => import('@pipeline/pages/execution/ExecutionInputsView/ExecutionInputsView'))
}

export const routeCDPipelineExecutionArtifacts: NestedRoute<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
  executionIdentifier: string
}> = {
  path:
    '/cd/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/executions/:executionIdentifier/artifacts',
  title: i18n.pipelineExecution,
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }) =>
    routeURL(
      routeCDPipelineExecution,
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}/artifacts`
    ),
  component: React.lazy(() => import('@pipeline/pages/execution/ExecutionArtifactsView/ExecutionArtifactsView'))
}

export const routeCDPipelineExecution: Route<{
  orgIdentifier: string
  projectIdentifier: string
  pipelineIdentifier: string | number
  executionIdentifier: string
}> = {
  module: ModuleName.CD,
  layout: PageLayout.NoMenuLayout,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path:
    '/cd/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier/executions/:executionIdentifier',
  title: i18n.pipelineExecution,
  pageId: 'cd-pipeline-execution',
  url: ({ orgIdentifier, projectIdentifier, pipelineIdentifier, executionIdentifier }) =>
    routeURL(
      routeCDPipelineExecution,
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}/executions/${executionIdentifier}`
    ),
  component: React.lazy(() => import('@pipeline/pages/execution/ExecutionLandingPage/ExecutionLandingPage')),
  nestedRoutes: [routeCDPipelineExecutionPipline, routeCDPipelineExecutionInputs, routeCDPipelineExecutionArtifacts]
}

export const routePipelineDetail: Route<{
  projectIdentifier: string
  orgIdentifier: string
  pipelineIdentifier: string
}> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/pipelines/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/:pipelineIdentifier',
  title: i18n.pipelineDetails,
  pageId: 'cd-pipeline-detail',
  url: ({ projectIdentifier, orgIdentifier, pipelineIdentifier }) =>
    routeURL(
      routePipelineDetail,
      `/cd/pipelines/orgs/${orgIdentifier}/projects/${projectIdentifier}/pipelines/${pipelineIdentifier}`
    ),
  component: React.lazy(() => import('@pipeline/pages/pipeline-details/PipelineDetails')),
  nestedRoutes: [routeInputSetList, routePipelineDeploymentList]
}

export const routeCDTemplateLibrary: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/admin/template-library/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.templateLibary,
  pageId: 'cd-template-library',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCDTemplateLibrary, `/cd/admin/template-library/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cd/pages/admin/template-library/CDTemplateLibraryPage'))
}

export const routeCDGitSync: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/admin/git-sync/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.gitSync,
  pageId: 'cd-git-sync',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCDGitSync, `/cd/admin/git-sync/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cd/pages/admin/git-sync/CDGitSyncPage'))
}

export const routeCDGovernance: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/admin/governance/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.governance,
  pageId: 'cd-governance',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCDGovernance, `/cd/admin/governance/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cd/pages/admin/governance/CDGovernancePage'))
}

export const routeCDAccessControl: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/admin/access-control/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.accessControl,
  pageId: 'cd-access-control',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCDAccessControl, `/cd/admin/access-control/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cd/pages/admin/access-control/CDAccessControlPage'))
}

export const routeCDGeneralSettings: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  module: ModuleName.CD,
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  path: '/cd/admin/general-settings/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.generalSettings,
  pageId: 'cd-general-settings',
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCDGeneralSettings, `/cd/admin/general-settings/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cd/pages/admin/general-settings/CDGeneralSettingsPage'))
}
