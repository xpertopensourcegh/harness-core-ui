import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'

import i18n from './routes.i18n'

export const routeCVDashboard: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/continuous-verification',
  title: i18n.title,
  pageId: 'continuous-verification',
  authenticated: true,
  url: () => routeURL(routeCVDashboard, '/continuous-verification'),
  component: React.lazy(() => import('./pages/dashboard/CVDashboardPage')),
  module: ModuleName.CV
}

/* ------------------------------------------ DataSource page routes ------------------------------------------ */
export const routeCVDataSources: Route<{ projectIdentifier: string; orgId: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-datasources/org/:orgId/project/:projectIdentifier',
  authenticated: true,
  title: i18n.datasources,
  pageId: 'cv-datasources',
  url: ({ projectIdentifier, orgId }) =>
    routeURL(
      routeCVDataSources,
      projectIdentifier && orgId ? `/cv-datasources/org/${orgId}/project/${projectIdentifier}` : routeCVDashboard.path
    ),
  component: React.lazy(() => import('./pages/data-sources/DataSources')),
  module: ModuleName.CV
}

export const routeCVService: Route<{ serviceId: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-service/:serviceId',
  title: i18n.services,
  pageId: 'cv-service',
  authenticated: true,
  url: ({ serviceId }) => routeURL(routeCVService, `/cv-service/${serviceId}`),
  component: React.lazy(() => import('./pages/services/CVServicePage')),
  module: ModuleName.CV
}

/* ------------------------------------------ Onboarding page routes ------------------------------------------ */
export const routeCVOnBoardingSetup: Route<{ dataSourceType: string; projectIdentifier: string; orgId: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-onboarding/:dataSourceType/setup/org/:orgId/project/:projectIdentifier/',
  title: i18n.services,
  authenticated: true,
  pageId: 'cv-onboarding/onboarding',
  url: ({ dataSourceType, projectIdentifier, orgId }) =>
    routeURL(
      routeCVOnBoardingSetup,
      dataSourceType && projectIdentifier && orgId
        ? `/cv-onboarding/${dataSourceType}/setup/org/${orgId}/project/${projectIdentifier}`
        : routeCVDashboard.path
    ),

  component: React.lazy(() => import('./pages/onboarding/BaseOnBoardingSetupPage/BaseOnBoardingSetupPage')),
  module: ModuleName.CV
}

export const routeCVDataSourcesProductPage: Route<{
  dataSourceType: string
  projectIdentifier: string
  orgId: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-onboarding/:dataSourceType/product/org/:orgId/project/:projectIdentifier',
  title: i18n.services,
  pageId: '/cv-onboarding/product',
  authenticated: true,
  url: ({ dataSourceType, projectIdentifier, orgId }) =>
    routeURL(
      routeCVDataSourcesProductPage,
      dataSourceType && projectIdentifier && orgId
        ? `/cv-onboarding/${dataSourceType}/product/org/${orgId}/project/${projectIdentifier}`
        : routeCVDashboard.path
    ),
  component: React.lazy(() => import('./pages/datasourceproducts/DataSourceProductPage/DataSourceProductPage')),
  module: ModuleName.CV
}

export const routeCVSplunkInputTypePage: Route<{ dataSourceType: string; projectIdentifier: string; orgId: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-onboarding/:dataSourceType/input-type/org/:orgId/project/:projectIdentifier',
  title: i18n.services,
  pageId: '/cv-onboarding/input-type',
  authenticated: true,
  url: ({ dataSourceType, projectIdentifier, orgId }) =>
    routeURL(
      routeCVSplunkInputTypePage,
      dataSourceType && projectIdentifier && orgId
        ? `/cv-onboarding/${dataSourceType}/input-type/org/${orgId}/project/${projectIdentifier}`
        : routeCVDashboard.path
    ),
  component: React.lazy(() => import('./pages/splunk-input-type/SplunkInputType')),
  module: ModuleName.CV
}

export const routeCVDataSourcesEntityPage: Route<{
  dataSourceType: string
  projectIdentifier: string
  orgId: string
}> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-onboarding/:dataSourceType/select-list-entities/org/:orgId/project/:projectIdentifier',
  title: i18n.services,
  pageId: 'cv-onboarding/:dataSourceType/select-list-entities',
  authenticated: true,
  url: ({ dataSourceType, projectIdentifier, orgId }) =>
    routeURL(
      routeCVDataSourcesEntityPage,
      dataSourceType && projectIdentifier && orgId
        ? `/cv-onboarding/${dataSourceType}/select-list-entities/org/${orgId}/project/${projectIdentifier}`
        : routeCVDashboard.path
    ),
  component: React.lazy(() => {
    return import('./pages/listEntitySelect/DataSourceListEntityPage/DataSourceListEntityPage')
  }),
  module: ModuleName.CV
}

/* ------------------------------------------ Global Metric page routes ------------------------------------------ */

export const routeCVMetricPackConfigureThresholdPage: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/metric-pack/config',
  title: i18n.services,
  pageId: '/metric-pack/config',
  authenticated: true,
  url: () => routeURL(routeCVMetricPackConfigureThresholdPage, `/metric-pack/config`),
  component: React.lazy(() => {
    return import('./pages/metric-pack/MetricPackConfigure')
  }),
  module: ModuleName.CV
}

/* ------------------------------------------ Dashboard page routes ------------------------------------------ */

export const routeCVAnomalyAnalysisPage: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv/anomaly-analysis',
  title: i18n.services,
  pageId: '/cv/anomaly-analysis',
  authenticated: true,
  url: () => routeURL(routeCVAnomalyAnalysisPage, `/cv/anomaly-analysis`),
  component: React.lazy(() => {
    return import('./pages/anomaly-analysis/AnomalyAnalysis')
  }),
  module: ModuleName.CV
}

/* ------------------------------------------ Activity page routes ------------------------------------------ */

export const routeCVActivities: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-activities',
  title: i18n.activities,
  pageId: '/cv-activities',
  authenticated: true,
  url: () => routeURL(routeCVActivities, `/cv-activities`),
  component: React.lazy(() => {
    return import('./pages/activities/ActivitiesPage')
  }),
  module: ModuleName.CV
}

export const routeCVActivityDetails: Route<{ activityType: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-activities-setup/:activityType',
  title: i18n.activityTypes,
  pageId: '/cv-activities-setup',
  authenticated: true,
  url: ({ activityType }) => routeURL(routeCVActivityDetails, `/cv-activities-setup/${activityType}`),
  component: React.lazy(() => {
    return import('./pages/activity-setup/ActivitySetupPage')
  }),
  module: ModuleName.CV
}
