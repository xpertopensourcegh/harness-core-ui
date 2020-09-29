import React from 'react'
import { Route, NestedRoute, PageLayout, ModuleName, SidebarIdentifier, routeURL } from 'framework/exports'
import i18n from './routes.i18n'

export const routeLogin: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.NONE,
  layout: PageLayout.BlankLayout,
  path: '/loginv2',
  title: i18n.login,
  pageId: 'login',
  url: () => '/login',
  component: React.lazy(() => import('./pages/login/LoginPage')),
  authenticated: false
}

export const routeOrgProjects: Route<{ orgIdentifier: string }> = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/organizations/:orgIdentifier/projects',
  title: i18n.project,
  pageId: 'orgProjects',
  url: ({ orgIdentifier }) => routeURL(routeOrgProjects, `/organizations/${orgIdentifier}/projects`),
  component: React.lazy(() => import('./pages/ProjectsPage/OrgsProjectsPage'))
}

export const routeOrganizations: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/organizations',
  title: i18n.organization,
  pageId: 'organization',
  url: () => routeURL(routeOrganizations, `/organizations`),
  component: React.lazy(() => import('./pages/organizations/OrganizationsPage'))
}

export const routeProjects: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.PROJECTS,
  path: '/projects',
  title: i18n.project,
  pageId: 'projects',
  url: () => routeURL(routeProjects, '/projects'),
  component: React.lazy(() => import('./pages/ProjectsPage/ProjectsPage'))
}

export const routeAdmin: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/admin',
  title: i18n.admin,
  pageId: 'admin',
  url: () => routeURL(routeAdmin, '/admin'),
  component: React.lazy(() => import('./pages/admin/AdminPage'))
}

export const routeGovernance: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/governance',
  title: i18n.governance,
  pageId: 'governance',
  url: () => routeURL(routeGovernance, '/governance'),
  component: React.lazy(() => import('./pages/governance/GovernancePage'))
}

export const routeOrgGovernance: Route<{ orgIdentifier: string }> = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/governance/org/:orgIdentifier',
  title: i18n.governance,
  pageId: 'org-governance',
  url: ({ orgIdentifier }) => routeURL(routeOrgGovernance, `/governance/org/${orgIdentifier}`),
  component: React.lazy(() => import('./pages/governance/GovernancePage'))
}

export const routeResourcesConnectors: NestedRoute = {
  path: '/resources/connectors',
  title: i18n.resourcesConnectors,
  url: () => routeURL(routeResourcesConnectors, '/resources/connectors'),
  component: React.lazy(() => import('../dx/pages/connectors/ConnectorsPage')),
  isDefault: true
}

export const routeResourcesConnectorDetails: NestedRoute = {
  path: '/resources/connectors/:connectorId',
  title: i18n.resourcesConnectorDetails,
  url: () => routeURL(routeResourcesConnectorDetails, '/resources/connectors/:connectorId'),
  component: React.lazy(() => import('../dx/pages/connectors/ConnectorDetailsPage'))
}

export const routeResourcesSecretsListing: NestedRoute = {
  path: '/resources/secrets',
  title: i18n.resourcesSecrets,
  url: () => routeURL(routeResourcesSecretsListing, '/resources/secrets'),
  component: React.lazy(() => import('../dx/pages/secrets/SecretsPage'))
}

export const routeResourcesSecretDetails: NestedRoute = {
  path: '/resources/secrets/:secretId',
  title: i18n.resourcesSecretDetails,
  url: () => routeURL(routeResourcesSecretDetails, '/resources/secrets/:secretId'),
  component: React.lazy(() => import('../dx/pages/secretDetails/SecretDetails'))
}

export const routeResources: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/resources',
  title: i18n.resources,
  pageId: 'resources',
  url: () => routeURL(routeResources, '/resources'),
  component: React.lazy(() => import('../cd/pages/Resources/ResourcesPage')),
  nestedRoutes: [
    routeResourcesConnectors,
    routeResourcesConnectorDetails,
    routeResourcesSecretsListing,
    routeResourcesSecretDetails
  ]
}

