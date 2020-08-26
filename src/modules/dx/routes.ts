import React from 'react'
import { Route, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import i18n from './routes.i18n'

export const routeDashboard: Route = {
  sidebarId: SidebarIdentifier.DASHBOARD,
  path: '/dashboard',
  title: i18n.dashboard,
  pageId: 'dashboard',
  url: () => routeURL(routeDashboard, '/dashboard'),
  component: React.lazy(() => import('./pages/dashboard/DashboardPage')),
  module: ModuleName.DX
}

export const routeConnectorDetails: Route<{ connectorId: string; type?: string }> = {
  module: ModuleName.DX,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/connectors/:connectorId',
  title: i18n.connectors,
  pageId: 'connector-details',
  url: ({ connectorId, type }) =>
    routeURL(routeConnectorDetails, `/connectors/${connectorId}${type ? `&type=${type}` : ``}`),
  component: React.lazy(() => import('./pages/connectors/ConnectorDetailsPage'))
}

export const routeSecretDetails: Route<{ secretId: string }> = {
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/secrets/:secretId',
  title: i18n.secrets,
  pageId: 'secret-details',
  url: ({ secretId }) => routeURL(routeSecretDetails, `/secrets/${secretId}`),
  component: React.lazy(() => import('./pages/secretDetails/SecretDetails')),
  module: ModuleName.DX
}

export const routeCreateSecretFromYaml: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/create-secret-from-yaml',
  title: 'Create Secret From Yaml',
  pageId: 'create-secret-from-yaml',
  url: () => routeURL(routeCreateSecretFromYaml, '/create-secret-from-yaml'),
  component: React.lazy(() => import('../dx/pages/createSecretFromYaml/CreateSecretFromYamlPage'))
}
