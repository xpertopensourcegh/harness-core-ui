import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL, PageLayout } from 'framework/exports'
import i18n from './routes.i18n'

/* ------------------------------------------ Dashboard page routes ------------------------------------------ */

export const routeCVMainDashBoardPage: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/dashboard/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.services,
  pageId: '/cv/dashboard',
  authenticated: true,
  url: ({ projectIdentifier, orgIdentifier }) =>
    !projectIdentifier || !orgIdentifier
      ? routeURL(routeCVHome, `/cv/home`)
      : routeURL(routeCVMainDashBoardPage, `/cv/dashboard/org/${orgIdentifier}/project/${projectIdentifier}`),
  component: React.lazy(() => import('@cv/pages/dashboard/CVDashboardPage')),
  module: ModuleName.CV
}

export const routeCVDeploymentPage: Route<{
  projectIdentifier: string
  orgIdentifier: string
  deploymentTag: string
  serviceIdentifier: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path:
    '/cv/dashboard/deployment/:deploymentTag/service/:serviceIdentifier/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.services,
  pageId: '/cv/dashboard/deployment',
  authenticated: true,
  url: ({ projectIdentifier, orgIdentifier, deploymentTag, serviceIdentifier }) =>
    !projectIdentifier || !orgIdentifier
      ? routeURL(routeCVHome, `/cv/home`)
      : routeURL(
          routeCVMainDashBoardPage,
          `/cv/dashboard/deployment/${deploymentTag}/service/${serviceIdentifier}/org/${orgIdentifier}/project/${projectIdentifier}`
        ),
  component: React.lazy(() => import('@cv/pages/dashboard/deployment-drilldown/DeploymentDrilldownView')),
  module: ModuleName.CV
}

export const routeCVActivityChangesPage: Route<{
  projectIdentifier: string
  orgIdentifier: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/dashboard/activity-changes/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.services,
  pageId: '/cv/dashboard/activityChanges',
  authenticated: true,
  url: ({ projectIdentifier, orgIdentifier }) =>
    !projectIdentifier || !orgIdentifier
      ? routeURL(routeCVHome, `/cv/home`)
      : routeURL(
          routeCVMainDashBoardPage,
          `/cv/dashboard/activity-changes/org/${orgIdentifier}/project/${projectIdentifier}`
        ),
  component: React.lazy(() => import('@cv/pages/dashboard/activity-changes-drilldown/ActivityChangesDrilldownView')),
  module: ModuleName.CV
}

export const routeCVHome: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/home',
  title: i18n.title,
  pageId: 'cv/home',
  authenticated: true,
  url: () => routeURL(routeCVHome, '/cv/home'),
  component: React.lazy(() => import('@cv/pages/cv-home/CVHomePage')),
  module: ModuleName.CV
}

/* ------------------------------------------ DataSource page routes ------------------------------------------ */
export const routeCVDataSources: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/datasources/org/:orgIdentifier/project/:projectIdentifier',
  authenticated: true,
  title: i18n.datasources,
  pageId: 'cv-datasources',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCVDataSources,
      projectIdentifier && orgIdentifier
        ? `/cv/datasources/org/${orgIdentifier}/project/${projectIdentifier}`
        : routeCVHome.path
    ),
  component: React.lazy(() => import('@cv/pages/data-sources/DataSources')),
  module: ModuleName.CV
}

export const routeCVServices: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/services/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.services,
  pageId: 'cv-services',
  authenticated: true,
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCVServices, `/cv/services/org/${orgIdentifier}/project/${projectIdentifier}`),
  component: React.lazy(() => import('@cv/pages/services/CVServicesPage')),
  module: ModuleName.CV
}

