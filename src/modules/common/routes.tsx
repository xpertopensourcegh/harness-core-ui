import React from 'react'
import { RouteInfo, RouteInfoURLArgs, PageLayout, ModuleName, NavIdentifier } from 'framework'
import i18n from './common.i18n'

export const routeLogin: RouteInfo = {
  module: ModuleName.COMMON,
  navId: NavIdentifier.NONE,
  layout: PageLayout.BlankLayout,
  path: '/loginv2',
  title: i18n.login,
  pageId: 'login',
  url: () => '/login',
  component: React.lazy(() => import('./pages/login/LoginPage')),
  authenticated: false
}

export const routeOrg: RouteInfo = {
  module: ModuleName.COMMON,
  navId: NavIdentifier.PROJECTS, // TODO: to be revised. Org might have their own place and not in Projects
  path: '/org/:orgId?',
  title: i18n.org,
  pageId: 'org',
  url: (params: RouteInfoURLArgs) => `/org${params?.orgId ? `/${params.orgId}` : ''}`,
  component: React.lazy(() => import('./pages/org/OrgPage'))
}

export const routeProject: RouteInfo = {
  module: ModuleName.COMMON,
  navId: NavIdentifier.PROJECTS,
  path: '/project/:orgId?',
  title: i18n.project,
  pageId: 'project',
  url: (params: RouteInfoURLArgs) => `/project${params?.projectId ? `/${params.projectId}` : ''}`,
  component: React.lazy(() => import('./pages/project/ProjectPage'))
}

export const routePageNotFound: RouteInfo = {
  module: ModuleName.COMMON,
  navId: NavIdentifier.NONE,
  layout: PageLayout.BlankLayout,
  path: '*',
  title: i18n.notFound,
  pageId: '404',
  url: () => '/404',
  component: React.lazy(() => import('./pages/404/NotFoundPage')),
  authenticated: false
}

export const routeSettings: RouteInfo = {
  module: ModuleName.COMMON,
  navId: NavIdentifier.SETTINGS, // TODO: To be revised - The layers icon might not Settings
  path: '/settings',
  title: i18n.settings,
  pageId: 'settings',
  url: () => '/settings',
  component: React.lazy(() => import('./pages/settings/SettingsPage'))
}

export const routeUserProfile: RouteInfo = {
  module: ModuleName.COMMON,
  navId: NavIdentifier.USER_PROFILE,
  layout: PageLayout.NoMenuLayout,
  path: '/user-profile',
  title: i18n.userProfile,
  pageId: 'user-profile',
  url: () => '/user-profile',
  component: React.lazy(() => import('./pages/user-profile/UserProfilePage'))
}
