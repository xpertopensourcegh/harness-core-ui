import { Route, ModuleName, SidebarIdentifier, RouteURLArgs } from 'framework/exports'
import React from 'react'
import i18n from './routes.i18n'

export const routeCVDashboard: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/continuous-verification',
  title: i18n.title,
  pageId: 'continuous-verification',
  url: () => '/continuous-verification',
  component: React.lazy(() => import('./pages/dashboard/CVDashboardPage')),
  module: ModuleName.CV
}

export const routeCVDataSources: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-datasources',
  title: i18n.datasources,
  pageId: 'cv-datasources',
  url: () => '/cv-datasources',
  component: React.lazy(() => import('./pages/DataSources/DataSources')),
  module: ModuleName.CV
}

export const routeCVServices: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-services',
  title: i18n.services,
  pageId: 'cv-services',
  url: () => '/cv-services',
  component: React.lazy(() => import('./pages/services/CVServicesPage')),
  module: ModuleName.CV
}

/* ------------------------------------------ Product page routes ------------------------------------------ */
export const routeCVOnBoardingSplunk: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-product/:dataSourceType/splunk-onboarding',
  title: i18n.services,
  pageId: 'cv-product',
  url: (params: RouteURLArgs) => (params?.dataSourceType ? `/cv-product/${params?.dataSourceType}/splunk-onboarding` : `cv-product/`),
  component: React.lazy(() => import('./pages/OnBoarding/Splunk/SplunkOnBoarding')),
  module: ModuleName.CV
}

export const routeCVDataSourcesAppDynamicsProductPage: Route = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  path: '/cv-product/:dataSourceType',
  title: i18n.services,
  pageId: 'cv-product',
  url: (params: RouteURLArgs) => (params?.dataSourceType ? `/cv-product/${params?.dataSourceType}` : `cv-product/`),
  component: React.lazy(() => import('./pages/datasourceproducts/DataSourceProductPage/DataSourceProductPage')),
  module: ModuleName.CV
}