export const routeOrgResourcesConnectors: NestedRoute<{ orgIdentifier: string }> = {
  path: '/resources/org/:orgIdentifier/connectors',
  title: i18n.resourcesConnectors,
  url: ({ orgIdentifier }) => routeURL(routeOrgResourcesConnectors, `/resources/org/${orgIdentifier}/connectors`),
  component: React.lazy(() => import('../dx/pages/connectors/ConnectorsPage')),
  isDefault: true
}

export const routeOrgResourcesConnectorDetails: NestedRoute<{ orgIdentifier: string }> = {
  path: '/resources/org/:orgIdentifier/connectors/:connectorId',
  title: i18n.resourcesConnectorDetails,
  url: ({ orgIdentifier }) =>
    routeURL(routeOrgResourcesConnectorDetails, `/resources/org/${orgIdentifier}/connectors/:connectorId`),
  component: React.lazy(() => import('../dx/pages/connectors/ConnectorDetailsPage'))
}

export const routeOrgResourcesSecretsListing: NestedRoute<{ orgIdentifier: string }> = {
  path: '/resources/org/:orgIdentifier/secrets',
  title: i18n.resourcesSecrets,
  url: ({ orgIdentifier }) => routeURL(routeOrgResourcesConnectors, `/resources/org/${orgIdentifier}/secrets`),
  component: React.lazy(() => import('../dx/pages/secrets/SecretsPage'))
}

export const routeOrgResourcesSecretDetails: NestedRoute<{ orgIdentifier: string }> = {
  path: '/resources/org/:orgIdentifier/secrets/:secretId',
  title: i18n.resourcesSecretDetails,
  url: ({ orgIdentifier }) =>
    routeURL(routeOrgResourcesConnectors, `/resources/org/${orgIdentifier}/secrets/:secretId`),
  component: React.lazy(() => import('../dx/pages/secretDetails/SecretDetails'))
}

export const routeOrgResources: Route<{ orgIdentifier: string }> = {
  module: ModuleName.FRAMEWORK,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/resources/org/:orgIdentifier',
  title: i18n.resources,
  pageId: 'org-admin-resources',
  url: ({ orgIdentifier }) => routeURL(routeOrgResources, `/resources/org/${orgIdentifier}`),
  component: React.lazy(() => import('../cd/pages/Resources/ResourcesPage')),
  nestedRoutes: [
    routeOrgResourcesConnectors,
    routeOrgResourcesSecretsListing,
    routeOrgResourcesSecretDetails,
    routeOrgResourcesConnectorDetails
  ]
}

export const routeGitSyncRepos: NestedRoute = {
  path: '/git-sync/repos',
  title: i18n.gitSync,
  url: () => routeURL(routeGitSyncRepos, '/git-sync/repos'),
  component: React.lazy(() => import('../dx/pages/git-sync/views/repos/GitSyncRepoTab')),
  isDefault: true
}

export const routeGitSyncActivities: NestedRoute = {
  path: '/git-sync/activities',
  title: i18n.gitSync,
  url: () => routeURL(routeGitSyncActivities, '/git-sync/activities'),
  component: React.lazy(() => import('../dx/pages/git-sync/views/activities/GitSyncActivities'))
}

export const routeGitSyncEntities: NestedRoute = {
  path: '/git-sync/entities',
  title: i18n.gitSync,
  url: () => routeURL(routeGitSyncEntities, '/git-sync/entities'),
  component: React.lazy(() => import('../dx/pages/git-sync/views/entities/GitSyncEntityTab'))
}

export const routeGitSyncErrors: NestedRoute = {
  path: '/git-sync/errors',
  title: i18n.gitSync,
  url: () => routeURL(routeGitSyncErrors, '/git-sync/errors'),
  component: React.lazy(() => import('../dx/pages/git-sync/views/errors/GitSyncErrors'))
}

