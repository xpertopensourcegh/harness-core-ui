import React from 'react'
import { Route, RouteURLArgs, ModuleName, SidebarIdentifier } from 'framework/exports'
import i18n from './routes.i18n'

export const routeDashboard: Route = {
  sidebarId: SidebarIdentifier.DASHBOARD,
  path: '/dashboard',
  title: i18n.dashboard,
  pageId: 'dashboard',
  url: () => '/dashboard',
  component: React.lazy(() => import('./pages/dashboard/DashboardPage')),
  module: ModuleName.DX
}

export const routeConnectorDetails: Route = {
  module: ModuleName.DX,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/connectors/:connectorId',
  title: i18n.connectors,
  pageId: 'connector-details',
  url: (params: RouteURLArgs) =>
    `/account/${params?.accountId}/connectors/${params?.connectorId}${params?.type ? `&type=${params?.type}` : ``}`,
  component: React.lazy(() => import('./pages/connectors/ConnectorDetailsPage'))
}

export const routeSecretDetails: Route = {
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/secrets/:secretId',
  title: i18n.secrets,
  pageId: 'secret-details',
  url: params => `/secrets/${params?.secretId}`,
  component: React.lazy(() => import('./pages/secretDetails/SecretDetails')),
  module: ModuleName.DX
}
