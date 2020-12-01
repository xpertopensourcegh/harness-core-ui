import React from 'react'
import { Switch, Route, useParams, Redirect } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import { EmptyLayout } from '@common/layouts'
import {
  accountPathProps,
  projectPathProps,
  pipelinePathProps,
  connectorPathProps,
  secretPathProps
} from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import type { AccountPathProps, PipelinePathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'

import CIHomePage from '@ci/pages/home/CIHomePage'
import CIDashboardPage from '@ci/pages/dashboard/CIDashboardPage'
import CIBuildList from '@ci/pages/builds/CIBuildsPage'
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

const RedirectToCIHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()

  return <Redirect to={routes.toCIHome(params)} />
}

const RedirectToResourcesHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps & ProjectPathProps>()

  return <Redirect to={routes.toCIAdminResourcesConnectors(params)} />
}

const RedirectToStudioUI = (): React.ReactElement => {
  const params = useParams<PipelinePathProps & AccountPathProps>()

  return <Redirect to={routes.toCIPipelineStudioUI(params)} />
}

export default (
  <SidebarProvider navComponent={SideNav} subtitle="CONTINUOUS" title="Integration">
    <Route path={routes.toCI({ ...accountPathProps })}>
      <Switch>
        <Route path={routes.toCI({ ...accountPathProps })} exact>
          <RedirectToCIHome />
        </Route>

        <RouteWithLayout path={[routes.toCIHome({ ...accountPathProps })]} exact>
          <CIHomePage />
        </RouteWithLayout>

        <RouteWithLayout path={routes.toCIDashboard({ ...accountPathProps, ...projectPathProps })} exact>
          <CIDashboardPage />
        </RouteWithLayout>

        <RouteWithLayout path={routes.toCIBuilds({ ...accountPathProps, ...projectPathProps })} exact>
          <CIBuildList />
        </RouteWithLayout>

        <RouteWithLayout
          exact
          layout={EmptyLayout}
          path={routes.toCIPipelineStudioUI({ ...accountPathProps, ...pipelinePathProps })}
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
          path={routes.toCIPipelineStudioYaml({ ...accountPathProps, ...pipelinePathProps })}
        >
          <CIPipelineStudio>
            <PipelineYamlView />
          </CIPipelineStudio>
        </RouteWithLayout>

        <Route exact path={routes.toCIPipelineStudio({ ...accountPathProps, ...pipelinePathProps })}>
          <RedirectToStudioUI />
        </Route>

        <RouteWithLayout exact path={routes.toCIPipelines({ ...accountPathProps, ...projectPathProps })}>
          <PipelinesPage />
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
      </Switch>
    </Route>
  </SidebarProvider>
)