export const routeGitSync: Route = {
  module: ModuleName.DX,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/git-sync',
  title: i18n.gitSync,
  pageId: 'git-sync',
  url: () => routeURL(routeGitSync, '/git-sync'),
  component: React.lazy(() => import('../dx/pages/git-sync/GitSyncPage')),
  nestedRoutes: [routeGitSyncActivities, routeGitSyncEntities, routeGitSyncErrors, routeGitSyncRepos]
}
export const routeOrgGitSyncRepos: NestedRoute<{ orgIdentifier: string }> = {
  path: '/git-sync/org/:orgIdentifier/repos',
  title: i18n.gitSync,
  url: ({ orgIdentifier }) => routeURL(routeOrgGitSyncRepos, `/git-sync/org/${orgIdentifier}/repos`),
  component: React.lazy(() => import('../dx/pages/git-sync/views/repos/GitSyncRepoTab')),
  isDefault: true
}

export const routeOrgGitSyncActivities: NestedRoute<{ orgIdentifier: string }> = {
  path: '/git-sync/org/:orgIdentifier/activities',
  title: i18n.gitSync,
  url: ({ orgIdentifier }) => routeURL(routeOrgGitSyncActivities, `/git-sync/org/${orgIdentifier}/activities`),
  component: React.lazy(() => import('../dx/pages/git-sync/views/activities/GitSyncActivities'))
}

export const routeOrgGitSyncEntities: NestedRoute<{ orgIdentifier: string }> = {
  path: '/git-sync/org/:orgIdentifier/entities',
  title: i18n.gitSync,
  url: ({ orgIdentifier }) => routeURL(routeOrgGitSyncEntities, `/git-sync/org/${orgIdentifier}/entities`),
  component: React.lazy(() => import('../dx/pages/git-sync/views/entities/GitSyncEntityTab'))
}

export const routeOrgGitSyncErrors: NestedRoute<{ orgIdentifier: string }> = {
  path: '/git-sync/org/:orgIdentifier/errors',
  title: i18n.gitSync,
  url: ({ orgIdentifier }) => routeURL(routeOrgGitSyncErrors, `/git-sync/org/${orgIdentifier}/errors`),
  component: React.lazy(() => import('../dx/pages/git-sync/views/errors/GitSyncErrors'))
}

export const routeOrgGitSync: Route<{ orgIdentifier: string }> = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/git-sync/org/:orgIdentifier',
  title: i18n.gitSync,
  pageId: 'org-git-sync',
  url: ({ orgIdentifier }) => routeURL(routeOrgGitSync, `/git-sync/org/${orgIdentifier}`),
  component: React.lazy(() => import('../dx/pages/git-sync/GitSyncPage')),
  nestedRoutes: [routeOrgGitSyncActivities, routeOrgGitSyncEntities, routeOrgGitSyncErrors, routeOrgGitSyncRepos]
}

export const routePageNotFound: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.NONE,
  layout: PageLayout.BlankLayout,
  path: '*',
  title: i18n.notFound,
  pageId: '404',
  url: () => routeURL(routePageNotFound, '/404'),
  component: React.lazy(() => import('./pages/404/NotFoundPage')),
  authenticated: false
}

export const routeSettings: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT, // TODO: To be revised - The layers icon might not Settings
  path: '/settings',
  title: i18n.settings,
  pageId: 'settings',
  url: () => routeURL(routeSettings, '/settings'),
  component: React.lazy(() => import('./pages/settings/SettingsPage'))
}

export const routeUserProfile: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.USER_PROFILE,
  path: '/user-profile',
  title: i18n.userProfile,
  pageId: 'user-profile',
  url: () => routeURL(routeUserProfile, '/user-profile'),
  component: React.lazy(() => import('./pages/user-profile/UserProfilePage'))
}
