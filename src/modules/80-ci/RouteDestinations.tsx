import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import { EmptyLayout, MinimalLayout } from '@common/layouts'
import {
  accountPathProps,
  projectPathProps,
  pipelinePathProps,
  connectorPathProps,
  secretPathProps,
  pipelineModuleParams,
  inputSetFormPathProps,
  triggerPathProps,
  executionPathProps
} from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import type {
  ExecutionPathProps,
  PipelinePathProps,
  PipelineType,
  ProjectPathProps
} from '@common/interfaces/RouteInterfaces'

import DeploymentsList from '@cd/pages/deployments-list/DeploymentsList'
import CIHomePage from '@ci/pages/home/CIHomePage'
import CIDashboardPage from '@ci/pages/dashboard/CIDashboardPage'
import CIPipelineStudio from '@ci/pages/pipeline-studio/CIPipelineStudio'
import StageBuilder from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilder'
import PipelineYamlView from '@pipeline/components/PipelineStudio/PipelineYamlView/PipelineYamlView'
import PipelinesPage from '@pipeline/pages/pipelines/PipelinesPage'
import SidebarProvider from '@common/navigation/SidebarProvider'
import SideNav from '@ci/components/SideNav/SideNav'
import ConnectorsPage from '@connectors/pages/connectors/ConnectorsPage'
import SecretsPage from '@secrets/pages/secrets/SecretsPage'
import ConnectorDetailsPage from '@connectors/pages/connectors/ConnectorDetailsPage'
import SecretDetails from '@secrets/pages/secretDetails/SecretDetails'
import ResourcesPage from '@ci/pages/Resources/ResourcesPage'
import CIPipelineDeploymentList from '@ci/pages/pipeline-deployment-list/CIPipelineDeploymentList'
import { useAppStore, ModuleName } from 'framework/exports'
import PipelineDetails from '@pipeline/pages/pipeline-details/PipelineDetails'
import InputSetList from '@pipeline/pages/inputSet-list/InputSetList'
import TriggersPage from '@pipeline/pages/triggers/TriggersPage'
import { InputSetForm } from '@pipeline/components/InputSetForm/InputSetForm'
import TriggerDetails from '@pipeline/pages/trigger-details/TriggerDetails'
import ExecutionArtifactsView from '@pipeline/pages/execution/ExecutionArtifactsView/ExecutionArtifactsView'
import ExecutionInputsView from '@pipeline/pages/execution/ExecutionInputsView/ExecutionInputsView'
import ExecutionLandingPage from '@pipeline/pages/execution/ExecutionLandingPage/ExecutionLandingPage'
import ExecutionPipelineView from '@pipeline/pages/execution/ExecutionPipelineView/ExecutionPipelineView'
import TriggersWizardPage from '@pipeline/pages/triggers/TriggersWizardPage'
import RunPipelinePage from '@pipeline/pages/RunPipeline/RunPipelinePage'

const RedirectToCIHome = (): React.ReactElement => {
  const params = useParams<ProjectPathProps>()
  return <Redirect to={routes.toCIHome(params)} />
}

const RedirectToCIProject = (): React.ReactElement => {
  const params = useParams<ProjectPathProps>()
  const { selectedProject } = useAppStore()

  if (selectedProject?.modules?.includes(ModuleName.CI)) {
    return <Redirect to={routes.toCIProjectOverview(params)} />
  } else {
    return <Redirect to={routes.toCIHome(params)} />
  }
}
const RedirectToExecutionPipeline = (): React.ReactElement => {
  const params = useParams<PipelineType<ExecutionPathProps>>()

  return <Redirect to={routes.toExecutionPipelineView(params)} />
}

const RedirectToResourcesHome = (): React.ReactElement => {
  const params = useParams<ProjectPathProps>()
  return <Redirect to={routes.toCIAdminResourcesConnectors(params)} />
}

const RedirectToStudioUI = (): React.ReactElement => {
  const params = useParams<PipelineType<PipelinePathProps>>()

  return <Redirect to={routes.toPipelineStudioUI(params)} />
}

const RedirectToPipelineDetailHome = (): React.ReactElement => {
  const params = useParams<PipelineType<PipelinePathProps>>()

  return <Redirect to={routes.toPipelineDeploymentList(params)} />
}