/* ------------------------------------------ Onboarding page routes ------------------------------------------ */
export const routeCVOnBoardingSetup: Route<{
  dataSourceType: string
  projectIdentifier: string
  orgIdentifier: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/onboarding/:dataSourceType/setup/org/:orgIdentifier/project/:projectIdentifier/',
  title: i18n.services,
  authenticated: true,
  pageId: 'cv-onboarding/onboarding',
  url: ({ dataSourceType, projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCVOnBoardingSetup,
      dataSourceType && projectIdentifier && orgIdentifier
        ? `/cv/onboarding/${dataSourceType}/setup/org/${orgIdentifier}/project/${projectIdentifier}`
        : routeCVHome.path
    ),

  component: React.lazy(() => import('@cv/pages/onboarding/setup/DataSourceSetupPage')),
  module: ModuleName.CV
}

export const routeCVDataSourcesProductPage: Route<{
  dataSourceType: string
  projectIdentifier: string
  orgIdentifier: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/onboarding/:dataSourceType/product/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.services,
  pageId: '/cv-onboarding/product',
  authenticated: true,
  url: ({ dataSourceType, projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCVDataSourcesProductPage,
      dataSourceType && projectIdentifier && orgIdentifier
        ? `/cv/onboarding/${dataSourceType}/product/org/${orgIdentifier}/project/${projectIdentifier}`
        : routeCVHome.path
    ),
  component: React.lazy(() => import('@cv/pages/onboarding/data-source-products/DataSourceProductPage')),
  module: ModuleName.CV
}

export const routeCVSplunkInputTypePage: Route<{
  dataSourceType: string
  projectIdentifier: string
  orgIdentifier: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/onboarding/:dataSourceType/input-type/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.services,
  pageId: '/cv-onboarding/input-type',
  authenticated: true,
  url: ({ dataSourceType, projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCVSplunkInputTypePage,
      dataSourceType && projectIdentifier && orgIdentifier
        ? `/cv/onboarding/${dataSourceType}/input-type/org/${orgIdentifier}/project/${projectIdentifier}`
        : routeCVHome.path
    ),
  component: React.lazy(() => import('@cv/pages/onboarding/splunk-input-type/SplunkInputType')),
  module: ModuleName.CV
}

export const routeCVDataSourcesEntityPage: Route<{
  dataSourceType: string
  projectIdentifier: string
  orgIdentifier: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/onboarding/:dataSourceType/select-list-entities/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.services,
  pageId: 'cv-onboarding/:dataSourceType/select-list-entities',
  authenticated: true,
  url: ({ dataSourceType, projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCVDataSourcesEntityPage,
      dataSourceType && projectIdentifier && orgIdentifier
        ? `/cv/onboarding/${dataSourceType}/select-list-entities/org/${orgIdentifier}/project/${projectIdentifier}`
        : routeCVHome.path
    ),
  component: React.lazy(() => {
    return import('@cv/pages/onboarding/list-entity-select/DataSourceListEntityPage')
  }),
  module: ModuleName.CV
}

export const routeActivitySourceSetup: Route<{
  orgIdentifier: string
  projectIdentifier: string
  activitySource: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/orgs/:orgIdentifier/projects/:projectIdentifier/onboarding/activity-source-setup/:activitySource',
  title: i18n.activitySourceSetup,
  layout: PageLayout.NoMenuLayout,
  pageId: 'cv-onboarding/activity-source-setup/:activitySource',
  authenticated: true,
  url: ({ activitySource, projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCVDataSourcesEntityPage,
      activitySource && projectIdentifier && orgIdentifier
        ? `/cv/orgs/${orgIdentifier}/projects/${projectIdentifier}/onboarding/activity-source-setup/${activitySource}`
        : routeCVHome.path
    ),
  component: React.lazy(() => import('@cv/pages/onboarding/activity-source-setup/ActivitySourceSetup')),
  module: ModuleName.CV
}

/* ------------------------------------------ Global Metric page routes ------------------------------------------ */

export const routeCVMetricPackConfigureThresholdPage: Route<{
  projectIdentifier: string
  orgIdentifier: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/metric-pack/config/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.services,
  pageId: '/metric-pack/config',
  authenticated: true,
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(
      routeCVMetricPackConfigureThresholdPage,
      `/cv/metric-pack/config/org/${orgIdentifier}/project/${projectIdentifier}`
    ),
  component: React.lazy(() => {
    return import('@cv/pages/metric-pack/MetricPackConfigure')
  }),
  module: ModuleName.CV
}

/* ------------------------------------------ Activity page routes ------------------------------------------ */

export const routeCVActivityDashboard: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/activities/dashboard/orgs/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.activities,
  pageId: '/cv/activities/dashboard',
  authenticated: true,
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCVActivities, `/cv/activities/dashboard/org/${orgIdentifier}/project/${projectIdentifier}`),
  component: React.lazy(() => {
    return import('@cv/pages/activities/dashboard/ActivityDashBoardPage')
  }),
  module: ModuleName.CV
}

export const routeCVActivities: Route<{ orgIdentifier: string; projectIdentifier: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/activities/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.activities,
  pageId: '/cv-activities',
  authenticated: true,
  url: ({ orgIdentifier, projectIdentifier }) =>
    routeURL(routeCVActivities, `/cv/activities/org/${orgIdentifier}/project/${projectIdentifier}`),
  component: React.lazy(() => {
    return import('@cv/pages/activities/ActivitiesPage')
  }),
  module: ModuleName.CV
}

export const routeCVActivityDetails: Route<{
  activityType: string
  orgIdentifier: string
  projectIdentifier: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/activities/setup/:activityType/org/:orgIdentifier/project/:projectIdentifier',
  title: i18n.activityTypes,
  pageId: '/cv-activities/setup',
  authenticated: true,
  url: ({ activityType, orgIdentifier, projectIdentifier }) =>
    routeURL(
      routeCVActivityDetails,
      `/cv/activities/setup/${activityType}/org/${orgIdentifier}/project/${projectIdentifier}`
    ),
  component: React.lazy(() => {
    return import('@cv/pages/activity-setup/ActivitySetupPage')
  }),
  module: ModuleName.CV
}

/* ------------------------------------------ Admin page routes ------------------------------------------ */

export const routeCVAdminGeneralSettings: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  module: ModuleName.CV,
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/admin/general-settings/org/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.adminSettings,
  pageId: 'cv-admin-general-settings',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(routeCVMainDashBoardPage, `/cv/admin/general-settings/org/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cv/pages/admin/general-settings/CVGeneralSettingsPage'))
}

export const routeCVAdminGovernance: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  module: ModuleName.CV,
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/admin/governance/org/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.adminSettings,
  pageId: 'cv-admin-governance',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(routeCVMainDashBoardPage, `/cv/admin/governance/org/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cv/pages/admin/governance/CVGovernancePage'))
}

export const routeCVAdminSetup: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  module: ModuleName.CV,
  layout: PageLayout.NoMenuLayout,
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/org/:orgIdentifier/projects/:projectIdentifier/admin/setup',
  title: i18n.adminSettings,
  pageId: 'cv-admin-setup',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(routeCVMainDashBoardPage, `/cv/org/${orgIdentifier}/projects/${projectIdentifier}/admin/setup`),
  component: React.lazy(() => import('@cv/pages/admin/setup/CVSetupPage'))
}

export const routeCVAdminSetupMonitoringSource: Route<{
  projectIdentifier: string
  orgIdentifier: string
  monitoringSource: string
}> = {
  module: ModuleName.CV,
  layout: PageLayout.NoMenuLayout,
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/org/:orgIdentifier/projects/:projectIdentifier/admin/setup/monitoring-source/:monitoringSource',
  title: i18n.adminSettings,
  pageId: 'cv-admin-setup-monitoring-source',
  url: ({ projectIdentifier, orgIdentifier, monitoringSource }) =>
    routeURL(
      routeCVMainDashBoardPage,
      `/cv/org/${orgIdentifier}/projects/${projectIdentifier}/admin/setup/monitoring-source/${monitoringSource}`
    ),
  component: React.lazy(() => import('@cv/pages/monitoring-source/MonitoringSource'))
}

export const routeCVAdminResources: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  module: ModuleName.CV,
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/admin/resources/org/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.adminSettings,
  pageId: 'cv-admin-resources',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(routeCVMainDashBoardPage, `/cv/admin/resources/org/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cv/pages/admin/resources/CVResourcesPage'))
}

export const routeCVAdminAccessControl: Route<{ projectIdentifier: string; orgIdentifier: string }> = {
  module: ModuleName.CV,
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/admin/access-control/org/:orgIdentifier/projects/:projectIdentifier',
  title: i18n.adminSettings,
  pageId: 'cv-admin-access-control',
  url: ({ projectIdentifier, orgIdentifier }) =>
    routeURL(routeCVMainDashBoardPage, `/cv/admin/access-control/org/${orgIdentifier}/projects/${projectIdentifier}`),
  component: React.lazy(() => import('@cv/pages/admin/access-control/CVAccessControlPage'))
}
