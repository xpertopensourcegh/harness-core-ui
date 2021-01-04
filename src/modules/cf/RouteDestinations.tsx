import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
// import SidebarProvider from '@common/navigation/SidebarProvider'
import routes from '@common/RouteDefinitions'
import {
  accountPathProps,
  featureFlagPathProps,
  projectPathProps,
  environmentPathProps,
  connectorPathProps,
  secretPathProps,
  segmentPathProps,
  targetPathProps
} from '@common/utils/routeUtils'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'

import CFHomePage from '@cf/pages/home/CFHomePage'
import CFDashboardPage from '@cf/pages/dashboard/CFDashboardPage'
import CFFeatureFlagsPage from '@cf/pages/feature-flags/CFFeatureFlagsPage'
import CFFeatureFlagsDetailPage from '@cf/pages/feature-flags-detail/CFFeatureFlagsDetailPage'
import CFTargetsPage from '@cf/pages/targets/CFTargetsPage'
import CFTargetDetailsPage from '@cf/pages/target-details/CFTargetDetailsPage'
import CFSegmentDetailsPage from '@cf/pages/segment-details/CFSegmentDetailsPage'
import CFWorkflowsPage from '@cf/pages/workflows/CFWorkflowsPage'
import SidebarProvider from '@common/navigation/SidebarProvider'
import SideNav from '@cf/components/SideNav/SideNav'
import ConnectorsPage from '@connectors/pages/connectors/ConnectorsPage'
import SecretsPage from '@secrets/pages/secrets/SecretsPage'
import ConnectorDetailsPage from '@connectors/pages/connectors/ConnectorDetailsPage'
import SecretDetails from '@secrets/pages/secretDetails/SecretDetails'
import { useAppStore, ModuleName } from 'framework/exports'
import ResourcesPage from './pages/Resources/ResourcesPage'

const RedirectToCFHome = (): React.ReactElement => {
  const params = useParams<AccountPathProps>()

  return <Redirect to={routes.toCFHome(params)} />
}

const RedirectToCFProject = (): React.ReactElement => {
  const params = useParams<ProjectPathProps>()
  const { selectedProject } = useAppStore()

  if (selectedProject?.modules?.includes(ModuleName.CF)) {
    return <Redirect to={routes.toCFProjectOverview(params)} />
  } else {
    return <Redirect to={routes.toCFHome(params)} />
  }
}

const RedirectToResourcesHome = (): React.ReactElement => {
  const params = useParams<ProjectPathProps>()

  return <Redirect to={routes.toCFAdminResourcesConnectors(params)} />
}

export default (
  <Route path={routes.toCF({ ...accountPathProps })}>
    <SidebarProvider navComponent={SideNav} subtitle="CONTINUOUS" title="Features">
      <Route path={routes.toCF({ ...accountPathProps })} exact>
        <RedirectToCFHome />
      </Route>

      <Route path={routes.toCFProject({ ...accountPathProps, ...projectPathProps })} exact>
        <RedirectToCFProject />
      </Route>

      <RouteWithLayout path={routes.toCFHome({ ...accountPathProps })} exact>
        <CFHomePage />
      </RouteWithLayout>

      <RouteWithLayout path={routes.toCFProjectOverview({ ...accountPathProps, ...projectPathProps })} exact>
        <CFDashboardPage />
      </RouteWithLayout>

      <RouteWithLayout path={routes.toCFFeatureFlags({ ...accountPathProps, ...projectPathProps })} exact>
        <CFFeatureFlagsPage />
      </RouteWithLayout>

      <RouteWithLayout
        path={routes.toCFFeatureFlagsDetail({
          ...accountPathProps,
          ...projectPathProps,
          ...featureFlagPathProps,
          ...environmentPathProps
        })}
        exact
      >
        <CFFeatureFlagsDetailPage />
      </RouteWithLayout>

      <RouteWithLayout
        path={routes.toCFSegmentDetails({
          ...accountPathProps,
          ...projectPathProps,
          ...segmentPathProps,
          ...environmentPathProps
        })}
        exact
      >
        <CFSegmentDetailsPage />
      </RouteWithLayout>

      <RouteWithLayout
        path={routes.toCFTargetDetails({
          ...accountPathProps,
          ...projectPathProps,
          ...targetPathProps,
          ...environmentPathProps
        })}
        exact
      >
        <CFTargetDetailsPage />
      </RouteWithLayout>

      <RouteWithLayout path={routes.toCFTargets({ ...accountPathProps, ...projectPathProps })} exact>
        <CFTargetsPage />
      </RouteWithLayout>

      <RouteWithLayout path={routes.toCFWorkflows({ ...accountPathProps, ...projectPathProps })} exact>
        <CFWorkflowsPage />
      </RouteWithLayout>

      <Route exact path={routes.toCFAdminResources({ ...accountPathProps, ...projectPathProps })}>
        <RedirectToResourcesHome />
      </Route>

      <RouteWithLayout exact path={routes.toCFAdminResourcesConnectors({ ...accountPathProps, ...projectPathProps })}>
        <ResourcesPage>
          <ConnectorsPage />
        </ResourcesPage>
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toCFAdminResourcesSecretsListing({ ...accountPathProps, ...projectPathProps })}
      >
        <ResourcesPage>
          <SecretsPage />
        </ResourcesPage>
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toCFAdminResourcesConnectorDetails({
          ...accountPathProps,
          ...projectPathProps,
          ...connectorPathProps
        })}
      >
        <ConnectorDetailsPage />
      </RouteWithLayout>

      <RouteWithLayout
        exact
        path={routes.toCFAdminResourcesSecretDetails({
          ...accountPathProps,
          ...projectPathProps,
          ...secretPathProps
        })}
      >
        <SecretDetails />
      </RouteWithLayout>
    </SidebarProvider>
  </Route>
)