export default (
  <Route path={routes.toCI({ ...accountPathProps })}>
    <SidebarProvider navComponent={SideNav} subtitle="CONTINUOUS" title="Integration">
      <Route path={routes.toCI({ ...accountPathProps })} exact>
        <RedirectToCIHome />
      </Route>

      <Route path={routes.toCIProject({ ...accountPathProps, ...projectPathProps })} exact>
        <RedirectToCIProject />
      </Route>

      <RouteWithLayout path={[routes.toCIHome({ ...accountPathProps })]} exact>
        <CIHomePage />
      </RouteWithLayout>

      <RouteWithLayout path={routes.toCIProjectOverview({ ...accountPathProps, ...projectPathProps })} exact>
        <CIDashboardPage />
      </RouteWithLayout>

      {/* <RouteWithLayout path={routes.toCIBuilds({ ...accountPathProps, ...projectPathProps })} exact>
        <CIBuildList />
      </RouteWithLayout>

      <Route path={routes.toCIBuild({ ...accountPathProps, ...projectPathProps, ...buildPathProps })} exact>
        <RedirectToBuildPipelineGraph />
      </Route>

      <BuildSubroute
        path={routes.toCIBuildPipelineGraph({ ...accountPathProps, ...projectPathProps, ...buildPathProps })}
        component={<PipelineGraph />}
      />
      <BuildSubroute
        path={routes.toCIBuildPipelineLog({ ...accountPathProps, ...projectPathProps, ...buildPathProps })}
        component={<PipelineLog />}
      />
      <BuildSubroute
        path={routes.toCIBuildArtifacts({ ...accountPathProps, ...projectPathProps, ...buildPathProps })}
        component={<BuildArtifacts />}
      />
      <BuildSubroute
        path={routes.toCIBuildTests({ ...accountPathProps, ...projectPathProps, ...buildPathProps })}
        component={<BuildTests />}
      />
      <BuildSubroute
        path={routes.toCIBuildInputs({ ...accountPathProps, ...projectPathProps, ...buildPathProps })}
        component={<BuildInputs />}
      />
      <BuildSubroute
        path={routes.toCIBuildCommits({ ...accountPathProps, ...projectPathProps, ...buildPathProps })}
        component={<BuildCommits />}
      /> */}

      <RouteWithLayout
        exact
        layout={MinimalLayout}
        path={routes.toPipelineStudioUI({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <CIPipelineStudio>
          <StageBuilder />
        </CIPipelineStudio>
      </RouteWithLayout>

      <Route exact path={routes.toCIAdminResources({ ...accountPathProps, ...projectPathProps })}>
        <RedirectToResourcesHome />
      </Route>

      <RouteWithLayout exact path={routes.toCIAdminResourcesConnectors({ ...accountPathProps, ...projectPathProps })}>
        <ResourcesPage>
          <ConnectorsPage />
        </ResourcesPage>
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toCIAdminResourcesSecretsListing({ ...accountPathProps, ...projectPathProps })}
      >
        <ResourcesPage>
          <SecretsPage />
        </ResourcesPage>
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toCIAdminResourcesConnectorDetails({
          ...accountPathProps,
          ...projectPathProps,
          ...connectorPathProps
        })}
      >
        <ConnectorDetailsPage />
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toCIAdminResourcesSecretDetails({
          ...accountPathProps,
          ...projectPathProps,
          ...secretPathProps
        })}
      >
        <SecretDetails />
      </RouteWithLayout>

      <RouteWithLayout
        exact
        layout={EmptyLayout}
        path={routes.toPipelineStudioYaml({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <CIPipelineStudio>
          <PipelineYamlView />
        </CIPipelineStudio>
      </RouteWithLayout>

      <Route
        exact
        path={routes.toPipelineStudio({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <RedirectToStudioUI />
      </Route>

      <RouteWithLayout
        exact
        path={routes.toPipelines({ ...accountPathProps, ...projectPathProps, ...pipelineModuleParams })}
      >
        <PipelinesPage />
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
        path={routes.toDeployments({ ...accountPathProps, ...projectPathProps, ...pipelineModuleParams })}
        exact
      >
        <DeploymentsList />
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
        path={routes.toRunPipeline({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <RunPipelinePage />
      </RouteWithLayout>
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
        path={routes.toPipelineDeploymentList({
          ...accountPathProps,
          ...pipelinePathProps,
          ...pipelineModuleParams
        })}
      >
        <PipelineDetails>
          <CIPipelineDeploymentList />
        </PipelineDetails>
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toPipelineDetail({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
      >
        <RedirectToPipelineDetailHome />
      </RouteWithLayout>
      <RouteWithLayout
        exact
        path={routes.toCIPipelineDeploymentList({
          ...accountPathProps,
          ...pipelinePathProps
        })}
      >
        <CIPipelineDeploymentList />
      </RouteWithLayout>
    </SidebarProvider>
  </Route>
)
