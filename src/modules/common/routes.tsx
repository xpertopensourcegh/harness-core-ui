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

export const routeOrg: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.PROJECTS, // TODO: to be revised. Org might have their own place and not in Projects
  path: '/org/:orgId?',
  title: i18n.org,
  pageId: 'org',
  url: (params: RouteURLArgs) => `/org${params?.orgId ? `/${params.orgId}` : ''}`,
  component: React.lazy(() => import('./pages/org/OrgPage'))
}

export const routeProject: Route = {
  module: ModuleName.COMMON,
  sidebarId: SidebarIdentifier.PROJECTS,
  path: '/project/:orgId?',
  title: i18n.project,
  pageId: 'project',
  url: (params: RouteURLArgs) => `/project${params?.projectId ? `/${params.projectId}` : ''}`,
  component: React.lazy(() => import('./pages/project/ProjectPage'))
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
  sidebarId: SidebarIdentifier.SETTINGS, // TODO: To be revised - The layers icon might not Settings
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
