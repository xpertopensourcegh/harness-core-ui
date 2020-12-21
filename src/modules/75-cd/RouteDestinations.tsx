import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import { EmptyLayout, MinimalLayout } from '@common/layouts'
import SidebarProvider from '@common/navigation/SidebarProvider'
import {
  accountPathProps,
  projectPathProps,
  pipelinePathProps,
  triggerPathProps,
  connectorPathProps,
  secretPathProps,
  executionPathProps,
  pipelineModuleParams,
  inputSetFormPathProps
} from '@common/utils/routeUtils'
import type {
  AccountPathProps,
  PipelinePathProps,
  ExecutionPathProps,
  ProjectPathProps,
  PipelineType
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
import TriggersWizardPage from '@pipeline/pages/triggers/TriggersWizardPage'
import ExecutionLandingPage from '@pipeline/pages/execution/ExecutionLandingPage/ExecutionLandingPage'
import ExecutionPipelineView from '@pipeline/pages/execution/ExecutionPipelineView/ExecutionPipelineView'
import ExecutionArtifactsView from '@pipeline/pages/execution/ExecutionArtifactsView/ExecutionArtifactsView'
import ExecutionInputsView from '@pipeline/pages/execution/ExecutionInputsView/ExecutionInputsView'
import PipelineDetails from '@pipeline/pages/pipeline-details/PipelineDetails'
import TriggerDetails from '@pipeline/pages/trigger-details/TriggerDetails'
import CDTemplateLibraryPage from '@cd/pages/admin/template-library/CDTemplateLibraryPage'
import CDGitSyncPage from '@cd/pages/admin/git-sync/CDGitSyncPage'
import CDGovernancePage from '@cd/pages/admin/governance/CDGovernancePage'
import CDAccessControlPage from '@cd/pages/admin/access-control/CDAccessControlPage'
import CDGeneralSettingsPage from '@cd/pages/admin/general-settings/CDGeneralSettingsPage'
import ResourcesPage from '@cd/pages/Resources/ResourcesPage'
import CDPipelineDeploymentList from '@cd/pages/pipeline-deployment-list/CDPipelineDeploymentList'
import { ModuleName, useAppStore } from 'framework/exports'
import RunPipelinePage from '@pipeline/pages/RunPipeline/RunPipelinePage'
import { InputSetForm } from '@pipeline/components/InputSetForm/InputSetForm'

const RedirectToCDHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()
  return <Redirect to={routes.toCDHome(params)} />
}

const RedirectToCDProject = (): React.ReactElement => {
  const params = useParams<ProjectPathProps>()
  const { selectedProject } = useAppStore()

  if (selectedProject?.modules?.includes(ModuleName.CD)) {
    return <Redirect to={routes.toCDProjectOverview(params)} />
  } else {
    return <Redirect to={routes.toCDHome(params)} />
  }
}

const RedirectToResourcesHome = (): React.ReactElement => {
  const params = useParams<ProjectPathProps>()
  return <Redirect to={routes.toCDResourcesConnectors(params)} />
}

const RedirectToPipelineDetailHome = (): React.ReactElement => {
  const params = useParams<PipelineType<PipelinePathProps>>()

  return <Redirect to={routes.toPipelineDeploymentList(params)} />
}

const RedirectToStudioUI = (): React.ReactElement => {
  const params = useParams<PipelineType<PipelinePathProps>>()

  return <Redirect to={routes.toPipelineStudioUI(params)} />
}

const RedirectToExecutionPipeline = (): React.ReactElement => {
  const params = useParams<PipelineType<ExecutionPathProps>>()

  return <Redirect to={routes.toExecutionPipelineView(params)} />
}

export default (
  <Route path={routes.toCD({ ...accountPathProps })}>
    <SidebarProvider navComponent={CDSideNav} subtitle="CONTINUOUS" title="Delivery">
      <Route path={routes.toCD({ ...accountPathProps })} exact>
        <RedirectToCDHome />
      </Route>

      <Route path={routes.toCDProject({ ...accountPathProps, ...projectPathProps })} exact>
        <RedirectToCDProject />
      </Route>

      <RouteWithLayout path={routes.toCDHome({ ...accountPathProps })} exact>
        <CDHomePage />
      </RouteWithLayout>

      <RouteWithLayout path={routes.toCDProjectOverview({ ...accountPathProps, ...projectPathProps })} exact>
        <CDDashboardPage />
      </RouteWithLayout>
      <RouteWithLayout
        path={routes.toDeployments({ ...accountPathProps, ...projectPathProps, ...pipelineModuleParams })}
        exact
      >
        <CDDeploymentsList />
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toPipelines({ ...accountPathProps, ...projectPathProps, ...pipelineModuleParams })}
      >
        <PipelinesPage />
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toRunPipeline({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <RunPipelinePage />
      </RouteWithLayout>
      <Route
        exact
        path={routes.toPipelineStudio({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <RedirectToStudioUI />
      </Route>

      <RouteWithLayout
        exact
        layout={MinimalLayout}
        path={routes.toPipelineStudioUI({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <CDPipelineStudio>
          <StageBuilder />
        </CDPipelineStudio>
      </RouteWithLayout>

      <RouteWithLayout
        exact
        layout={EmptyLayout}
        path={routes.toPipelineStudioYaml({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <CDPipelineStudio>
          <PipelineYamlView />
        </CDPipelineStudio>
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toPipelineDeploymentList({
          ...accountPathProps,
          ...pipelinePathProps,
          ...pipelineModuleParams
        })}
      >
        <PipelineDetails>
          <CDPipelineDeploymentList />
        </PipelineDetails>
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
      <RouteWithLayout
        exact
        path={routes.toInputSetList({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <PipelineDetails>
          <InputSetList />
        </PipelineDetails>
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toInputSetForm({ ...accountPathProps, ...inputSetFormPathProps, ...pipelineModuleParams })}
      >
        <InputSetForm />
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toTriggersPage({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <PipelineDetails>
          <TriggersPage />
        </PipelineDetails>
      </RouteWithLayout>
      <RouteWithLayout
        path={routes.toTriggersWizardPage({ ...accountPathProps, ...triggerPathProps, ...pipelineModuleParams })}
      >
        <TriggerDetails>
          <TriggersWizardPage />
        </TriggerDetails>
      </RouteWithLayout>
      <Route exact path={routes.toExecution({ ...accountPathProps, ...executionPathProps, ...pipelineModuleParams })}>
        <RedirectToExecutionPipeline />
      </Route>
      <RouteWithLayout
        exact
        path={routes.toExecutionPipelineView({ ...accountPathProps, ...executionPathProps, ...pipelineModuleParams })}
      >
        <ExecutionLandingPage>
          <ExecutionPipelineView />
        </ExecutionLandingPage>
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toExecutionInputsView({ ...accountPathProps, ...executionPathProps, ...pipelineModuleParams })}
      >
        <ExecutionLandingPage>
          <ExecutionInputsView />
        </ExecutionLandingPage>
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toExecutionArtifactsView({
          ...accountPathProps,
          ...executionPathProps,
          ...pipelineModuleParams
        })}
      >
        <ExecutionLandingPage>
          <ExecutionArtifactsView />
        </ExecutionLandingPage>
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toPipelineDetail({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <RedirectToPipelineDetailHome />
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
