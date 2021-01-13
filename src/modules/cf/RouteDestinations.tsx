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
import CFEnvironmentsPage from '@cf/pages/environments/CFEnvironmentsPage'
import CFEnvironmentDetails from '@cf/pages/environment-details/CFEnvironmentDetails'
import CFWorkflowsPage from '@cf/pages/workflows/CFWorkflowsPage'
import type { SidebarContext } from '@common/navigation/SidebarProvider'
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
    return <Redirect to={routes.toCFFeatureFlags(params)} />
  } else {
    return <Redirect to={routes.toCFHome(params)} />
  }
}

const RedirectToResourcesHome = (): React.ReactElement => {
  const params = useParams<ProjectPathProps>()

  return <Redirect to={routes.toCFAdminResourcesConnectors(params)} />
}

const CFSideNavProps: SidebarContext = {
  navComponent: SideNav,
  subtitle: 'CONTINUOUS',
  title: 'Features'
}

export default (
  <>
    <Route path={routes.toCF({ ...accountPathProps })} exact>
      <RedirectToCFHome />
    </Route>

    <Route path={routes.toCFProject({ ...accountPathProps, ...projectPathProps })} exact>
      <RedirectToCFProject />
    </Route>

    <RouteWithLayout sidebarProps={CFSideNavProps} path={routes.toCFHome({ ...accountPathProps })} exact>
      <CFHomePage />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={CFSideNavProps}
      path={routes.toCFProjectOverview({ ...accountPathProps, ...projectPathProps })}
      exact
    >
      <CFDashboardPage />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={CFSideNavProps}
      path={routes.toCFFeatureFlags({ ...accountPathProps, ...projectPathProps })}
      exact
    >
      <CFFeatureFlagsPage />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={CFSideNavProps}
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
      sidebarProps={CFSideNavProps}
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
      sidebarProps={CFSideNavProps}
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

    <RouteWithLayout
      sidebarProps={CFSideNavProps}
      path={routes.toCFTargets({ ...accountPathProps, ...projectPathProps })}
      exact
    >
      <CFTargetsPage />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={CFSideNavProps}
      path={routes.toCFEnvironments({ ...accountPathProps, ...projectPathProps })}
      exact
    >
      <CFEnvironmentsPage />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={CFSideNavProps}
      path={routes.toCFEnvironmentDetails({ ...accountPathProps, ...projectPathProps, ...environmentPathProps })}
      exact
    >
      <CFEnvironmentDetails />
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={CFSideNavProps}
      path={routes.toCFWorkflows({ ...accountPathProps, ...projectPathProps })}
      exact
    >
      <CFWorkflowsPage />
    </RouteWithLayout>

    <Route
      exact
      sidebarProps={CFSideNavProps}
      path={routes.toCFAdminResources({ ...accountPathProps, ...projectPathProps })}
    >
      <RedirectToResourcesHome />
    </Route>

    <RouteWithLayout
      exact
      sidebarProps={CFSideNavProps}
      path={routes.toCFAdminResourcesConnectors({ ...accountPathProps, ...projectPathProps })}
    >
      <ResourcesPage>
        <ConnectorsPage />
      </ResourcesPage>
    </RouteWithLayout>

    <RouteWithLayout
      exact
      sidebarProps={CFSideNavProps}
      path={routes.toCFAdminResourcesSecretsListing({ ...accountPathProps, ...projectPathProps })}
    >
      <ResourcesPage>
        <SecretsPage />
      </ResourcesPage>
    </RouteWithLayout>

    <RouteWithLayout
      exact
      sidebarProps={CFSideNavProps}
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
      sidebarProps={CFSideNavProps}
      path={routes.toCFAdminResourcesSecretDetails({
        ...accountPathProps,
        ...projectPathProps,
        ...secretPathProps
      })}
    >
      <SecretDetails />
    </RouteWithLayout>
  </>
)
