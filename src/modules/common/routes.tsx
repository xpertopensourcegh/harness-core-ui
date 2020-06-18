import React from 'react'
import { Route, RouteURLArgs, PageLayout, ModuleName, SidebarIdentifier } from 'framework/exports'
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

export const routeOrganizations: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/organizations',
  title: i18n.organization,
  pageId: 'organization',
  url: () => `/organizations`,
  component: React.lazy(() => import('./pages/organizations/OrganizationsPage'))
}

export const routeAdmin: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/admin',
  title: i18n.admin,
  pageId: 'admin',
  url: (_params: RouteURLArgs) => '/admin',
  component: React.lazy(() => import('./pages/admin/AdminPage'))
}

export const routeGovernance: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/governance',
  title: i18n.governance,
  pageId: 'governance',
  url: (_params: RouteURLArgs) => '/governance',
  component: React.lazy(() => import('./pages/governance/GovernancePage'))
}

export const routeResources: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT,
  path: '/resources',
  title: i18n.resources,
  pageId: 'resources',
  url: (_params: RouteURLArgs) => '/resources',
  component: React.lazy(() => import('../../modules/cd/pages/Resources/ResourcesPage'))
}

export const routeProject: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.PROJECTS,
  path: '/projects',
  title: i18n.project,
  pageId: 'projects',
  url: () => `/projects`,
  component: React.lazy(() => import('./pages/ProjectsPage/ProjectsPage'))
}

export const routePageNotFound: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.NONE,
  layout: PageLayout.BlankLayout,
  path: '*',
  title: i18n.notFound,
  pageId: '404',
  url: () => '/404',
  component: React.lazy(() => import('./pages/404/NotFoundPage')),
  authenticated: false
}

export const routeSettings: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.ACCOUNT, // TODO: To be revised - The layers icon might not Settings
  path: '/settings',
  title: i18n.settings,
  pageId: 'settings',
  url: () => '/settings',
  component: React.lazy(() => import('./pages/settings/SettingsPage'))
}

export const routeUserProfile: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.USER_PROFILE,
  path: '/user-profile',
  title: i18n.userProfile,
  pageId: 'user-profile',
  url: () => '/user-profile',
  component: React.lazy(() => import('./pages/user-profile/UserProfilePage'))
}
