import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import { EmptyLayout, MinimalLayout } from '@common/layouts'
import SidebarProvider from '@common/navigation/SidebarProvider'
import {
  accountPathProps,
  projectPathProps,
  pipelinePathProps,
  connectorPathProps,
  secretPathProps,
  executionPathProps
} from '@common/utils/routeUtils'
import type {
  AccountPathProps,
  PipelinePathProps,
  ExecutionPathProps,
  ProjectPathProps
} from '@common/interfaces/RouteInterfaces'
import routes from '@common/RouteDefinitions'

import CDSideNav from '@cd/components/CDSideNav/CDSideNav'
import CDHomePage from '@cd/pages/home/CDHomePage'
import CDDashboardPage from '@cd/pages/dashboard/CDDashboardPage'
import CDDeploymentsList from '@cd/pages/deployments-list/DeploymentsList'
import CDPipelineStudio from '@cd/pages/pipeline-studio/CDPipelineStudio'
import StageBuilder from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilder'
import PipelineYamlView from '@pipeline/components/PipelineStudio/PipelineYamlView/PipelineYamlView'
import PipelinesPage from '@pipeline/pages/pipelines/PipelinesPage'
import ConnectorsPage from '@connectors/pages/connectors/ConnectorsPage'
import SecretsPage from '@secrets/pages/secrets/SecretsPage'
import ConnectorDetailsPage from '@connectors/pages/connectors/ConnectorDetailsPage'
import SecretDetails from '@secrets/pages/secretDetails/SecretDetails'
import InputSetList from '@pipeline/pages/inputSet-list/InputSetList'
import TriggersPage from '@pipeline/pages/triggers/TriggersPage'
import ExecutionLandingPage from '@pipeline/pages/execution/ExecutionLandingPage/ExecutionLandingPage'
import ExecutionPipelineView from '@pipeline/pages/execution/ExecutionPipelineView/ExecutionPipelineView'
import ExecutionArtifactsView from '@pipeline/pages/execution/ExecutionArtifactsView/ExecutionArtifactsView'
import ExecutionInputsView from '@pipeline/pages/execution/ExecutionInputsView/ExecutionInputsView'
import PipelineDetails from '@pipeline/pages/pipeline-details/PipelineDetails'
import CDTemplateLibraryPage from '@cd/pages/admin/template-library/CDTemplateLibraryPage'
import CDGitSyncPage from '@cd/pages/admin/git-sync/CDGitSyncPage'
import CDGovernancePage from '@cd/pages/admin/governance/CDGovernancePage'
import CDAccessControlPage from '@cd/pages/admin/access-control/CDAccessControlPage'
import CDGeneralSettingsPage from '@cd/pages/admin/general-settings/CDGeneralSettingsPage'
import ResourcesPage from '@cd/pages/Resources/ResourcesPage'
import CDPipelineDeploymentList from '@cd/pages/pipeline-deployment-list/CDPipelineDeploymentList'

const RedirectToCDHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()

  return <Redirect to={routes.toCDHome(params)} />
}

const RedirectToResourcesHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps & ProjectPathProps>()

  return <Redirect to={routes.toCDResourcesConnectors(params)} />
}

const RedirectToStudioUI = (): React.ReactElement => {
  const params = useParams<PipelinePathProps & AccountPathProps>()

  return <Redirect to={routes.toCDPipelineStudioUI(params)} />
}

const RedirectToExecutionPipeline = (): React.ReactElement => {
  const params = useParams<ExecutionPathProps & AccountPathProps>()

  return <Redirect to={routes.toCDExecutionPiplineView(params)} />
}

