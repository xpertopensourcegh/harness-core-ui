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
export const routeCVDataSources: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-datasources',
  authenticated: true,
  title: i18n.datasources,
  pageId: 'cv-datasources',
  url: () => routeURL(routeCVDataSources, '/cv-datasources'),
  component: React.lazy(() => import('./pages/data-sources/DataSources')),
  module: ModuleName.CV
}

export const routeCVServices: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-services',
  title: i18n.services,
  pageId: 'cv-services',
  authenticated: true,
  url: () => routeURL(routeCVService, '/cv-services'),
  component: React.lazy(() => import('./pages/services/CVServicesPage')),
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
export const routeCVOnBoardingSetup: Route<{ dataSourceType?: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-onboarding/:dataSourceType/setup',
  title: i18n.services,
  authenticated: true,
  pageId: 'cv-onboarding/onboarding',
  url: ({ dataSourceType } = {}) =>
    routeURL(routeCVOnBoardingSetup, dataSourceType ? `/cv-onboarding/${dataSourceType}/setup` : `/cv-onboarding/`),
  component: React.lazy(() => import('./pages/onboarding/BaseOnBoardingSetupPage/BaseOnBoardingSetupPage')),
  module: ModuleName.CV
}

export const routeCVDataSourcesProductPage: Route<{ dataSourceType?: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-onboarding/:dataSourceType/product',
  title: i18n.services,
  pageId: '/cv-onboarding/product',
  authenticated: true,
  url: ({ dataSourceType } = {}) =>
    routeURL(
      routeCVDataSourcesProductPage,
      dataSourceType ? `/cv-onboarding/${dataSourceType}/product` : `/cv-datasources/`
    ),
  component: React.lazy(() => import('./pages/datasourceproducts/DataSourceProductPage/DataSourceProductPage')),
  module: ModuleName.CV
}

export const routeCVSplunkInputTypePage: Route<{ dataSourceType?: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-onboarding/:dataSourceType/input-type',
  title: i18n.services,
  pageId: '/cv-onboarding/input-type',
  authenticated: true,
  url: ({ dataSourceType } = {}) =>
    routeURL(
      routeCVSplunkInputTypePage,
      dataSourceType ? `/cv-onboarding/${dataSourceType}/input-type` : `/cv-onboarding/`
    ),
  component: React.lazy(() => import('./pages/splunk-input-type/SplunkInputType')),
  module: ModuleName.CV
}

export const routeCVDataSourcesEntityPage: Route<{ dataSourceType?: string }> = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-onboarding/:dataSourceType/select-list-entities',
  title: i18n.services,
  pageId: 'cv-onboarding/:dataSourceType/select-list-entities',
  authenticated: true,
  url: ({ dataSourceType } = {}) =>
    routeURL(
      routeCVDataSourcesEntityPage,
      dataSourceType ? `/cv-onboarding/${dataSourceType}/select-list-entities` : '/cv-datasources/'
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
