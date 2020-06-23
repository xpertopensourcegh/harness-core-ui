import { Route, RouteURLArgs, ModuleName, SidebarIdentifier } from 'framework/exports'
import React from 'react'
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

export const routeYAMLBuilder: Route = {
  sidebarId: SidebarIdentifier.DASHBOARD,
  path: '/yaml-builder',
  title: i18n.yamlBuilder,
  pageId: 'yaml-builder',
  url: () => '/yaml-builder',
  component: React.lazy(() => import('./pages/yamlBuilder/YamlBuilderPage')),
  module: ModuleName.DX
}

export const routeConnectorDetails: Route = {
  module: ModuleName.DX,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/connectors/:connectorId',
  title: i18n.connectors,
  pageId: 'connector-details',
  url: (params: RouteURLArgs) =>
    params?.editMode
      ? `/account/${params?.accountId}/connectors/edit=true`
      : `/account/${params?.accountId}/connectors/${params?.connectorId}`,
  component: React.lazy(() => import('./pages/connectors/ConnectorDetailsPage'))
}