export default (
  <Route path={routes.toCD({ ...accountPathProps })}>
    <SidebarProvider navComponent={CDSideNav} subtitle="CONTINUOUS" title="Delivery">
      <Route path={routes.toCD({ ...accountPathProps })} exact>
        <RedirectToCDHome />
      </Route>
      <RouteWithLayout path={routes.toCDHome({ ...accountPathProps })} exact>
        <CDHomePage />
      </RouteWithLayout>
      <RouteWithLayout path={routes.toCDDashboard({ ...accountPathProps, ...projectPathProps })} exact>
        <CDDashboardPage />
      </RouteWithLayout>
      <RouteWithLayout path={routes.toCDDeployments({ ...accountPathProps, ...projectPathProps })} exact>
        <CDDeploymentsList />
      </RouteWithLayout>

      <RouteWithLayout exact path={routes.toCDPipelines({ ...accountPathProps, ...projectPathProps })}>
        <PipelinesPage />
      </RouteWithLayout>

      <Route exact path={routes.toCDPipelineStudio({ ...accountPathProps, ...pipelinePathProps })}>
        <RedirectToStudioUI />
      </Route>
      <RouteWithLayout
        exact
        layout={MinimalLayout}
        path={routes.toCDPipelineStudioUI({ ...accountPathProps, ...pipelinePathProps })}
      >
        <CDPipelineStudio>
          <StageBuilder />
        </CDPipelineStudio>
      </RouteWithLayout>

      <RouteWithLayout
        exact
        layout={EmptyLayout}
        path={routes.toCDPipelineStudioYaml({ ...accountPathProps, ...pipelinePathProps })}
      >
        <CDPipelineStudio>
          <PipelineYamlView />
        </CDPipelineStudio>
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toCDPipelineDeploymentList({
          ...accountPathProps,
          ...pipelinePathProps
        })}
      >
        <CDPipelineDeploymentList />
      </RouteWithLayout>
      <Route exact path={routes.toCDResources({ ...accountPathProps, ...projectPathProps })}>
        <RedirectToResourcesHome />
      </Route>
      <RouteWithLayout exact path={routes.toCDResourcesConnectors({ ...accountPathProps, ...projectPathProps })}>
        <ResourcesPage>
          <ConnectorsPage />
        </ResourcesPage>
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDResourcesSecretsListing({ ...accountPathProps, ...projectPathProps })}>
        <ResourcesPage>
          <SecretsPage />
        </ResourcesPage>
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toCDResourcesConnectorDetails({
          ...accountPathProps,
          ...projectPathProps,
          ...connectorPathProps
        })}
      >
        <ConnectorDetailsPage />
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toCDResourcesSecretDetails({
          ...accountPathProps,
          ...projectPathProps,
          ...secretPathProps
        })}
      >
        <SecretDetails />
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDInputSetList({ ...accountPathProps, ...pipelinePathProps })}>
        <InputSetList />
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDTriggersPage({ ...accountPathProps, ...pipelinePathProps })}>
        <TriggersPage />
      </RouteWithLayout>
      <Route exact path={routes.toCDExecution({ ...accountPathProps, ...executionPathProps })}>
        <RedirectToExecutionPipeline />
      </Route>
      <RouteWithLayout exact path={routes.toCDExecutionPiplineView({ ...accountPathProps, ...executionPathProps })}>
        <ExecutionLandingPage>
          <ExecutionPipelineView />
        </ExecutionLandingPage>
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDExecutionInputsView({ ...accountPathProps, ...executionPathProps })}>
        <ExecutionLandingPage>
          <ExecutionInputsView />
        </ExecutionLandingPage>
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDExecutionArtifactsView({ ...accountPathProps, ...executionPathProps })}>
        <ExecutionLandingPage>
          <ExecutionArtifactsView />
        </ExecutionLandingPage>
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDPipelineDetail({ ...accountPathProps, ...pipelinePathProps })}>
        <PipelineDetails />
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDTemplateLibrary({ ...accountPathProps, ...projectPathProps })}>
        <CDTemplateLibraryPage />
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDGitSync({ ...accountPathProps, ...projectPathProps })}>
        <CDGitSyncPage />
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDGovernance({ ...accountPathProps, ...projectPathProps })}>
        <CDGovernancePage />
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDAccessControl({ ...accountPathProps, ...projectPathProps })}>
        <CDAccessControlPage />
      </RouteWithLayout>
      <RouteWithLayout exact path={routes.toCDGeneralSettings({ ...accountPathProps, ...projectPathProps })}>
        <CDGeneralSettingsPage />
      </RouteWithLayout>
    </SidebarProvider>
  </Route>
)

// export const routeCDResources: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
//   module: ModuleName.CD,
//   sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
//   path: '/cd/admin/resources/orgs/:orgIdentifier/projects/:projectIdentifier',
//   title: i18n.resources,
//   pageId: 'cd-admin-resources',
//   url: ({ projectIdentifier, orgIdentifier }) =>
//     routeURL(routeCDResources, `/cd/admin/resources/orgs/${orgIdentifier}/projects/${projectIdentifier}`),
//   component: React.lazy(() => import('@cd/pages/admin/resources/CDResourcesPage')),
//   nestedRoutes: [
//     routeCDResourcesConnectors,
//     routeCDResourcesConnectorDetails,
//     routeCDResourcesSecretsListing,
//     routeCDResourcesSecretDetails
//   ]
// }
