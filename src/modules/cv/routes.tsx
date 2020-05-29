import { Route, ModuleName, SidebarIdentifier } from 'framework/exports'
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
  component: React.lazy(() => import('./pages/datasources/CVDataSourcesPage')),
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
